# Living Court narrative rewrite proposal

**PROPOSAL ONLY — UNIMPLEMENTED.** The requested proposal supersedes the earlier implementation request. No source, mechanics, save, contract or deployment changes.

The five review samples come first, paired with exact current text. They are complete existing conversational routes, not a new linear cutscene. Alternative questions remain free; commitments still open inspection; aftermath requires verification.

Current conditional expressions preserve every source variant. Proposed bullets replace their arms in the same order unless explicitly described as a presentation-only selector. Braced values are existing runtime substitutions, not new state. Displayed nights are one-based; n is zero-based.

Baseline: [Complete dialogue](COMPLETE_DIALOGUE.md), [Encounter branches](ENCOUNTER_BRANCHES.md), [Editorial issues](NARRATIVE_ISSUES.md), [Coverage limits](NARRATIVE_COVERAGE.md). The audit was partial; every replacement below was checked against current source. This proposal does not reverify hosted playability.

## Review sample 1 — Prologue and Night 1: Vesper’s ultimatum

Route: four prologue panels → ultimatum → discovery or character:vesper → ask/personal → parent. No additional clicks, past events or branches.


#### Prologue — A borrowed shelter

**Type:** Narration. **State:** Existing vesper panel; preserve title/order.

**Exact current text / template:**

```text
The Crypt keeps the daylight out. For now. Vesper is your sire, and she has begun to speak of your shelter as something she might take away.
```

**Complete proposed replacement:**

> The Crypt shelters you because Vesper permits it. She is your sire. That has begun to sound less like a promise.

**Reason:** Establish vulnerability and competing interests without listing systems.

**Source:** [src/entry.ts:4](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/entry.ts:4>)

#### Prologue — House Volari

**Type:** Narration. **State:** Existing marius panel; preserve title/order.

**Exact current text / template:**

```text
Here, a promise can open a door. A debt can close it. Marius presides over the court, where every offer asks something of you in return.
```

**Complete proposed replacement:**

> Marius offers a place in House Volari. He expects that place to be earned.

**Reason:** Establish vulnerability and competing interests without listing systems.

**Source:** [src/entry.ts:5](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/entry.ts:5>)

#### Prologue — A power of her own

**Type:** Narration. **State:** Existing seraphine panel; preserve title/order.

**Exact current text / template:**

```text
Marius and Seraphine founded House Volari together. But hers is a power of her own. If you seek shelter at her table, it will be on her terms.
```

**Complete proposed replacement:**

> Seraphine founded the House beside Marius, not beneath him. Her sanctuary has a price of its own.

**Reason:** Establish vulnerability and competing interests without listing systems.

**Source:** [src/entry.ts:6](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/entry.ts:6>)

#### Prologue — Three nights

**Type:** Narration. **State:** Existing vesper panel; preserve title/order.

**Exact current text / template:**

```text
Vesper will close the Crypt to you at the third reckoning. Over seven nights, you must survive with a refuge of your own or a patron willing to protect you. Before its rival promises pull you apart, she has something to say.
```

**Complete proposed replacement:**

> At the third reckoning, Vesper will withdraw her Crypt invitation. You have seven nights to survive—and three to find another refuge.

**Reason:** Establish vulnerability and competing interests without listing systems.

**Source:** [src/entry.ts:7](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/entry.ts:7>)

#### Vesper — opening

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:vesper; question → ask:n:vesper, personal → personal:n:vesper. Active campaign; no new branch.

**Exact current text / template:**

```text
w.access.crypt?(n===2?'Tonight. You have had time to ask everyone else what they think of me. I trust you have also found a bed.':`You may sleep in my Crypt for ${3-n} more nights. Then you will find another roof. I will not have dependence mistaken for a birthright.`):'My door is closed. Yours is not. You still own the Library. I expect you are discovering how pleasant it is to be the one people ask.'
```

**Complete proposed replacement:**

- Crypt accessible, n=2: “This is the last night. I will close the Crypt at dawn. I would rather you resented me from somewhere safe.”
- Crypt accessible, other existing branch: “You have {3-n} nights beneath my roof. Then I withdraw my invitation. I am your sire. I will not be your shelter forever.”
- No Crypt access: “The Crypt does not admit you now. I am still your sire. Those are separate facts.”

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:148](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:148>)

#### Vesper — question

**Type:** Choice wording. **State:** Same ordered guards as the current expression. character:vesper; question → ask:n:vesper, personal → personal:n:vesper. Active campaign; no new branch.

**Exact current text / template:**

```text
'Does being your descendant count for nothing?'
```

**Complete proposed replacement:**

> Does being your descendant mean so little?

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:148](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:148>)

#### Vesper — answer

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:vesper; question → ask:n:vesper, personal → personal:n:vesper. Active campaign; no new branch.

**Exact current text / template:**

```text
'It makes you my descendant. It does not oblige me to house you forever. Nor does it entitle me to your Library. Tradition has limits; that is why it survives.'
```

**Complete proposed replacement:**

> It means I am your sire. It does not make your Library mine, or my hospitality yours to command.

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:148](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:148>)

#### Vesper — personal

**Type:** Choice wording. **State:** Same ordered guards as the current expression. character:vesper; question → ask:n:vesper, personal → personal:n:vesper. Active campaign; no new branch.

**Exact current text / template:**

```text
'Are you trying to make me fail?'
```

**Complete proposed replacement:**

> Do you want me to fail?

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:148](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:148>)

#### Vesper — reply

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:vesper; question → ask:n:vesper, personal → personal:n:vesper. Active campaign; no new branch.

**Exact current text / template:**

```text
'I am telling you precisely when my hospitality ends. Do not mistake that warning for a promise that someone else will catch you.'
```

**Complete proposed replacement:**

> I want you to understand that I mean it. What you do with the warning is yours.

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:148](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:148>)

#### Night 1 — ultimatum narrator

**Type:** Narration. **State:** Night 1 — ultimatum narrator

**Exact current text / template:**

```text
Before the third dawn, you need another refuge. Seraphine offers a bargain; Marius wants your service. Your Library is yours, but its walls are no shelter from the sun.
```

**Complete proposed replacement:**

> Before the third dawn, find another refuge. Seraphine will sell sanctuary. Marius wants service. The Library cannot shelter you.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:314](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:314>)

#### ultimatum → discovery:0

**Type:** Choice wording. **State:** ultimatum → discovery:0

**Exact current text / template:**

```text
Find out who might help me
```

**Complete proposed replacement:**

> Hear their offers.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:314](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:314>)

#### ultimatum → character:vesper

**Type:** Choice wording. **State:** ultimatum → character:vesper

**Exact current text / template:**

```text
I want an explanation
```

**Complete proposed replacement:**

> Speak to Vesper.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:314](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:314>)

After either question, retain “There is something else I want to ask” → parent. Discovery retains Seraphine/Marius and secondary Lucien access. Questions cannot persuade Vesper or move her deadline. The last-night threat is intent, not completed revocation.

## Review sample 2 — Nights 1–3: Seraphine’s sanctuary

Route: character:seraphine → either free question → return, file title if offered, or inspect action:sanctuary_pact → explicit paid commitment. No question accepts the lease.


#### Seraphine — opening

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:seraphine; question → ask:n:seraphine, personal → personal:n:seraphine. Active campaign; no new branch.

**Exact current text / template:**

```text
w.access.sanctuary?'You paid for a refuge. You have one. You may stop thanking me whenever it becomes tiresome.':n>=3?'You missed the offer. I can still listen, but listening will not put a roof over your head.':p.titleFiled?'Your Library really is your own. Good. Now we can discuss a bargain between people with something to lose.':'Marius likes to know where everyone belongs. I prefer to know whether they can keep a bargain. You need a place to sleep. I have one.'
```

**Complete proposed replacement:**

- Effective sanctuary access: “You paid for sanctuary. Enjoy the rare pleasure of not owing me gratitude.”
- Otherwise n>=3: “There is no sanctuary here for you now. I can offer conversation. Do not mistake it for shelter.”
- Otherwise titleFiled: “A claim of your own. Good. I prefer a bargain to an appeal.”
- Otherwise: “Marius will ask what use you are to him. I ask whether you can pay. Shall we spare each other the performance?”

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:150](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:150>)

#### Seraphine — question

**Type:** Choice wording. **State:** Same ordered guards as the current expression. character:seraphine; question → ask:n:seraphine, personal → personal:n:seraphine. Active campaign; no new branch.

**Exact current text / template:**

```text
'What is the catch?'
```

**Complete proposed replacement:**

> What exactly am I buying?

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:150](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:150>)

#### Seraphine — answer

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:seraphine; question → ask:n:seraphine, personal → personal:n:seraphine. Active campaign; no new branch.

**Exact current text / template:**

```text
'Seven nights of sanctuary, paid in advance: 0.02 NEAR. No refund, no ownership. I cannot take it back once you accept, but it ends. Bring your Library claim or the dossier before Night Four.'
```

**Complete proposed replacement:**

> Seven nights of sanctuary for 0.02 NEAR, paid in advance. No refund and no ownership. Once accepted, I cannot cancel it. A filed Library claim or secured dossier qualifies you. Acceptance closes before Night Four.

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:150](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:150>)

#### Seraphine — personal

**Type:** Choice wording. **State:** Same ordered guards as the current expression. character:seraphine; question → ask:n:seraphine, personal → personal:n:seraphine. Active campaign; no new branch.

**Exact current text / template:**

```text
'And Marius is content with that?'
```

**Complete proposed replacement:**

> Can Marius interfere?

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:150](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:150>)

#### Seraphine — reply

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:seraphine; question → ask:n:seraphine, personal → personal:n:seraphine. Active campaign; no new branch.

**Exact current text / template:**

```text
'Ask him. We founded this House together; we did not become the same person. My rights were mine before our marriage. They still are.'
```

**Complete proposed replacement:**

> He may object. We founded this House together; we did not merge our authority. He cannot cancel my bargain.

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:150](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:150>)

#### Sanctuary — whole negotiation

**Type:** Dialogue + retained terms. **State:** action:sanctuary_pact; unchanged eligibility/payment/deadline.

**Exact current text / template:**

```text
['Receive 7 nights of sanctuary. Neither Vesper nor Marius can withdraw it; Seraphine cannot cancel an accepted bargain. Your Library remains yours.','The bargain takes tonight’s action and 0.02 NEAR of prepaid, nonrefundable rent, plus network gas. Temporary shelter, not ownership. Accept before Night Four.']
```

**Complete proposed replacement:**

> Seven nights under my protection. Pay the agreed rent, and neither Marius nor Vesper can shorten them. Neither can I.

Visible detail retained verbatim:

> The bargain takes tonight’s action and 0.02 NEAR of prepaid, nonrefundable rent, plus network gas. Temporary shelter, not ownership. Accept before Night Four.

Retain the calculated expiry sentence. Replace the entire composed opening with the single dialogue line, rather than appending it to the greeting.

**Reason:** One precise offer instead of a repeated introduction.

**Source:** [src/livingCourt.ts:170](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:170>)

#### Sanctuary inspection label, not commitment

**Type:** Choice wording. **State:** Sanctuary inspection label, not commitment

**Exact current text / template:**

```text
I want a refuge of my own
```

**Complete proposed replacement:**

> Discuss paid sanctuary.

**Reason:** Do not imply ownership.

**Source:** [src/livingCourt.ts:35](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:35>)

Commit unchanged: “We have a deal · pay 0.02 NEAR”. Exit unchanged: “Consider my other choices”. Keep filed-title/dossier prerequisite, seven-night term, one action, gas, no refund, no ownership and exact expiry visible.

After verified acceptance, use the existing reckoning lease line: “Agreed. Your sanctuary {expiryDescription}. You paid for that time. It is yours to use.” Its exact old template and replacement appear in the consequence section. This is not a new success scene. Submission, failure and uncertain recovery produce no acceptance narration.

## Review sample 3 — Night 4: the Library petitioners

Route A: character:mirelle → question/personal → action:authorize_mirelle.
Route B: character:dorian → question/personal → action:authorize_dorian.
These remain separate encounters, not an invented face-to-face argument. One investigator root at a time; later reactions require recorded state.


#### Mirelle — opening

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:mirelle; question → ask:n:mirelle, personal → personal:n:mirelle. Active campaign; no new branch.

**Exact current text / template:**

```text
d.result==='mirelle'?'It is published. Marius has the work; you cannot make him unread it. My key is another matter.':d.result==='dorian'?'Dorian finished first. I dislike the result. Pretending there is still a race would be worse.':root&&d.chosen==='mirelle'?(assistant?'Cassian has joined the work. Give us until the next reckoning. Or close the room now, if you have changed your mind.':'You have let me begin. I still need to bring Cassian in before we can finish.'):root?'You have chosen Dorian. I will not claim a place at his desk. If you stop him before publication, we can talk again.':n<3?'There is a difference between owning the Library and making the court acknowledge it. I can help you put the record before Seraphine.':'I want to finish work Marius can use. Cassian can help. You have the room; I need you to decide whether we may use it.'
```

**Complete proposed replacement:**

- Mirelle published: “Marius has the account. That is what I came to do. Whether I keep your key is another question.”
- Dorian published: “Dorian finished first. I will not congratulate him. Nor will I ask you to pretend I won.”
- Mirelle root, assistant present: “Cassian can enter. We have what we need to continue—unless you are taking it back.”
- Mirelle root, no assistant: “You have admitted me. Cassian still needs his invitation before we can finish.”
- Other root: “You chose Dorian. If you mean to change that, stop his work first. I will not share his commission.”
- Otherwise n<3: “You own the Library. Let us put the claim before Seraphine while it can still buy you a hearing.”
- Otherwise: “Marius needs this account. I intend to deliver it. You have the Library; I need your permission.”

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:154](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:154>)

#### Mirelle — question

**Type:** Choice wording. **State:** Same ordered guards as the current expression. character:mirelle; question → ask:n:mirelle, personal → personal:n:mirelle. Active campaign; no new branch.

**Exact current text / template:**

```text
'What will you reveal?'
```

**Complete proposed replacement:**

> What will Marius get from this?

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:154](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:154>)

#### Mirelle — answer

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:mirelle; question → ask:n:mirelle, personal → personal:n:mirelle. Active campaign; no new branch.

**Exact current text / template:**

```text
'An account of the Library’s present obligations: who may use it, and which promises stand outside it. Not a secret ancestry or a convenient scandal. Marius wants the finished work. Once he has it, Dorian cannot offer Lucien the same investigation.'
```

**Complete proposed replacement:**

> An account of who may use the Library and which obligations stand apart from it. Useful knowledge, not a scandal. If I publish first, Dorian cannot deliver this investigation to Lucien.

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:154](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:154>)

#### Mirelle — personal

**Type:** Choice wording. **State:** Same ordered guards as the current expression. character:mirelle; question → ask:n:mirelle, personal → personal:n:mirelle. Active campaign; no new branch.

**Exact current text / template:**

```text
'Why bring Cassian?'
```

**Complete proposed replacement:**

> Why should I admit Cassian?

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:154](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:154>)

#### Mirelle — reply

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:mirelle; question → ask:n:mirelle, personal → personal:n:mirelle. Active campaign; no new branch.

**Exact current text / template:**

```text
'Because I need an assistant. Let me in and I can invite him under your permission. Take my key back and his stops working too. His other patrons are another matter.'
```

**Complete proposed replacement:**

> Because I need an assistant, not an audience. My invitation lets me bring him in. Withdraw mine and his Library access falls with it—not his other patronage.

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:154](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:154>)

#### Dorian — opening

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:dorian; question → ask:n:dorian, personal → personal:n:dorian. Active campaign; no new branch.

**Exact current text / template:**

```text
d.result==='dorian'?'The work is published. Lucien has it. You can take my key back; you cannot put the findings back in a drawer.':d.result==='mirelle'?'Mirelle finished. Marius gets the useful result. There is no sense pretending I can still beat her to it.':d.challenged&&d.result==='open'&&d.chosen==='mirelle'&&root?'Mirelle will hand the work to Marius. You do have another option. Stop her before she publishes, then let me bring Lucien in.':root&&d.chosen==='dorian'?(assistant?'Lucien can enter now. You knew I wanted him involved. Let us finish, or tell us to leave.':'You have given me a start. Lucien still needs his invitation before the work can be finished.'):'Help Mirelle and Marius benefits. Help me and someone outside his House does. I am not pretending those are the same bargain.'
```

