# Encounter branches

## Index — 109 canonical definitions/families

Includes informational child scenes, historical reactions and legacy branches. This is not 109 distinct dramatic meetings. Parameterized night/grant IDs are counted once per kind/actor. Exact text is linked to canonical trees, avoiding duplication. Some conditional trees remain source-form; see coverage limitations.

- [character:vesper](#enc-1)
- [ask:${n}:vesper](#enc-2)
- [personal:${n}:vesper](#enc-3)
- [character:seraphine](#enc-4)
- [ask:${n}:seraphine](#enc-5)
- [personal:${n}:seraphine](#enc-6)
- [character:marius](#enc-7)
- [ask:${n}:marius](#enc-8)
- [personal:${n}:marius](#enc-9)
- [character:mirelle](#enc-10)
- [ask:${n}:mirelle](#enc-11)
- [personal:${n}:mirelle](#enc-12)
- [character:dorian](#enc-13)
- [ask:${n}:dorian](#enc-14)
- [personal:${n}:dorian](#enc-15)
- [character:lucien](#enc-16)
- [ask:${n}:lucien](#enc-17)
- [personal:${n}:lucien](#enc-18)
- [character:cassian](#enc-19)
- [ask:${n}:cassian](#enc-20)
- [personal:${n}:cassian](#enc-21)
- [character:sabine](#enc-22)
- [ask:${n}:sabine](#enc-23)
- [personal:${n}:sabine](#enc-24)
- [action:petition_marius](#enc-25)
- [action:sanctuary_pact](#enc-26)
- [action:fulfil_service](#enc-27)
- [action:secure_dossier](#enc-28)
- [action:broker_passage](#enc-29)
- [action:authorize_mirelle](#enc-30)
- [action:authorize_dorian](#enc-31)
- [action:withdraw_library](#enc-32)
- [action:final_accept](#enc-33)
- [action:final_refuse](#enc-34)
- [action:final_counter](#enc-35)
- [action:feed](#enc-36)
- [action:rest](#enc-37)
- [action:investigate_title](#enc-38)
- [action:investigate_bloodline](#enc-39)
- [action:investigate_expiry](#enc-40)
- [action:learn_seraphine](#enc-41)
- [action:discuss_exchange](#enc-42)
- [record:crypt](#enc-43)
- [record:library](#enc-44)
- [record:lounge](#enc-45)
- [discovery:${n}](#enc-46)
- [decision:${n}](#enc-47)
- [hold:${n}](#enc-48)
- [incident:${n}](#enc-49)
- [ultimatum](#enc-50)
- [reckoning:${night}](#enc-51)
- [conclusion:${ending-or-status}](#enc-52)
- [final-demand](#enc-53)
- [lease:0](#enc-54)
- [talk:${n}:vesper:question](#enc-55)
- [talk:${n}:vesper:relationship](#enc-56)
- [talk:${n}:vesper:respect](#enc-57)
- [talk:${n}:vesper:challenge](#enc-58)
- [talk:${n}:seraphine:question](#enc-59)
- [talk:${n}:seraphine:relationship](#enc-60)
- [talk:${n}:seraphine:respect](#enc-61)
- [talk:${n}:seraphine:challenge](#enc-62)
- [talk:${n}:marius:question](#enc-63)
- [talk:${n}:marius:relationship](#enc-64)
- [talk:${n}:marius:respect](#enc-65)
- [talk:${n}:marius:challenge](#enc-66)
- [talk:${n}:mirelle:question](#enc-67)
- [talk:${n}:mirelle:relationship](#enc-68)
- [talk:${n}:mirelle:respect](#enc-69)
- [talk:${n}:mirelle:challenge](#enc-70)
- [talk:${n}:dorian:question](#enc-71)
- [talk:${n}:dorian:relationship](#enc-72)
- [talk:${n}:dorian:respect](#enc-73)
- [talk:${n}:dorian:challenge](#enc-74)
- [talk:${n}:lucien:question](#enc-75)
- [talk:${n}:lucien:relationship](#enc-76)
- [talk:${n}:lucien:respect](#enc-77)
- [talk:${n}:lucien:challenge](#enc-78)
- [talk:${n}:cassian:question](#enc-79)
- [talk:${n}:cassian:relationship](#enc-80)
- [talk:${n}:cassian:respect](#enc-81)
- [talk:${n}:cassian:challenge](#enc-82)
- [talk:${n}:sabine:question](#enc-83)
- [talk:${n}:sabine:relationship](#enc-84)
- [talk:${n}:sabine:respect](#enc-85)
- [talk:${n}:sabine:challenge](#enc-86)
- [reaction:npc:${night}:${actor}:passage_offer](#enc-87)
- [reaction:npc:${night}:${actor}:passage_buy](#enc-88)
- [reaction:npc:${night}:${actor}:passage_collect](#enc-89)
- [reaction:npc:${night}:${actor}:final_answer](#enc-90)
- [reaction:npc:${night}:${actor}:revoke](#enc-91)
- [reaction:npc:${night}:${actor}:dismiss](#enc-92)
- [reaction:npc:${night}:${actor}:archive_assist](#enc-93)
- [reaction:npc:${night}:${actor}:archive_challenge](#enc-94)
- [reaction:npc:${night}:${actor}:archive_research](#enc-95)
- [reaction:npc:${night}:${actor}:archive_protect](#enc-96)
- [reaction:npc:${night}:${actor}:appoint](#enc-97)
- [reaction:npc:${night}:${actor}:open_passage](#enc-98)
- [reaction:npc:${night}:${actor}:publish](#enc-99)
- [reaction:npc:${night}:${actor}:sponsor](#enc-100)
- [reaction:npc:${night}:${actor}:compete](#enc-101)
- [reaction:npc:${night}:${actor}:collect](#enc-102)
- [reaction:npc:${night}:${actor}:collect_sanctuary](#enc-103)
- [reaction:npc:${night}:${actor}:offer](#enc-104)
- [reaction:key:${grant}](#enc-105)
- [reaction:withdraw:${grant}](#enc-106)
- [reaction:lease:${id}:${status}](#enc-107)
- [reaction:decline:${agreement}](#enc-108)
- [reaction:service-kept](#enc-109)

## Shared eligibility and execution

Commitments also require session/revision validation and no conflicting pending transaction. Visibility is not authorization. Exact predicates and rejection messages:

[src/game.ts:70](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/game.ts:70>)

```ts
export function actionAvailability(s:Campaign,kind:string,w:Authority):Availability{
  if(!Object.hasOwn(ACTIONS,kind))return {kind,label:kind,allowed:false,reasons:['Unknown game action.'],cost:{blood:0,majorActions:1},permission:null,description:''};
  const spec=ACTIONS[kind as GameAction],reasons:string[]=[];
  const free=!!s.politics&&['learn_seraphine','discuss_exchange','investigate_bloodline','investigate_expiry'].includes(kind);
  if(s.status!=='playing')reasons.push('Campaign ended.');
  if(!free&&s.actionsLeft<1)reasons.push('No major actions remain.');
  if(isFinalAction(kind))reasons.push(...finalReasons(s,kind,w));
  if(isLibraryAction(kind))reasons.push(...libraryReasons(s,kind,w));
  if(Object.hasOwn(POLITICAL_ACTIONS,kind))reasons.push(...politicalReasons(s,kind,w));
  if(!free&&s.resources.blood<spec.blood)reasons.push(`Insufficient Blood: need ${spec.blood}, current ${s.resources.blood}.`);
  if(spec.property){const denied=roomDenial(w,spec.property);if(denied)reasons.push(`${spec.property}: ${denied}`);}
  if(spec.once&&s.discoveries.some(d=>d.id===kind))reasons.push('Completed — this opportunity is exhausted.');
  if(kind==='investigate_expiry'&&!w.leases.some(l=>l.status==='accepted'))reasons.push('Requires an accepted lease to investigate.');
  if(kind==='discuss_exchange'&&!s.discoveries.some(d=>d.id==='learn_seraphine'))reasons.push('First learn what Seraphine wants.');
  if(kind==='rest'&&s.resources.blood===12)reasons.push('Already fully rested.');
  return {kind,label:spec.label,allowed:!reasons.length,reasons,cost:{blood:free?0:spec.blood,majorActions:free?0:1},permission:spec.property??null,description:free?'Free information: inspect this record once; rereading it is always free.':s.politics&&kind==='investigate_title'?'Cost 1 Blood; publicly file your verified Library title to qualify for sanctuary negotiations. This grants no rights.':spec.description};
}
export function validateAction(s:Campaign,proposal:GameProposal,w:Authority):Availability{
  if(!proposal||Object.keys(proposal).length!==1||typeof proposal.kind!=='string')throw new Error('Invalid action proposal.');
  const result=actionAvailability(s,proposal.kind,w);if(!result.allowed)throw new Error(result.reasons.join(' '));return result;
}
export function availableActions(s:Campaign,w:Authority){return Object.keys(ACTIONS).filter(kind=>(s.politics||!Object.hasOwn(POLITICAL_ACTIONS,kind))&&(!isLibraryAction(kind)||s.politics?.library)&&(!isFinalAction(kind)||s.politics?.finalCourt)).map(kind=>actionAvailability(s,kind,w));}
```

[src/politics.ts:36](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/politics.ts:36>)

```ts
export function politicalReasons(s:Campaign,kind:string,w:Authority):string[]{
  const p=s.politics;if(!p)return ['Requires a new Pass 2C campaign.'];
  const r:string[]=[];
  if(kind==='petition_marius'&&(p.appointment!=='open'||s.night>=3))r.push('The appointment is already claimed or closed.');
  if(kind==='sanctuary_pact'){
    if(!p.titleFiled&&p.dossier!=='player')r.push('First file your Library title or secure the dossier.');
    const l=w.leases.find(l=>l.property_id==='sanctuary');
    if(!l||l.status!=='offered'||w.night>=l.offer_expiry_night)r.push('The sanctuary offer is unavailable or expired.');
  }
  if(kind==='fulfil_service'&&(p.appointment!=='player'||p.serviceFulfilled||!w.access.court||s.night<3||s.night>=5))r.push('Requires active patron protection and an unfulfilled obligation during Nights 4–5.');
  if(kind==='secure_dossier'&&(!p.archiveLead||p.dossier!=='open'||s.night>=4))r.push('No available archive lead; dossier claimed or deadline passed.');
  if(kind==='broker_passage'&&(!p.archiveLead||p.passageRequested||s.night>=3))r.push('Requires a public lead and an unclaimed passage before Night 4.');
  return r;
}
```

[src/library.ts:21](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/library.ts:21>)

```ts
export function libraryReasons(s:Campaign,kind:LibraryAction,w:Authority):string[]{
  if(!s.politics?.library)return ['Requires a new Living Court campaign.'];
  if(w.properties.find(p=>p.id==='library')?.owner!==accounts(s).player)return ['You do not own the Library.'];
  if(s.night<3)return ['The Library petitions arrive after Vesper’s ultimatum.'];
  const root=libraryRoot(s,w);
  if(kind==='withdraw_library')return root?[]:['No permission of yours remains to withdraw.'];
  if(s.night>=6)return ['There is no time left for a new investigation.'];
  if(s.politics.library.result!=='open')return ['The investigation is already published.'];
  return root?['Withdraw your current delegation before choosing another investigator.']:[];
}
export function libraryPlayerOperation(s:Campaign,kind:LibraryAction,w:Authority):LibraryOperation{
  const reasons=libraryReasons(s,kind,w);if(reasons.length)throw new Error(reasons.join(' '));
  if(kind==='withdraw_library')return {method:'revoke_grant',args:{grant_id:libraryRoot(s,w)!.id}};
  return {method:'grant_access',args:{property_id:'library',scope:'enter',grantee:accounts(s)[kind==='authorize_mirelle'?'mirelle':'dorian'],parent_grant_id:null,can_delegate:true,expiry_night:null}};
}
```

[src/finalCourt.ts:17](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/finalCourt.ts:17>)

```ts
export function finalDemand(s:Campaign,w:Authority){return !!s.politics?.finalCourt&&s.night===6&&!!mariusProtection(s,w);}
export function finalReasons(s:Campaign,kind:FinalAction,w:Authority):string[]{
 if(!finalDemand(s,w)||s.politics!.finalCourt!.response)return ['No unanswered final demand.'];
 if(kind==='final_counter'&&(!s.politics?.library||s.politics.library.result==='open'))return ['A published Library account is required to support this proposal.'];
 return [];
}
export function finalPlayerOperation(s:Campaign,kind:FinalAction,w:Authority):LibraryOperation|null{
 const reasons=finalReasons(s,kind,w);if(reasons.length)throw new Error(reasons.join(' '));
 if(kind==='final_refuse')return null;
 return {method:'grant_access',args:{property_id:'library',scope:'enter',grantee:s.politics!.accounts.marius,parent_grant_id:null,can_delegate:false,expiry_night:kind==='final_counter'?8:null}};
}
```

<a id="enc-1"></a>

## character:vesper

**Character:** vesper. **Location:** crypt.

**Availability:** NPC exists in roster; active Nights 1–7; suggestions vary, relationships retain access.

**Tree / convergence:** Opening → ask/personal → parent; eligible offer → action inspection. Investigator opening may be overridden after withdrawal.

**State / contract:** Browser memory only until commitment.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:148](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:148>)

<a id="enc-2"></a>

## ask:${n}:vesper

**Character:** vesper. **Location:** crypt.

**Availability:** Living Court, parent available.

**Tree / convergence:** Exact question → exact response → “There is something else I want to ask” → parent; eligible offer → negotiation. Loop is repeatable.

**State / contract:** No resource, affinity or contract change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:148](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:148>)

<a id="enc-3"></a>

## personal:${n}:vesper

**Character:** vesper. **Location:** crypt.

**Availability:** Living Court, parent available.

**Tree / convergence:** Exact question → exact response → “There is something else I want to ask” → parent; eligible offer → negotiation. Loop is repeatable.

**State / contract:** No resource, affinity or contract change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:148](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:148>)

<a id="enc-4"></a>

## character:seraphine

**Character:** seraphine. **Location:** lounge.

**Availability:** NPC exists in roster; active Nights 1–7; suggestions vary, relationships retain access.

**Tree / convergence:** Opening → ask/personal → parent; eligible offer → action inspection. Investigator opening may be overridden after withdrawal.

**State / contract:** Browser memory only until commitment.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:150](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:150>)

<a id="enc-5"></a>

## ask:${n}:seraphine

**Character:** seraphine. **Location:** lounge.

**Availability:** Living Court, parent available.

**Tree / convergence:** Exact question → exact response → “There is something else I want to ask” → parent; eligible offer → negotiation. Loop is repeatable.

**State / contract:** No resource, affinity or contract change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:150](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:150>)

<a id="enc-6"></a>

## personal:${n}:seraphine

**Character:** seraphine. **Location:** lounge.

**Availability:** Living Court, parent available.

**Tree / convergence:** Exact question → exact response → “There is something else I want to ask” → parent; eligible offer → negotiation. Loop is repeatable.

**State / contract:** No resource, affinity or contract change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:150](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:150>)

<a id="enc-7"></a>

## character:marius

**Character:** marius. **Location:** lounge.

**Availability:** NPC exists in roster; active Nights 1–7; suggestions vary, relationships retain access.

**Tree / convergence:** Opening → ask/personal → parent; eligible offer → action inspection. Investigator opening may be overridden after withdrawal.

**State / contract:** Browser memory only until commitment.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:152](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:152>)

<a id="enc-8"></a>

## ask:${n}:marius

**Character:** marius. **Location:** lounge.

**Availability:** Living Court, parent available.

**Tree / convergence:** Exact question → exact response → “There is something else I want to ask” → parent; eligible offer → negotiation. Loop is repeatable.

**State / contract:** No resource, affinity or contract change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:152](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:152>)

<a id="enc-9"></a>

## personal:${n}:marius

**Character:** marius. **Location:** lounge.

**Availability:** Living Court, parent available.

**Tree / convergence:** Exact question → exact response → “There is something else I want to ask” → parent; eligible offer → negotiation. Loop is repeatable.

**State / contract:** No resource, affinity or contract change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:152](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:152>)

<a id="enc-10"></a>

## character:mirelle

**Character:** mirelle. **Location:** library.

**Availability:** NPC exists in roster; active Nights 1–7; suggestions vary, relationships retain access.

**Tree / convergence:** Opening → ask/personal → parent; eligible offer → action inspection. Investigator opening may be overridden after withdrawal.

**State / contract:** Browser memory only until commitment.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:154](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:154>)

<a id="enc-11"></a>

## ask:${n}:mirelle

**Character:** mirelle. **Location:** library.

**Availability:** Living Court, parent available.

**Tree / convergence:** Exact question → exact response → “There is something else I want to ask” → parent; eligible offer → negotiation. Loop is repeatable.

**State / contract:** No resource, affinity or contract change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:154](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:154>)

<a id="enc-12"></a>

## personal:${n}:mirelle

**Character:** mirelle. **Location:** library.

**Availability:** Living Court, parent available.

**Tree / convergence:** Exact question → exact response → “There is something else I want to ask” → parent; eligible offer → negotiation. Loop is repeatable.

**State / contract:** No resource, affinity or contract change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:154](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:154>)

<a id="enc-13"></a>

## character:dorian

**Character:** dorian. **Location:** library.

**Availability:** NPC exists in roster; active Nights 1–7; suggestions vary, relationships retain access.

**Tree / convergence:** Opening → ask/personal → parent; eligible offer → action inspection. Investigator opening may be overridden after withdrawal.

**State / contract:** Browser memory only until commitment.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:156](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:156>)

<a id="enc-14"></a>

## ask:${n}:dorian

**Character:** dorian. **Location:** library.

**Availability:** Living Court, parent available.

**Tree / convergence:** Exact question → exact response → “There is something else I want to ask” → parent; eligible offer → negotiation. Loop is repeatable.

**State / contract:** No resource, affinity or contract change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:156](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:156>)

<a id="enc-15"></a>

## personal:${n}:dorian

**Character:** dorian. **Location:** library.

**Availability:** Living Court, parent available.

**Tree / convergence:** Exact question → exact response → “There is something else I want to ask” → parent; eligible offer → negotiation. Loop is repeatable.

**State / contract:** No resource, affinity or contract change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:156](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:156>)

<a id="enc-16"></a>

## character:lucien

**Character:** lucien. **Location:** lounge.

**Availability:** NPC exists in roster; active Nights 1–7; suggestions vary, relationships retain access.

**Tree / convergence:** Opening → ask/personal → parent; eligible offer → action inspection. Investigator opening may be overridden after withdrawal.

**State / contract:** Browser memory only until commitment.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:158](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:158>)

<a id="enc-17"></a>

## ask:${n}:lucien

**Character:** lucien. **Location:** lounge.

**Availability:** Living Court, parent available.

**Tree / convergence:** Exact question → exact response → “There is something else I want to ask” → parent; eligible offer → negotiation. Loop is repeatable.

**State / contract:** No resource, affinity or contract change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:158](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:158>)

<a id="enc-18"></a>

## personal:${n}:lucien

**Character:** lucien. **Location:** lounge.

**Availability:** Living Court, parent available.

**Tree / convergence:** Exact question → exact response → “There is something else I want to ask” → parent; eligible offer → negotiation. Loop is repeatable.

**State / contract:** No resource, affinity or contract change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:158](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:158>)

<a id="enc-19"></a>

## character:cassian

**Character:** cassian. **Location:** library.

**Availability:** NPC exists in roster; active Nights 1–7; suggestions vary, relationships retain access.

**Tree / convergence:** Opening → ask/personal → parent; eligible offer → action inspection. Investigator opening may be overridden after withdrawal.

**State / contract:** Browser memory only until commitment.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:160](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:160>)

<a id="enc-20"></a>

## ask:${n}:cassian

**Character:** cassian. **Location:** library.

**Availability:** Living Court, parent available.

**Tree / convergence:** Exact question → exact response → “There is something else I want to ask” → parent; eligible offer → negotiation. Loop is repeatable.

**State / contract:** No resource, affinity or contract change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:160](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:160>)

<a id="enc-21"></a>

## personal:${n}:cassian

**Character:** cassian. **Location:** library.

**Availability:** Living Court, parent available.

**Tree / convergence:** Exact question → exact response → “There is something else I want to ask” → parent; eligible offer → negotiation. Loop is repeatable.

**State / contract:** No resource, affinity or contract change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:160](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:160>)

<a id="enc-22"></a>

## character:sabine

**Character:** sabine. **Location:** lounge.

**Availability:** NPC exists in roster; active Nights 1–7; suggestions vary, relationships retain access.

**Tree / convergence:** Opening → ask/personal → parent; eligible offer → action inspection. Investigator opening may be overridden after withdrawal.

**State / contract:** Browser memory only until commitment.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:162](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:162>)

<a id="enc-23"></a>

## ask:${n}:sabine

**Character:** sabine. **Location:** lounge.

**Availability:** Living Court, parent available.

**Tree / convergence:** Exact question → exact response → “There is something else I want to ask” → parent; eligible offer → negotiation. Loop is repeatable.

**State / contract:** No resource, affinity or contract change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:162](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:162>)

<a id="enc-24"></a>

## personal:${n}:sabine

**Character:** sabine. **Location:** lounge.

**Availability:** Living Court, parent available.

**Tree / convergence:** Exact question → exact response → “There is something else I want to ask” → parent; eligible offer → negotiation. Loop is repeatable.

**State / contract:** No resource, affinity or contract change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#current-character-conversations).

[src/livingCourt.ts:162](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:162>)

<a id="enc-25"></a>

## action:petition_marius

**Character:** ACTION_SPEAKER; withdrawal uses selected investigator. **Location:** Speaker room; otherwise permission Library or Crypt.

**Availability:** Exact action predicates below; commit only when allowed, playing, no pending/error. Demoted current-mode actions have no commit.

**Tree / convergence:** Inspection → commit or “Consider my other choices” → decision. Verified commit refreshes state and may trigger reckoning. Error does not invent success.

**State / contract:** Reserves player appointment and spends action. Marius must issue court grant at reckoning; service obligation and revocability remain.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#action-negotiations).

[src/politics.ts:29](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/politics.ts:29>)

<a id="enc-26"></a>

## action:sanctuary_pact

**Character:** ACTION_SPEAKER; withdrawal uses selected investigator. **Location:** Speaker room; otherwise permission Library or Crypt.

**Availability:** Exact action predicates below; commit only when allowed, playing, no pending/error. Demoted current-mode actions have no commit.

**Tree / convergence:** Inspection → commit or “Consider my other choices” → decision. Verified commit refreshes state and may trigger reckoning. Error does not invent success.

**State / contract:** accept_lease on verified sanctuary offer; 0.02 NEAR prepaid treasury payment for current public mode. Fixed term, nonrefundable; spends action. No protection is asserted from an offer.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#action-negotiations).

[src/politics.ts:30](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/politics.ts:30>)

<a id="enc-27"></a>

## action:fulfil_service

**Character:** ACTION_SPEAKER; withdrawal uses selected investigator. **Location:** Speaker room; otherwise permission Library or Crypt.

**Availability:** Exact action predicates below; commit only when allowed, playing, no pending/error. Demoted current-mode actions have no commit.

**Tree / convergence:** Inspection → commit or “Consider my other choices” → decision. Verified commit refreshes state and may trigger reckoning. Error does not invent success.

**State / contract:** Spends action and 1 Blood; records completed service, not a new grant.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#action-negotiations).

[src/politics.ts:31](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/politics.ts:31>)

<a id="enc-28"></a>

## action:secure_dossier

**Character:** ACTION_SPEAKER; withdrawal uses selected investigator. **Location:** Speaker room; otherwise permission Library or Crypt.

**Availability:** Exact action predicates below; commit only when allowed, playing, no pending/error. Demoted current-mode actions have no commit.

**Tree / convergence:** Inspection → commit or “Consider my other choices” → decision. Verified commit refreshes state and may trigger reckoning. Error does not invent success.

**State / contract:** Claims finite dossier for action and 1 Blood; legacy sanctuary qualification. Demoted in Living Court.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#action-negotiations).

[src/politics.ts:32](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/politics.ts:32>)

<a id="enc-29"></a>

## action:broker_passage

**Character:** ACTION_SPEAKER; withdrawal uses selected investigator. **Location:** Speaker room; otherwise permission Library or Crypt.

**Availability:** Exact action predicates below; commit only when allowed, playing, no pending/error. Demoted current-mode actions have no commit.

**Tree / convergence:** Inspection → commit or “Consider my other choices” → decision. Verified commit refreshes state and may trigger reckoning. Error does not invent success.

**State / contract:** Records passage request and spends action; Lucien must issue grant, expiring at contract night 5 (displayed Night 6).

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#action-negotiations).

[src/politics.ts:33](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/politics.ts:33>)

<a id="enc-30"></a>

## action:authorize_mirelle

**Character:** ACTION_SPEAKER; withdrawal uses selected investigator. **Location:** Speaker room; otherwise permission Library or Crypt.

**Availability:** Exact action predicates below; commit only when allowed, playing, no pending/error. Demoted current-mode actions have no commit.

**Tree / convergence:** Inspection → commit or “Consider my other choices” → decision. Verified commit refreshes state and may trigger reckoning. Error does not invent success.

**State / contract:** grant_access: Library enter, delegable, no expiry, Mirelle grantee; records authorization. Assistant, research and patron grant are separate NPC turns.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#action-negotiations).

[src/library.ts:6](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/library.ts:6>)

<a id="enc-31"></a>

## action:authorize_dorian

**Character:** ACTION_SPEAKER; withdrawal uses selected investigator. **Location:** Speaker room; otherwise permission Library or Crypt.

**Availability:** Exact action predicates below; commit only when allowed, playing, no pending/error. Demoted current-mode actions have no commit.

**Tree / convergence:** Inspection → commit or “Consider my other choices” → decision. Verified commit refreshes state and may trigger reckoning. Error does not invent success.

**State / contract:** grant_access: Library enter, delegable, no expiry, Dorian grantee. Lucien assistant, research and independent protection require later verified NPC turns.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#action-negotiations).

[src/library.ts:7](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/library.ts:7>)

<a id="enc-32"></a>

## action:withdraw_library

**Character:** ACTION_SPEAKER; withdrawal uses selected investigator. **Location:** Speaker room; otherwise permission Library or Crypt.

**Availability:** Exact action predicates below; commit only when allowed, playing, no pending/error. Demoted current-mode actions have no commit.

**Tree / convergence:** Inspection → commit or “Consider my other choices” → decision. Verified commit refreshes state and may trigger reckoning. Error does not invent success.

**State / contract:** revoke_grant on investigator root invalidates dependent assistant permission. Published work, independent rights and financial liabilities survive.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#action-negotiations).

[src/library.ts:8](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/library.ts:8>)

<a id="enc-33"></a>

## action:final_accept

**Character:** ACTION_SPEAKER; withdrawal uses selected investigator. **Location:** Speaker room; otherwise permission Library or Crypt.

**Availability:** Exact action predicates below; commit only when allowed, playing, no pending/error. Demoted current-mode actions have no commit.

**Tree / convergence:** Inspection → commit or “Consider my other choices” → decision. Verified commit refreshes state and may trigger reckoning. Error does not invent success.

**State / contract:** Grants non-delegable, non-expiring Library entry to Marius; records response. NPC final_answer verifies continued court protection.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#action-negotiations).

[src/finalCourt.ts:7](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/finalCourt.ts:7>)

<a id="enc-34"></a>

## action:final_refuse

**Character:** ACTION_SPEAKER; withdrawal uses selected investigator. **Location:** Speaker room; otherwise permission Library or Crypt.

**Availability:** Exact action predicates below; commit only when allowed, playing, no pending/error. Demoted current-mode actions have no commit.

**Tree / convergence:** Inspection → commit or “Consider my other choices” → decision. Verified commit refreshes state and may trigger reckoning. Error does not invent success.

**State / contract:** Spends action and records refusal; Marius later revokes his own protection. Independent shelter survives.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#action-negotiations).

[src/finalCourt.ts:8](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/finalCourt.ts:8>)

<a id="enc-35"></a>

## action:final_counter

**Character:** ACTION_SPEAKER; withdrawal uses selected investigator. **Location:** Speaker room; otherwise permission Library or Crypt.

**Availability:** Exact action predicates below; commit only when allowed, playing, no pending/error. Demoted current-mode actions have no commit.

**Tree / convergence:** Inspection → commit or “Consider my other choices” → decision. Verified commit refreshes state and may trigger reckoning. Error does not invent success.

**State / contract:** Spends action and 1 Blood; non-delegable Library entry expires at contract night 8. Invitation remains even after rejection. Acceptance requires Mirelle publication, completed service and active settled Cassian passage.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#action-negotiations).

[src/finalCourt.ts:9](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/finalCourt.ts:9>)

<a id="enc-36"></a>

## action:feed

**Character:** ACTION_SPEAKER; withdrawal uses selected investigator. **Location:** Speaker room; otherwise permission Library or Crypt.

**Availability:** Exact action predicates below; commit only when allowed, playing, no pending/error. Demoted current-mode actions have no commit.

**Tree / convergence:** Inspection → commit or “Consider my other choices” → decision. Verified commit refreshes state and may trigger reckoning. Error does not invent success.

**State / contract:** Restores 4 Blood capped at 12; spends one nightly action. Last action triggers automatic reckoning in new political campaigns; dawn and deadlines still apply.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#action-negotiations).

[src/game.ts:25](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/game.ts:25>)

<a id="enc-37"></a>

## action:rest

**Character:** ACTION_SPEAKER; withdrawal uses selected investigator. **Location:** Speaker room; otherwise permission Library or Crypt.

**Availability:** Exact action predicates below; commit only when allowed, playing, no pending/error. Demoted current-mode actions have no commit.

**Tree / convergence:** Inspection → commit or “Consider my other choices” → decision. Verified commit refreshes state and may trigger reckoning. Error does not invent success.

**State / contract:** Restores 2 Blood capped at 12 with Crypt access; spends action. Vesper deadline unchanged.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#action-negotiations).

[src/game.ts:26](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/game.ts:26>)

<a id="enc-38"></a>

## action:investigate_title

**Character:** ACTION_SPEAKER; withdrawal uses selected investigator. **Location:** Speaker room; otherwise permission Library or Crypt.

**Availability:** Exact action predicates below; commit only when allowed, playing, no pending/error. Demoted current-mode actions have no commit.

**Tree / convergence:** Inspection → commit or “Consider my other choices” → decision. Verified commit refreshes state and may trigger reckoning. Error does not invent success.

**State / contract:** Spends major action and 1 Blood; sets titleFiled. No shelter or new ownership.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#action-negotiations).

[src/game.ts:27](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/game.ts:27>)

<a id="enc-39"></a>

## action:investigate_bloodline

**Character:** ACTION_SPEAKER; withdrawal uses selected investigator. **Location:** Speaker room; otherwise permission Library or Crypt.

**Availability:** Exact action predicates below; commit only when allowed, playing, no pending/error. Demoted current-mode actions have no commit.

**Tree / convergence:** Inspection → commit or “Consider my other choices” → decision. Verified commit refreshes state and may trigger reckoning. Error does not invent success.

**State / contract:** Legacy free informational discovery; no right. Demoted in Living Court.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#action-negotiations).

[src/game.ts:28](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/game.ts:28>)

<a id="enc-40"></a>

## action:investigate_expiry

**Character:** ACTION_SPEAKER; withdrawal uses selected investigator. **Location:** Speaker room; otherwise permission Library or Crypt.

**Availability:** Exact action predicates below; commit only when allowed, playing, no pending/error. Demoted current-mode actions have no commit.

**Tree / convergence:** Inspection → commit or “Consider my other choices” → decision. Verified commit refreshes state and may trigger reckoning. Error does not invent success.

**State / contract:** Legacy free informational discovery; no right. Demoted in Living Court.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#action-negotiations).

[src/game.ts:29](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/game.ts:29>)

<a id="enc-41"></a>

## action:learn_seraphine

**Character:** ACTION_SPEAKER; withdrawal uses selected investigator. **Location:** Speaker room; otherwise permission Library or Crypt.

**Availability:** Exact action predicates below; commit only when allowed, playing, no pending/error. Demoted current-mode actions have no commit.

**Tree / convergence:** Inspection → commit or “Consider my other choices” → decision. Verified commit refreshes state and may trigger reckoning. Error does not invent success.

**State / contract:** Legacy free informational discovery; no right. Demoted in Living Court.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#action-negotiations).

[src/game.ts:30](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/game.ts:30>)

<a id="enc-42"></a>

## action:discuss_exchange

**Character:** ACTION_SPEAKER; withdrawal uses selected investigator. **Location:** Speaker room; otherwise permission Library or Crypt.

**Availability:** Exact action predicates below; commit only when allowed, playing, no pending/error. Demoted current-mode actions have no commit.

**Tree / convergence:** Inspection → commit or “Consider my other choices” → decision. Verified commit refreshes state and may trigger reckoning. Error does not invent success.

**State / contract:** Legacy free informational discovery; no right. Demoted in Living Court.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#action-negotiations).

[src/game.ts:31](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/game.ts:31>)

<a id="enc-43"></a>

## record:crypt

**Character:** narrator. **Location:** crypt.

**Availability:** Living Court; text depends on verified rights and research result.

**Tree / convergence:** Record → “Send for [contact]” → parent conversation.

**State / contract:** No authoritative change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#night-navigation).

[src/livingCourt.ts:276](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:276>)

<a id="enc-44"></a>

## record:library

**Character:** narrator. **Location:** library.

**Availability:** Living Court; text depends on verified rights and research result.

**Tree / convergence:** Record → “Send for [contact]” → parent conversation.

**State / contract:** No authoritative change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#night-navigation).

[src/livingCourt.ts:276](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:276>)

<a id="enc-45"></a>

## record:lounge

**Character:** narrator. **Location:** lounge.

**Availability:** Living Court; text depends on verified rights and research result.

**Tree / convergence:** Record → “Send for [contact]” → parent conversation.

**State / contract:** No authoritative change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#night-navigation).

[src/livingCourt.ts:276](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:276>)

<a id="enc-46"></a>

## discovery:${n}

**Character:** Marius: final demand; Seraphine: lease; Vesper: ultimatum; otherwise narrator/recorded actors. **Location:** Lounge generally; ultimatum Crypt; ending-dependent conclusion.

**Availability:** Playing political campaign, Nights 1–7.

**Tree / convergence:** Contacts → parent; “I am ready to choose” → decision.

**State / contract:** Navigation free; wait resolves dawn; lease uses financial journal; replay requires archive readiness. See canonical effects.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#night-navigation).

[src/livingCourt.ts:130](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:130>)

<a id="enc-47"></a>

## decision:${n}

**Character:** Marius: final demand; Seraphine: lease; Vesper: ultimatum; otherwise narrator/recorded actors. **Location:** Lounge generally; ultimatum Crypt; ending-dependent conclusion.

**Availability:** Playing political campaign, Nights 1–7.

**Tree / convergence:** Allowed actions → inspections; optional wait → hold.

**State / contract:** Navigation free; wait resolves dawn; lease uses financial journal; replay requires archive readiness. See canonical effects.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#night-navigation).

[src/livingCourt.ts:130](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:130>)

<a id="enc-48"></a>

## hold:${n}

**Character:** Marius: final demand; Seraphine: lease; Vesper: ultimatum; otherwise narrator/recorded actors. **Location:** Lounge generally; ultimatum Crypt; ending-dependent conclusion.

**Availability:** Living Court, playing, end_night allowed, no pending/error.

**Tree / convergence:** “Wait for dawn” / “Face the final reckoning” → validated end_night.

**State / contract:** Navigation free; wait resolves dawn; lease uses financial journal; replay requires archive readiness. See canonical effects.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#night-navigation).

[src/livingCourt.ts:130](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:130>)

<a id="enc-49"></a>

## incident:${n}

**Character:** Marius: final demand; Seraphine: lease; Vesper: ultimatum; otherwise narrator/recorded actors. **Location:** Lounge generally; ultimatum Crypt; ending-dependent conclusion.

**Availability:** Living Court, n>0, playing.

**Tree / convergence:** “Hear the people involved” → discovery; “Choose my next move” → decision.

**State / contract:** Navigation free; wait resolves dawn; lease uses financial journal; replay requires archive readiness. See canonical effects.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#night-navigation).

[src/livingCourt.ts:130](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:130>)

<a id="enc-50"></a>

## ultimatum

**Character:** Marius: final demand; Seraphine: lease; Vesper: ultimatum; otherwise narrator/recorded actors. **Location:** Lounge generally; ultimatum Crypt; ending-dependent conclusion.

**Availability:** Politics, n=0, playing.

**Tree / convergence:** “Find out who might help me” → discovery; “I want an explanation” → Vesper.

**State / contract:** Navigation free; wait resolves dawn; lease uses financial journal; replay requires archive readiness. See canonical effects.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#night-navigation).

[src/encounters.ts:77](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/encounters.ts:77>)

<a id="enc-51"></a>

## reckoning:${night}

**Character:** Marius: final demand; Seraphine: lease; Vesper: ultimatum; otherwise narrator/recorded actors. **Location:** Lounge generally; ultimatum Crypt; ending-dependent conclusion.

**Availability:** Retained history night; confirmed/local non-pass events.

**Tree / convergence:** Recorded narration, no choices; continuing/skipping signs nothing.

**State / contract:** Navigation free; wait resolves dawn; lease uses financial journal; replay requires archive readiness. See canonical effects.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#night-navigation).

[src/encounters.ts:77](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/encounters.ts:77>)

<a id="enc-52"></a>

## conclusion:${ending-or-status}

**Character:** Marius: final demand; Seraphine: lease; Vesper: ultimatum; otherwise narrator/recorded actors. **Location:** Lounge generally; ultimatum Crypt; ending-dependent conclusion.

**Availability:** Nonplaying campaign.

**Tree / convergence:** Stored ending → persistent finale → Chronicle or lifecycle-gated replay.

**State / contract:** Navigation free; wait resolves dawn; lease uses financial journal; replay requires archive readiness. See canonical effects.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#night-navigation).

[src/encounters.ts:77](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/encounters.ts:77>)

<a id="enc-53"></a>

## final-demand

**Character:** Marius: final demand; Seraphine: lease; Vesper: ultimatum; otherwise narrator/recorded actors. **Location:** Lounge generally; ultimatum Crypt; ending-dependent conclusion.

**Availability:** Dangerous Court, n=6, effective Marius court grant, no response. Counter requires published account.

**Tree / convergence:** Standing invitation/refusal/counter → respective final inspection; no direct grant on navigation.

**State / contract:** Navigation free; wait resolves dawn; lease uses financial journal; replay requires archive readiness. See canonical effects.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#final-demand).

[src/livingCourt.ts:130](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:130>)

<a id="enc-54"></a>

## lease:0

**Character:** Marius: final demand; Seraphine: lease; Vesper: ultimatum; otherwise narrator/recorded actors. **Location:** Lounge generally; ultimatum Crypt; ending-dependent conclusion.

**Availability:** Lease 0 exists; commit needs playing, no pending/error and availability. Proposal decline needs pending agreement.

**Tree / convergence:** Proposal accept/decline or standing accept/reject → verified outcome; exact terms in canonical tree.

**State / contract:** Navigation free; wait resolves dawn; lease uses financial journal; replay requires archive readiness. See canonical effects.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#lounge-agreement).

[src/encounters.ts:77](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/encounters.ts:77>)

<a id="enc-55"></a>

## talk:${n}:vesper:question

**Character:** vesper. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:37](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:37>)

<a id="enc-56"></a>

## talk:${n}:vesper:relationship

**Character:** vesper. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:37](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:37>)

<a id="enc-57"></a>

## talk:${n}:vesper:respect

**Character:** vesper. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:37](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:37>)

<a id="enc-58"></a>

## talk:${n}:vesper:challenge

**Character:** vesper. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:37](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:37>)

<a id="enc-59"></a>

## talk:${n}:seraphine:question

**Character:** seraphine. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:38](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:38>)

<a id="enc-60"></a>

## talk:${n}:seraphine:relationship

**Character:** seraphine. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:38](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:38>)

<a id="enc-61"></a>

## talk:${n}:seraphine:respect

**Character:** seraphine. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:38](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:38>)

<a id="enc-62"></a>

## talk:${n}:seraphine:challenge

**Character:** seraphine. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:38](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:38>)

<a id="enc-63"></a>

## talk:${n}:marius:question

**Character:** marius. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:39](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:39>)

<a id="enc-64"></a>

## talk:${n}:marius:relationship

**Character:** marius. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:39](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:39>)

<a id="enc-65"></a>

## talk:${n}:marius:respect

**Character:** marius. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:39](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:39>)

<a id="enc-66"></a>

## talk:${n}:marius:challenge

**Character:** marius. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:39](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:39>)

<a id="enc-67"></a>

## talk:${n}:mirelle:question

**Character:** mirelle. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:41](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:41>)

<a id="enc-68"></a>

## talk:${n}:mirelle:relationship

**Character:** mirelle. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:41](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:41>)

<a id="enc-69"></a>

## talk:${n}:mirelle:respect

**Character:** mirelle. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:41](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:41>)

<a id="enc-70"></a>

## talk:${n}:mirelle:challenge

**Character:** mirelle. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:41](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:41>)

<a id="enc-71"></a>

## talk:${n}:dorian:question

**Character:** dorian. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:43](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:43>)

<a id="enc-72"></a>

## talk:${n}:dorian:relationship

**Character:** dorian. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:43](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:43>)

<a id="enc-73"></a>

## talk:${n}:dorian:respect

**Character:** dorian. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:43](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:43>)

<a id="enc-74"></a>

## talk:${n}:dorian:challenge

**Character:** dorian. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:43](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:43>)

<a id="enc-75"></a>

## talk:${n}:lucien:question

**Character:** lucien. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:40](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:40>)

<a id="enc-76"></a>

## talk:${n}:lucien:relationship

**Character:** lucien. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:40](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:40>)

<a id="enc-77"></a>

## talk:${n}:lucien:respect

**Character:** lucien. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:40](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:40>)

<a id="enc-78"></a>

## talk:${n}:lucien:challenge

**Character:** lucien. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:40](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:40>)

<a id="enc-79"></a>

## talk:${n}:cassian:question

**Character:** cassian. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:42](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:42>)

<a id="enc-80"></a>

## talk:${n}:cassian:relationship

**Character:** cassian. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:42](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:42>)

<a id="enc-81"></a>

## talk:${n}:cassian:respect

**Character:** cassian. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:42](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:42>)

<a id="enc-82"></a>

## talk:${n}:cassian:challenge

**Character:** cassian. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:42](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:42>)

<a id="enc-83"></a>

## talk:${n}:sabine:question

**Character:** sabine. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:44](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:44>)

<a id="enc-84"></a>

## talk:${n}:sabine:relationship

**Character:** sabine. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:44](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:44>)

<a id="enc-85"></a>

## talk:${n}:sabine:respect

**Character:** sabine. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:44](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:44>)

<a id="enc-86"></a>

## talk:${n}:sabine:challenge

**Character:** sabine. **Location:** lounge (legacy factory, not physical presence).

**Availability:** Playing politics without library. Nights 1–7.

**Tree / convergence:** Exact choice → exact reply → Ask another question / Return to Discovery / Make your decision. Loop.

**State / contract:** No relationship, resource, right or deadline change.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#legacy-character-dialogue).

[src/story.ts:44](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:44>)

<a id="enc-87"></a>

## reaction:npc:${night}:${actor}:passage_offer

**Character:** Recorded actor. **Location:** Event room in exact source.

**Availability:** Living Court; confirmed/local matching event plus verification predicate.

**Tree / convergence:** Optional NPC reply → narrator text → optional follow; unavailable action follow falls back to Library record. Continue closes.

**State / contract:** Projection only; no replay of underlying transaction.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:50](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:50>)

<a id="enc-88"></a>

## reaction:npc:${night}:${actor}:passage_buy

**Character:** Recorded actor. **Location:** Event room in exact source.

**Availability:** Living Court; confirmed/local matching event plus verification predicate.

**Tree / convergence:** Optional NPC reply → narrator text → optional follow; unavailable action follow falls back to Library record. Continue closes.

**State / contract:** Projection only; no replay of underlying transaction.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:51](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:51>)

<a id="enc-89"></a>

## reaction:npc:${night}:${actor}:passage_collect

**Character:** Recorded actor. **Location:** Event room in exact source.

**Availability:** Living Court; confirmed/local matching event plus verification predicate.

**Tree / convergence:** Optional NPC reply → narrator text → optional follow; unavailable action follow falls back to Library record. Continue closes.

**State / contract:** Projection only; no replay of underlying transaction.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:52](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:52>)

<a id="enc-90"></a>

## reaction:npc:${night}:${actor}:final_answer

**Character:** Recorded actor. **Location:** Event room in exact source.

**Availability:** Living Court; confirmed/local matching event plus verification predicate.

**Tree / convergence:** Optional NPC reply → narrator text → optional follow; unavailable action follow falls back to Library record. Continue closes.

**State / contract:** Projection only; no replay of underlying transaction.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:53](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:53>)

<a id="enc-91"></a>

## reaction:npc:${night}:${actor}:revoke

**Character:** Recorded actor. **Location:** Event room in exact source.

**Availability:** Living Court; confirmed/local matching event plus verification predicate.

**Tree / convergence:** Optional NPC reply → narrator text → optional follow; unavailable action follow falls back to Library record. Continue closes.

**State / contract:** Projection only; no replay of underlying transaction.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:56](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:56>)

<a id="enc-92"></a>

## reaction:npc:${night}:${actor}:dismiss

**Character:** Recorded actor. **Location:** Event room in exact source.

**Availability:** Living Court; confirmed/local matching event plus verification predicate.

**Tree / convergence:** Optional NPC reply → narrator text → optional follow; unavailable action follow falls back to Library record. Continue closes.

**State / contract:** Projection only; no replay of underlying transaction.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:58](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:58>)

<a id="enc-93"></a>

## reaction:npc:${night}:${actor}:archive_assist

**Character:** Recorded actor. **Location:** Event room in exact source.

**Availability:** Living Court; confirmed/local matching event plus verification predicate.

**Tree / convergence:** Optional NPC reply → narrator text → optional follow; unavailable action follow falls back to Library record. Continue closes.

**State / contract:** Projection only; no replay of underlying transaction.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:60](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:60>)

<a id="enc-94"></a>

## reaction:npc:${night}:${actor}:archive_challenge

**Character:** Recorded actor. **Location:** Event room in exact source.

**Availability:** Living Court; confirmed/local matching event plus verification predicate.

**Tree / convergence:** Optional NPC reply → narrator text → optional follow; unavailable action follow falls back to Library record. Continue closes.

**State / contract:** Projection only; no replay of underlying transaction.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:62](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:62>)

<a id="enc-95"></a>

## reaction:npc:${night}:${actor}:archive_research

**Character:** Recorded actor. **Location:** Event room in exact source.

**Availability:** Living Court; confirmed/local matching event plus verification predicate.

**Tree / convergence:** Optional NPC reply → narrator text → optional follow; unavailable action follow falls back to Library record. Continue closes.

**State / contract:** Projection only; no replay of underlying transaction.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:64](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:64>)

<a id="enc-96"></a>

## reaction:npc:${night}:${actor}:archive_protect

**Character:** Recorded actor. **Location:** Event room in exact source.

**Availability:** Living Court; confirmed/local matching event plus verification predicate.

**Tree / convergence:** Optional NPC reply → narrator text → optional follow; unavailable action follow falls back to Library record. Continue closes.

**State / contract:** Projection only; no replay of underlying transaction.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:66](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:66>)

<a id="enc-97"></a>

## reaction:npc:${night}:${actor}:appoint

**Character:** Recorded actor. **Location:** Event room in exact source.

**Availability:** Living Court; confirmed/local matching event plus verification predicate.

**Tree / convergence:** Optional NPC reply → narrator text → optional follow; unavailable action follow falls back to Library record. Continue closes.

**State / contract:** Projection only; no replay of underlying transaction.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:68](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:68>)

<a id="enc-98"></a>

## reaction:npc:${night}:${actor}:open_passage

**Character:** Recorded actor. **Location:** Event room in exact source.

**Availability:** Living Court; confirmed/local matching event plus verification predicate.

**Tree / convergence:** Optional NPC reply → narrator text → optional follow; unavailable action follow falls back to Library record. Continue closes.

**State / contract:** Projection only; no replay of underlying transaction.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:70](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:70>)

<a id="enc-99"></a>

## reaction:npc:${night}:${actor}:publish

**Character:** Recorded actor. **Location:** Event room in exact source.

**Availability:** Living Court; confirmed/local matching event plus verification predicate.

**Tree / convergence:** Optional NPC reply → narrator text → optional follow; unavailable action follow falls back to Library record. Continue closes.

**State / contract:** Projection only; no replay of underlying transaction.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:72](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:72>)

<a id="enc-100"></a>

## reaction:npc:${night}:${actor}:sponsor

**Character:** Recorded actor. **Location:** Event room in exact source.

**Availability:** Living Court; confirmed/local matching event plus verification predicate.

**Tree / convergence:** Optional NPC reply → narrator text → optional follow; unavailable action follow falls back to Library record. Continue closes.

**State / contract:** Projection only; no replay of underlying transaction.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:74](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:74>)

<a id="enc-101"></a>

## reaction:npc:${night}:${actor}:compete

**Character:** Recorded actor. **Location:** Event room in exact source.

**Availability:** Living Court; confirmed/local matching event plus verification predicate.

**Tree / convergence:** Optional NPC reply → narrator text → optional follow; unavailable action follow falls back to Library record. Continue closes.

**State / contract:** Projection only; no replay of underlying transaction.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:76](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:76>)

<a id="enc-102"></a>

## reaction:npc:${night}:${actor}:collect

**Character:** Recorded actor. **Location:** Event room in exact source.

**Availability:** Living Court; confirmed/local matching event plus verification predicate.

**Tree / convergence:** Optional NPC reply → narrator text → optional follow; unavailable action follow falls back to Library record. Continue closes.

**State / contract:** Projection only; no replay of underlying transaction.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:78](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:78>)

<a id="enc-103"></a>

## reaction:npc:${night}:${actor}:collect_sanctuary

**Character:** Recorded actor. **Location:** Event room in exact source.

**Availability:** Living Court; confirmed/local matching event plus verification predicate.

**Tree / convergence:** Optional NPC reply → narrator text → optional follow; unavailable action follow falls back to Library record. Continue closes.

**State / contract:** Projection only; no replay of underlying transaction.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:78](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:78>)

<a id="enc-104"></a>

## reaction:npc:${night}:${actor}:offer

**Character:** Recorded actor. **Location:** Event room in exact source.

**Availability:** Living Court; confirmed/local matching event plus verification predicate.

**Tree / convergence:** Optional NPC reply → narrator text → optional follow; unavailable action follow falls back to Library record. Continue closes.

**State / contract:** Projection only; no replay of underlying transaction.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:80](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:80>)

<a id="enc-105"></a>

## reaction:key:${grant}

**Character:** Investigator, Seraphine or Marius. **Location:** Library for keys; Lounge for agreement/service.

**Availability:** Corresponding grant/lease, rejected proposal or fulfilled service; exact verification predicate in canonical tree.

**Tree / convergence:** Narrator, optional reply, optional follow; closes to gameplay.

**State / contract:** Projection only; does not sign.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:104](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:104>)

<a id="enc-106"></a>

## reaction:withdraw:${grant}

**Character:** Investigator, Seraphine or Marius. **Location:** Library for keys; Lounge for agreement/service.

**Availability:** Corresponding grant/lease, rejected proposal or fulfilled service; exact verification predicate in canonical tree.

**Tree / convergence:** Narrator, optional reply, optional follow; closes to gameplay.

**State / contract:** Projection only; does not sign.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:114](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:114>)

<a id="enc-107"></a>

## reaction:lease:${id}:${status}

**Character:** Investigator, Seraphine or Marius. **Location:** Library for keys; Lounge for agreement/service.

**Availability:** Corresponding grant/lease, rejected proposal or fulfilled service; exact verification predicate in canonical tree.

**Tree / convergence:** Narrator, optional reply, optional follow; closes to gameplay.

**State / contract:** Projection only; does not sign.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:126](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:126>)

<a id="enc-108"></a>

## reaction:decline:${agreement}

**Character:** Investigator, Seraphine or Marius. **Location:** Library for keys; Lounge for agreement/service.

**Availability:** Corresponding grant/lease, rejected proposal or fulfilled service; exact verification predicate in canonical tree.

**Tree / convergence:** Narrator, optional reply, optional follow; closes to gameplay.

**State / contract:** Projection only; does not sign.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:130](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:130>)

<a id="enc-109"></a>

## reaction:service-kept

**Character:** Investigator, Seraphine or Marius. **Location:** Library for keys; Lounge for agreement/service.

**Availability:** Corresponding grant/lease, rejected proposal or fulfilled service; exact verification predicate in canonical tree.

**Tree / convergence:** Narrator, optional reply, optional follow; closes to gameplay.

**State / contract:** Projection only; does not sign.

**Exact branches:** [canonical extraction](COMPLETE_DIALOGUE.md#recorded-reactions).

[src/reactiveCourt.ts:132](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:132>)

## Branch count definition

70 authored question/command paths: 16 current questions, 32 legacy question/tone paths, 18 game commands, 4 Lounge command variants (proposal accept/reject; standing accept/reject). The 18 include five demoted current-mode actions and three final decisions. This is not a full conditional-edge or seven-night playthrough count. Navigation, end-night, replay and NPC reaction variants are documented separately.

## Base and legacy variants

[src/encounters.ts:42](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/encounters.ts:42>)

```ts
function characterLines(actor:NpcName,r:Result):DialogueLine[]{
  const c=r.campaign!,p=c.politics,w=r.world;
  switch(actor){
    case 'vesper':return [line(actor,w.grants[0]?.revoked?'The Crypt is closed to you. Your other arrangements are your own.':p?'Three nights. After the third reckoning, my permission ends. Decide where you will stand.':'The Crypt is yours to use while my grant remains.'),line('narrator','Vesper can withdraw her own grant. Your independent Library title lies outside it.')];
    case 'seraphine':return [line(actor,!p?'The Lounge agreement stands on its recorded terms. Let us inspect them.':w.access.sanctuary?'Your sanctuary covenant is recorded. Its protection lasts until the stated expiry.':p.titleFiled||p.dossier==='player'?'You have brought something concrete. Let us read the terms.':'Independence requires more than a declaration. File your title, or secure the archive dossier.'),line(actor,'Entry is not ownership. Read the duration before you give your answer.')];
    case 'marius':return [line(actor,p?.serviceFulfilled&&w.access.court?'Your service is fulfilled. The grant remains; so does its dependence on my authority.':p?.serviceFulfilled?'Your service is recorded, but it does not replace a valid grant. Inspect your present rights.':w.access.court?'You have institutional protection. The administrative obligation is still due during Nights Four and Five.':p?.appointment==='cassian'?'The appointment has been claimed. I will not promise it twice.':'One appointment is available. It carries protection and an obligation.'),line('narrator','This is institutional protection, not succession or a council vote.')];
    case 'lucien':return [line(actor,!p?'There is no passage agreement available in this campaign.':w.access.passage?'The passage is open to you—for now. It closes at contract night five.':p.passageRequested?'The passage you commissioned has ended. It was never a permanent settlement.':'I can arrange a temporary passage. You will still need a lasting position.'),line('narrator','Lucien acts independently, outside House Volari.')];
    case 'mirelle':return [line(actor,p?.archiveLead?'The lead is public now. The dossier will not remain unclaimed forever.':'While my Library permission holds, I can make the archive lead public.'),line(actor,p?.titleFiled?'Your title filing is already recorded. It grants no sanctuary by itself.':'A title can open a negotiation. It cannot replace the agreement.')];
    case 'cassian':return [line(actor,p?.appointment==='player'?'You reached the appointment first. Its obligation is yours as well.':p?.appointment==='cassian'?'The service is mine. The court can inspect the grant for itself.':'If you leave the appointment open, I intend to pursue it.')];
    case 'dorian':return [line(actor,p?.dossier==='player'?'You secured the dossier before I did. Now decide what to do with it.':p?.dossier==='dorian'?'The dossier has been claimed. That opportunity is closed.':'An open archive is an invitation. I do not intend to wait indefinitely.')];
    case 'sabine':return [line(actor,'A patron’s promise and a valid grant are different things. Inspect the chain.'),line(actor,r.world.grants.some(g=>g.grantor===p?.accounts.sabine&&g.grantee===p?.accounts.cassian)?'My sponsorship of Cassian is recorded. It still depends on the grant above it.':'I may sponsor Cassian only while my delegated court authority permits it.')];
  }
}
```

[src/story.ts:47](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/story.ts:47>)

```ts
export function addDirectedStory(r:Result,scenes:EncounterScene[]):void{
  const c=r.campaign!;if(!c.politics)return;
  if(c.politics.library){livingCourt(r,scenes);return;}
  if(c.status!=='playing'){
    scenes.find(s=>s.type==='CAMPAIGN CONCLUSION')?.terms.push(...protectionSummary(r));
    return;
  }
  const n=c.night,discovery=`discovery:${n}`,decision=`decision:${n}`;
  const scene=(id:string,title:string,lines:EncounterScene['lines'],choices:SceneChoice[],terms:string[]=[],portraits:NpcName[]=[]):EncounterScene=>({id,type:'ENCOUNTER',title,location:'lounge',portraits,lines,terms,rights:[],choices});
  const inspect=(id:string,label:string):SceneChoice=>({id,label,inspect:id});
  const actors=Object.keys(c.npcs) as NpcName[];
  for(const actor of actors){
    const parent=scenes.find(s=>s.id===`character:${actor}`)!;const v=voices[actor];
    const branches=[['question',v.question,v.answer],['relationship','Ask about relationships and authority',v.relationship],['respect','“I want to understand the terms.”',v.respect],['challenge','“Why should I trust this arrangement?”',v.challenge]];
    parent.choices.unshift(...branches.map(([key,label])=>inspect(`talk:${n}:${actor}:${key}`,`${label} · free`)));
    parent.choices.push(inspect(discovery,'Return to Discovery'),inspect(decision,'Make your decision'));
    for(const [key,label,answer] of branches)scenes.push(scene(`talk:${n}:${actor}:${key}`,label,[{speaker:actor,text:answer},{speaker:'narrator',text:'This conversation is free. Your tone changes no relationship, right, resource or deadline.'}],[inspect(`character:${actor}`,'Ask another question'),inspect(discovery,'Return to Discovery'),inspect(decision,'Make your decision')],actor==='seraphine'&&n>=3?['The sanctuary acceptance deadline has passed. Existing accepted rights keep their recorded expiry; conversation cannot reopen the offer.']:[],[actor]));
  }
  for(const s of scenes.filter(s=>s.id.startsWith('action:'))){
    s.terms.push(...commitmentImpact(s.id.slice(7),r));
    s.choices.push(inspect(decision,'Compare decisions before committing'));
  }
  const contacts=actors.map(actor=>inspect(`character:${actor}`,`Speak with ${AGENTS[actor].name} · free`));
  scenes.push(scene(discovery,`Discovery · Night ${n+1}`,[{speaker:'narrator',text:'Hear the court before you choose. All contacts are available remotely; entering their rooms is not required. You may skip any conversation.'}],contacts.concat(inspect(decision,'Make your decision')),protectionSummary(r)));
  const available=(r.actions??[]).filter(a=>a.allowed&&a.cost.majorActions>0);
  const commitments:SceneChoice[]=available.map(a=>({...inspect(`action:${a.kind}`,`${a.label} · inspect consequences`),summary:[`Cost: ${a.cost.majorActions} major action; ${a.cost.blood} Blood.${a.kind==='sanctuary_pact'?' Plus 0.02 Sandbox NEAR rent and gas.':''}`,...commitmentImpact(a.kind,r).filter(t=>!t.startsWith('Opportunity cost:'))]}));
  if(scenes.find(s=>s.id==='lease:0')?.choices.some(ch=>ch.id==='accept'))commitments.push(inspect('lease:0','Lounge tenancy · ordinary entry, NOT protection'));
  if(c.status==='playing'&&!r.pending&&!r.error&&r.availability?.end_night.length===0)commitments.push({id:'pass',label:'Pass this night · no new protection; deadlines and Blood upkeep still resolve',action:{action:'end_night'}});
  scenes.push({...scene(decision,`Make your decision · Night ${n+1}`,[{speaker:'narrator',text:'Choose one commitment after inspecting its terms. Nothing is spent until you explicitly commit. Every commitment advances the court and its deadlines; you may return to Discovery first.'}],commitments.concat(inspect(discovery,'Return to Discovery · free')),protectionSummary(r)),type:'DECISION'});
  const opening=scenes.find(s=>s.id==='ultimatum');
  if(opening){opening.choices.push(inspect(discovery,'Hear all available voices · Discovery'));opening.terms.push('You have three major actions before the ultimatum. A Lounge lease is ordinary room entry, not sanctuary. Ask freely before choosing.');}
  if(c.status==='playing'&&n>0){
    let actor:NpcName='seraphine',text='The court has moved. Review your protection and choose what you will preserve tonight.';
    if(c.resources.blood<=3){actor='sabine';text='Your Blood is running low. Rights cannot sustain an exhausted body. Consider feeding before another costly commitment.';}
    else if(r.world.access.court&&!c.politics.serviceFulfilled&&n>=3){actor='marius';text='My protection carries an unfinished obligation. Fulfil it during Nights Four or Five; the appointment alone is not the end of your bargain.';}
    else if(n<3&&!r.world.access.sanctuary&&!r.world.access.court){actor='vesper';text=`${3-n} night${3-n===1?'':'s'} remain before my Crypt grant is withdrawn. Seraphine’s sanctuary and Marius’s appointment offer different dependencies. Ask them now.`;}
    else if(n<3){text='Your existing arrangement does not silence the other patrons. You can still discuss alternatives, but sanctuary closes after Night Three.';}
    else if(r.world.access.passage&&!r.world.access.sanctuary&&!r.world.access.court){actor='lucien';text='My passage still protects you, but it expires at the start of Night Six. Inspect whether a lasting route remains; temporary access cannot satisfy the final reckoning.';}
    else if(n>=5){actor=r.world.access.sanctuary?'seraphine':'marius';text='The final reckoning draws near. Preserve your qualifying protection and enough Blood to survive it. Ordinary room access is not an ending.';}
    scenes.push({...scene(`incident:${n}`,`The court approaches · Night ${n+1}`,[{speaker:actor,text}], [inspect(discovery,'Hear the court · Discovery'),inspect(decision,'Review tonight’s decisions')],protectionSummary(r),[actor]),automatic:true});
  }
}
```
