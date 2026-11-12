import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {startSandbox} from '../../scripts/sandbox/runtime.mjs';
import {createScenario,RENT_YOCTO,WASM_PATH} from '../../scripts/sandbox/scenario.mjs';

test('first economic betrayal — real WASM and native Sandbox NEAR',{timeout:300000},async t=>{
  const {worker,runtime,binaryVersion}=await startSandbox();
  let scenario;
  const evidence={runtime,binaryVersion,wasmSha256:createHash('sha256').update(await readFile(WASM_PATH)).digest('hex'),tests:[],transactions:[]};
  try{
    scenario=await createScenario(worker);
    const {actors,contract,view,action,call}=scenario;
    async function check(name,fn){await t.test(name,async()=>{try{await fn();evidence.tests.push({name,status:'PASS'});}catch(error){evidence.tests.push({name,status:'FAIL',error:String(error)});throw error;}});}
    async function reject(actor,method,args,reason,deposit='0'){
      const before=await view(actors[actor]);
      const result=await action(actor,method,args,deposit);
      assert.equal(result.failed,true);assert.ok(result.receiptFailures.length>0);
      assert.match(JSON.stringify(result.receiptFailures),reason);
      assert.deepEqual(await view(actors[actor]),before,'failed call must not alter rights, escrow or nonces');
      return result;
    }
    const offerArgs={property_id:'lounge',buyer:actors.player.accountId,price_yocto:RENT_YOCTO,duration_nights:3,offer_expiry_night:2};
    await check('authorized owner offer and starting rights',async()=>{
      const w=await view();assert.equal(w.leases[0].owner,actors.seraphine.accountId);
      assert.deepEqual(w.access,{crypt:true,library:true,lounge:false});
    });
    await check('unauthorized offers and wrong buyer rejected',async()=>{
      await reject('vesper','offer_lease',offerArgs,/owner required/);
      await reject('vesper','offer_lease',{...offerArgs,property_id:'library'},/owner required/);
      await reject('lucien','accept_lease',{lease_id:0},/buyer required/,RENT_YOCTO);
    });
    await check('underpayment and overpayment rejected, deposit refunded',async()=>{
      const balance=BigInt((await actors.player.accountView()).amount);
      await reject('player','accept_lease',{lease_id:0},/exact rent required/,'1');
      await reject('player','accept_lease',{lease_id:0},/exact rent required/,(BigInt(RENT_YOCTO)+1n).toString());
      const cost=balance-BigInt((await actors.player.accountView()).amount);
      assert.ok(cost>0n&&cost<10n**22n,'only bounded gas cost remains, not the rejected rent');
    });
    await check('unaffordable wallet transaction cannot mutate lease state',async()=>{
      const before=await view();
      await assert.rejects(()=>action('player','accept_lease',{lease_id:0},'1000000000000000000000000'),/balance|Balance/);
      assert.deepEqual(await view(),before);
      evidence.unaffordablePayment='Rejected by runtime balance validation before execution; no execution receipt';
    });
    await check('valid acceptance pays exact native rent and grants rights',async()=>{
      const before=BigInt((await actors.player.accountView()).amount);
      const result=await action('player','accept_lease',{lease_id:0},RENT_YOCTO);
      assert.equal(result.succeeded,true);
      const w=await view();assert.equal(w.leases[0].escrow_yocto,RENT_YOCTO);assert.equal(w.leases[0].end_night,3);assert.equal(w.access.lounge,true);
      const spent=before-BigInt((await actors.player.accountView()).amount);
      assert.ok(spent>=BigInt(RENT_YOCTO)&&spent<BigInt(RENT_YOCTO)+10n**22n);
      evidence.playerPayment={balanceBefore:before.toString(),balanceAfter:(await actors.player.accountView()).amount,rentYocto:RENT_YOCTO};
    });
    await check('duplicate acceptance and stale nonce cannot double charge',async()=>{
      await reject('player','accept_lease',{lease_id:0},/offer not open/,RENT_YOCTO);
      const before=await view();const result=await call('player','accept_lease',{lease_id:0,nonce:0},RENT_YOCTO);
      assert.equal(result.failed,true);assert.match(JSON.stringify(result.receiptFailures),/stale nonce/);assert.deepEqual(await view(),before);
    });
    await check('neither sire nor owner can cancel acquired lease',async()=>{
      await reject('vesper','cancel_lease',{lease_id:0},/owner required/);
      await reject('seraphine','cancel_lease',{lease_id:0},/offer not open/);
      await reject('vesper','claim_rent',{lease_id:0},/owner required/);
      await reject('player','claim_rent',{lease_id:0},/owner required/);
    });
    await check('accepted lease triggers real retaliation; independent rooms survive',async()=>{
      const result=await scenario.request({action:'continue'});assert.equal(result.error,null);assert.equal(result.phase,'independent');
      assert.deepEqual(result.world.access,{crypt:false,library:true,lounge:true});
      const denied=await scenario.request({action:'enter',property_id:'crypt'});assert.match(denied.error,/access denied/);
      assert.equal((await scenario.request({action:'enter',property_id:'lounge'})).error,null);
      assert.equal((await scenario.request({action:'enter',property_id:'library'})).error,null);
      const reload=await scenario.request({action:'view'});assert.deepEqual(reload.world.access,{crypt:false,library:true,lounge:true});
      assert.equal(reload.world.properties.find(p=>p.id==='lounge').owner,actors.seraphine.accountId);
    });
    await check('seller payout settles once with real transfer receipt',async()=>{
      const before=BigInt((await actors.seraphine.accountView()).amount);
      const result=await action('seraphine','claim_rent',{lease_id:0});
      assert.equal(result.succeeded,true);assert.equal(result.receiptFailures.length,0);assert.equal(result.parseResult(),true);
      assert.ok(result.result.receipts_outcome.some(r=>r.outcome.executor_id===actors.seraphine.accountId),'seller transfer receipt');
      const w=await view();assert.equal(w.leases[0].escrow_yocto,'0');assert.equal(w.leases[0].settled,true);assert.equal(w.leases[0].payout_pending,false);
      const gained=BigInt((await actors.seraphine.accountView()).amount)-before;
      assert.ok(gained>BigInt(RENT_YOCTO)-10n**22n&&gained<=BigInt(RENT_YOCTO));
      evidence.sellerPayment={balanceBefore:before.toString(),balanceAfter:(await actors.seraphine.accountView()).amount};
      await reject('seraphine','claim_rent',{lease_id:0},/rent already claimed/);
      const spoof=await call('vesper','rent_paid',{lease_id:0});assert.equal(spoof.failed,true);
      assert.equal((await view()).leases[0].settled,true);
    });
    await check('overlapping rights and unauthorized time advance rejected',async()=>{
      const offer=await action('seraphine','offer_lease',offerArgs);assert.equal(offer.succeeded,true);
      await reject('player','accept_lease',{lease_id:offer.parseResult()},/property already leased/,RENT_YOCTO);
      const before=await view();const result=await call('player','advance_night',{expected_night:0});assert.equal(result.failed,true);assert.deepEqual(await view(),before);
    });
    await check('lease and offer expiry enforced by authorized night counter',async()=>{
      for(let night=0;night<3;night++)assert.equal((await call('keeper','advance_night',{expected_night:night})).succeeded,true);
      await reject('player','enter_room',{property_id:'lounge'},/access denied/);
      await reject('player','accept_lease',{lease_id:1},/offer expired/,RENT_YOCTO);
      const w=await view();assert.equal(w.access.library,true);assert.equal(w.leases[0].settled,true);assert.equal(w.leases[0].escrow_yocto,'0');
    });
    await check('unaccepted offers can be cancelled or rejected without payment',async()=>{
      const a=await action('seraphine','offer_lease',{...offerArgs,offer_expiry_night:5});const id=a.parseResult();
      assert.equal((await action('seraphine','cancel_lease',{lease_id:id})).succeeded,true);
      await reject('player','accept_lease',{lease_id:id},/offer not open/,RENT_YOCTO);
      const b=await action('seraphine','offer_lease',{...offerArgs,offer_expiry_night:5});const next=b.parseResult();
      assert.equal((await action('player','reject_lease',{lease_id:next})).succeeded,true);
      await reject('player','accept_lease',{lease_id:next},/offer not open/,RENT_YOCTO);
    });
  }finally{
    evidence.transactions=scenario?.transactions??[];
    evidence.finishedAt=new Date().toISOString();
    await mkdir('docs/evidence',{recursive:true});await writeFile('docs/evidence/m2-sandbox.json',JSON.stringify(evidence,null,2)+'\n');
    await worker.tearDown();
  }
});