**Complete proposed replacement:**

- Dorian published: “Lucien has the account. Marius does not get to be the beneficiary of every useful decision you make.”
- Mirelle published: “Mirelle delivered to Marius. I lost this contest. There is no second copy of the victory to sell you.”
- Live recorded rival petition while Mirelle root remains: “Mirelle will deliver to Marius. Before she does, consider who gains from your permission.”
- Dorian root, assistant present: “Lucien can enter now. We can continue. Are you still willing?”
- Dorian root, no assistant: “You admitted me. Lucien still needs his invitation. I did say whose interests I meant to serve.”
- Otherwise: “Mirelle wants your Library to be useful to Marius. I want it to be useful to Lucien. At least I am not asking you to call that neutral.”

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:156](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:156>)

#### Dorian — question

**Type:** Choice wording. **State:** Same ordered guards as the current expression. character:dorian; question → ask:n:dorian, personal → personal:n:dorian. Active campaign; no new branch.

**Exact current text / template:**

```text
'Why should I let Lucien see my records?'
```

**Complete proposed replacement:**

> What would Lucien owe me?

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:156](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:156>)

#### Dorian — answer

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:dorian; question → ask:n:dorian, personal → personal:n:dorian. Active campaign; no new branch.

**Exact current text / template:**

```text
'Because his protection could be useful to you. Finish the research and he has a reason to offer it without a deadline. It is still his to withdraw. If you want a favour with no patron attached, talk to Seraphine.'
```

**Complete proposed replacement:**

> Nothing until he makes his promise. Finish the account for him and he has reason to offer protection without a deadline. He can still withdraw it. Seraphine sells a different kind of certainty: a fixed term.

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:156](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:156>)

#### Dorian — personal

**Type:** Choice wording. **State:** Same ordered guards as the current expression. character:dorian; question → ask:n:dorian, personal → personal:n:dorian. Active campaign; no new branch.

**Exact current text / template:**

```text
'Are you accusing Mirelle of something?'
```

**Complete proposed replacement:**

> What has Mirelle done wrong?

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:156](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:156>)

#### Dorian — reply

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:dorian; question → ask:n:dorian, personal → personal:n:dorian. Active campaign; no new branch.

**Exact current text / template:**

```text
'No. I am telling you whom she means to help. You do not need a secret crime to have conflicting interests.'
```

**Complete proposed replacement:**

> Nothing I need to accuse her of. We want different men to benefit. You are allowed to choose without discovering a villain.

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:156](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:156>)

#### authorize_mirelle — whole negotiation

**Type:** Dialogue + commitment detail. **State:** action:authorize_mirelle; unchanged eligibility. Replace repeated greeting plus material[0], not an additional line.

**Exact current text / template:**

```text
['Let me into your Library, and let me bring Cassian. Our finished account will satisfy Marius’s service and give him reason to protect you.','This takes tonight’s action. No deadline on these invitations; you may withdraw them. They need a subsequent reckoning to finish. Publication closes Dorian’s competing route and cannot be recalled.']
```

**Complete proposed replacement:**

> Let me bring Cassian in. I will put the finished account before Marius. Until then, you may stop us.

Visible terms:

> One nightly action. Give Mirelle delegable Library entry without expiry; she can invite Cassian. You may revoke her permission and its dependent access. Research needs a later reckoning. Publication cannot be recalled and closes Dorian’s route. The completed account satisfies Marius’s service; his protection still requires his own confirmed grant.

**Reason:** Name the beneficiary, delegation, revocation, timing and irreversible publication.

**Source:** [src/livingCourt.ts:176](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:176>)

#### authorize_dorian — whole negotiation

**Type:** Dialogue + commitment detail. **State:** action:authorize_dorian; unchanged eligibility. Replace repeated greeting plus material[0], not an additional line.

**Exact current text / template:**

```text
['Let me bring Lucien into the Library. Finish this account with us, and he has reason to offer lasting protection. It will still be his promise to withdraw.','This takes tonight’s action. No deadline on these invitations; you may withdraw them. Lucien can see your records. Publication needs a subsequent reckoning, closes Mirelle’s route and cannot be recalled.']
```

**Complete proposed replacement:**

> Admit me, and I will invite Lucien. Let us finish, and the account goes to him—not Marius.

Visible terms:

> One nightly action. Give Dorian delegable Library entry without expiry; he can invite Lucien. You may revoke that permission and its dependent access. Research needs a later reckoning. Publication cannot be recalled and closes Mirelle’s route. Lucien’s lasting protection requires his own confirmed grant.

**Reason:** Name the beneficiary, delegation, revocation, timing and irreversible publication.

**Source:** [src/livingCourt.ts:178](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:178>)

#### authorize_mirelle inspection and existing commit label

**Type:** Choice wording. **State:** authorize_mirelle inspection and existing commit label

**Exact current text / template:**

```text
Let Mirelle and Cassian do the work
```

**Complete proposed replacement:**

> Admit Mirelle and let her invite Cassian.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:37](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:37>)

#### authorize_dorian inspection and existing commit label

**Type:** Choice wording. **State:** authorize_dorian inspection and existing commit label

**Exact current text / template:**

```text
Back Dorian and Lucien
```

**Complete proposed replacement:**

> Admit Dorian and let him invite Lucien.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:37](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:37>)

The return question and eligible offer remain after both questions. Confirmation acknowledges permission, not finished research. Assistant and publication reactions remain separate. The future Night Seven demand warning stays on Mirelle’s terms. Withdrawal never unpublishes findings.


## Review sample 4 — Night 7: Marius’s final demand

Gate unchanged: finalDemand(c,w), no recorded response. Requires the existing finalCourt mode, Night Seven and effective Marius-issued court protection. No demand for other routes.


#### final-demand; opening reused by incident:6, decision:6 and character:marius

**Type:** Dialogue. **State:** final-demand; opening reused by incident:6, decision:6 and character:marius

**Exact current text / template:**

```text
The work is finished. Our arrangement is not. I want to enter your Library without having to ask again. Give me that, or find another protector.
```

**Complete proposed replacement:**

> Your Library is yours. My protection is mine. If you want mine to continue, give me leave to enter yours without asking again.

**Reason:** A personal demand without asserting completed service, which the trigger does not require.

**Source:** [src/livingCourt.ts:319](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:319>)

#### final-demand → corresponding existing action inspection

**Type:** Choice wording. **State:** final-demand → corresponding existing action inspection

**Exact current text / template:**

```text
Keep his protection: give a standing invitation
```

**Complete proposed replacement:**

> Keep his protection. Give Marius entry without expiry.

**Reason:** Disclose the actual alternative before commitment; selecting this still opens inspection.

**Source:** [src/livingCourt.ts:319](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:319>)

#### final-demand → corresponding existing action inspection

**Type:** Choice wording. **State:** final-demand → corresponding existing action inspection

**Exact current text / template:**

```text
Refuse and face the loss of his protection
```

**Complete proposed replacement:**

> Refuse. Lose his protection at dawn.

**Reason:** Disclose the actual alternative before commitment; selecting this still opens inspection.

**Source:** [src/livingCourt.ts:319](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:319>)

#### final-demand → corresponding existing action inspection

**Type:** Choice wording. **State:** final-demand → corresponding existing action inspection

**Exact current text / template:**

```text
Propose a limited inspection using the published account
```

**Complete proposed replacement:**

> Offer two nights of entry—even if he refuses.

**Reason:** Disclose the actual alternative before commitment; selecting this still opens inspection.

**Source:** [src/livingCourt.ts:319](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:319>)

#### action:final_accept; before commitment

**Type:** Dialogue. **State:** action:final_accept; before commitment

**Exact current text / template:**

```text
A standing invitation, then. I keep my protection; you let me into the Library. Neither of us needs to pretend this is friendship.
```

**Complete proposed replacement:**

> You may call it a concession. I call it a reason to continue our arrangement.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:204](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:204>)

#### action:final_refuse; before commitment

**Type:** Dialogue. **State:** action:final_refuse; before commitment

**Exact current text / template:**

```text
Then you understand what you are refusing. My protection ends tonight. Your arrangements with the others are their affair.
```

**Complete proposed replacement:**

> Then you will face the dawn without my protection. I will not speak for whoever else has promised you shelter.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:204](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:204>)

#### action:final_counter; before commitment

**Type:** Dialogue. **State:** action:final_counter; before commitment

**Exact current text / template:**

```text
A limited inspection, instead of a standing invitation? Show me what makes that worth accepting.
```

**Complete proposed replacement:**

> Two nights instead of a standing invitation. Give me a reason to accept less.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:204](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:204>)

#### final_counter commit

**Type:** Choice wording. **State:** final_counter commit

**Exact current text / template:**

```text
Make the counterproposal · 1 Blood
```

**Complete proposed replacement:**

> Grant two nights’ entry and counter · 1 Blood

**Reason:** The invitation survives rejection.

**Source:** [src/livingCourt.ts:232](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:232>)

Material terms retained verbatim:

- “One major action. Give Marius non-delegable Library access without expiry; keep his revocable protection.”
- “One major action. Marius will withdraw his own protection at this reckoning. Independent shelter remains; without it you may lose.”
- “One major action and 1 Blood. Give Marius a two-night Library invitation covering the final night, even if he refuses. He evaluates the public account and Cassian’s separate passage; rejection costs his protection.”
- “Once you offer the invitation, you cannot take it back as part of this bargain—even if Marius refuses.”

Retain the current forecast from counterAccepted: Mirelle publication, fulfilled service and Cassian’s settled, still-active purchased passage. Published Dorian work does not become an accepted counter. Counter still requires publication to appear. Ignoring the demand still costs Marius’s protection.

Accept/refuse commit buttons remain “Give the continuing invitation” / “Refuse his demand”. Returning to other choices and Feed remain existing alternatives with existing costs.

Confirmed narrator aftermath, replacing the three existing final_answer variants:

- Accepted standing invitation: “Marius kept his protection. You gave him continuing Library entry, with no power to pass it on.”
- Accepted counter: “Marius accepted the narrower bargain. Your invitation lasts two nights; his protection continues.”
- Rejected/refused/unanswered: “Marius withdrew his protection. Other shelter stands or falls on its own terms.”

Exact current variants are paired in the consequence section. The rejected counter retains the separate warning about its still-active invitation. No new success dialogue before verification.

## Review sample 5 — Completed endings


#### conclusion:unbound; stored Unbound result

**Type:** Consequence narration. **State:** conclusion:unbound; stored Unbound result

**Exact current text / template:**

```text
Vesper’s door is closed. You no longer need it. The Library remains yours, and Seraphine’s bargain has carried you beyond this week. Freedom has an end date here; it is still more than you began with.
```

**Complete proposed replacement:**

> Seven nights survived. The Library is still yours. You paid Seraphine for time she cannot take back—not for a place beneath her. The bargain will end. This week, you endured on its terms.

**Reason:** Dignity without mistaking temporary sanctuary for permanent independence.

**Source:** [src/livingCourt.ts:254](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:254>)

#### endingSummary active accepted Unbound lease branch; retain existing title prefix

**Type:** Consequence narration. **State:** endingSummary active accepted Unbound lease branch; retain existing title prefix

**Exact current text / template:**

```text
Seraphine cannot withdraw her protection, and it will last through the final night. But sanctuary is not ownership.
```

**Complete proposed replacement:**

> The final reckoning is over. Your sanctuary {expiryDescription(lease.end_night, world.night)}. Seraphine cannot cancel the remaining term. You own no part of her sanctuary.

**Reason:** Use verified remaining expiry and completed tense.

**Source:** [src/livingCourt.ts:50](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:50>)

#### Favoured epilogue

**Type:** Consequence narration. **State:** conclusion:favoured; existing patron selector.

**Exact current text / template:**

```text
You have survived. ${c.reason.includes('Lucien')?'Lucien':'Marius'} stands behind you. That is a place in the world, even if it is not a place beyond everyone else’s reach.
```

**Complete proposed replacement:**

> Seven nights survived. {Lucien or Marius, selected exactly as now} still protects you. You have secured a place, not freedom from its patron. The Library remains yours; the promise remains his.

**Reason:** Survival is a success; dependence remains its political cost.

**Source:** [src/livingCourt.ts:254](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:254>)

Complete Unbound presentation: CAMPAIGN COMPLETE → The Unbound → proposed epilogue → actual remaining expiry → up to three evidence-selected consequence lines → Review Your Chronicle / lifecycle-gated Begin Another Campaign.

Complete Favoured example, Marius with accepted final invitation: CAMPAIGN COMPLETE → The Favoured → proposed Marius epilogue → retained no-scheduled-end-but-revocable summary → “You kept Marius’s protection by giving him continuing Library entry. He cannot pass that invitation on.” Remaining highlights are selected from recorded evidence.

Lucien Favoured uses the existing Lucien selector; never add Marius’s confrontation or an unrecorded invitation. Settlement/archive status and replay controls remain unchanged. Alternative conditional ending text is specified later.

## Night-by-night direction and chapter copy

Canonical character sequences above apply across every eligible night, using their existing ordered state guards. The remaining character sequences below are likewise canonical, not eight newly scheduled encounters. No character is made physically present by a contact suggestion.

### Night 1 — The ultimatum


#### Chapter 1 title

**Type:** Heading. **State:** CHAPTERS[0]; all existing chapter/recap uses.

**Exact current text / template:**

```text
A bed before dawn
```

**Complete proposed replacement:**

> The ultimatum

**Reason:** Give the sequence an escalating dramatic spine.

**Source:** [src/livingCourt.ts:17](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:17>)

#### Chapter 1 question

**Type:** Narration. **State:** Same chapter.question consumers.

**Exact current text / template:**

```text
Whose help can you afford?
```

**Complete proposed replacement:**

> Whose terms can you live with?

**Reason:** One dominant dramatic question.

**Source:** [src/livingCourt.ts:17](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:17>)

#### Chapter 1 base paragraph

**Type:** Narration. **State:** Same chapterSituation base branch; existing urgent/state-specific overrides take precedence.

**Exact current text / template:**

```text
You are newly awakened. Vesper is your sire, but the Library belongs to you. In three nights she will close the Crypt. Find somewhere the daylight cannot reach you. These seven nights will decide whether you endure on your own terms or under a patron.
```

**Complete proposed replacement:**

> Vesper has given you three nights. Seraphine offers paid sanctuary; Marius offers a place in return for service. Before you can choose how to live, you need somewhere to survive.

**Reason:** Shorten the premise; avoid promising an unavailable action.

**Source:** [src/livingCourt.ts:17](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:17>)

### Night 2 — The price of protection

#### Chapter 2 title

**Type:** Heading. **State:** CHAPTERS[1]; all existing chapter/recap uses.

**Exact current text / template:**

```text
The price of company
```

**Complete proposed replacement:**

> The price of protection

**Reason:** Give the sequence an escalating dramatic spine.

**Source:** [src/livingCourt.ts:19](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:19>)

#### Chapter 2 question

**Type:** Narration. **State:** Same chapter.question consumers.

**Exact current text / template:**

```text
A bargain or a place in the House?
```

**Complete proposed replacement:**

> What will protection cost you?

**Reason:** One dominant dramatic question.

**Source:** [src/livingCourt.ts:19](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:19>)

#### Chapter 2 base paragraph

**Type:** Narration. **State:** Same chapterSituation base branch; existing urgent/state-specific overrides take precedence.

**Exact current text / template:**

```text
Seraphine offers a bargain with a limit. Marius offers a place with a duty. Lucien offers time. None of them can choose for you, and none will keep an offer open forever.
```

**Complete proposed replacement:**

> The offers are different. So are the people who will benefit if you accept. Vesper’s deadline is nearer.

**Reason:** Shorten the premise; avoid promising an unavailable action.

**Source:** [src/livingCourt.ts:19](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:19>)

