import {isFinalAction,finalPlayerOperation,isFinalNpcAction,finalNpcOperation,finalNpcConfirmed} from '../../src/finalCourt.ts';
import {isLibraryAction,libraryPlayerOperation,isLibraryNpcAction,libraryNpcOperation,operationConfirmed} from '../../src/library.ts';
import {selectNpcAction,validateNpc,applyNpc,observeAgent,NPC_ORDER,COURT_ORDER,courtOperation,courtConfirmed,decisionProposal,validateDecision,validateAgreement} from '../../src/agents.ts';
import {politicalEnding} from '../../src/politics.ts';
import {newCampaign,migrateCampaign,playerAction,spendAction,requirePlaying,dawn,log,ACTIONS,availableActions,inspectRights,roomDenial} from '../../src/game.ts';
import {readJson,saveJson} from './persistence.mjs';

// Policy receives data only. It never receives accounts, signing keys or a client.
export async function createCampaignSession(scenario,path,id,selector=selectNpcAction,provider=null){
  let saved=await readJson(path);
  if(!saved){
    const campaign=newCampaign(id,{legacy:!scenario.political,living:scenario.living,dangerous:scenario.dangerous});
    if(campaign.politics)campaign.politics.accounts=Object.fromEntries(Object.entries(scenario.actors).map(([name,actor])=>[name,actor.accountId]));
    saved={campaign,pending:null};
  }
  if(saved.campaign.id!==id)throw new Error('Save belongs to a different Sandbox.');
  saved.campaign=migrateCampaign(saved.campaign);
  for(const field of ['state','after','before'])if(saved.pending?.[field])saved.pending[field]=migrateCampaign(saved.pending[field]);
  if(saved.pending?.intent){
    if(isFinalNpcAction(saved.pending.intent.proposal.kind)||['revoke','collect','offer','pass','appoint','dismiss','open_passage','publish','compete','sponsor','collect_sanctuary','archive_assist','archive_research','archive_challenge','archive_protect'].includes(saved.pending.intent.proposal.kind))saved.pending.intent.after=migrateCampaign(saved.pending.intent.after);
    else throw new Error('Unknown saved NPC intent.');
  }
  let queue=Promise.resolve();
  const persist=()=>saveJson(path,saved);
  await persist();
  async function runDawn(){
    const pending=saved.pending;
    const order=pending.state.politics?COURT_ORDER:NPC_ORDER;
    for(;pending.index<order.length;){
      const actor=order[pending.index],account=scenario.actors[actor].accountId;
      if(!pending.intent){
        const world=await scenario.view(scenario.actors[actor]);
        const observation=observeAgent(actor,account,pending.state,world);
        let proposal,source=pending.state.politics?'deterministic-policy':'fallback',detail=pending.state.politics?'Autonomous deterministic policy; no model call.':'Deterministic fallback.',envelope,attempts=0,model,rejectedProposal;
        if(provider&&!pending.state.politics){
          let result;
          if(pending.decision){result={source:'fallback',detail:'Interrupted provider request; not repeated.'};}
          else{
            pending.decision={actor,id:observation.observationId};await persist();
            result=await provider(observation);
          }
          detail=result.detail;attempts=result.attempts??0;model=result.model;
          if(result.source==='llm'&&result.proposal){
            try{
              envelope=validateDecision(actor,result.proposal,pending.state,await scenario.view(scenario.actors[actor]),account);
              proposal={kind:envelope.kind};source='llm';
            }catch{rejectedProposal=result.proposal;detail='Model proposal rejected by deterministic validation.';}
          }
        }
        if(!proposal){
          try{proposal=await selector(observation);validateNpc(actor,proposal,pending.state,world,account);}
          catch{proposal=selectNpcAction(observation);validateNpc(actor,proposal,pending.state,world,account);}
          envelope=decisionProposal(actor,proposal.kind,pending.state,world);
        }
        const after=applyNpc(pending.state,actor,proposal,world,account,source),event=after.agentHistory.at(-1);
        Object.assign(event,{decisionId:observation.observationId,proposal:envelope,validation:source==='fallback'?'fallback':'accepted',execution:['pass','offer','publish','compete','archive_challenge'].includes(proposal.kind)?'local':'pending',detail,attempts,...(model?{model}:{}),...(rejectedProposal?{rejectedProposal}:{})});
        if(proposal.kind==='offer')after.agreements.at(-1).dialogue=envelope.dialogue;
        pending.intent={actor,proposal,envelope,after,nonce:world.next_nonce,...(isFinalNpcAction(proposal.kind)?{finalOperation:finalNpcOperation(actor,proposal.kind,pending.state,world)}:{})};await persist();
      }
      const {proposal,after}=pending.intent,world=await scenario.view(scenario.actors[actor]);
      if(pending.intent.actor!==actor||world.night!==pending.state.night)throw new Error('Stale NPC intent or identity.');
      const libraryOp=isLibraryNpcAction(proposal.kind);
      const finalOp=isFinalNpcAction(proposal.kind);
      const operation=finalOp?pending.intent.finalOperation:libraryOp?libraryNpcOperation(actor,proposal.kind,pending.state,world):pending.state.politics?courtOperation(actor,proposal.kind,pending.state,world):null;
      const libraryConfirmed=w=>proposal.kind==='archive_research'?w.next_nonce===pending.intent.nonce+1:operation&&operationConfirmed(w,operation,account);
      const completed=finalOp?finalNpcConfirmed(proposal.kind,pending.state,world,operation):libraryOp?libraryConfirmed(world):proposal.kind==='revoke'?world.grants[0]?.revoked:proposal.kind==='collect'?world.leases[0]?.settled:operation?courtConfirmed(pending.state,world,proposal.kind):false;
      if(!completed){
        if(pending.intent.envelope)validateDecision(actor,pending.intent.envelope,pending.state,world,account);
        else validateNpc(actor,proposal,pending.state,world,account);
      }
      if(proposal.kind==='revoke'&&!world.grants[0].revoked){
        if(pending.state.politics){const r=await scenario.action('vesper','revoke_grant',{grant_id:0});if(!r.succeeded||r.receiptFailures.length)throw new Error('Revocation failed.');}
        else {const r=await scenario.request({action:'continue'});if(r.error)throw new Error(r.error);}
      }
      if(proposal.kind==='collect'&&!world.leases[0].settled){const r=await scenario.request({action:'settle'});if(r.error)throw new Error(r.error);}
      if(operation&&!completed){const r=await scenario.action(actor,operation.method,operation.args);if(!r.succeeded||r.receiptFailures.length)throw new Error('Court transaction failed.');}
      const confirmed=await scenario.view(scenario.actors[actor]);
      if(proposal.kind==='revoke'&&!confirmed.grants[0]?.revoked||proposal.kind==='collect'&&!confirmed.leases[0]?.settled)throw new Error('NPC outcome not confirmed.');
      if((operation||finalOp)&&!(finalOp?finalNpcConfirmed(proposal.kind,pending.state,confirmed,operation):libraryOp?libraryConfirmed(confirmed):courtConfirmed(pending.state,confirmed,proposal.kind)))throw new Error('Court outcome not confirmed.');
      // Preserve already-journaled Pass 1 intents without replaying their effects.
      if(!after.agentHistory.some(e=>e.actor===actor&&e.night===after.night))after.agentHistory.push({night:after.night,actor,kind:proposal.kind,source:'deterministic-policy',outcome:proposal.kind==='pass'?'passed':'confirmed'});
      const event=after.agentHistory.at(-1);event.execution=finalOp&&!operation?'local':['pass','offer','publish','compete','archive_challenge'].includes(proposal.kind)?'local':'confirmed';
      pending.state=after;pending.index++;pending.intent=null;pending.decision=null;await persist();
    }
    if(!pending.after){pending.after=dawn(pending.state,await scenario.view());await persist();}
    const world=await scenario.view();
    if(world.night===pending.state.night){
      const tx=await scenario.call('keeper','advance_night',{expected_night:world.night});
      if(!tx.succeeded||tx.receiptFailures.length)throw new Error('Dawn transaction failed. Refresh to recover.');
    }else if(world.night!==pending.after.night)throw new Error('Unexpected chain night; cannot safely resolve dawn.');
    for(const a of pending.after.agreements)if(a.status==='pending'&&pending.after.night>=a.expiryNight){a.status='expired';a.result='Offer expired before acceptance.';}
    politicalEnding(pending.after,await scenario.view());
    if(pending.after.politics&&pending.after.status!=='playing')log(pending.after,pending.after.reason);
    saved={campaign:pending.after,pending:null};await persist();
  }
  async function recover(){
    if(saved.pending?.kind==='dawn')await runDawn();
    else if(saved.pending?.kind==='player'){
      const p=saved.pending,world=await scenario.view();
      if(world.next_nonce===p.nonce+1){
        if(p.action==='library'&&!operationConfirmed(world,p.operation,scenario.actors.player.accountId))throw new Error('Library authority postcondition not confirmed.');
        if(p.action==='sanctuary'&&!(world.leases[1]?.status==='accepted'&&world.access.sanctuary))throw new Error('Sanctuary postcondition not confirmed.');
        if(p.action==='accept'&&(world.leases[0]?.status!=='accepted'||!world.access.lounge)||p.action==='reject'&&world.leases[0]?.status!=='rejected')throw new Error('Player transaction postcondition not confirmed.');
        saved={campaign:p.after,pending:null,...(p.automatic?{automatic:true}:{})};await persist();}
      else if(world.next_nonce===p.nonce){saved={campaign:{...p.before,revision:p.after.revision},pending:null};log(saved.campaign,'An interrupted action was not confirmed. Review the castle before choosing again.');await persist();}
      else throw new Error('Unexpected player nonce; refusing to invent campaign effects.');
    }
    if(saved.automatic&&!saved.pending&&saved.campaign.status==='playing'){
      saved.pending={kind:'dawn',index:0,intent:null,state:structuredClone(saved.campaign)};await persist();await runDawn();
    }
  }
  function controls(world,wallet){
    const s=saved.campaign,lease=world.leases[0],base=[];
    if(s.status!=='playing')base.push('Campaign ended.');
    if(s.actionsLeft<1)base.push('No major actions remain.');
    const offer=[...base];if(lease.status!=='offered')offer.push('Agreement already resolved.');
    if(world.night>=lease.offer_expiry_night)offer.push('Offer expired.');
    const accept=[...offer];if(BigInt(wallet)<BigInt(lease.price_yocto))accept.push('Insufficient Sandbox NEAR for rent (network gas is additional).');
    return {accept,reject:offer,end_night:s.status==='playing'?[]:['Campaign ended.'],rooms:Object.fromEntries(world.properties.map(p=>[p.id,roomDenial(world,p.id)]))};
  }
  async function snapshot(error=null){const result=await scenario.snapshot(error);return {...result,campaign:saved.campaign,actions:availableActions(saved.campaign,result.world),authority:inspectRights(result.world,scenario.actors.player.accountId),availability:controls(result.world,result.walletYocto),pending:!!saved.pending};}
  async function handle(request){
    try{
      if(!request||Object.keys(request).some(key=>!['action','choice','property_id','campaign_id','revision','agreement_id'].includes(key)))throw new Error('Invalid action request fields.');
      await recover();
      if(request.action==='view')return snapshot();
      const s=saved.campaign;
      if(request.campaign_id!==s.id||request.revision!==s.revision)throw new Error('This choice is stale or already resolved. Refresh the castle.');
      const world=await scenario.view();if(world.night!==s.night)throw new Error('Campaign and contract nights disagree.');
      if(request.action==='end_night'){
        requirePlaying(s);saved.pending={kind:'dawn',index:0,intent:null,state:{...structuredClone(s),revision:s.revision+1}};
        await persist();await runDawn();return snapshot();
      }
      let next=structuredClone(s),chain=null;
      if(request.action==='game'){
        next=playerAction(s,request.choice,world);
        if(isFinalAction(request.choice)){const operation=finalPlayerOperation(s,request.choice,world);if(operation)chain={action:'library',operation};}
        if(isLibraryAction(request.choice))chain={action:'library',operation:libraryPlayerOperation(s,request.choice,world)};
        const property=ACTIONS[request.choice].property;
        if(property&&!await scenario.hasAccess(property))throw new Error('Permission changed before execution. No action or Blood spent.');
        if(request.choice==='sanctuary_pact'){
          const lease=world.leases[1],owner=scenario.actors.seraphine.accountId;
          if(!lease||lease.property_id!=='sanctuary'||lease.owner!==owner||world.properties.find(p=>p.id==='sanctuary')?.owner!==owner||lease.buyer!==scenario.actors.player.accountId||lease.price_yocto!=='20000000000000000000000'||lease.duration_nights!==7||lease.offer_expiry_night!==3)throw new Error('Sanctuary terms or authority changed.');
          if(BigInt((await scenario.actors.player.balance()).available)<BigInt(lease.price_yocto))throw new Error('Insufficient Sandbox NEAR.');
          chain={action:'sanctuary'};log(next,'Sanctuary covenant accepted: seven nights of non-revocable entry, not ownership (NEAR confirmed).');
        }
      }else if(['agreement_accept','agreement_reject'].includes(request.action)){
        const a=next.agreements.find(a=>a.id===request.agreement_id);
        if(!a)throw new Error('Unknown agreement.');
        if(request.action==='agreement_reject'){
          requirePlaying(s);if(a.status!=='pending')throw new Error('Agreement already resolved.');
          a.status='rejected';a.result='Player declined; no transaction or relationship penalty.';log(next,a.result);
        }else{
          validateAgreement(a,s,world,scenario.actors.seraphine.accountId,scenario.actors.player.accountId);
          const blocked=controls(world,(await scenario.actors.player.balance()).available).accept;
          if(blocked.length)throw new Error(blocked.join(' '));
          spendAction(next);a.status='accepted';a.result='Contract confirmed prepaid Lounge entry; no title or votes.';
          chain={action:'accept'};log(next,a.result);
        }
      }else if(['accept','reject'].includes(request.action)){
        const blocked=controls(world,(await scenario.actors.player.balance()).available)[request.action];
        if(blocked.length)throw new Error(blocked.join(' '));
        if(request.action==='accept'||!s.politics?.library)spendAction(next);chain={action:request.action};
        for(const a of next.agreements)if(a.status==='pending'){a.status=request.action==='accept'?'accepted':'rejected';a.result='Standing lease decision confirmed by NEAR.';}log(next,request.action==='accept'?'You sign Seraphine’s lease. Vesper will choose her own response at dawn.':'You refuse the lease. No rent paid.');
      }else if(request.action==='enter'){
        if(!Object.hasOwn(world.access,request.property_id)||!await scenario.hasAccess(request.property_id))throw new Error('Access denied: no current contract permission.');
        return snapshot(); // Navigation/information is free and never a narrative transaction.
      }
      else throw new Error('Scripted NPC contract actions resolve at dawn, not through player commands.');
      next.revision=s.revision+1;
      const automatic=!!s.politics&&next.actionsLeft<s.actionsLeft&&next.actionsLeft===0&&next.status==='playing';
      if(chain){
        saved.pending={kind:'player',before:s,after:next,nonce:world.next_nonce,action:chain.action,...(chain.operation?{operation:chain.operation}:{}),...(automatic?{automatic:true}:{})};await persist();
        let result;
        if(chain.action==='library'){
          const fresh=await scenario.view();const op=isFinalAction(request.choice)?finalPlayerOperation(s,request.choice,fresh):libraryPlayerOperation(s,request.choice,fresh);
          if(JSON.stringify(op)!==JSON.stringify(chain.operation))throw new Error('Library permission changed before execution.');
          const r=await scenario.action('player',op.method,op.args);result={error:r.succeeded&&!r.receiptFailures.length?null:'Library transaction failed.'};
        }else if(chain.action==='sanctuary'){
          const r=await scenario.action('player','accept_lease',{lease_id:1},world.leases[1].price_yocto);
          result={error:r.succeeded&&!r.receiptFailures.length?null:'Sanctuary transaction failed.'};
        }else result=await scenario.request(chain);
        if(result.error){
          // A provider/RPC error may arrive AFTER commitment. Reconcile nonce and
          // postcondition before rolling back; never erase an uncertain intent.
          const confirmed=await scenario.view();
          if(confirmed.next_nonce!==world.next_nonce){await recover();return snapshot();}
          saved={campaign:{...s,revision:next.revision},pending:null};
          const a=saved.campaign.agreements.find(a=>a.id===request.agreement_id);if(a)a.result='Transaction failed; no agreement effects applied.';
          await persist();return snapshot(result.error);
        }
        const final=await scenario.view();
        if(final.next_nonce!==world.next_nonce+1)throw new Error('Player transaction not confirmed. Refresh to recover.');
        await recover();return snapshot();
      }
      saved={campaign:next,pending:null,...(automatic?{automatic:true}:{})};await persist();await recover();return snapshot();
    }catch(error){
      if(saved.pending?.intent){saved.pending.intent.after.agentHistory.at(-1).execution='failed';await persist();}
      return snapshot(String(error));
    }
  }
  return {request(request){const run=queue.then(()=>handle(request));queue=run.catch(()=>{});return run;}};
}

