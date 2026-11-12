import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { startSandbox } from '../../scripts/sandbox/runtime.mjs';

const wasmPath = 'target/near/night_authority/night_authority.wasm';
const evidencePath = 'docs/evidence/m1b-sandbox.json';

test('authority WASM in local NEAR Sandbox', { timeout: 240_000 }, async t => {
  assert.equal(process.platform, 'linux', 'Run this suite inside WSL2/Linux');
  const {worker,runtime,binaryVersion} = await startSandbox();
  const wasm = await readFile(wasmPath);
  const evidence = { startedAt: new Date().toISOString(), network: 'sandbox',
    wasmSha256: createHash('sha256').update(wasm).digest('hex'), wasmBytes: wasm.length,
    workspacesVersion: '5.0.0', binaryVersion, tests: [], transactions: [] };
  // Explicit network prevents ambient NEAR_ENV from selecting a public network.
  try {
    evidence.runtime = runtime;
    assert.equal(evidence.runtime.version.version, '2.14.0', 'verify the running node, not just the downloaded binary');
    const root = worker.rootAccount;
    const vesper = await root.createSubAccount('vesper');
    const player = await root.createSubAccount('player');
    const lucien = await root.createSubAccount('lucien');
    const keeper = await root.createSubAccount('keeper');
    let fixtureNumber = 0;

    function record(label, result, before, after) {
      // Only public execution evidence, never account/key objects or credentials.
      evidence.transactions.push({ label, hash: result.result.transaction.hash,
        status: result.status, gasBurnt: result.gas_burnt,
        storageBefore: before?.storage_usage, storageAfter: after?.storage_usage,
        transactionOutcome: result.result.transaction_outcome,
        receiptOutcomes: result.result.receipts_outcome });
    }
    async function fixture() {
      const contract = await root.createSubAccount(`world${++fixtureNumber}`);
      const before = await contract.accountView();
      const deployment = await contract.deploy(wasm);
      record('deploy', deployment, before, await contract.accountView());
      assert.equal(deployment.succeeded, true);
      await call(contract, contract, 'new', {vesper:vesper.accountId,player:player.accountId,executor:keeper.accountId});
      return contract;
    }
    const view = (contract, actor) => contract.view('get_world', {account_id:actor.accountId});
    async function call(contract, actor, method, args, expectedError) {
      const before = await contract.accountView();
      const prior = method === 'new' ? null : await view(contract, actor);
      const result = await actor.callRaw(contract, method, args, {gas:'100000000000000'});
      record(method, result, before, await contract.accountView());
      if (expectedError) {
        assert.equal(result.failed, true, `${method} must fail`);
        assert.ok(result.receiptFailures.length > 0, 'must fail in an execution receipt');
        assert.match(JSON.stringify(result.receiptFailures), expectedError);
        assert.deepEqual(await view(contract, actor), prior, 'failed action must roll back all game state');
      } else {
        assert.equal(result.succeeded, true, JSON.stringify(result.status));
        assert.equal(result.receiptFailures.length, 0);
      }
      return result;
    }
    async function action(contract, actor, method, args, error) {
      return call(contract, actor, method, {...args,nonce:(await view(contract, actor)).next_nonce}, error);
    }
    async function grant(contract, actor, grantee, parent=null, expiry=null, error) {
      const result=await action(contract, actor, 'grant_access', {property_id:'crypt',scope:'enter',
        grantee:grantee.accountId,parent_grant_id:parent,can_delegate:true,expiry_night:expiry},error);
      return error ? undefined : result.parseResult();
    }
    const enter = (c,a,room='crypt',error) => action(c,a,'enter_room',{property_id:room},error);
    const revoke = (c,a,id,error) => action(c,a,'revoke_grant',{grant_id:id},error);
    async function scenario(name, fn) {
      await t.test(name, async () => {
        const first = evidence.transactions.length;
        try { await fn(await fixture()); evidence.tests.push({name,status:'PASS',firstTransaction:first,transactionCount:evidence.transactions.length-first}); }
        catch(error) { evidence.tests.push({name,status:'FAIL',error:String(error),firstTransaction:first}); throw error; }
      });
    }
    await scenario('authorized delegation succeeds', async c => {
      const id=await grant(c,vesper,player); await grant(c,player,lucien,id);
      await enter(c,lucien); assert.equal((await view(c,lucien)).access.crypt,true);
    });
    await scenario('unauthorized delegation fails', async c => {
      await grant(c,lucien,player,null,null,/owner required/);
      const id=await grant(c,vesper,player);
      await grant(c,lucien,keeper,id,null,/wrong parent holder/);
    });
    await scenario('revocation prevents subsequent use', async c => {
      const id=await grant(c,vesper,player); await enter(c,player); await revoke(c,vesper,id);
      await enter(c,player,'crypt',/access denied/);
    });
    await scenario('cascading revocation invalidates dependent grants', async c => {
      const id=await grant(c,vesper,player); const child=await grant(c,player,lucien,id);
      await enter(c,lucien); await revoke(c,vesper,id);
      await enter(c,player,'crypt',/access denied/); await enter(c,lucien,'crypt',/access denied/);
      await grant(c,lucien,keeper,child,null,/parent not delegable or invalid/);
    });
    await scenario('independently owned Library survives', async c => {
      const id=await grant(c,vesper,player); await revoke(c,vesper,id);
      await enter(c,player,'library'); assert.equal((await view(c,player)).access.library,true);
    });
    await scenario('expired rights cannot be exercised', async c => {
      const id=await grant(c,vesper,player,null,1); await grant(c,player,lucien,id,1);
      await enter(c,lucien);
      await call(c,keeper,'advance_night',{expected_night:0});
      await enter(c,player,'crypt',/access denied/); await enter(c,lucien,'crypt',/access denied/);
    });
    await scenario('replayed operations rejected', async c => {
      await enter(c,player,'library');
      await call(c,player,'enter_room',{property_id:'library',nonce:0},/stale nonce/);
      const id=await grant(c,vesper,player); await revoke(c,vesper,id);
      await call(c,vesper,'revoke_grant',{grant_id:id,nonce:1},/stale nonce/);
      await revoke(c,vesper,id,/already revoked/);
    });
    await scenario('unauthorized revocation fails', async c => {
      const id=await grant(c,vesper,player);
      await revoke(c,lucien,id,/grantor required/); await revoke(c,player,id,/grantor required/);
      await enter(c,player); await enter(c,player,'library');
    });
    await scenario('independent source survives loss of delegated source', async c => {
      const rootGrant=await grant(c,vesper,player); await grant(c,player,lucien,rootGrant);
      const independent=await grant(c,vesper,lucien);
      await revoke(c,vesper,rootGrant); await enter(c,lucien);
      assert.equal((await view(c,lucien)).grants[independent].revoked,false);
      await revoke(c,vesper,independent); await enter(c,lucien,'crypt',/access denied/);
    });
  } finally {
    evidence.finishedAt = new Date().toISOString();
    await mkdir('docs/evidence',{recursive:true});
    await writeFile(evidencePath,JSON.stringify(evidence,null,2)+'\n');
    await worker.tearDown();
  }
});