### Night 3 — The severance

#### Chapter 3 title

**Type:** Heading. **State:** CHAPTERS[2]; all existing chapter/recap uses.

**Exact current text / template:**

```text
The last borrowed night
```

**Complete proposed replacement:**

> The severance

**Reason:** Give the sequence an escalating dramatic spine.

**Source:** [src/livingCourt.ts:21](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:21>)

#### Chapter 3 question

**Type:** Narration. **State:** Same chapter.question consumers.

**Exact current text / template:**

```text
Where will you sleep tomorrow?
```

**Complete proposed replacement:**

> Where will you face the dawn?

**Reason:** One dominant dramatic question.

**Source:** [src/livingCourt.ts:21](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:21>)

#### Chapter 3 base paragraph

**Type:** Narration. **State:** Same chapterSituation base branch; existing urgent/state-specific overrides take precedence.

**Exact current text / template:**

```text
Tonight Vesper means to close her door. It will not make the Library hers. Owning that room, though, will not keep the sun from your body.
```

**Complete proposed replacement:**

> Tonight Vesper means to withdraw her invitation. Whatever you arranged elsewhere must now be enough.

**Reason:** Shorten the premise; avoid promising an unavailable action.

**Source:** [src/livingCourt.ts:21](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:21>)

### Night 4 — The petitioners

#### Chapter 4 title

**Type:** Heading. **State:** CHAPTERS[3]; all existing chapter/recap uses.

**Exact current text / template:**

```text
Your door, their quarrel
```

**Complete proposed replacement:**

> The petitioners

**Reason:** Give the sequence an escalating dramatic spine.

**Source:** [src/livingCourt.ts:23](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:23>)

#### Chapter 4 question

**Type:** Narration. **State:** Same chapter.question consumers.

**Exact current text / template:**

```text
Who gets to use what is yours?
```

**Complete proposed replacement:**

> Whose interests will your Library serve?

**Reason:** One dominant dramatic question.

**Source:** [src/livingCourt.ts:23](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:23>)

#### Chapter 4 base paragraph

**Type:** Narration. **State:** Same chapterSituation base branch; existing urgent/state-specific overrides take precedence.

**Exact current text / template:**

```text
Now the petitions come to you. Mirelle wants to put the Library to work for Marius. Dorian wants Lucien to benefit instead. They need your leave, and each intends to bring someone with them.
```

**Complete proposed replacement:**

> Now others need your permission. Mirelle wants the Library to serve Marius. Dorian wants it to serve Lucien. Neither can begin without you.

**Reason:** Shorten the premise; avoid promising an unavailable action.

**Source:** [src/livingCourt.ts:23](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:23>)

### Night 5 — The consequences of knowledge

#### Chapter 5 title

**Type:** Heading. **State:** CHAPTERS[4]; all existing chapter/recap uses.

**Exact current text / template:**

```text
Before the ink dries
```

**Complete proposed replacement:**

> The consequences of knowledge

**Reason:** Give the sequence an escalating dramatic spine.

**Source:** [src/livingCourt.ts:25](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:25>)

#### Chapter 5 question

**Type:** Narration. **State:** Same chapter.question consumers.

**Exact current text / template:**

```text
Let the work finish, or stop it?
```

**Complete proposed replacement:**

> Will you let the account leave the Library?

**Reason:** One dominant dramatic question.

**Source:** [src/livingCourt.ts:25](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:25>)

#### Chapter 5 base paragraph

**Type:** Narration. **State:** Same chapterSituation base branch; existing urgent/state-specific overrides take precedence.

**Exact current text / template:**

```text
There is a difference between letting someone read and letting their findings leave the room. Once the work is published, closing the Library cannot call it back.
```

**Complete proposed replacement:**

> An unfinished account can still be stopped. A published one cannot be recalled. Decide what you want your permission to accomplish.

**Reason:** Shorten the premise; avoid promising an unavailable action.

**Source:** [src/livingCourt.ts:25](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:25>)

### Night 6 — The approaching reckoning

#### Chapter 6 title

**Type:** Heading. **State:** CHAPTERS[5]; all existing chapter/recap uses.

**Exact current text / template:**

```text
What survives a promise
```

**Complete proposed replacement:**

> The approaching reckoning

**Reason:** Give the sequence an escalating dramatic spine.

**Source:** [src/livingCourt.ts:27](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:27>)

#### Chapter 6 question

**Type:** Narration. **State:** Same chapter.question consumers.

**Exact current text / template:**

```text
What are you prepared to leave unfinished?
```

**Complete proposed replacement:**

> What can still be secured?

**Reason:** One dominant dramatic question.

**Source:** [src/livingCourt.ts:27](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:27>)

#### Chapter 6 base paragraph

**Type:** Narration. **State:** Same chapterSituation base branch; existing urgent/state-specific overrides take precedence.

**Exact current text / template:**

```text
There is just enough time to begin one last investigation and let it finish tomorrow. There is not enough time to change your mind twice. Keep yourself alive while you decide which promises deserve another night.
```

**Complete proposed replacement:**

> One night remains after this. An unfinished bargain is not protection; an unfinished investigation is not a published account.

**Reason:** Shorten the premise; avoid promising an unavailable action.

**Source:** [src/livingCourt.ts:27](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:27>)

### Night 7 — What we inherit

#### Chapter 7 title

**Type:** Heading. **State:** CHAPTERS[6]; all existing chapter/recap uses.

**Exact current text / template:**

```text
The door you leave open
```

**Complete proposed replacement:**

> What we inherit

**Reason:** Give the sequence an escalating dramatic spine.

**Source:** [src/livingCourt.ts:29](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:29>)

#### Chapter 7 question

**Type:** Narration. **State:** Same chapter.question consumers.

**Exact current text / template:**

```text
What will remain when dawn comes?
```

**Complete proposed replacement:**

> What will you keep—and what will you concede?

**Reason:** One dominant dramatic question.

**Source:** [src/livingCourt.ts:29](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:29>)

#### Chapter 7 base paragraph

**Type:** Narration. **State:** Same chapterSituation base branch; existing urgent/state-specific overrides take precedence.

**Exact current text / template:**

```text
This is the final night of the campaign. If research is still running, you can let it finish or stop it. If it is published, you can reclaim the keys or leave your allies welcome. Whatever you choose, you must survive the dawn.
```

**Complete proposed replacement:**

> This is the last night. The court will act once more. Choose what you are willing to leave standing—and keep enough Blood to reach the dawn.

**Reason:** Shorten the premise; avoid promising an unavailable action.

**Source:** [src/livingCourt.ts:29](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:29>)

### Discovery versus incident: remove the repeated paragraph

The incident keeps chapterSituation’s state-specific account. Discovery keeps the same contacts and chapter question, but replaces its repeated paragraph with the short nightly line below. Urgent Blood/service/final-demand warnings remain visible; the Night Seven demand override still wins. This is a proposed presentation projection, not a gameplay change.


#### discovery:0 — shorter hub

**Type:** Narration. **State:** Exact current base paragraph is the quoted chapter text, with chapterSituation’s existing suffixes. Replace only the discovery base; retain urgent suffixes and final-demand override.

**Exact current text / template:**

```text
You are newly awakened. Vesper is your sire, but the Library belongs to you. In three nights she will close the Crypt. Find somewhere the daylight cannot reach you. These seven nights will decide whether you endure on your own terms or under a patron.
```

**Complete proposed replacement:**

> Hear Seraphine’s price. Hear what Marius expects. Neither conversation commits you.

**Reason:** Do not replay the incident on the next navigation click.

**Source:** [src/livingCourt.ts:17](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:17>)

#### discovery:1 — shorter hub

**Type:** Narration. **State:** Exact current base paragraph is the quoted chapter text, with chapterSituation’s existing suffixes. Replace only the discovery base; retain urgent suffixes and final-demand override.

**Exact current text / template:**

```text
Seraphine offers a bargain with a limit. Marius offers a place with a duty. Lucien offers time. None of them can choose for you, and none will keep an offer open forever.
```

**Complete proposed replacement:**

> Ask what each offer leaves in the other person’s hands.

**Reason:** Do not replay the incident on the next navigation click.

**Source:** [src/livingCourt.ts:19](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:19>)

#### discovery:2 — shorter hub

**Type:** Narration. **State:** Exact current base paragraph is the quoted chapter text, with chapterSituation’s existing suffixes. Replace only the discovery base; retain urgent suffixes and final-demand override.

**Exact current text / template:**

```text
Tonight Vesper means to close her door. It will not make the Library hers. Owning that room, though, will not keep the sun from your body.
```

**Complete proposed replacement:**

> Ask what is still available before you spend this night.

**Reason:** Do not replay the incident on the next navigation click.

**Source:** [src/livingCourt.ts:21](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:21>)

#### discovery:3 — shorter hub

**Type:** Narration. **State:** Exact current base paragraph is the quoted chapter text, with chapterSituation’s existing suffixes. Replace only the discovery base; retain urgent suffixes and final-demand override.

**Exact current text / template:**

```text
Now the petitions come to you. Mirelle wants to put the Library to work for Marius. Dorian wants Lucien to benefit instead. They need your leave, and each intends to bring someone with them.
```

**Complete proposed replacement:**

> Hear whom each investigator intends to serve.

**Reason:** Do not replay the incident on the next navigation click.

**Source:** [src/livingCourt.ts:23](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:23>)

#### discovery:4 — shorter hub

**Type:** Narration. **State:** Exact current base paragraph is the quoted chapter text, with chapterSituation’s existing suffixes. Replace only the discovery base; retain urgent suffixes and final-demand override.

**Exact current text / template:**

```text
There is a difference between letting someone read and letting their findings leave the room. Once the work is published, closing the Library cannot call it back.
```

**Complete proposed replacement:**

> Hear what has changed before deciding whether the work continues.

**Reason:** Do not replay the incident on the next navigation click.

**Source:** [src/livingCourt.ts:25](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:25>)

#### discovery:5 — shorter hub

**Type:** Narration. **State:** Exact current base paragraph is the quoted chapter text, with chapterSituation’s existing suffixes. Replace only the discovery base; retain urgent suffixes and final-demand override.

**Exact current text / template:**

```text
There is just enough time to begin one last investigation and let it finish tomorrow. There is not enough time to change your mind twice. Keep yourself alive while you decide which promises deserve another night.
```

**Complete proposed replacement:**

> Ask about the position you have now, not the offer you remember.

**Reason:** Do not replay the incident on the next navigation click.

**Source:** [src/livingCourt.ts:27](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:27>)

#### discovery:6 — shorter hub

**Type:** Narration. **State:** Exact current base paragraph is the quoted chapter text, with chapterSituation’s existing suffixes. Replace only the discovery base; retain urgent suffixes and final-demand override.

**Exact current text / template:**

```text
This is the final night of the campaign. If research is still running, you can let it finish or stop it. If it is published, you can reclaim the keys or leave your allies welcome. Whatever you choose, you must survive the dawn.
```

**Complete proposed replacement:**

> Hear the people whose promises still matter.

**Reason:** Do not replay the incident on the next navigation click.

**Source:** [src/livingCourt.ts:29](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:29>)

### Night 6 — state distinctions

Do not add an invitation to begin research to the general chapter. Existing eligibility remains the only source of an available authorize action. The following replace existing presentation fragments; no new action or stored flag is proposed.


#### n=5, published result

**Type:** Narration. **State:** n=5, published result

**Exact current text / template:**

```text
The work is public. There is no second investigation to sell to a different patron. Decide who may keep using your Library, and whether you can afford another night without feeding.
```

**Complete proposed replacement:**

> The account is public. Its beneficiary has been chosen. What remains is who keeps your permission—and whether you can afford another night without feeding.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:102](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:102>)

#### effective chosen root, result open; preserve leading separator

**Type:** Narration. **State:** effective chosen root, result open; preserve leading separator

**Exact current text / template:**

```text
 The investigation is still unfinished. Closing the Library now stops it.
```

**Complete proposed replacement:**

> The account is unfinished. Let the investigators continue, or withdraw the permission they still need.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:110](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:110>)

#### n=6, no root and no published result; preserve leading separator

**Type:** Narration. **State:** n=6, no root and no published result; preserve leading separator

**Exact current text / template:**

```text
 No investigation is running. Earlier choices have left no time to begin another.
```

**Complete proposed replacement:**

> No investigation is running. It is too late to begin one now.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:110](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:110>)

#### no root, open result, before final night; preserve leading separator

**Type:** Narration. **State:** no root, open result, before final night; preserve leading separator

**Exact current text / template:**

```text
 Neither investigator currently has your lasting invitation to the Library.
```

**Complete proposed replacement:**

> Neither investigator has your invitation. Only the offers still available can change that.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:110](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:110>)

Research abandoned versus never begun: only call it abandoned when an existing player-issued investigator root is revoked and the result remains open. Proposed optional presentation specialization of the last fragment: “You stopped the work before publication. Neither investigator now has your invitation.” Otherwise retain the neutral replacement above. This adds no branch choice or history. If grant evidence is absent, do not infer abandonment from an empty root.

Protection secured/lost stays in the current access-aware character and room branches below. An absent right is not automatically a revoked right. The existing hunger and service-deadline suffixes remain verbatim. No viable-research claim is made unless the existing returned action is allowed.


## Nights 1–7 — remaining complete character sequences

These parents retain both free questions, the common return choice and exactly the existing eligible offer. Choosing a tone never writes loyalty, affinity or willingness to help.

### Marius — character:marius; ask:n:marius; personal:n:marius

Early appointment, Nights 4–5 service and later protection are distinct states. The final-demand overlay still supersedes this parent on Night Seven.


#### Marius — opening

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:marius; question → ask:n:marius, personal → personal:n:marius. Active campaign; no new branch.

**Exact current text / template:**

```text
p.serviceFulfilled&&w.access.court?'The work is finished. I said I would protect you, and I am doing so. We need not make a ceremony of it.':p.serviceFulfilled?'The work is finished. That does not replace a promise actually made: we must still settle whether my protection stands.':w.access.court?'You have my protection. I still expect the work you undertook. A useful arrangement should be useful to both of us.':p.appointment==='cassian'?'Cassian took the appointment. I will not offer you his place as though he had done nothing.':n<3?'Vesper has given you a deadline. I have an appointment to fill. Do the work the House needs, and I can make room for you.':'There is no empty appointment waiting for you. Mirelle’s completed work could still give me reason to offer protection.'
```

**Complete proposed replacement:**

- Service fulfilled and court accessible: “You did the work. I have kept my protection. We need not diminish either by pretending it was charity.”
- Service fulfilled, court inaccessible: “Your service is recorded. My protection does not presently stand. Do not confuse what you earned with what is in force.”
- Court accessible, service not fulfilled: “You have my protection. Now make good on what you undertook.”
- Appointment belongs to Cassian: “Cassian claimed the place. I will not make his appointment worthless to spare your disappointment.”
- Otherwise n<3: “Vesper intends to close her door. I have a place for someone useful. Consider the obligation before you ask for the protection.”
- Otherwise: “The appointment is closed. Mirelle’s account may still give me reason to act. A reason is not yet a promise.”

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:152](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:152>)

#### Marius — question

**Type:** Choice wording. **State:** Same ordered guards as the current expression. character:marius; question → ask:n:marius, personal → personal:n:marius. Active campaign; no new branch.

**Exact current text / template:**

```text
'What work, exactly?'
```

**Complete proposed replacement:**

> What would you require of me?

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:152](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:152>)

#### Marius — answer

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:marius; question → ask:n:marius, personal → personal:n:marius. Active campaign; no new branch.

**Exact current text / template:**

```text
d.result==='mirelle'?'Mirelle completed the Library investigation. That satisfies the service I required; you need not perform it again.':p.serviceFulfilled?'Your obligation is fulfilled. My protection remains mine to withdraw, not Vesper’s.':'Service to the House, completed on Night Four or Five. It costs you that night and 1 Blood. Leave it unfinished and I withdraw my protection at the sixth reckoning. Mirelle’s completed investigation can satisfy it instead.'
```

**Complete proposed replacement:**

- Mirelle published: “Mirelle’s account satisfies the service. I do not ask you to perform the same obligation twice.”
- Otherwise service fulfilled: “The obligation is fulfilled. My protection remains mine to withdraw, not Vesper’s.”
- Otherwise: “Serve the House on Night Four or Five: one nightly action and 1 Blood. Leave it undone and I withdraw my protection at the sixth reckoning. Mirelle’s completed account can satisfy the service instead.”

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:152](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:152>)

#### Marius — personal

**Type:** Choice wording. **State:** Same ordered guards as the current expression. character:marius; question → ask:n:marius, personal → personal:n:marius. Active campaign; no new branch.

**Exact current text / template:**

```text
'Why should I choose you over Seraphine?'
```

**Complete proposed replacement:**

> Why choose your protection over hers?

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:152](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:152>)

#### Marius — reply

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:marius; question → ask:n:marius, personal → personal:n:marius. Active campaign; no new branch.

**Exact current text / template:**

```text
'That is your decision. She can make a bargain I cannot cancel. I can offer a place in the institution I administer. Neither is the same as inheriting it.'
```

**Complete proposed replacement:**

> Seraphine can sell you time I cannot take away. I can give you a place in the House. Decide whether you want a bargain or a patron.

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:152](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:152>)

### Lucien — character:lucien; ask:n:lucien; personal:n:lucien

#### Lucien — opening

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:lucien; question → ask:n:lucien, personal → personal:n:lucien. Active campaign; no new branch.

**Exact current text / template:**

```text
permanentPassage?'Dorian did the work. I have extended my protection without a deadline. It is still a favour from me; I would rather you understood that.':d.result==='dorian'?'Dorian has delivered. That gives us something to discuss. Until I actually extend my protection, do not count a conversation as a safe bed.':w.access.passage?'You have a way out until Night Six. Please do not spend all that time congratulating yourself on escaping.':p.passageRequested?'The temporary passage has ended. I told you it would. If Dorian finishes, there may still be a lasting arrangement.':'I can buy you time. It is not the same as solving your problem, but people in your position sometimes need the distinction explained.'
```

**Complete proposed replacement:**

- Effective permanent passage: “Dorian delivered. I have removed the deadline from my protection. Do not mistake that for removing me from the arrangement.”
- Otherwise Dorian published: “Dorian has made you useful to me. That deserves a conversation. Until I grant protection, it is only a conversation.”
- Otherwise passage accessible: “You have passage until Night Six. Time is a useful purchase even when no one enjoys admitting they need it.”
- Otherwise passage requested: “That passage is no longer shelter for you. Its deadline was part of the offer. If Dorian’s work earns a lasting arrangement, that will be a different promise.”
- Otherwise: “I can offer a little distance from House Volari. It comes with a deadline. Freedom from everyone would be a much more expensive boast.”

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:158](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:158>)

#### Lucien — question

**Type:** Choice wording. **State:** Same ordered guards as the current expression. character:lucien; question → ask:n:lucien, personal → personal:n:lucien. Active campaign; no new branch.

**Exact current text / template:**

```text
'How do I make the escape last?'
```

**Complete proposed replacement:**

> What would make you stay involved?

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:158](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:158>)

#### Lucien — answer

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:lucien; question → ask:n:lucien, personal → personal:n:lucien. Active campaign; no new branch.

**Exact current text / template:**

```text
'With temporary passage alone, you must let Dorian begin on Night Four and finish on Night Five, before the passage closes at the start of Night Six. His completed work can earn lasting protection. Delay is dangerous.'
```

**Complete proposed replacement:**

> Let Dorian deliver the account. With only my temporary passage, start his work on Night Four and let it finish on Night Five. The passage closes as Night Six begins; his completed work can earn a longer promise.

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:158](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:158>)

#### Lucien — personal

**Type:** Choice wording. **State:** Same ordered guards as the current expression. character:lucien; question → ask:n:lucien, personal → personal:n:lucien. Active campaign; no new branch.

**Exact current text / template:**

```text
'Why help anyone in House Volari?'
```

**Complete proposed replacement:**

> What do you gain from helping me?

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:158](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:158>)

#### Lucien — reply

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:lucien; question → ask:n:lucien, personal → personal:n:lucien. Active campaign; no new branch.

**Exact current text / template:**

```text
'I am outside the House. That does not mean I have no interest in what happens here. A useful connection need not become a family relationship.'
```

**Complete proposed replacement:**

> An interest inside a House I do not belong to. Marius need not approve of it for it to be useful.

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:158](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:158>)

### Cassian — character:cassian; ask:n:cassian; personal:n:cassian

#### Cassian — opening

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:cassian; question → ask:n:cassian, personal → personal:n:cassian. Active campaign; no new branch.

**Exact current text / template:**

```text
d.chosen==='mirelle'&&assistant?'Mirelle brought me into the Library. I would like to finish something before the next person changes their mind.':p.appointment==='player'?'You took the appointment. Congratulations. Now you get to discover why it was called work.':p.appointment==='cassian'?'I took the appointment while it was open. Waiting politely was not going to make me indispensable.':'If you want the appointment, take it. If you do not, stop standing in the doorway.'
```

**Complete proposed replacement:**

- Mirelle chosen and assistant present: “Mirelle has brought me in. I would like to finish the work before someone decides I should be grateful for losing it.”
- Otherwise player appointment: “You took the appointment. Now comes the part where Marius expects it to have been worth giving you.”
- Otherwise Cassian appointment: “The place was open. I took it. Was I meant to wait until you had finished considering it?”
- Otherwise: “I would prefer a place to another conversation about my prospects.”

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:160](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:160>)

#### Cassian — question

**Type:** Choice wording. **State:** Same ordered guards as the current expression. character:cassian; question → ask:n:cassian, personal → personal:n:cassian. Active campaign; no new branch.

**Exact current text / template:**

```text
'Would you lose everything if I closed the Library?'
```

**Complete proposed replacement:**

> What would you lose if I withdrew the Library invitation?

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:160](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:160>)

#### Cassian — answer

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:cassian; question → ask:n:cassian, personal → personal:n:cassian. Active campaign; no new branch.

**Exact current text / template:**

```text
'Only what depends on that invitation. Sabine’s court sponsorship, if she has given it, is separate. You can close one door without becoming master of all the others.'
```

**Complete proposed replacement:**

> The access I have through Mirelle. Not every place I hold. If Sabine has sponsored me at court, your Library key does not undo it.

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:160](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:160>)

#### Cassian — personal

**Type:** Choice wording. **State:** Same ordered guards as the current expression. character:cassian; question → ask:n:cassian, personal → personal:n:cassian. Active campaign; no new branch.

**Exact current text / template:**

```text
'You seem remarkably eager to owe someone.'
```

**Complete proposed replacement:**

> You are willing to owe a great deal.

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:160](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:160>)

#### Cassian — reply

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:cassian; question → ask:n:cassian, personal → personal:n:cassian. Active campaign; no new branch.

**Exact current text / template:**

```text
'I am eager to have a position. There is a difference. You may decide you prefer a bargain of your own.'
```

**Complete proposed replacement:**

> I am willing to be needed. That is not the same as enjoying the debt.

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:160](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:160>)

### Sabine — character:sabine; ask:n:sabine; personal:n:sabine

#### Sabine — opening

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:sabine; question → ask:n:sabine, personal → personal:n:sabine. Active campaign; no new branch.

**Exact current text / template:**

```text
root?'You are getting used to lending keys. The awkward part comes when you ask for them back.':d.result!=='open'?'The work is already public. Taking back the keys cannot undo it. It can still settle who is welcome tomorrow.':'Everyone asks who will protect them. Try asking who that person must answer to. It saves time later.'
```

**Complete proposed replacement:**

- Investigator root present: “They needed your permission. Notice how carefully they explained why you should give it.”
- Otherwise published: “The account is public. You can decide who stays welcome. You cannot decide who has already benefited.”
- Otherwise: “You have heard what protection costs. Ask who gets to change the price.”

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:162](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:162>)

#### Sabine — question

**Type:** Choice wording. **State:** Same ordered guards as the current expression. character:sabine; question → ask:n:sabine, personal → personal:n:sabine. Active campaign; no new branch.

**Exact current text / template:**

```text
'Can I shut out one person without losing another?'
```

**Complete proposed replacement:**

> What would taking back my permission actually cost?

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:162](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:162>)

#### Sabine — answer

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:sabine; question → ask:n:sabine, personal → personal:n:sabine. Active campaign; no new branch.

**Exact current text / template:**

```text
root?'Your investigator and any assistant using their invitation depend on your Library key. Close that invitation and both lose that route. A separate promise from Marius, Lucien or Seraphine remains separate.':'Yes, if their arrangements really are separate. My sponsorship of Cassian depends on Marius, not on your Library. Do not confuse a person with a single chain of favours.'
```

**Complete proposed replacement:**

- Investigator root present: “Your investigator’s access, and the assistant’s route through it. Not a separate promise from a patron. Be exact about what you are withdrawing.”
- Otherwise: “That depends on what it supports. My sponsorship of Cassian depends on Marius, not your Library. Disliking the beneficiary does not put you in charge of the promise.”

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:162](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:162>)

#### Sabine — personal

**Type:** Choice wording. **State:** Same ordered guards as the current expression. character:sabine; question → ask:n:sabine, personal → personal:n:sabine. Active campaign; no new branch.

**Exact current text / template:**

```text
'Whose side are you on?'
```

**Complete proposed replacement:**

> Whom are you protecting in this?

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:162](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:162>)

#### Sabine — reply

**Type:** Dialogue. **State:** Same ordered guards as the current expression. character:sabine; question → ask:n:sabine, personal → personal:n:sabine. Active campaign; no new branch.

**Exact current text / template:**

```text
'I sponsor Cassian when my own position permits it. That is an answer, even if it is not the answer you hoped for.'
```

**Complete proposed replacement:**

> Cassian, when my authority permits it. You wanted an answer, not a profession of affection.

**Reason:** Sharpen the character’s motive; retain the existing branch and its mechanical meaning.

**Source:** [src/livingCourt.ts:162](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:162>)

All character offers keep their current selector: Seraphine sanctuary/title; Marius service/appointment; Mirelle authorization/title; Dorian authorization; Lucien passage. No offer is added for Vesper, Cassian or Sabine.

## Nights 1–7 — action negotiations and choice wording

The entries below replace the **whole opening composition**, which currently combines character opening and material[0]. They are not additive dialogue. Where the current opening is state-dependent, the full expression appears in the character comparison above; the exact reused construction is quoted here.


#### Current Living Court active action negotiation opening selector

**Type:** Presentation composition. **State:** Current Living Court active action negotiation opening selector

**Exact current text / template:**

```text
voices[speaker].opening
```

**Complete proposed replacement:**

Use the action-specific single line specified here or in the samples. Do not prepend the character introduction. Legacy/demoted actions retain their current fallback.

**Reason:** Remove repetition without changing scene IDs, actions, speaker, terms or eligibility.

**Source:** [src/livingCourt.ts:212](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:212>)

#### investigate_title — composed negotiation

**Type:** Dialogue + terms. **State:** action:investigate_title; same availability. Withdrawal uses existing result branch.

**Exact current text / template:**

```text
['Put your existing independent Library claim before Seraphine. It opens her sanctuary offer; it does not give shelter.','This takes tonight’s action and 1 Blood. Accept sanctuary separately by the end of Night Three.']
```

**Complete proposed replacement:**

> It is already your Library. Let us make that claim the reason Seraphine hears you.

Visible detail unchanged:

> This takes tonight’s action and 1 Blood. Accept sanctuary separately by the end of Night Three.

**Reason:** Put the decision before the explanation; retain real cost and delayed consequence.

**Source:** [src/livingCourt.ts:168](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:168>)

#### petition_marius — composed negotiation

**Type:** Dialogue + terms. **State:** action:petition_marius; same availability. Withdrawal uses existing result branch.

**Exact current text / template:**

```text
['Take the appointment before Cassian does. Fulfil my work, and you may shelter under my authority. Until I issue the invitation at dawn, you have only my offer.','This takes tonight’s action. Finish service on Night Four or Five, directly or through Mirelle’s completed work. Otherwise Marius withdraws his protection at the sixth reckoning.']
```

**Complete proposed replacement:**

> Take the appointment, and undertake the service. My protection must still be granted at the reckoning. Until then, you have an offer.

Visible detail unchanged:

> This takes tonight’s action. Finish service on Night Four or Five, directly or through Mirelle’s completed work. Otherwise Marius withdraws his protection at the sixth reckoning.

**Reason:** Put the decision before the explanation; retain real cost and delayed consequence.

**Source:** [src/livingCourt.ts:172](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:172>)

#### fulfil_service — composed negotiation

**Type:** Dialogue + terms. **State:** action:fulfil_service; same availability. Withdrawal uses existing result branch.

**Exact current text / template:**

```text
['Finish the work you promised me. I will keep my protection, but do not mistake a place in my House for independence.','This takes tonight’s action and 1 Blood. Completes your outstanding service.']
```

**Complete proposed replacement:**

> You undertook the work. Finish it. I value an obligation honoured more than an apology well delivered.

Visible detail unchanged:

> This takes tonight’s action and 1 Blood. Completes your outstanding service.

**Reason:** Put the decision before the explanation; retain real cost and delayed consequence.

**Source:** [src/livingCourt.ts:174](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:174>)

#### withdraw_library — composed negotiation

**Type:** Dialogue + terms. **State:** action:withdraw_library; same availability. Withdrawal uses existing result branch.

**Exact current text / template:**

```text
['Ask for my key, and my assistant loses this invitation too. If our work is unfinished, it stops here.','This takes tonight’s action. Published findings, your Library ownership, sanctuary and separate patron protection remain.']
```

**Complete proposed replacement:**

- Open result: “Then we stop here. Take back my permission, and my assistant loses this way into the Library too.”
- Published result: “You can have the permission back. The account has already reached its patron.”

Visible detail unchanged:

> This takes tonight’s action. Published findings, your Library ownership, sanctuary and separate patron protection remain.

**Reason:** Put the decision before the explanation; retain real cost and delayed consequence.

**Source:** [src/livingCourt.ts:180](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:180>)

#### broker_passage — composed negotiation

**Type:** Dialogue + terms. **State:** action:broker_passage; same availability. Withdrawal uses existing result branch.

**Exact current text / template:**

```text
['I can open the passage at dawn. It will shelter you until Night Six begins, no longer. You must find a lasting arrangement before then.','This takes tonight’s action. For lasting protection on this route, begin Dorian’s research on Night Four and allow it to finish on Night Five.']
```

**Complete proposed replacement:**

> A way out, not a permanent escape. If I grant the passage at dawn, it shelters you only until Night Six begins.

Visible detail unchanged:

> This takes tonight’s action. For lasting protection on this route, begin Dorian’s research on Night Four and allow it to finish on Night Five.

**Reason:** Put the decision before the explanation; retain real cost and delayed consequence.

**Source:** [src/livingCourt.ts:182](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:182>)

#### feed — composed negotiation

**Type:** Dialogue + terms. **State:** action:feed; same availability. Withdrawal uses existing result branch.

**Exact current text / template:**

```text
['Hunting restores 4 Blood, up to 12. Tonight’s upkeep still applies.','This takes tonight’s action. Hunting grants no political protection.']
```

**Complete proposed replacement:**

> The court can wait for an answer. Your hunger cannot.

Visible detail replaces the split explanatory strings:

> One nightly action. Restore 4 Blood, up to 12. Dawn upkeep and every deadline still apply. Feeding grants no protection.

**Reason:** Put the decision before the explanation; retain real cost and delayed consequence.

**Source:** [src/livingCourt.ts:184](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:184>)

#### rest — composed negotiation

**Type:** Dialogue + terms. **State:** action:rest; same availability. Withdrawal uses existing result branch.

**Exact current text / template:**

```text
['Rest restores 2 Blood, up to 12, while the Crypt remains open to you.','This takes tonight’s action. Vesper’s deadline is unchanged.']
```

**Complete proposed replacement:**

> For now, the Crypt admits you. Take what rest it permits.

Visible detail replaces the split explanatory strings:

> One nightly action. Restore 2 Blood, up to 12. Requires Crypt access. Vesper’s deadline and dawn upkeep remain unchanged.

**Reason:** Put the decision before the explanation; retain real cost and delayed consequence.

**Source:** [src/livingCourt.ts:186](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:186>)

#### investigate_title label

**Type:** Choice wording. **State:** investigate_title label

**Exact current text / template:**

```text
Put my claim before Seraphine
```

**Complete proposed replacement:**

> File my Library claim · 1 Blood

**Reason:** Make the existing action legible without inventing a right.

**Source:** [src/livingCourt.ts:35](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:35>)

#### petition_marius label

**Type:** Choice wording. **State:** petition_marius label

**Exact current text / template:**

```text
I will take my chances with Marius
```

**Complete proposed replacement:**

> Take Marius’s appointment

**Reason:** Make the existing action legible without inventing a right.

**Source:** [src/livingCourt.ts:35](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:35>)

#### fulfil_service label

**Type:** Choice wording. **State:** fulfil_service label

**Exact current text / template:**

```text
Keep my word to Marius
```

**Complete proposed replacement:**

> Fulfil Marius’s service · 1 Blood

**Reason:** Make the existing action legible without inventing a right.

**Source:** [src/livingCourt.ts:35](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:35>)

#### withdraw_library inspection; ownership never left player

**Type:** Choice wording. **State:** withdraw_library inspection; ownership never left player

**Exact current text / template:**

```text
I want my Library back
```

**Complete proposed replacement:**

> Withdraw my investigator’s permission

**Reason:** Make the existing action legible without inventing a right.

**Source:** [src/livingCourt.ts:37](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:37>)

#### broker_passage label

**Type:** Choice wording. **State:** broker_passage label

**Exact current text / template:**

```text
Ask Lucien for a way out
```

**Complete proposed replacement:**

> Ask for temporary passage

**Reason:** Make the existing action legible without inventing a right.

**Source:** [src/livingCourt.ts:37](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:37>)

#### rest label, avoids attributing all later access to Vesper

**Type:** Choice wording. **State:** rest label, avoids attributing all later access to Vesper

**Exact current text / template:**

```text
Rest while Vesper still permits it
```

**Complete proposed replacement:**

> Rest in the Crypt · restore 2 Blood

**Reason:** Make the existing action legible without inventing a right.

**Source:** [src/livingCourt.ts:37](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:37>)

Keep Feed’s existing label and the currently verified contextual action-cost/expiry/fatal-Blood text. Retain withdraw commit “Take back the keys”. No extra confirmation is proposed. All optional inspection details, one-action costs, network gas, treasury rules, once-only flags, counter acceptance forecast and expired/unavailable warnings remain accessible.

### Supplemental warning for an unanswered final demand


#### Night 7 Feed warning only when the existing finalDemand is true and no response is recorded; otherwise retain current sentence.

**Type:** Consequence warning. **State:** Night 7 Feed warning only when the existing finalDemand is true and no response is recorded; otherwise retain current sentence.

**Exact current text / template:**

```text
No nightly action will remain for another commitment.
```

**Complete proposed replacement:**

> No nightly action will remain for another commitment. Leaving Marius unanswered also costs his protection at this reckoning.

**Reason:** State the political cost of silence alongside the already accurate final-reckoning warning.

**Source:** [src/blood.ts:44](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/blood.ts:44>)

This is a conditional presentation sentence, not a feeding-rule change. It must not appear on routes without the demand.

## Rooms and records — all eligible nights

Optional records carry the durable explanation; greetings no longer have to repeat it.


#### record:crypt

**Type:** Narration. **State:** Existing recordText ordered guards; contacts/record IDs unchanged.

**Exact current text / template:**

```text
'The family record names Vesper as your sire. It does not make her the owner of everything you hold. Your Library title is separate. Crypt shelter is hers to withdraw; your ancestry remains.'
```

**Complete proposed replacement:**

> Vesper is your sire. Your Library is not hers. Crypt shelter depends on permission, not ancestry.

**Reason:** Keep optional context concise and precise.

**Source:** [src/livingCourt.ts:278](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:278>)

#### record:library

**Type:** Narration. **State:** Existing recordText ordered guards; contacts/record IDs unchanged.

**Exact current text / template:**

```text
d.result==='mirelle'?'Mirelle’s account separates the Library invitations from the promises held outside them. Your title remains yours; your researcher’s key does not control sanctuary or court protection. The completed work has satisfied Marius’s service. His protection is a separate promise, not something that depends on keeping her key.':d.result==='dorian'?'Dorian’s work has reached Lucien. It can earn his lasting protection. It cannot make him incapable of withdrawing that protection, and taking Dorian’s key back cannot make him unread the work.':p.titleFiled?'Your independent Library claim has been put before the court. That fact cannot shelter you by itself. The researchers now want to decide whom the work will benefit.':n<3?'The Library record names you as owner. Vesper cannot take it merely because she is your sire. Put that existing claim before Seraphine if you want to negotiate sanctuary.':'The Library record still names you as owner. The early sanctuary offer has closed; filing this title now will not reopen it.'
```

**Complete proposed replacement:**

- Mirelle published: “Mirelle delivered the account to Marius and satisfied his service. The investigator’s permission and Marius’s protection are separate arrangements.”
- Dorian published: “Dorian delivered to Lucien. The work can earn his lasting protection; only his own grant makes it real. Publication cannot be recalled.”
- Title filed: “Your independent claim is filed. It grants no shelter by itself.”
- Otherwise n<3: “The Library belongs to you. Filing the claim can qualify you for Seraphine’s sanctuary offer; reading it costs no action.”
- Otherwise: “The Library remains yours. Filing now cannot reopen the early sanctuary offer.”

**Reason:** Keep optional context concise and precise.

**Source:** [src/livingCourt.ts:280](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:280>)

#### record:lounge

**Type:** Narration. **State:** Existing recordText ordered guards; contacts/record IDs unchanged.

**Exact current text / template:**

```text
`Marius and Seraphine founded House Volari from independent bloodlines. He administers castle and succession; her older rights remain her own. ${permanentPassage?'Lucien now offers protection in his own name, outside the House.':'Lucien offers a route outside the House, but his temporary passage alone does not last.'}`
```

**Complete proposed replacement:**

> Marius and Seraphine founded House Volari with independent authority. Marriage did not give either control of the other’s rights.

Append the current branch, without a second paragraph:
- Permanent passage: “Lucien’s protection stands outside the House.”
- Otherwise: “Lucien’s temporary passage is not a lasting refuge.”

**Reason:** Keep optional context concise and precise.

**Source:** [src/livingCourt.ts:282](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:282>)

Room-development narration remains distinct from these records. Retain its existing state selectors and contact suggestions; proposed shorter replacements follow. Do not treat a suggested contact as physically present.


#### roomDevelopment existing matching branch

**Type:** Narration. **State:** roomDevelopment existing matching branch

**Exact current text / template:**

```text
A surviving right still admits you to the Crypt. Vesper’s withdrawn invitation is not the source of that shelter.
```

**Complete proposed replacement:**

> A right still admits you. Do not mistake present access for a promise from Vesper.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:120](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:120>)

#### roomDevelopment existing matching branch

**Type:** Narration. **State:** roomDevelopment existing matching branch

**Exact current text / template:**

```text
Vesper still permits you to rest here. Read the family record: being her descendant does not make your Library hers. After the third reckoning this shelter is hers to close.
```

**Complete proposed replacement:**

> The Crypt is shelter for now. Vesper intends to withdraw her invitation at the third reckoning.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:120](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:120>)

#### roomDevelopment existing matching branch

**Type:** Narration. **State:** roomDevelopment existing matching branch

**Exact current text / template:**

```text
Vesper has closed this shelter. Blood ties remain; her hospitality does not.
```

**Complete proposed replacement:**

> The Crypt no longer admits you. Being Vesper’s descendant does not open it.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:120](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:120>)

#### roomDevelopment existing matching branch

**Type:** Narration. **State:** roomDevelopment existing matching branch

**Exact current text / template:**

```text
Your chosen investigator can work here. There is still time to stop the research before it leaves the room.
```

**Complete proposed replacement:**

> The investigation is unfinished. Your permission still determines whether it continues.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:122](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:122>)

#### roomDevelopment existing matching branch

**Type:** Narration. **State:** roomDevelopment existing matching branch

**Exact current text / template:**

```text
Your title is already yours. Putting it before Seraphine may buy a hearing; reading it alone cannot buy shelter.
```

**Complete proposed replacement:**

> Your claim is independent. Seraphine wants it filed before she offers sanctuary.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:122](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:122>)

#### roomDevelopment existing matching branch

**Type:** Narration. **State:** roomDevelopment existing matching branch

**Exact current text / template:**

```text
The shelves are yours to open or close. Mirelle and Dorian want the work to serve different patrons.
```

**Complete proposed replacement:**

> Mirelle and Dorian need your permission. They disagree about who should benefit.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:122](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:122>)

#### roomDevelopment existing matching branch

**Type:** Narration. **State:** roomDevelopment existing matching branch

**Exact current text / template:**

```text
A seat at Seraphine’s table is an invitation to talk, not a place to sleep. Hear the patrons before choosing a debt.
```

**Complete proposed replacement:**

> You may hear the offers here. A place in the Lounge is not shelter.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:124](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:124>)

#### roomDevelopment existing matching branch

**Type:** Narration. **State:** roomDevelopment existing matching branch

**Exact current text / template:**

```text
Mirelle’s work has reached Marius. Ask what he now offers, and what still depends on him.
```

**Complete proposed replacement:**

> Mirelle delivered to Marius. Find out what his promise now amounts to.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:124](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:124>)

#### roomDevelopment existing matching branch

**Type:** Narration. **State:** roomDevelopment existing matching branch

**Exact current text / template:**

```text
Dorian has put the work before Lucien. Ask the outsider what his protection will cost you in dependence.
```

**Complete proposed replacement:**

> Dorian delivered to Lucien. Find out whether useful work has become protection.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:124](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:124>)

#### roomDevelopment existing matching branch

**Type:** Narration. **State:** roomDevelopment existing matching branch

**Exact current text / template:**

```text
The court is waiting to learn whom your Library will serve. Sabine can explain how Cassian’s other patronage survives your choices.
```

**Complete proposed replacement:**

> Your permission could serve either patron. Sabine has her own interest in what survives your decision.

**Reason:** Reduce exposition while preserving the recorded meaning.

**Source:** [src/livingCourt.ts:124](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:124>)

The published Library room template retains its exact current factual text and dynamic key status. It is already a short state summary; do not replace it with an invented reaction.

### Post-deadline Vesper safeguard

The old accessible-Crypt fallback interpolates 3-n. The proposed remaining-nights line is only appropriate before the third reckoning. For n>=3 with access still effective, use: “The Crypt still admits you. Do not confuse access with an extension of my promise.” This is an explicit presentation-only specialization of the quoted Vesper opening; it does not alter the right or assume which grant provides it.


## Night 3 onward — confirmed consequences and correspondence

All existing event, grant, lease, pending/error and journal guards remain. These are responses to recorded acts, not new acts. Past-tense narration avoids claiming that an old grant is still effective today. Current standing remains in the distinct relationship/inspection field.

### NPC event narration — reaction:npc:night:actor:kind


#### passage_offer — narrator

**Type:** Consequence narration. **State:** reaction:npc:*:passage_offer; exact existing event and verification predicate, historical date retained.

**Exact current text / template:**

```text
'After losing the appointment, Cassian has another offer: a temporary passage from Lucien. An offer alone buys him nothing.'
```

**Complete proposed replacement:**

> After losing the appointment, Cassian received Lucien’s offer of passage. An offer, not yet an escape.

**Reason:** State the confirmed political consequence once; distinguish it from current standing.

**Source:** [src/reactiveCourt.ts:50](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:50>)

#### passage_buy — narrator

**Type:** Consequence narration. **State:** reaction:npc:*:passage_buy; exact existing event and verification predicate, historical date retained.

**Exact current text / template:**

```text
'Cassian has spent his entire passage allowance on three nights outside Marius’s protection. His paid escape does not depend on your Library invitation. The accepted lease is publicly recorded.'
```

**Complete proposed replacement:**

> Cassian paid his entire passage allowance for three nights under Lucien’s lease. His escape did not depend on your Library permission.

**Reason:** State the confirmed political consequence once; distinguish it from current standing.

**Source:** [src/reactiveCourt.ts:51](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:51>)

#### passage_collect — narrator

**Type:** Consequence narration. **State:** reaction:npc:*:passage_collect; exact existing event and verification predicate, historical date retained.

**Exact current text / template:**

```text
'The agreed passage rent has reached Lucien. Cassian’s finite allowance is spent; the passage retains its recorded deadline.'
```

**Complete proposed replacement:**

> Lucien received Cassian’s payment. The passage kept its deadline.

**Reason:** State the confirmed political consequence once; distinguish it from current standing.

**Source:** [src/reactiveCourt.ts:52](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:52>)

#### final_answer — narrator

**Type:** Consequence narration. **State:** reaction:npc:*:final_answer; exact existing event and verification predicate, historical date retained.

**Exact current text / template:**

```text
p.finalCourt.result==='accepted'?(p.finalCourt.response==='counter'?'Marius accepts a limited inspection. Mirelle’s completed account and Cassian’s paid escape have made a narrower bargain worth accepting. You gave him a two-night invitation, not permanent access.':'Marius keeps his protection. You have given him a continuing invitation to the Library; he cannot pass that invitation on.'):'Marius has withdrawn his own protection after your answer—or your silence. Other independent promises remain governed by their own terms.'
```

**Complete proposed replacement:**

- Accepted, counter: “Marius accepted the narrower bargain. Your invitation lasts two nights; his protection continues.”
- Accepted, standing: “Marius kept his protection. You gave him continuing Library entry, with no power to pass it on.”
- Otherwise: “Marius withdrew his protection. Other shelter stands or falls on its own terms.”

On historical reopening, preserve the existing correspondence date/current-standing distinction; these lines describe the verified final answer, not a new assessment.

**Reason:** State the confirmed political consequence once; distinguish it from current standing.

**Source:** [src/reactiveCourt.ts:53](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:53>)

#### revoke — narrator

**Type:** Consequence narration. **State:** reaction:npc:*:revoke; exact existing event and verification predicate, historical date retained.

**Exact current text / template:**

```text
r.world.access.crypt?'Vesper has withdrawn her invitation. Another valid right still opens the Crypt. Her decision did not erase it.':'Vesper has withdrawn her invitation. The Crypt no longer admits you. Your Library title remains separate; it is not a refuge.'
```

**Complete proposed replacement:**

- Crypt still accessible: “Vesper withdrew her invitation. Another right still admits you to the Crypt.”
- Otherwise: “Vesper withdrew her invitation. The Crypt no longer admits you.”

**Reason:** State the confirmed political consequence once; distinguish it from current standing.

**Source:** [src/reactiveCourt.ts:56](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:56>)

#### dismiss — narrator

**Type:** Consequence narration. **State:** reaction:npc:*:dismiss; exact existing event and verification predicate, historical date retained.

**Exact current text / template:**

```text
`Marius has withdrawn the protection tied to unfinished service. ${r.world.access.court?'Another effective right still admits you at court.':'That court protection is no longer available.'} Your other arrangements stand or fall on their own terms.`
```

**Complete proposed replacement:**

> Marius withdrew the protection tied to unfinished service. {If court remains accessible: Another right still admits you there. Otherwise: That protection is no longer available.} Other shelter is separate.

**Reason:** State the confirmed political consequence once; distinguish it from current standing.

**Source:** [src/reactiveCourt.ts:58](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:58>)

#### archive_assist — narrator

**Type:** Consequence narration. **State:** reaction:npc:*:archive_assist; exact existing event and verification predicate, historical date retained.

**Exact current text / template:**

```text
`${e.actor==='mirelle'?'Cassian':'Lucien'} received an assistant’s invitation beneath ${e.actor==='mirelle'?'Mirelle':'Dorian'}’s. It created a route into the Library, not ownership. Check the present invitations below before deciding whether the work continues.`
```

**Complete proposed replacement:**

> {Cassian if Mirelle, otherwise Lucien} received an invitation through {Mirelle or Dorian}. Your permission had made room for someone else’s ally.

**Reason:** State the confirmed political consequence once; distinguish it from current standing.

**Source:** [src/reactiveCourt.ts:60](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:60>)

#### archive_challenge — narrator

**Type:** Consequence narration. **State:** reaction:npc:*:archive_challenge; exact existing event and verification predicate, historical date retained.

**Exact current text / template:**

```text
'Dorian made a competing petition while Mirelle could still be stopped. His proposal was a change of patron, not an accusation. A change requires taking back her key before inviting him; publication or delay can close that route.'
```

**Complete proposed replacement:**

> Dorian asked you to stop Mirelle and choose Lucien’s interests instead. It was a rival petition, not an accusation.

**Reason:** State the confirmed political consequence once; distinguish it from current standing.

**Source:** [src/reactiveCourt.ts:62](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:62>)

#### archive_research — narrator

**Type:** Consequence narration. **State:** reaction:npc:*:archive_research; exact existing event and verification predicate, historical date retained.

**Exact current text / template:**

```text
`${e.actor==='mirelle'?'Mirelle has delivered to Marius':'Dorian has delivered to Lucien'}. The account of present obligations is public. The rival investigation is finished as an opportunity. Taking back a key cannot unpublish the work; a patron’s protection still requires their own actual promise.`
```

**Complete proposed replacement:**

> {Mirelle delivered to Marius / Dorian delivered to Lucien}. The account became public. The competing investigation closed. Withdrawal cannot recall the publication.

**Reason:** State the confirmed political consequence once; distinguish it from current standing.

**Source:** [src/reactiveCourt.ts:64](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:64>)

#### archive_protect — narrator

**Type:** Consequence narration. **State:** reaction:npc:*:archive_protect; exact existing event and verification predicate, historical date retained.

**Exact current text / template:**

```text
`${e.actor==='marius'?'Marius':'Lucien'} issued separate protection after the research. The investigator cannot withdraw that promise. Its patron can. That promise is separate from your decision about the Library invitation.`
```

**Complete proposed replacement:**

> {Marius or Lucien} issued separate protection after the research. Your investigator did not gain control of that promise.

**Reason:** State the confirmed political consequence once; distinguish it from current standing.

**Source:** [src/reactiveCourt.ts:66](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:66>)

#### appoint — narrator

**Type:** Consequence narration. **State:** reaction:npc:*:appoint; exact existing event and verification predicate, historical date retained.

**Exact current text / template:**

```text
p.appointment==='player'?'Marius issued protection for your service. His support comes with work due on Nights Four or Five. Leaving it undone allows him to withdraw his promise.':'Marius issued protection to Cassian. The appointment is no longer yours to claim. Separate sanctuary, passage and the Library contest are different routes.'
```

**Complete proposed replacement:**

- Player appointment: “Marius granted protection for your service. The work was due on Night Four or Five; leaving it unfinished put his promise at risk.”
- Cassian appointment: “Marius granted Cassian protection. The appointment was no longer yours to claim.”

**Reason:** State the confirmed political consequence once; distinguish it from current standing.

**Source:** [src/reactiveCourt.ts:68](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:68>)

#### open_passage — narrator

**Type:** Consequence narration. **State:** reaction:npc:*:open_passage; exact existing event and verification predicate, historical date retained.

**Exact current text / template:**

```text
'Lucien opened the temporary passage, ending at the start of Night Six. To turn that escape into lasting protection, Dorian must finish before it closes, unless another refuge carries you longer.'
```

**Complete proposed replacement:**

> Lucien granted temporary passage, ending at the start of Night Six. Lasting protection would require another arrangement.

**Reason:** State the confirmed political consequence once; distinguish it from current standing.

**Source:** [src/reactiveCourt.ts:70](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:70>)

#### publish — narrator

**Type:** Consequence narration. **State:** reaction:npc:*:publish; exact existing event and verification predicate, historical date retained.

**Exact current text / template:**

```text
'Mirelle made the archive lead public. Lucien can now discuss passage. Information has opened a conversation; it has not yet opened a refuge.'
```

**Complete proposed replacement:**

> Mirelle made the lead public. Lucien could now discuss passage. No refuge was granted by the information alone.

**Reason:** State the confirmed political consequence once; distinguish it from current standing.

**Source:** [src/reactiveCourt.ts:72](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:72>)

#### sponsor — narrator

**Type:** Consequence narration. **State:** reaction:npc:*:sponsor; exact existing event and verification predicate, historical date retained.

**Exact current text / template:**

```text
'Cassian received a court invitation through Sabine. It depends on her authority from Marius, not on your Library key.'
```

**Complete proposed replacement:**

> Sabine sponsored Cassian at court under Marius’s authority. Your Library permission did not control that place.

**Reason:** State the confirmed political consequence once; distinguish it from current standing.

**Source:** [src/reactiveCourt.ts:74](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:74>)

#### compete — narrator

**Type:** Consequence narration. **State:** reaction:npc:*:compete; exact existing event and verification predicate, historical date retained.

**Exact current text / template:**

```text
e.actor==='cassian'?'Cassian claimed the vacant appointment. Waiting was a decision too.':'Dorian claimed the finite dossier. The record is no longer waiting for a claimant.'
```

**Complete proposed replacement:**

- Cassian: “Cassian claimed the appointment while it was still open.”
- Dorian: “Dorian claimed the finite dossier. There was nothing left to reserve.”

**Reason:** State the confirmed political consequence once; distinguish it from current standing.

**Source:** [src/reactiveCourt.ts:76](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:76>)

#### collect — narrator

**Type:** Consequence narration. **State:** reaction:npc:*:collect; exact existing event and verification predicate, historical date retained.

**Exact current text / template:**

```text
'The agreed rent has been collected. Payment settlement does not extend your stay.'
```

**Complete proposed replacement:**

> Seraphine received the agreed rent. The payment did not buy another night.

**Reason:** State the confirmed political consequence once; distinguish it from current standing.

**Source:** [src/reactiveCourt.ts:78](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:78>)

#### collect_sanctuary — narrator

**Type:** Consequence narration. **State:** reaction:npc:*:collect_sanctuary; exact existing event and verification predicate, historical date retained.

**Exact current text / template:**

```text
'The agreed rent has been collected. Payment settlement does not extend your stay.'
```

**Complete proposed replacement:**

> Seraphine received the agreed rent. The payment did not buy another night.

**Reason:** State the confirmed political consequence once; distinguish it from current standing.

**Source:** [src/reactiveCourt.ts:78](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:78>)

#### offer — narrator

**Type:** Consequence narration. **State:** reaction:npc:*:offer; exact existing event and verification predicate, historical date retained.

**Exact current text / template:**

```text
'Seraphine proposed the existing Lounge agreement. Reading or declining it does not mean accepting it.'
```

**Complete proposed replacement:**

> Seraphine proposed the Lounge agreement. You had made no commitment by hearing it.

**Reason:** State the confirmed political consequence once; distinguish it from current standing.

**Source:** [src/reactiveCourt.ts:80](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:80>)

### NPC replies — existing reactionReply branches

These replace only replies that already exist. Reactions without an NPC reply remain narrator-only. No newly invented meeting, gratitude, resentment state or affinity.


#### reactionReply — withdraw, speaker published

**Type:** Dialogue. **State:** reactionReply — withdraw, speaker published

**Exact current text / template:**

```text
You wanted the work. You have it. Now you want the key back. Very well. Let us be precise about which part of our arrangement is over.
```

**Complete proposed replacement:**

> You have the account. You are taking back the permission. I understand the distinction.

**Reason:** Distinct voice; retrospective fact without invented present protection.

**Source:** [src/reactiveCourt.ts:230](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:230>)

#### reactionReply — withdraw, speaker did not publish

**Type:** Dialogue. **State:** reactionReply — withdraw, speaker did not publish

**Exact current text / template:**

```text
I have your answer. The work stops here. If you invite someone else, at least let them finish before you change your mind again.
```

**Complete proposed replacement:**

> You withdrew permission before we finished. There is no completed account to give you.

**Reason:** Distinct voice; retrospective fact without invented present protection.

**Source:** [src/reactiveCourt.ts:230](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:230>)

#### reactionReply — service-kept

**Type:** Dialogue. **State:** reactionReply — service-kept

**Exact current text / template:**

```text
You kept your word. I prefer that to elaborate assurances. The work is done; I have no unfinished service to demand of you.
```

**Complete proposed replacement:**

> The service is fulfilled. I asked for work, and received it.

**Reason:** Distinct voice; retrospective fact without invented present protection.

**Source:** [src/reactiveCourt.ts:232](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:232>)

#### reactionReply — Vesper revoke; confirmed only

**Type:** Dialogue. **State:** reactionReply — Vesper revoke; confirmed only

**Exact current text / template:**

```text
The three nights are over. I have taken back my invitation. You may dislike the decision; you cannot say I concealed it.
```

**Complete proposed replacement:**

> The three nights are over. I have withdrawn my invitation. I did not ask you to like the warning. I asked you to use it.

**Reason:** Distinct voice; retrospective fact without invented present protection.

**Source:** [src/reactiveCourt.ts:238](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:238>)

#### reactionReply — Marius dismiss

**Type:** Dialogue. **State:** reactionReply — Marius dismiss

**Exact current text / template:**

```text
I kept a place for you. You left the work undone. I have withdrawn that promise. Whatever you arranged elsewhere is your affair.
```

**Complete proposed replacement:**

> You accepted the place and left the service unfinished. I have withdrawn my protection. I will not call that a misunderstanding.

**Reason:** Distinct voice; retrospective fact without invented present protection.

**Source:** [src/reactiveCourt.ts:240](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:240>)

#### reactionReply — archive_assist, child no longer effective

**Type:** Dialogue. **State:** reactionReply — archive_assist, child no longer effective

**Exact current text / template:**

```text
I brought an assistant into the work. That invitation no longer works. The unfinished research cannot continue through it.
```

**Complete proposed replacement:**

> The assistant’s invitation no longer holds. Unfinished work cannot continue on the strength of an old permission.

**Reason:** Distinct voice; retrospective fact without invented present protection.

**Source:** [src/reactiveCourt.ts:242](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:242>)

#### reactionReply — Mirelle archive_assist

**Type:** Dialogue. **State:** reactionReply — Mirelle archive_assist

**Exact current text / template:**

```text
Cassian has his invitation. Now we can get on with it. Give us another night, unless you would rather have an empty desk.
```

**Complete proposed replacement:**

> Cassian received his invitation. I intended him to work, not decorate the room.

**Reason:** Distinct voice; retrospective fact without invented present protection.

**Source:** [src/reactiveCourt.ts:242](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:242>)

#### reactionReply — Dorian archive_assist

**Type:** Dialogue. **State:** reactionReply — Dorian archive_assist

**Exact current text / template:**

```text
Lucien has his invitation. I said whom I wanted involved. I have not changed the bargain behind your back.
```

**Complete proposed replacement:**

> Lucien received his invitation. I said whose interests I meant to serve.

**Reason:** Distinct voice; retrospective fact without invented present protection.

**Source:** [src/reactiveCourt.ts:242](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:242>)

#### reactionReply — Dorian challenge no longer viable

**Type:** Dialogue. **State:** reactionReply — Dorian challenge no longer viable

**Exact current text / template:**

```text
I asked you to reconsider while there was time to change patrons. That was the offer then. We must deal with the choices you have made since.
```

**Complete proposed replacement:**

> I asked while a change could still matter. We cannot negotiate as though the intervening nights never happened.

**Reason:** Distinct voice; retrospective fact without invented present protection.

**Source:** [src/reactiveCourt.ts:244](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:244>)

#### reactionReply — Dorian live challenge; existing time/choice guard

**Type:** Dialogue. **State:** reactionReply — Dorian live challenge; existing time/choice guard

**Exact current text / template:**

```text
You can still stop Mirelle. Take her key back, then hear me. But count the nights before you decide; changing your mind twice will not give us more of them.
```

**Complete proposed replacement:**

> Stop Mirelle before she publishes, then invite me. Two commitments, not one clever answer. Count the nights before you choose.

**Reason:** Distinct voice; retrospective fact without invented present protection.

**Source:** [src/reactiveCourt.ts:244](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:244>)

#### reactionReply — Mirelle research confirmed

**Type:** Dialogue. **State:** reactionReply — Mirelle research confirmed

**Exact current text / template:**

```text
Finished. Marius has the account. You can close the Library tomorrow, but he will still have read it.
```

**Complete proposed replacement:**

> Delivered to Marius. You gave me the work; I finished it.

**Reason:** Distinct voice; retrospective fact without invented present protection.

**Source:** [src/reactiveCourt.ts:246](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:246>)

#### reactionReply — Dorian research confirmed

**Type:** Dialogue. **State:** reactionReply — Dorian research confirmed

**Exact current text / template:**

```text
Lucien has the finished account. Mirelle will not like losing the race. That does not make the work any less finished.
```

**Complete proposed replacement:**

> Delivered to Lucien. Mirelle’s commission will not decide this result.

**Reason:** Distinct voice; retrospective fact without invented present protection.

**Source:** [src/reactiveCourt.ts:246](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:246>)

#### reactionReply — Marius archive_protect confirmed

**Type:** Dialogue. **State:** reactionReply — Marius archive_protect confirmed

**Exact current text / template:**

```text
Mirelle delivered. You have my protection. Whether she keeps your key is between the two of you.
```

**Complete proposed replacement:**

> Mirelle delivered. I issued the protection. Her place in your Library is your decision.

**Reason:** Distinct voice; retrospective fact without invented present protection.

**Source:** [src/reactiveCourt.ts:248](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:248>)

#### reactionReply — Lucien archive_protect confirmed

**Type:** Dialogue. **State:** reactionReply — Lucien archive_protect confirmed

**Exact current text / template:**

```text
Dorian delivered. I have made my promise without a deadline this time. It is my promise, not something you borrowed from his key.
```

**Complete proposed replacement:**

> Dorian delivered. I made a promise without a deadline. Do remember whose promise it is.

**Reason:** Distinct voice; retrospective fact without invented present protection.

**Source:** [src/reactiveCourt.ts:248](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:248>)

#### reactionReply — Marius appoint player

**Type:** Dialogue. **State:** reactionReply — Marius appoint player

**Exact current text / template:**

```text
The place is yours. I expect the work by the end of the fifth night. You need not thank me repeatedly; doing it will suffice.
```

**Complete proposed replacement:**

> I granted the place for service due by the end of Night Five. That was the obligation, not an invitation to thank me.

**Reason:** Distinct voice; retrospective fact without invented present protection.

**Source:** [src/reactiveCourt.ts:250](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:250>)

#### reactionReply — Marius appoint Cassian

**Type:** Dialogue. **State:** reactionReply — Marius appoint Cassian

**Exact current text / template:**

```text
Cassian took the appointment. I have kept my side of that arrangement. You will have to find a different opening.
```

**Complete proposed replacement:**

> Cassian claimed the place. I granted its protection. I do not promise one appointment twice.

**Reason:** Distinct voice; retrospective fact without invented present protection.

**Source:** [src/reactiveCourt.ts:250](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:250>)

#### reactionReply — Lucien open_passage

**Type:** Dialogue. **State:** reactionReply — Lucien open_passage

**Exact current text / template:**

```text
I opened the way. Until the sixth night, remember. Escape is useful; mistaking it for a permanent solution is less useful.
```

**Complete proposed replacement:**

> I granted passage until Night Six. A deadline is less flattering than a vow, but considerably clearer.

**Reason:** Distinct voice; retrospective fact without invented present protection.

**Source:** [src/reactiveCourt.ts:252](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:252>)

#### reactionReply — Mirelle publish

**Type:** Dialogue. **State:** reactionReply — Mirelle publish

**Exact current text / template:**

```text
The lead is public now. Ask Lucien what he can make of it. I have given you information, not a bed.
```

**Complete proposed replacement:**

> I published the lead. Lucien could offer passage once he had it. The offer itself was his to make.

**Reason:** Distinct voice; retrospective fact without invented present protection.

**Source:** [src/reactiveCourt.ts:254](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:254>)

### Player permission, lease and service reactions

Titles and evidence references remain unchanged. These comparisons preserve all current variants and ledger guards.


#### id:`reaction:key: — narration

**Type:** Consequence narration. **State:** Same ledger/event predicate and historical date; no fabricated current grant.

**Exact current text / template:**

```text
`Your invitation let ${actor==='mirelle'?'Mirelle pursue Marius’s interests':'Dorian pursue Lucien’s interests'} and bring an assistant. ${g.revoked?'That invitation has since been withdrawn.':'Keeping it open is a continuing choice.'}`
```

**Complete proposed replacement:**

> You admitted {Mirelle to pursue Marius’s interests / Dorian to pursue Lucien’s interests}, with permission to bring an assistant. {Revoked: That invitation has since been withdrawn. Otherwise: The permission remains open.}

**Reason:** Acknowledge the player’s decision without restating every independence rule.

**Source:** [src/reactiveCourt.ts:104](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:104>)

#### id:`reaction:withdraw: — narration

**Type:** Consequence narration. **State:** Same ledger/event predicate and historical date; no fabricated current grant.

**Exact current text / template:**

```text
`Your invitation to ${actor==='mirelle'?'Mirelle':'Dorian'} is withdrawn. Any route depending on it is ineffective. ${p.library?.result==='open'?'The unfinished work cannot proceed through that invitation. You can hear the rival if time remains.':'Published findings remain. Separate patron protection is not yours to cancel with this key.'}`
```

**Complete proposed replacement:**

> You withdrew {Mirelle or Dorian}’s invitation and the access depending on it. {Open result: The unfinished work cannot continue through that permission. Published: The published account and separate patron protection remain.}

**Reason:** Acknowledge the player’s decision without restating every independence rule.

**Source:** [src/reactiveCourt.ts:114](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:114>)

#### id:`reaction:lease: — narration

**Type:** Consequence narration. **State:** Same ledger/event predicate and historical date; no fabricated current grant.

**Exact current text / template:**

```text
l.status==='accepted'?`Your ${l.property_id} agreement was accepted. It ${expiryDescription(l.end_night,r.world.night)}. Neither gratitude nor an unrelated quarrel changes that term.`:'You rejected this standing agreement. It grants no shelter or access. Refusal is recorded; no personal grudge is invented.'
```

**Complete proposed replacement:**

- Accepted: “Your {property_id} agreement was accepted. It {expiryDescription}. The recorded term remains the bargain.”
- Rejected: “You rejected the standing agreement. It gave you no shelter or entry.”

**Reason:** Acknowledge the player’s decision without restating every independence rule.

**Source:** [src/reactiveCourt.ts:126](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:126>)

#### id:`reaction:decline: — narration

**Type:** Consequence narration. **State:** Same ledger/event predicate and historical date; no fabricated current grant.

**Exact current text / template:**

```text
'You declined Seraphine’s proposal. No payment or relationship penalty followed. The refusal does not close an independently valid right.'
```

**Complete proposed replacement:**

> You declined Seraphine’s proposal. No payment followed. No relationship penalty was recorded.

**Reason:** Acknowledge the player’s decision without restating every independence rule.

**Source:** [src/reactiveCourt.ts:130](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:130>)

#### id:'reaction:service-kept' — narration

**Type:** Consequence narration. **State:** Same ledger/event predicate and historical date; no fabricated current grant.

**Exact current text / template:**

```text
'Your service is fulfilled. Marius no longer has that unfinished obligation to invoke. Protection still depends on the actual right he issued, not this acknowledgement.'
```

**Complete proposed replacement:**

> Your service to Marius is fulfilled. It is no longer an unfinished obligation he can invoke. His protection still depends on its own right.

**Reason:** Acknowledge the player’s decision without restating every independence rule.

**Source:** [src/reactiveCourt.ts:132](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:132>)

#### All generated court reaction scenes

**Type:** Presentation composition. **State:** All generated court reaction scenes

**Exact current text / template:**

```text
terms:[u.text,politicalRelationship(r,u.actor)]
```

**Complete proposed replacement:**

Retain only politicalRelationship(r,u.actor) in this terms list. The exact proposed narration remains in the dialogue body; do not duplicate it.

**Reason:** Remove the same paragraph being displayed twice.

**Source:** [src/reactiveCourt.ts:198](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:198>)

#### Historical correspondence caption

**Type:** Consequence framing. **State:** Existing known-night correspondence branch; unknown-night fallback retained.

**Exact current text / template:**

```text
Correspondence from Night ${u.night+1}. Your current standing is shown above.
```

**Complete proposed replacement:**

> Recorded on Night {u.night+1}. Present rights are shown separately.

**Reason:** Do not stage recorded correspondence as a new conversation.

**Source:** [src/reactiveCourt.ts:198](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:198>)

### Nightly reckoning replies — reckoning:night

Recaps keep the same journal filters, speakers, ordering and no-action completion. The shorter replies complement—not repeat—the fuller reaction narration. Never turn a journal entry into a new NPC action.


#### reckoning — revoke

**Type:** Dialogue / recorded recap. **State:** Existing matching completed journal event; actor and history night unchanged.

**Exact current text / template:**

```text
'The three nights are over. My Crypt is closed to you. Your Library is still your own.'
```

**Complete proposed replacement:**

> I withdrew my Crypt invitation. You remain my descendant.

**Reason:** Past-tense personal response; no assertion that historical protection still holds.

**Source:** [src/livingCourt.ts:340](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:340>)

#### reckoning — archive_assist

**Type:** Dialogue / recorded recap. **State:** Existing matching completed journal event; actor and history night unchanged.

**Exact current text / template:**

```text
e.actor==='mirelle'?'I have brought Cassian into the Library. We can finish on a later night, if you leave us the room.':'Lucien can now enter the Library through my invitation. Give us another night to finish.'
```

**Complete proposed replacement:**

- Mirelle: “I invited Cassian. The account still needed another night.”
- Dorian: “I invited Lucien. We had not yet finished the account.”

**Reason:** Past-tense personal response; no assertion that historical protection still holds.

**Source:** [src/livingCourt.ts:342](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:342>)

#### reckoning — archive_research

**Type:** Dialogue / recorded recap. **State:** Existing matching completed journal event; actor and history night unchanged.

**Exact current text / template:**

```text
e.actor==='mirelle'?'The work is published. Marius has what he needed. Dorian cannot claim the same investigation now.':'The findings are published and Lucien has them. Mirelle’s competing route is closed.'
```

**Complete proposed replacement:**

- Mirelle: “I delivered the account to Marius. Dorian’s competing route closed.”
- Dorian: “I delivered the account to Lucien. Mirelle’s competing route closed.”

**Reason:** Past-tense personal response; no assertion that historical protection still holds.

**Source:** [src/livingCourt.ts:344](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:344>)

#### reckoning — archive_protect

**Type:** Dialogue / recorded recap. **State:** Existing matching completed journal event; actor and history night unchanged.

**Exact current text / template:**

```text
e.actor==='marius'?'Mirelle’s work is enough. You have my protection; the service is fulfilled. Taking her key back will not undo my promise.':'Dorian delivered. My protection now has no deadline. It remains mine to withdraw, not your investigator’s.'
```

**Complete proposed replacement:**

- Marius: “Mirelle’s work satisfied the service. I issued my protection.”
- Lucien: “Dorian delivered. I issued protection without a deadline—not without an issuer.”

**Reason:** Past-tense personal response; no assertion that historical protection still holds.

**Source:** [src/livingCourt.ts:346](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:346>)

#### reckoning — archive_challenge

**Type:** Dialogue / recorded recap. **State:** Existing matching completed journal event; actor and history night unchanged.

**Exact current text / template:**

```text
'Before Mirelle publishes, hear my offer. Stop her work and you could still choose Lucien instead of Marius. I have no key until you give me one.'
```

**Complete proposed replacement:**

> I asked you to stop Mirelle and choose Lucien’s interests. I had no permission until you gave it.

**Reason:** Past-tense personal response; no assertion that historical protection still holds.

**Source:** [src/livingCourt.ts:348](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:348>)

#### reckoning — appoint

**Type:** Dialogue / recorded recap. **State:** Existing matching completed journal event; actor and history night unchanged.

**Exact current text / template:**

```text
c.politics?.appointment==='player'?'You have my protection. I expect the work by the end of Night Five.':'Cassian has the appointment and my protection. I will not promise that place twice.'
```

**Complete proposed replacement:**

- Player: “I granted your protection. Service was due by the end of Night Five.”
- Cassian: “I granted Cassian the protection of the appointment.”

**Reason:** Past-tense personal response; no assertion that historical protection still holds.

**Source:** [src/livingCourt.ts:350](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:350>)

#### reckoning — dismiss

**Type:** Dialogue / recorded recap. **State:** Existing matching completed journal event; actor and history night unchanged.

**Exact current text / template:**

```text
'You left the service unfinished. I have withdrawn my protection. Your arrangements with others are your own.'
```

**Complete proposed replacement:**

> The service remained unfinished. I withdrew my protection.

**Reason:** Past-tense personal response; no assertion that historical protection still holds.

**Source:** [src/livingCourt.ts:352](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:352>)

#### reckoning — open_passage

**Type:** Dialogue / recorded recap. **State:** Existing matching completed journal event; actor and history night unchanged.

**Exact current text / template:**

```text
'The passage is open to you until the start of Night Six. Use the time. It will not last by itself.'
```

**Complete proposed replacement:**

> I granted passage until the start of Night Six. It was time, not permanence.

**Reason:** Past-tense personal response; no assertion that historical protection still holds.

**Source:** [src/livingCourt.ts:354](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:354>)

#### reckoning — sponsor

**Type:** Dialogue / recorded recap. **State:** Existing matching completed journal event; actor and history night unchanged.

**Exact current text / template:**

```text
'I have sponsored Cassian at court. His place through me depends on Marius, not on the Library.'
```

**Complete proposed replacement:**

> I sponsored Cassian through my court authority. Your Library did not control it.

**Reason:** Past-tense personal response; no assertion that historical protection still holds.

**Source:** [src/livingCourt.ts:356](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:356>)

#### reckoning — publish

**Type:** Dialogue / recorded recap. **State:** Existing matching completed journal event; actor and history night unchanged.

**Exact current text / template:**

```text
'I have made the archive lead public. Lucien can now discuss a passage with you. Speaking to him is not the same as having somewhere safe to sleep.'
```

**Complete proposed replacement:**

> I published the lead. Lucien could now discuss passage.

**Reason:** Past-tense personal response; no assertion that historical protection still holds.

**Source:** [src/livingCourt.ts:358](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:358>)

#### reckoning — compete

**Type:** Dialogue / recorded recap. **State:** Existing matching completed journal event; actor and history night unchanged.

**Exact current text / template:**

```text
e.actor==='cassian'?'I took the appointment. You were not the only one who needed it.':'I secured the dossier. That opportunity is no longer waiting.'
```

**Complete proposed replacement:**

- Cassian: “I claimed the appointment. I did not intend to leave it open.”
- Dorian: “I claimed the dossier. There was only one opportunity.”

**Reason:** Past-tense personal response; no assertion that historical protection still holds.

**Source:** [src/livingCourt.ts:360](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:360>)

#### reckoning — collect

**Type:** Dialogue / recorded recap. **State:** Existing matching completed journal event; actor and history night unchanged.

**Exact current text / template:**

```text
'The agreed rent has reached me. It buys the nights we agreed, not another night beyond them.'
```

**Complete proposed replacement:**

> I received the rent. The agreed nights did not change.

**Reason:** Past-tense personal response; no assertion that historical protection still holds.

**Source:** [src/livingCourt.ts:362](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:362>)

#### reckoning — collect_sanctuary

**Type:** Dialogue / recorded recap. **State:** Existing matching completed journal event; actor and history night unchanged.

**Exact current text / template:**

```text
'The sanctuary rent has reached me. Your refuge keeps the same end date.'
```

**Complete proposed replacement:**

> I received the sanctuary rent. The term stayed the same.

**Reason:** Past-tense personal response; no assertion that historical protection still holds.

**Source:** [src/livingCourt.ts:364](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:364>)

#### reckoning — offer

**Type:** Dialogue / recorded recap. **State:** Existing matching completed journal event; actor and history night unchanged.

**Exact current text / template:**

```text
'There is room at my table, if you want to discuss the standing offer.'
```

**Complete proposed replacement:**

> I put the Lounge agreement before you. Hearing it was not acceptance.

**Reason:** Past-tense personal response; no assertion that historical protection still holds.

**Source:** [src/livingCourt.ts:366](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:366>)

#### Accepted lease recap

**Type:** Dialogue. **State:** Existing verified accepted-lease recap filter and formatter; no success on pending/failed result.

**Exact current text / template:**

```text
We have a bargain. Your ${l.property_id==='sanctuary'?'sanctuary':'place in the Lounge'} ${expiryDescription(l.end_night,r.world.night)}. Neither gratitude nor argument will change that date.
```

**Complete proposed replacement:**

> Agreed. Your {sanctuary / place in the Lounge} {expiryDescription(l.end_night, world.night)}. You paid for that time. It is yours to use.

**Reason:** Give the bargain a concise acknowledgement with actual expiry.

**Source:** [src/livingCourt.ts:374](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:374>)

#### reckoning fallback when no generated lines

**Type:** Consequence narration. **State:** reckoning fallback when no generated lines

**Exact current text / template:**

```text
The final dawn arrives. No new bargain was made in the court tonight. What remains is what your choices have left standing.
```

**Complete proposed replacement:**

> The final reckoning is complete. No further court action is recorded. The outcome follows.

**Reason:** Avoid implying extra events or a missing finale.

**Source:** [src/livingCourt.ts:378](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:378>)

#### reckoning fallback when no generated lines

**Type:** Consequence narration. **State:** reckoning fallback when no generated lines

**Exact current text / template:**

```text
No new claim or broken promise reaches you tonight. The quiet does not stop the deadlines.
```

**Complete proposed replacement:**

> No new court action is recorded tonight. The deadlines still pass.

**Reason:** Avoid implying extra events or a missing finale.

**Source:** [src/livingCourt.ts:378](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:378>)

## Night 7 and early defeat — remaining ending variants

The stored ending still selects the outcome. No narrative predicate recalculates victory. No invented regret, future betrayal, succession or permanent political independence.


#### Ending — Blood defeat epilogue

**Type:** Consequence narration. **State:** Ending — Blood defeat epilogue

**Exact current text / template:**

```text
You kept count of promises until there was no Blood left to spend. A safe room cannot save a body that cannot reach it.
```

**Complete proposed replacement:**

> Your Blood is gone. Whatever protection you secured, there is nothing left in you to reach the next night.

**Reason:** Match the recorded evidence; keep the ending concise and honest about dependence.

**Source:** [src/livingCourt.ts:254](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:254>)

#### Ending — Non-Blood, nonhistorical-Exposure failure epilogue

**Type:** Consequence narration. **State:** Ending — Non-Blood, nonhistorical-Exposure failure epilogue

**Exact current text / template:**

```text
The Library may still bear your name. It is not a refuge. Dawn finds you without the protection you needed.
```

**Complete proposed replacement:**

> Your name remains on a title, not a refuge. At the reckoning, no qualifying shelter stood between you and the daylight.

**Reason:** Match the recorded evidence; keep the ending concise and honest about dependence.

**Source:** [src/livingCourt.ts:254](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:254>)

#### Ending — Blood failure summary

**Type:** Consequence narration. **State:** Ending — Blood failure summary

**Exact current text / template:**

```text
Your Blood is exhausted. Rights and promises cannot keep you alive without it.
```

**Complete proposed replacement:**

> Blood reached zero. Protection could not prevent that defeat.

**Reason:** Match the recorded evidence; keep the ending concise and honest about dependence.

**Source:** [src/livingCourt.ts:58](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:58>)

#### Ending — Early shelter failure summary; avoids assuming which loss caused the state

**Type:** Consequence narration. **State:** Ending — Early shelter failure summary; avoids assuming which loss caused the state

**Exact current text / template:**

```text
No shelter remained after Vesper closed the Crypt. The Library and Lounge are not refuges.
```

**Complete proposed replacement:**

> No effective shelter remained after the third reckoning. Ordinary Library and Lounge access could not protect you.

**Reason:** Match the recorded evidence; keep the ending concise and honest about dependence.

**Source:** [src/livingCourt.ts:58](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:58>)

#### Ending — Night 7 failure summary

**Type:** Consequence narration. **State:** Ending — Night 7 failure summary

**Exact current text / template:**

```text
No lasting patron protection or qualifying sanctuary remained at the final reckoning. Ordinary room invitations cannot replace them.
```

**Complete proposed replacement:**

> The final reckoning found no qualifying sanctuary or patron protection. Ordinary room entry was not enough.

**Reason:** Match the recorded evidence; keep the ending concise and honest about dependence.

**Source:** [src/livingCourt.ts:58](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:58>)

#### Ending — Unbound diagnostic fallback; do not embellish contradictory state

**Type:** Consequence narration. **State:** Ending — Unbound diagnostic fallback; do not embellish contradictory state

**Exact current text / template:**

```text
No accepted sanctuary agreement is confirmed in the current record. Sanctuary is not ownership.
```

**Complete proposed replacement:**

> This record does not confirm an accepted sanctuary agreement. The stored outcome cannot establish a missing right.

**Reason:** Match the recorded evidence; keep the ending concise and honest about dependence.

**Source:** [src/livingCourt.ts:52](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:52>)

#### Ending — appointment player, service fulfilled; ending consequence

**Type:** Consequence narration. **State:** Ending — appointment player, service fulfilled; ending consequence

**Exact current text / template:**

```text
You kept the work promised to Marius. Your place in his institution was earned through service.
```

**Complete proposed replacement:**

> You fulfilled Marius’s service. Whatever followed, that obligation was met.

**Reason:** Match the recorded evidence; keep the ending concise and honest about dependence.

**Source:** [src/livingCourt.ts:72](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:72>)

#### Ending — existing revoked court-grant branch; do not infer a specific motive from the revocation alone

**Type:** Consequence narration. **State:** Ending — existing revoked court-grant branch; do not infer a specific motive from the revocation alone

**Exact current text / template:**

```text
You left Marius’s work unfinished. He withdrew his promise; any separate shelter had to carry you.
```

**Complete proposed replacement:**

> Marius’s service remained unfinished. A court grant to you was withdrawn; any surviving shelter was separate.

**Reason:** Match the recorded evidence; keep the ending concise and honest about dependence.

**Source:** [src/livingCourt.ts:72](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:72>)

#### Ending — unfulfilled, no recorded revoked court grant

**Type:** Consequence narration. **State:** Ending — unfulfilled, no recorded revoked court grant

**Exact current text / template:**

```text
Marius’s promised work remains unfinished.
```

**Complete proposed replacement:**

> Your service to Marius remains unfinished.

**Reason:** Match the recorded evidence; keep the ending concise and honest about dependence.

**Source:** [src/livingCourt.ts:72](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:72>)

#### Ending — published Mirelle ending consequence

**Type:** Consequence narration. **State:** Ending — published Mirelle ending consequence

**Exact current text / template:**

```text
You let Mirelle deliver the Library account to Marius. Dorian’s competing investigation closed before it could serve Lucien.
```

**Complete proposed replacement:**

> You let Mirelle deliver to Marius. Dorian’s competing route closed.

**Reason:** Match the recorded evidence; keep the ending concise and honest about dependence.

**Source:** [src/livingCourt.ts:74](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:74>)

#### Ending — published Dorian ending consequence

**Type:** Consequence narration. **State:** Ending — published Dorian ending consequence

**Exact current text / template:**

```text
You let Dorian deliver the Library account to Lucien. Mirelle’s competing investigation closed before it could serve Marius.
```

**Complete proposed replacement:**

> You let Dorian deliver to Lucien. Mirelle’s competing route closed.

**Reason:** Match the recorded evidence; keep the ending concise and honest about dependence.

**Source:** [src/livingCourt.ts:74](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:74>)

#### Ending — result open; does not deny independently earned service protection

**Type:** Consequence narration. **State:** Ending — result open; does not deny independently earned service protection

**Exact current text / template:**

```text
Neither investigator delivered the Library account. No patron can owe you protection for work that never reached them.
```

**Complete proposed replacement:**

> Neither investigator delivered the account. No protection was earned through that research.

**Reason:** Match the recorded evidence; keep the ending concise and honest about dependence.

**Source:** [src/livingCourt.ts:76](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:76>)

#### Ending — recorded withdrawn delegable player Library grant

**Type:** Consequence narration. **State:** Ending — recorded withdrawn delegable player Library grant

**Exact current text / template:**

```text
You took back an investigator’s key. Their dependent invitations fell with it; separate promises did not.
```

**Complete proposed replacement:**

> You withdrew an investigator’s permission. Dependent access fell; independent promises did not.

**Reason:** Match the recorded evidence; keep the ending concise and honest about dependence.

**Source:** [src/livingCourt.ts:80](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:80>)

#### Ending — accepted final counter

**Type:** Consequence narration. **State:** Ending — accepted final counter

**Exact current text / template:**

```text
Your published account supported a narrower bargain. Marius kept his protection; you gave him a two-night Library invitation, not permanent access.
```

**Complete proposed replacement:**

> Your recorded position supported a narrower bargain. Marius kept his protection; his Library invitation lasts two nights.

**Reason:** Match the recorded evidence; keep the ending concise and honest about dependence.

**Source:** [src/livingCourt.ts:88](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:88>)

#### Ending — accepted standing final invitation

**Type:** Consequence narration. **State:** Ending — accepted standing final invitation

**Exact current text / template:**

```text
You kept Marius’s protection by giving him a continuing, non-delegable Library invitation.
```

**Complete proposed replacement:**

> You kept Marius’s protection by giving him continuing Library entry. He cannot pass that invitation on.

**Reason:** Match the recorded evidence; keep the ending concise and honest about dependence.

**Source:** [src/livingCourt.ts:88](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:88>)

#### Ending — rejected final result; include silence, do not assert player explicitly refused

**Type:** Consequence narration. **State:** Ending — rejected final result; include silence, do not assert player explicitly refused

**Exact current text / template:**

```text
Marius withdrew his protection at the final confrontation. Your refusal or rejected proposal did not cancel independent shelter.
```

**Complete proposed replacement:**

> Marius withdrew his protection at the final reckoning. Refusal, silence or a rejected proposal did not cancel independent shelter.

**Reason:** Match the recorded evidence; keep the ending concise and honest about dependence.

**Source:** [src/livingCourt.ts:88](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:88>)

#### Ending — rejected counter with matching effective temporary invitation

**Type:** Consequence narration. **State:** Ending — rejected counter with matching effective temporary invitation

**Exact current text / template:**

```text
The two-night invitation you offered Marius still stands, although he rejected the bargain. It is temporary access, not ownership.
```

**Complete proposed replacement:**

> Marius rejected the bargain. The two-night Library invitation you gave him still stands. He gained entry, not ownership.

**Reason:** Match the recorded evidence; keep the ending concise and honest about dependence.

**Source:** [src/livingCourt.ts:89](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:89>)

Retain unchanged:
- Favoured summary’s existing patron selector, no scheduled end and revocability.
- Accepted-lease expired/other-state expiryDescription fallback, including ownership disclaimer.
- Existing current investigator invitation and separate-patron protection consequence templates.
- Historical Exposure defeat wording; it describes an old record, not a restored mechanic.
- CAMPAIGN COMPLETE, named endings, Chronicle controls, settlement warning and replay gating.
- At most three evidence-selected consequence highlights. The proposal does not force every line into every ending.

## Shared navigation and waiting


#### decision:n narrator

**Type:** Narration. **State:** decision:n narrator

**Exact current text / template:**

```text
You have one action before dawn. A hunt takes the same night as a bargain; hear the terms before you choose.
```

**Complete proposed replacement:**

> One action before dawn. Hunting spends the same time as a bargain.

**Reason:** No predicted success or new action.

**Source:** [src/livingCourt.ts:308](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:308>)

#### hold:n with root/open result

**Type:** Narration. **State:** hold:n with root/open result

**Exact current text / template:**

```text
You leave the investigators to their work. If they still have what they need, they may finish at this reckoning.
```

**Complete proposed replacement:**

> You leave the work running. This reckoning may finish it, if the investigators still have the authority they need.

**Reason:** No predicted success or new action.

**Source:** [src/livingCourt.ts:310](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:310>)

#### hold:n otherwise

**Type:** Narration. **State:** hold:n otherwise

**Exact current text / template:**

```text
You make no new commitment. The court will still act, and every promise keeps its deadline.
```

**Complete proposed replacement:**

> You make no new commitment. The court acts; deadlines pass.

**Reason:** No predicted success or new action.

**Source:** [src/livingCourt.ts:310](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:310>)

Keep wait labels, one-action rules, Blood upkeep text, “Leaving Marius unanswered…” warning and ordinary return/skip/inspect controls. They are functional distinctions, not opportunities for poetic ambiguity.

## Separate accuracy corrections — not fiction

These changes are proposed alongside the writing, not silently implemented.


#### lease:0 rejection in current Living Court only; retain legacy one-action label outside Library mode.

**Type:** Choice wording. **State:** lease:0 rejection in current Living Court only; retain legacy one-action label outside Library mode.

**Exact current text / template:**

```text
Reject standing lease · signed, one action
```

**Complete proposed replacement:**

> Reject standing lease · signed, no nightly action

**Reason:** Match the runner’s existing spending rule; do not change rejection execution.

**Source:** [src/encounters.ts:101](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/encounters.ts:101>)

#### Diagnostics; finite passage mandate feature.

**Type:** Technical accuracy. **State:** Diagnostics; finite passage mandate feature.

**Exact current text / template:**

```text
NPC purchasing treasuries are not implemented.
```

**Complete proposed replacement:**

> Cassian has one bounded, prepaid passage allowance. General NPC purchasing treasuries are not implemented.

**Reason:** Acknowledge the implemented exception without inventing an economy.

**Source:** [src/GameInspection.tsx:41](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/GameInspection.tsx:41>)

#### Diagnostics shared renderer; preserve the existing runtime proof/network indicator.

**Type:** Technical accuracy. **State:** Diagnostics shared renderer; preserve the existing runtime proof/network indicator.

**Exact current text / template:**

```text
Local development signing. No public wallet or LLM activation.
```

**Complete proposed replacement:**

> Signing is handled by the game runtime. The default NPC policy does not use live LLM dialogue.

**Reason:** Do not call hosted Testnet local or fictional.

**Source:** [src/GameInspection.tsx:41](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/GameInspection.tsx:41>)

The adjacent Sandbox-funds paragraph is not fictional narration. Its current network-specific wording should remain in Sandbox only; a Testnet renderer must not describe live Testnet as local Sandbox. No new replacement is proposed without choosing the existing trusted network indicator. This is a separately flagged accuracy item, not permission to change signing.

## Editorial direction and implementation boundaries

| Character | Voice decision | Avoid |
|---|---|---|
| Vesper | Personal severity, precise warning, restrained concern | Invented abuse, affection scores, revocation before confirmation |
| Seraphine | Commercial precision, composed dry humour | Charity, permanent sanctuary, dependence on Marius |
| Marius | Dignified reciprocity turning into explicit pressure | Cartoon villainy, false completed-service claims, power over independent rights |
| Lucien | Sardonic outsider seeking usefulness | Secret alliances, guaranteed future aid, confusing passage with permanence |
| Mirelle | Ambitious and exacting about delivering to Marius | Scandals or ancestry unsupported by the account |
| Dorian | Openly partisan, persuasive without accusations | Invented wrongdoing or claims that publication is reversible |
| Cassian | Competitive, impatient, clever about status | Universal destitution after losing one invitation |
| Sabine | Selective, calculating, interested in Cassian | Omniscient narration or invented control over independent grants |

**Dramatic progression:** dependence → competing prices → severance → others needing the player → irreversible publication → limited remaining choices → the actual political settlement. Quiet routes still receive a definitive ending; they do not inherit a counterfeit Marius confrontation.

**Repetition removed:** one action-specific opening instead of character introduction plus material exposition; one reaction narration instead of the same text in terms; short discovery prompts instead of repeated chapter paragraphs; durable authority explanations live in optional records and material commitment detail. This does not remove warnings at irreversible choices.

**Implementation discipline after approval:** change text and presentation selection only. Keep scene IDs, inspect targets, command payloads, turn cost, predicate order, journal confirmation, state shape, archive/settlement and choice availability intact. Do not run a global search-and-replace: some exact strings occur in multiple contexts, and source citations plus scene/field selectors define scope. Keep literal event logs unchanged because existing projections match their exact wording.

**Deliberately unchanged:** legacy-only questions; demoted information actions; action validation/rejection logic; signing and financial errors; deterministic NPC proposals; simulation/debug/execution records; no new branch choices, hidden emotional state or cutscene system. Artwork, motion-comic branch and layouts are untouched.

**Material-term checklist for later implementation:** action count and Blood cost; accepted lease price and network gas; prepaid nonrefundability; acceptance deadline and calculated expiry; grant recipient, scope and delegation; revocation/cascades; publication irreversibility; later-NPC dependency; exact Marius counter conditions and surviving temporary invitation. Existing details remain visible wherever not explicitly replaced.

## Creative judgments and unresolved limits

1. Vesper’s “I would rather you resented me from somewhere safe” is a proposed tone choice, not a recorded caring relationship or a change in her intent to revoke. Approve that controlled concern, or retain the colder existing third-night line. No new response branch is attached.
2. The account’s actual contents remain the implemented record of permissions and obligations. Stronger voices cannot create a scandal or historical revelation the game does not record.
3. Some dialogue guards summarize current access rather than identify its exact issuing grant. This proposal avoids attributing absent access to a particular act. A future implementation must not claim Vesper’s revocation, Marius’s dismissal or a paid sanctuary solely from an access boolean when the relevant event/lease is required.
4. Historical reactions describe an old act; current standing belongs in the existing separate field. There is no stored transcript of exactly what each character said at the time. Do not imply the proposed lines were previously recorded speech.
5. Safe elapsed-term phrasing must use expiryDescription. “Unbound” remains the existing ending name, not a promise of permanent independence.
6. The conditional Night Seven demand is the strongest climax. Routes without it get the proposed outcome-focused epilogue, not an added confrontation or action.
7. The audit’s open questions about arbitrary older-save text and external failures remain. Those strings are not creatively rewritten. The old audit remains an immutable baseline; this proposal is not an updated transcript of implemented dialogue.
8. Existing issuer/beneficiary selector limitations are not permission to alter victory rules or infer a different ending patron. Use current authoritative evidence and retain the existing outcome selector until a separately demonstrated defect is approved.

**Review focus:** approve the five samples as a coherent voice direction, particularly Vesper’s restraint, Seraphine’s humour, Dorian’s frank partisanship and Marius’s final pressure. All replacements remain proposals until reviewed.

## Verification

**PASS — document checks:** 207 exact-current excerpts matched source; 207 source citations resolved; all eight complete character sequences, seven chapters and five review samples were present. All 53 baseline source, contract, script and existing audit files retained their original SHA-256 fingerprints. Only this proposal was added.

**NOT RUN — intentionally:** application builds, gameplay tests, Sandbox/RPC calls and hosted verification. Nothing is implemented or deployed.

Document-only checks: exact current fragments must occur in the cited source; links must resolve; all eight current character sequences must include opening, both questions and both responses; all seven chapters and existing reaction/recap kinds must be covered or explicitly retained. Source/audit fingerprints are compared before and after writing.

No application build, gameplay tests, transaction, deployment, commit or push is required or performed for this unimplemented proposal.
