# Narrative director review — Living Court V2

**Creative proposal only. Unimplemented and awaiting review.** “Approved-direction catalogue” below means the recommended direction, not user approval to edit code. The audit and V1 remain intact. No source, contract, state, artwork, layout, NPC policy or deployment changes.

## A. Creative assessment

V1 was most useful as a clarity pass. It was least useful when it treated a character’s evasions, irritation or wit as excess wording.

Cassian’s “Congratulations. Now you get to discover why it was called work” became an explanation of the appointment. Seraphine lost “Ask him.” Sabine’s refusal to give a reassuring answer became a more ornamental remark about affection. These are not improvements. The originals let the player hear people defending their positions.

V1 also imposed one register across the court: declarative, exact, mildly disapproving. Giving everybody a short sentence does not give anybody a voice. Some of its best corrections—past versus present authority, an unanswered demand, an invitation surviving rejection—belong in the factual layer. They do not need to replace the dramatic layer.

**The revised direction:** each conversation is an attempt to get something from the player. Vesper refuses responsibility without surrendering her standing as sire. Seraphine sells relief from discretion, with the confidence to make it amusing. Marius makes obligation attractive before demanding reciprocity on his own terms. Mirelle wants her work to matter to Marius; Dorian wants the player to question why it should. Lucien offers an alternative centre of interest. Cassian resists condescension. Sabine refuses reassurance.

A reply can challenge the question, concede a point or expose an assumption. The interface carries the precise commitment; the speaker makes the commitment tempting, uncomfortable or politically revealing.

**Selective revision, not replacement by volume:** 33 catalogue units receive fresh dramatic writing. Strong originals are restored, and useful V1 factual/compositional changes survive. A unit may contain conditional variants; this is not a claim of exactly 33 spoken lines. The count is subordinate to the quality of the five playable sequences.

**Scope:** the five baseline documents were consulted, including their partial-coverage warning. V1’s 207 paired entries provide a finite review register. Original quotations are exact source excerpts, checked against current source. They sometimes contain conditional expressions rather than a single rendered sentence. Arbitrary saved text and RPC failures are not claimed as an exhaustive part of this review.

[Comparisons](#b-original-v1-and-recommendation) · [Showcases](#c-five-complete-showcase-sequences) · [Catalogue](#d-complete-disposition-and-replacement-catalogue) · [Editorial review](#e-editorial-quality-review)

## B. Original, V1 and recommendation

The tables retain exact Original and V1 wording, including template notation and implementation notes. They are not paraphrases of the competing drafts. KEEP ORIGINAL restores that field; KEEP V1 adopts only that named entry; REWRITE V2 specifies the replacement. Unmentioned source arms remain original.

Each R-number identifies the corresponding V1 entry. D records all 207 dispositions; the tables examine significant selections individually. Minor unchanged controls are not rewritten to inflate the review.


<a id="r1"></a>

### R1 — Prologue — A borrowed shelter

**REWRITE V2** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| The Crypt keeps the daylight out. For now. Vesper is your sire, and she has begun to speak of your shelter as something she might take away. | > The Crypt shelters you because Vesper permits it. She is your sire. That has begun to sound less like a promise. | The Crypt keeps the daylight out. Vesper is your sire, and for now she permits you to sleep there. Tonight, she has a limit to put on that permission. | The original has a concrete setting; V1’s ‘begun to sound less like a promise’ is vague. End on the coming confrontation, not an abstract condition. |

**Existing state/slot:** Existing vesper panel; preserve title/order.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/entry.ts:4](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/entry.ts:4>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:16>)

<a id="r2"></a>

### R2 — Prologue — House Volari

**KEEP ORIGINAL** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Here, a promise can open a door. A debt can close it. Marius presides over the court, where every offer asks something of you in return. | > Marius offers a place in House Volari. He expects that place to be earned. | Here, a promise can open a door. A debt can close it. Marius presides over the court, where every offer asks something of you in return. | The original has rhythm and introduces a reciprocal court. V1 reduces Marius to a job description. |

**Existing state/slot:** Existing marius panel; preserve title/order.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/entry.ts:5](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/entry.ts:5>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:34>)

<a id="r3"></a>

### R3 — Prologue — A power of her own

**KEEP ORIGINAL** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Marius and Seraphine founded House Volari together. But hers is a power of her own. If you seek shelter at her table, it will be on her terms. | > Seraphine founded the House beside Marius, not beneath him. Her sanctuary has a price of its own. | Marius and Seraphine founded House Volari together. But hers is a power of her own. If you seek shelter at her table, it will be on her terms. | The original establishes the founders and Seraphine’s independence with assurance. The new ‘price of its own’ is less specific. |

**Existing state/slot:** Existing seraphine panel; preserve title/order.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/entry.ts:6](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/entry.ts:6>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:52>)

<a id="r4"></a>

### R4 — Prologue — Three nights

**KEEP V1** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Vesper will close the Crypt to you at the third reckoning. Over seven nights, you must survive with a refuge of your own or a patron willing to protect you. Before its rival promises pull you apart, she has something to say. | > At the third reckoning, Vesper will withdraw her Crypt invitation. You have seven nights to survive—and three to find another refuge. | > At the third reckoning, Vesper will withdraw her Crypt invitation. You have seven nights to survive—and three to find another refuge. | The deadline and seven-night objective need plain clarity here. Drama belongs to the confrontation that follows. |

**Existing state/slot:** Existing vesper panel; preserve title/order.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/entry.ts:7](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/entry.ts:7>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:70>)

<a id="r5"></a>

### R5 — Vesper — opening

**REWRITE V2** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| w.access.crypt?(n===2?'Tonight. You have had time to ask everyone else what they think of me. I trust you have also found a bed.':&#96;You may sleep in my Crypt for ${3-n} more nights. Then you will find another roof. I will not have dependence mistaken for a birthright.&#96;):'My door is closed. Yours is not. You still own the Library. I expect you are discovering how pleasant it is to be the one people ask.' | - Crypt accessible, n=2: “This is the last night. I will close the Crypt at dawn. I would rather you resented me from somewhere safe.”<br>- Crypt accessible, other existing branch: “You have {3-n} nights beneath my roof. Then I withdraw my invitation. I am your sire. I will not be your shelter forever.”<br>- No Crypt access: “The Crypt does not admit you now. I am still your sire. Those are separate facts.” | Crypt accessible, n=2: KEEP ORIGINAL — “Tonight. You have had time to ask everyone else what they think of me. I trust you have also found a bed.”<br>Crypt accessible, n<2: “I made you one of us. I did not promise you a place beside me forever. You have {3-n} more nights in my Crypt. Then you must find another roof.”<br>Crypt accessible, n>=3: “The Crypt still admits you. Do not take that as a new promise from me.”<br>Crypt inaccessible: “You are still my descendant. You are no longer sheltered here. I see no reason to confuse the two.” | V1 gives Vesper an unearned note of solicitude. Her strongest original last-night line is colder and more personal. The opening needs room for creation versus responsibility. |

**Existing state/slot:** Same ordered guards as the current expression. character:vesper; question → ask:n:vesper, personal → personal:n:vesper. Active campaign; no new branch.

**V2 placement:** character:vesper and ultimatum reuse. Preserve the access check and n=2 precedence; split only the old generic accessible fallback by n<2/n>=3 to avoid a negative countdown. This is text selection, never a revocation claim.

[src/livingCourt.ts:148](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:148>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:88>)

<a id="r6"></a>

### R6 — Vesper — question

**KEEP ORIGINAL** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'Does being your descendant count for nothing?' | > Does being your descendant mean so little? | 'Does being your descendant count for nothing?' | ‘Count for nothing?’ is wounded and confrontational; V1 makes it a milder philosophical question. |

**Existing state/slot:** Same ordered guards as the current expression. character:vesper; question → ask:n:vesper, personal → personal:n:vesper. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:148](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:148>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:108>)

<a id="r7"></a>

### R7 — Vesper — answer

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'It makes you my descendant. It does not oblige me to house you forever. Nor does it entitle me to your Library. Tradition has limits; that is why it survives.' | > It means I am your sire. It does not make your Library mine, or my hospitality yours to command. | 'It makes you my descendant. It does not oblige me to house you forever. Nor does it entitle me to your Library. Tradition has limits; that is why it survives.' | The original gives her an internally coherent, severe defence. ‘Tradition has limits’ reveals how she justifies herself. |

**Existing state/slot:** Same ordered guards as the current expression. character:vesper; question → ask:n:vesper, personal → personal:n:vesper. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:148](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:148>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:126>)

<a id="r8"></a>

### R8 — Vesper — personal

**KEEP ORIGINAL** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'Are you trying to make me fail?' | > Do you want me to fail? | 'Are you trying to make me fail?' | The original is a credible accusation and a distinct free branch. |

**Existing state/slot:** Same ordered guards as the current expression. character:vesper; question → ask:n:vesper, personal → personal:n:vesper. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:148](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:148>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:144>)

<a id="r9"></a>

### R9 — Vesper — reply

**REWRITE V2** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'I am telling you precisely when my hospitality ends. Do not mistake that warning for a promise that someone else will catch you.' | > I want you to understand that I mean it. What you do with the warning is yours. | If I wanted you unprepared, I would have said nothing. Do not turn a warning into a promise that I will relent. | She refuses the emotional premise instead of repeating the deadline. This is an argument, not evidence of a secret motive. |

**Existing state/slot:** Same ordered guards as the current expression. character:vesper; question → ask:n:vesper, personal → personal:n:vesper. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:148](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:148>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:162>)

<a id="r10"></a>

### R10 — Night 1 — ultimatum narrator

**KEEP V1** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Before the third dawn, you need another refuge. Seraphine offers a bargain; Marius wants your service. Your Library is yours, but its walls are no shelter from the sun. | > Before the third dawn, find another refuge. Seraphine will sell sanctuary. Marius wants service. The Library cannot shelter you. | > Before the third dawn, find another refuge. Seraphine will sell sanctuary. Marius wants service. The Library cannot shelter you. | The narrator should orient the player without competing with Vesper. Keep the readable two-route distinction. |

**Existing state/slot:** Night 1 — ultimatum narrator

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:314](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:314>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:180>)

<a id="r11"></a>

### R11 — ultimatum → discovery:0

**KEEP ORIGINAL** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Find out who might help me | > Hear their offers. | Find out who might help me | The original expresses an immediate personal need. ‘Hear their offers’ makes vulnerability sound like shopping. |

**Existing state/slot:** ultimatum → discovery:0

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:314](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:314>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:198>)

<a id="r12"></a>

### R12 — ultimatum → character:vesper

**KEEP ORIGINAL** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| I want an explanation | > Speak to Vesper. | I want an explanation | The player is entitled to demand an explanation. A plain ‘Speak to Vesper’ loses intention. |

**Existing state/slot:** ultimatum → character:vesper

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:314](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:314>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:216>)

<a id="r13"></a>

### R13 — Seraphine — opening

**REWRITE V2** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| w.access.sanctuary?'You paid for a refuge. You have one. You may stop thanking me whenever it becomes tiresome.':n>=3?'You missed the offer. I can still listen, but listening will not put a roof over your head.':p.titleFiled?'Your Library really is your own. Good. Now we can discuss a bargain between people with something to lose.':'Marius likes to know where everyone belongs. I prefer to know whether they can keep a bargain. You need a place to sleep. I have one.' | - Effective sanctuary access: “You paid for sanctuary. Enjoy the rare pleasure of not owing me gratitude.”<br>- Otherwise n>=3: “There is no sanctuary here for you now. I can offer conversation. Do not mistake it for shelter.”<br>- Otherwise titleFiled: “A claim of your own. Good. I prefer a bargain to an appeal.”<br>- Otherwise: “Marius will ask what use you are to him. I ask whether you can pay. Shall we spare each other the performance?” | Keep all original opening branches except n>=3 with no sanctuary access. Replace that branch with: “The offer is closed. I can still listen, but listening will not put a roof over your head.” | Her original first meeting and paid-refuge line already have wit. Correct the unsupported accusation that the player missed the offer; do not replace personality with a new gag. |

**Existing state/slot:** Same ordered guards as the current expression. character:seraphine; question → ask:n:seraphine, personal → personal:n:seraphine. Active campaign; no new branch.

**V2 placement:** Exact ordered guards unchanged. Only the expired-offer leaf changes; do not claim rejection, missed acceptance or current payment from that leaf.

[src/livingCourt.ts:150](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:150>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:241>)

<a id="r14"></a>

### R14 — Seraphine — question

**KEEP ORIGINAL** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'What is the catch?' | > What exactly am I buying? | 'What is the catch?' | ‘What is the catch?’ lets the player voice the natural suspicion. The pricing question in V1 is less human. |

**Existing state/slot:** Same ordered guards as the current expression. character:seraphine; question → ask:n:seraphine, personal → personal:n:seraphine. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:150](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:150>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:262>)

<a id="r15"></a>

### R15 — Seraphine — answer

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'Seven nights of sanctuary, paid in advance: 0.02 NEAR. No refund, no ownership. I cannot take it back once you accept, but it ends. Bring your Library claim or the dossier before Night Four.' | > Seven nights of sanctuary for 0.02 NEAR, paid in advance. No refund and no ownership. Once accepted, I cannot cancel it. A filed Library claim or secured dossier qualifies you. Acceptance closes before Night Four. | 'Seven nights of sanctuary, paid in advance: 0.02 NEAR. No refund, no ownership. I cannot take it back once you accept, but it ends. Bring your Library claim or the dossier before Night Four.' | When directly asked for the catch, exact terms are a characterful answer. Not all precision is bad dialogue. Preserve the deadline and amount. |

**Existing state/slot:** Same ordered guards as the current expression. character:seraphine; question → ask:n:seraphine, personal → personal:n:seraphine. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:150](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:150>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:280>)

<a id="r16"></a>

### R16 — Seraphine — personal

**KEEP ORIGINAL** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'And Marius is content with that?' | > Can Marius interfere? | 'And Marius is content with that?' | ‘And Marius is content with that?’ recognizes the court’s interpersonal tension. V1 narrows it to an authority query. |

**Existing state/slot:** Same ordered guards as the current expression. character:seraphine; question → ask:n:seraphine, personal → personal:n:seraphine. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:150](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:150>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:298>)

<a id="r17"></a>

### R17 — Seraphine — reply

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'Ask him. We founded this House together; we did not become the same person. My rights were mine before our marriage. They still are.' | > He may object. We founded this House together; we did not merge our authority. He cannot cancel my bargain. | 'Ask him. We founded this House together; we did not become the same person. My rights were mine before our marriage. They still are.' | ‘Ask him’ is an excellent first beat; the rest establishes marriage without subordination. V1 removes its best rhythm. |

**Existing state/slot:** Same ordered guards as the current expression. character:seraphine; question → ask:n:seraphine, personal → personal:n:seraphine. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:150](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:150>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:316>)

<a id="r18"></a>

### R18 — Sanctuary — whole negotiation

**REWRITE V2** · Dialogue + retained terms.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| ['Receive 7 nights of sanctuary. Neither Vesper nor Marius can withdraw it; Seraphine cannot cancel an accepted bargain. Your Library remains yours.','The bargain takes tonight’s action and 0.02 NEAR of prepaid, nonrefundable rent, plus network gas. Temporary shelter, not ownership. Accept before Night Four.'] | > Seven nights under my protection. Pay the agreed rent, and neither Marius nor Vesper can shorten them. Neither can I.<br><br>Visible detail retained verbatim:<br><br>> The bargain takes tonight’s action and 0.02 NEAR of prepaid, nonrefundable rent, plus network gas. Temporary shelter, not ownership. Accept before Night Four.<br><br>Retain the calculated expiry sentence. Replace the entire composed opening with the single dialogue line, rather than appending it to the greeting. | SERAPHINE: “Marius can decide you have ceased to be useful. Vesper can decide you have stayed long enough. Pay me, and neither decision shortens your sanctuary. Mine cannot either. I find a price agreed in advance saves a great deal of injured feeling.”<br>VISIBLE TERMS: “One nightly action. Pay 0.02 NEAR from the prepaid campaign treasury, nonrefundable, plus network gas. Seven nights of sanctuary from acceptance; no ownership. An accepted lease cannot be cancelled by Seraphine, Marius or Vesper. Accept before Night Four.”<br>Retain the filed-title/dossier prerequisite, exact computed expiry and authoritative acceptance requirement. | The offer should seduce through predictability, not through a promise of permanent freedom. Her commercial humour comes from the actual contract. |

**Existing state/slot:** action:sanctuary_pact; unchanged eligibility/payment/deadline.

**V2 placement:** action:sanctuary_pact: replace the whole repeated greeting plus material[0], not an additional speech. Existing terms/expiry remain before the existing commit.

[src/livingCourt.ts:170](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:170>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:334>)

<a id="r19"></a>

### R19 — Sanctuary inspection label, not commitment

**KEEP ORIGINAL** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| I want a refuge of my own | > Discuss paid sanctuary. | I want a refuge of my own | ‘I want a refuge of my own’ is a natural aspiration. The visible lease terms already make clear that ‘my refuge’ does not mean ownership. |

**Existing state/slot:** Sanctuary inspection label, not commitment

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:35](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:35>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:358>)

<a id="r20"></a>

### R20 — Mirelle — opening

**REWRITE V2** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| d.result==='mirelle'?'It is published. Marius has the work; you cannot make him unread it. My key is another matter.':d.result==='dorian'?'Dorian finished first. I dislike the result. Pretending there is still a race would be worse.':root&&d.chosen==='mirelle'?(assistant?'Cassian has joined the work. Give us until the next reckoning. Or close the room now, if you have changed your mind.':'You have let me begin. I still need to bring Cassian in before we can finish.'):root?'You have chosen Dorian. I will not claim a place at his desk. If you stop him before publication, we can talk again.':n<3?'There is a difference between owning the Library and making the court acknowledge it. I can help you put the record before Seraphine.':'I want to finish work Marius can use. Cassian can help. You have the room; I need you to decide whether we may use it.' | - Mirelle published: “Marius has the account. That is what I came to do. Whether I keep your key is another question.”<br>- Dorian published: “Dorian finished first. I will not congratulate him. Nor will I ask you to pretend I won.”<br>- Mirelle root, assistant present: “Cassian can enter. We have what we need to continue—unless you are taking it back.”<br>- Mirelle root, no assistant: “You have admitted me. Cassian still needs his invitation before we can finish.”<br>- Other root: “You chose Dorian. If you mean to change that, stop his work first. I will not share his commission.”<br>- Otherwise n<3: “You own the Library. Let us put the claim before Seraphine while it can still buy you a hearing.”<br>- Otherwise: “Marius needs this account. I intend to deliver it. You have the Library; I need your permission.” | Keep the first five original branches: her publication, Dorian’s publication, her root with/without assistant, and an opposing root.<br>Early n<3 fallback: KEEP ORIGINAL.<br>Final no-root fallback: “Marius needs the Library account. I can give him work worth having—if you will let me begin. Dorian will tell you whom that benefits. I assume you can work it out without him.” | Her original conditional disappointment and practical progress are strong. The new petition gives her ambition, impatience and a reason to resent Dorian’s framing without inventing a scandal. |

**Existing state/slot:** Same ordered guards as the current expression. character:mirelle; question → ask:n:mirelle, personal → personal:n:mirelle. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:154](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:154>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:387>)

<a id="r21"></a>

### R21 — Mirelle — question

**KEEP ORIGINAL** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'What will you reveal?' | > What will Marius get from this? | 'What will you reveal?' | ‘What will you reveal?’ asks about the work rather than telling the player it is only patronage. |

**Existing state/slot:** Same ordered guards as the current expression. character:mirelle; question → ask:n:mirelle, personal → personal:n:mirelle. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:154](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:154>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:411>)

<a id="r22"></a>

### R22 — Mirelle — answer

**REWRITE V2** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'An account of the Library’s present obligations: who may use it, and which promises stand outside it. Not a secret ancestry or a convenient scandal. Marius wants the finished work. Once he has it, Dorian cannot offer Lucien the same investigation.' | > An account of who may use the Library and which obligations stand apart from it. Useful knowledge, not a scandal. If I publish first, Dorian cannot deliver this investigation to Lucien. | Who may use the Library. Which obligations reach beyond it. It is an account Marius can act on, not a collection of rumours. If I finish first, Dorian cannot deliver this investigation to Lucien. | Precision becomes a professional claim to seriousness; preserve the publication race rather than disclaim absent plotlines. |

**Existing state/slot:** Same ordered guards as the current expression. character:mirelle; question → ask:n:mirelle, personal → personal:n:mirelle. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:154](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:154>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:429>)

<a id="r23"></a>

### R23 — Mirelle — personal

**KEEP ORIGINAL** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'Why bring Cassian?' | > Why should I admit Cassian? | 'Why bring Cassian?' | The concise original asks the question this permission actually raises. |

**Existing state/slot:** Same ordered guards as the current expression. character:mirelle; question → ask:n:mirelle, personal → personal:n:mirelle. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:154](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:154>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:447>)

<a id="r24"></a>

### R24 — Mirelle — reply

**REWRITE V2** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'Because I need an assistant. Let me in and I can invite him under your permission. Take my key back and his stops working too. His other patrons are another matter.' | > Because I need an assistant, not an audience. My invitation lets me bring him in. Withdraw mine and his Library access falls with it—not his other patronage. | Because I intend to finish. Cassian is impatient to be useful; I can use impatience. Let me in and I can invite him. Withdraw my permission and his Library access goes with it. | Give her an opinion about her assistant rather than just a dependency diagram. Cassian’s ambition is established; no prior achievement is invented. |

**Existing state/slot:** Same ordered guards as the current expression. character:mirelle; question → ask:n:mirelle, personal → personal:n:mirelle. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:154](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:154>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:465>)

<a id="r25"></a>

### R25 — Dorian — opening

**REWRITE V2** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| d.result==='dorian'?'The work is published. Lucien has it. You can take my key back; you cannot put the findings back in a drawer.':d.result==='mirelle'?'Mirelle finished. Marius gets the useful result. There is no sense pretending I can still beat her to it.':d.challenged&&d.result==='open'&&d.chosen==='mirelle'&&root?'Mirelle will hand the work to Marius. You do have another option. Stop her before she publishes, then let me bring Lucien in.':root&&d.chosen==='dorian'?(assistant?'Lucien can enter now. You knew I wanted him involved. Let us finish, or tell us to leave.':'You have given me a start. Lucien still needs his invitation before the work can be finished.'):'Help Mirelle and Marius benefits. Help me and someone outside his House does. I am not pretending those are the same bargain.' | - Dorian published: “Lucien has the account. Marius does not get to be the beneficiary of every useful decision you make.”<br>- Mirelle published: “Mirelle delivered to Marius. I lost this contest. There is no second copy of the victory to sell you.”<br>- Live recorded rival petition while Mirelle root remains: “Mirelle will deliver to Marius. Before she does, consider who gains from your permission.”<br>- Dorian root, assistant present: “Lucien can enter now. We can continue. Are you still willing?”<br>- Dorian root, no assistant: “You admitted me. Lucien still needs his invitation. I did say whose interests I meant to serve.”<br>- Otherwise: “Mirelle wants your Library to be useful to Marius. I want it to be useful to Lucien. At least I am not asking you to call that neutral.” | Keep all original conditional branches. Replace only the final fallback with: “Mirelle will make Marius the beneficiary and call it useful work. It will be useful work. That is not the part I object to.” | He can concede her competence while disputing the beneficiary. He becomes persuasive without needing misconduct. |

**Existing state/slot:** Same ordered guards as the current expression. character:dorian; question → ask:n:dorian, personal → personal:n:dorian. Active campaign; no new branch.

**V2 placement:** character:dorian fallback only. His questions and commitment identify Lucien explicitly; no new rival petition is triggered by this line.

[src/livingCourt.ts:156](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:156>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:483>)

<a id="r26"></a>

### R26 — Dorian — question

**KEEP ORIGINAL** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'Why should I let Lucien see my records?' | > What would Lucien owe me? | 'Why should I let Lucien see my records?' | The original centres the player’s concern about admitting an outsider; V1 turns the discussion into a reward request. |

**Existing state/slot:** Same ordered guards as the current expression. character:dorian; question → ask:n:dorian, personal → personal:n:dorian. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:156](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:156>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:506>)

<a id="r27"></a>

### R27 — Dorian — answer

**REWRITE V2** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'Because his protection could be useful to you. Finish the research and he has a reason to offer it without a deadline. It is still his to withdraw. If you want a favour with no patron attached, talk to Seraphine.' | > Nothing until he makes his promise. Finish the account for him and he has reason to offer protection without a deadline. He can still withdraw it. Seraphine sells a different kind of certainty: a fixed term. | Because he has an interest outside Marius’s House. Finish the account for Lucien and he has a reason to protect you without a deadline. He must still grant it, and it remains his to withdraw. I am offering a different patron, not a world without them. | Admit the limitation as part of the persuasion. Remove the mistaken description of paid sanctuary as a favour. |

**Existing state/slot:** Same ordered guards as the current expression. character:dorian; question → ask:n:dorian, personal → personal:n:dorian. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:156](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:156>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:524>)

<a id="r28"></a>

### R28 — Dorian — personal

**KEEP ORIGINAL** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'Are you accusing Mirelle of something?' | > What has Mirelle done wrong? | 'Are you accusing Mirelle of something?' | The original permits a pointed challenge without asserting misconduct. |

**Existing state/slot:** Same ordered guards as the current expression. character:dorian; question → ask:n:dorian, personal → personal:n:dorian. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:156](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:156>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:542>)

<a id="r29"></a>

### R29 — Dorian — reply

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'No. I am telling you whom she means to help. You do not need a secret crime to have conflicting interests.' | > Nothing I need to accuse her of. We want different men to benefit. You are allowed to choose without discovering a villain. | 'No. I am telling you whom she means to help. You do not need a secret crime to have conflicting interests.' | ‘You do not need a secret crime to have conflicting interests’ is distinctive, accurate and a useful rebuke. V1 makes it more generic. |

**Existing state/slot:** Same ordered guards as the current expression. character:dorian; question → ask:n:dorian, personal → personal:n:dorian. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:156](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:156>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:560>)

<a id="r30"></a>

### R30 — authorize_mirelle — whole negotiation

**REWRITE V2** · Dialogue + commitment detail.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| ['Let me into your Library, and let me bring Cassian. Our finished account will satisfy Marius’s service and give him reason to protect you.','This takes tonight’s action. No deadline on these invitations; you may withdraw them. They need a subsequent reckoning to finish. Publication closes Dorian’s competing route and cannot be recalled.'] | > Let me bring Cassian in. I will put the finished account before Marius. Until then, you may stop us.<br><br>Visible terms:<br><br>> One nightly action. Give Mirelle delegable Library entry without expiry; she can invite Cassian. You may revoke her permission and its dependent access. Research needs a later reckoning. Publication cannot be recalled and closes Dorian’s route. The completed account satisfies Marius’s service; his protection still requires his own confirmed grant. | MIRELLE: “Give me permission to bring Cassian in. Let us finish, and Marius receives the account. If you mean to stop us, do it before I publish. I will not pretend the work can be unread.”<br>Use V1’s complete visible terms unchanged, including completed research satisfying Marius’s service and protection requiring his own confirmed grant. | Her ambition is the pressure; the warning is practical rather than ornamental. Keep V1’s more complete commitment disclosure. |

**Existing state/slot:** action:authorize_mirelle; unchanged eligibility. Replace repeated greeting plus material[0], not an additional line.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:176](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:176>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:578>)

<a id="r31"></a>

### R31 — authorize_dorian — whole negotiation

**REWRITE V2** · Dialogue + commitment detail.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| ['Let me bring Lucien into the Library. Finish this account with us, and he has reason to offer lasting protection. It will still be his promise to withdraw.','This takes tonight’s action. No deadline on these invitations; you may withdraw them. Lucien can see your records. Publication needs a subsequent reckoning, closes Mirelle’s route and cannot be recalled.'] | > Admit me, and I will invite Lucien. Let us finish, and the account goes to him—not Marius.<br><br>Visible terms:<br><br>> One nightly action. Give Dorian delegable Library entry without expiry; he can invite Lucien. You may revoke that permission and its dependent access. Research needs a later reckoning. Publication cannot be recalled and closes Mirelle’s route. Lucien’s lasting protection requires his own confirmed grant. | DORIAN: “Let me invite Lucien. We finish the account; he gets the benefit. You need not pretend this is neutral. Neither will I.”<br>Use V1’s complete visible terms unchanged: delegable access, assistant, no expiry, revocation, later reckoning, irrevocable publication, rival route closing and separate grant. | His directness distinguishes him from Mirelle’s professional appeal. Do not add a payoff before the NPC grants protection. |

**Existing state/slot:** action:authorize_dorian; unchanged eligibility. Replace repeated greeting plus material[0], not an additional line.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:178](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:178>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:600>)

<a id="r32"></a>

### R32 — authorize_mirelle inspection and existing commit label

**KEEP ORIGINAL** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Let Mirelle and Cassian do the work | > Admit Mirelle and let her invite Cassian. | Let Mirelle and Cassian do the work | The original ‘Let Mirelle and Cassian do the work’ is readable intent. V1’s grant vocabulary belongs in the terms; the command stays the same. |

**Existing state/slot:** authorize_mirelle inspection and existing commit label

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:37](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:37>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:622>)

<a id="r33"></a>

### R33 — authorize_dorian inspection and existing commit label

**KEEP ORIGINAL** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Back Dorian and Lucien | > Admit Dorian and let him invite Lucien. | Back Dorian and Lucien | ‘Back Dorian and Lucien’ names the political decision. Exact access consequences remain in the commitment detail. |

**Existing state/slot:** authorize_dorian inspection and existing commit label

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:37](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:37>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:640>)

<a id="r34"></a>

### R34 — final-demand; opening reused by incident:6, decision:6 and character:marius

**REWRITE V2** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| The work is finished. Our arrangement is not. I want to enter your Library without having to ask again. Give me that, or find another protector. | > Your Library is yours. My protection is mine. If you want mine to continue, give me leave to enter yours without asking again. | You have my protection. You would like to keep it. Very well.<br><br>I want an invitation to your Library that does not expire. Keep your title. I have no interest in taking it from you. I am asking whether you intend our arrangement to benefit only you. | Give the confrontation time to turn an attractive arrangement into pressure. He casts a fresh demand as reciprocity without claiming that the player agreed to it before. |

**Existing state/slot:** final-demand; opening reused by incident:6, decision:6 and character:marius

**V2 placement:** Existing finalDemand and unanswered-response gate only. Two paragraphs in the existing dialogue slot, not extra clicks or a new scene. Preserve all three existing destinations.

[src/livingCourt.ts:319](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:319>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:666>)

<a id="r38"></a>

### R38 — action:final_accept; before commitment

**REWRITE V2** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| A standing invitation, then. I keep my protection; you let me into the Library. Neither of us needs to pretend this is friendship. | > You may call it a concession. I call it a reason to continue our arrangement. | Then we understand one another. Your title remains yours. I expect to be admitted. | His satisfaction is restrained. This is negotiation intent; authoritative continuation is still pending. |

**Existing state/slot:** action:final_accept; before commitment

**V2 placement:** Existing action:final_accept inspection, before commit; retain non-delegable/no-expiry terms and subsequent verified answer.

[src/livingCourt.ts:204](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:204>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:738>)

<a id="r39"></a>

### R39 — action:final_refuse; before commitment

**REWRITE V2** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Then you understand what you are refusing. My protection ends tonight. Your arrangements with the others are their affair. | > Then you will face the dawn without my protection. I will not speak for whoever else has promised you shelter. | You may refuse me. You may not refuse me and keep what I offered on my authority. At this reckoning, my protection ends. | Recognize the player’s agency while refusing to absorb its cost. No shouting or power over other patrons. |

**Existing state/slot:** action:final_refuse; before commitment

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:204](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:204>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:756>)

<a id="r40"></a>

### R40 — action:final_counter; before commitment

**REWRITE V2** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| A limited inspection, instead of a standing invitation? Show me what makes that worth accepting. | > Two nights instead of a standing invitation. Give me a reason to accept less. | Two nights. You want me to accept a limit on your hospitality while leaving none on mine. Show me why that should interest me. | He notices the asymmetry; the public evidence, not a persuasion roll, determines his answer. |

**Existing state/slot:** action:final_counter; before commitment

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:204](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:204>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:774>)

<a id="r41"></a>

### R41 — final_counter commit

**KEEP V1** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Make the counterproposal · 1 Blood | > Grant two nights’ entry and counter · 1 Blood | > Grant two nights’ entry and counter · 1 Blood | Explicitly names the grant rather than merely suggesting a discussion. Keep the disclosure that entry survives rejection. |

**Existing state/slot:** final_counter commit

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:232](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:232>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:792>)

<a id="r42"></a>

### R42 — conclusion:unbound; stored Unbound result

**REWRITE V2** · Consequence narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Vesper’s door is closed. You no longer need it. The Library remains yours, and Seraphine’s bargain has carried you beyond this week. Freedom has an end date here; it is still more than you began with. | > Seven nights survived. The Library is still yours. You paid Seraphine for time she cannot take back—not for a place beneath her. The bargain will end. This week, you endured on its terms. | You began with shelter someone else could withdraw. You finish the seventh night with your Library still yours, and sanctuary paid for on terms no change of mood can shorten.<br><br>Seraphine has not given you a home forever. You have not inherited her power. What you secured is smaller, and real: time that cannot be taken back merely because you cease to please.<br><br>For these seven nights, that was enough. | Celebrate a specific achievement rather than announce abstract freedom. Longer than a routine line because the player has earned a resolution. |

**Existing state/slot:** conclusion:unbound; stored Unbound result

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:254](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:254>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:832>)

<a id="r43"></a>

### R43 — endingSummary active accepted Unbound lease branch; retain existing title prefix

**KEEP V1** · Consequence narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Seraphine cannot withdraw her protection, and it will last through the final night. But sanctuary is not ownership. | > The final reckoning is over. Your sanctuary {expiryDescription(lease.end_night, world.night)}. Seraphine cannot cancel the remaining term. You own no part of her sanctuary. | > The final reckoning is over. Your sanctuary {expiryDescription(lease.end_night, world.night)}. Seraphine cannot cancel the remaining term. You own no part of her sanctuary. | The existing expiry formatter fixes the temporal error. Let the epilogue carry emotion and the summary carry the remaining term. |

**Existing state/slot:** endingSummary active accepted Unbound lease branch; retain existing title prefix

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:50](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:50>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:850>)

<a id="r44"></a>

### R44 — Favoured epilogue

**REWRITE V2** · Consequence narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| You have survived. ${c.reason.includes('Lucien')?'Lucien':'Marius'} stands behind you. That is a place in the world, even if it is not a place beyond everyone else’s reach. | > Seven nights survived. {Lucien or Marius, selected exactly as now} still protects you. You have secured a place, not freedom from its patron. The Library remains yours; the promise remains his. | Marius branch: “You have survived the seventh night with Marius’s protection still standing. There is a place for you in his order. It is not a small achievement. It is not a place beyond his reach.<br><br>Your Library remains yours. His promise remains his. You have secured a future in which that distinction will matter.”<br>Lucien branch: “You have survived the seventh night with Lucien’s protection still standing. A promise from outside House Volari has carried you further than its temporary passage could.<br><br>There is no scheduled end to this protection. There is still a man who can withdraw it. You kept your Library and gained a patron—not a guarantee that he will always want what you want.” | Different patrons deserve different emotional resolutions. Both are victories with continuing dependency, not lesser failures. |

**Existing state/slot:** conclusion:favoured; existing patron selector.

**V2 placement:** Stored Favoured only; use the existing c.reason.includes('Lucien') patron selector, not a new inference from current access. No claim that Marius demanded entry unless the separate recorded consequence exists.

[src/livingCourt.ts:254](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:254>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:868>)

<a id="r77"></a>

### R77 — Marius — opening

**REWRITE V2** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| p.serviceFulfilled&&w.access.court?'The work is finished. I said I would protect you, and I am doing so. We need not make a ceremony of it.':p.serviceFulfilled?'The work is finished. That does not replace a promise actually made: we must still settle whether my protection stands.':w.access.court?'You have my protection. I still expect the work you undertook. A useful arrangement should be useful to both of us.':p.appointment==='cassian'?'Cassian took the appointment. I will not offer you his place as though he had done nothing.':n<3?'Vesper has given you a deadline. I have an appointment to fill. Do the work the House needs, and I can make room for you.':'There is no empty appointment waiting for you. Mirelle’s completed work could still give me reason to offer protection.' | - Service fulfilled and court accessible: “You did the work. I have kept my protection. We need not diminish either by pretending it was charity.”<br>- Service fulfilled, court inaccessible: “Your service is recorded. My protection does not presently stand. Do not confuse what you earned with what is in force.”<br>- Court accessible, service not fulfilled: “You have my protection. Now make good on what you undertook.”<br>- Appointment belongs to Cassian: “Cassian claimed the place. I will not make his appointment worthless to spare your disappointment.”<br>- Otherwise n<3: “Vesper intends to close her door. I have a place for someone useful. Consider the obligation before you ask for the protection.”<br>- Otherwise: “The appointment is closed. Mirelle’s account may still give me reason to act. A reason is not yet a promise.” | Keep the original first four branches: fulfilled service with/without court access, active court protection, and Cassian’s appointment.<br>Replace n<3 fallback: “Vesper has made your position uncertain. I can offer a place with duties you can fulfil, rather than favour you must keep guessing at. There is one appointment. Consider whether you want it.”<br>Keep the final original closed-appointment/Mirelle-work branch. | V1’s ‘protection does not presently stand’ is clerical. Retain the original fulfilled-service and Cassian branches; give the early offer dignity and appeal. |

**Existing state/slot:** Same ordered guards as the current expression. character:marius; question → ask:n:marius, personal → personal:n:marius. Active campaign; no new branch.

**V2 placement:** Same branch order. The attractive certainty is Marius’s sales argument about specified service, not a promise that his protection is irrevocable. Keep explicit revocability and Night Seven warning in the terms.

[src/livingCourt.ts:152](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:152>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1511>)

<a id="r79"></a>

### R79 — Marius — answer

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| d.result==='mirelle'?'Mirelle completed the Library investigation. That satisfies the service I required; you need not perform it again.':p.serviceFulfilled?'Your obligation is fulfilled. My protection remains mine to withdraw, not Vesper’s.':'Service to the House, completed on Night Four or Five. It costs you that night and 1 Blood. Leave it unfinished and I withdraw my protection at the sixth reckoning. Mirelle’s completed investigation can satisfy it instead.' | - Mirelle published: “Mirelle’s account satisfies the service. I do not ask you to perform the same obligation twice.”<br>- Otherwise service fulfilled: “The obligation is fulfilled. My protection remains mine to withdraw, not Vesper’s.”<br>- Otherwise: “Serve the House on Night Four or Five: one nightly action and 1 Blood. Leave it undone and I withdraw my protection at the sixth reckoning. Mirelle’s completed account can satisfy the service instead.” | d.result==='mirelle'?'Mirelle completed the Library investigation. That satisfies the service I required; you need not perform it again.':p.serviceFulfilled?'Your obligation is fulfilled. My protection remains mine to withdraw, not Vesper’s.':'Service to the House, completed on Night Four or Five. It costs you that night and 1 Blood. Leave it unfinished and I withdraw my protection at the sixth reckoning. Mirelle’s completed investigation can satisfy it instead.' | A direct question about the obligation deserves a precise answer. The original correctly distinguishes Mirelle’s completed work, fulfilled service and outstanding service. |

**Existing state/slot:** Same ordered guards as the current expression. character:marius; question → ask:n:marius, personal → personal:n:marius. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:152](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:152>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1552>)

<a id="r81"></a>

### R81 — Marius — reply

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'That is your decision. She can make a bargain I cannot cancel. I can offer a place in the institution I administer. Neither is the same as inheriting it.' | > Seraphine can sell you time I cannot take away. I can give you a place in the House. Decide whether you want a bargain or a patron. | 'That is your decision. She can make a bargain I cannot cancel. I can offer a place in the institution I administer. Neither is the same as inheriting it.' | The original contrasts two legitimate arrangements without caricaturing either founder. V1’s ‘bargain or patron’ is a useful slogan but a weaker answer. |

**Existing state/slot:** Same ordered guards as the current expression. character:marius; question → ask:n:marius, personal → personal:n:marius. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:152](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:152>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1590>)

<a id="r82"></a>

### R82 — Lucien — opening

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| permanentPassage?'Dorian did the work. I have extended my protection without a deadline. It is still a favour from me; I would rather you understood that.':d.result==='dorian'?'Dorian has delivered. That gives us something to discuss. Until I actually extend my protection, do not count a conversation as a safe bed.':w.access.passage?'You have a way out until Night Six. Please do not spend all that time congratulating yourself on escaping.':p.passageRequested?'The temporary passage has ended. I told you it would. If Dorian finishes, there may still be a lasting arrangement.':'I can buy you time. It is not the same as solving your problem, but people in your position sometimes need the distinction explained.' | - Effective permanent passage: “Dorian delivered. I have removed the deadline from my protection. Do not mistake that for removing me from the arrangement.”<br>- Otherwise Dorian published: “Dorian has made you useful to me. That deserves a conversation. Until I grant protection, it is only a conversation.”<br>- Otherwise passage accessible: “You have passage until Night Six. Time is a useful purchase even when no one enjoys admitting they need it.”<br>- Otherwise passage requested: “That passage is no longer shelter for you. Its deadline was part of the offer. If Dorian’s work earns a lasting arrangement, that will be a different promise.”<br>- Otherwise: “I can offer a little distance from House Volari. It comes with a deadline. Freedom from everyone would be a much more expensive boast.” | permanentPassage?'Dorian did the work. I have extended my protection without a deadline. It is still a favour from me; I would rather you understood that.':d.result==='dorian'?'Dorian has delivered. That gives us something to discuss. Until I actually extend my protection, do not count a conversation as a safe bed.':w.access.passage?'You have a way out until Night Six. Please do not spend all that time congratulating yourself on escaping.':p.passageRequested?'The temporary passage has ended. I told you it would. If Dorian finishes, there may still be a lasting arrangement.':'I can buy you time. It is not the same as solving your problem, but people in your position sometimes need the distinction explained.' | His original temporary-passage admonition is funny because it addresses the player’s temptation to relax. V1 replaces it with an abstract remark about purchasing time. |

**Existing state/slot:** Same ordered guards as the current expression. character:lucien; question → ask:n:lucien, personal → personal:n:lucien. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:158](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:158>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1610>)

<a id="r84"></a>

### R84 — Lucien — answer

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'With temporary passage alone, you must let Dorian begin on Night Four and finish on Night Five, before the passage closes at the start of Night Six. His completed work can earn lasting protection. Delay is dangerous.' | > Let Dorian deliver the account. With only my temporary passage, start his work on Night Four and let it finish on Night Five. The passage closes as Night Six begins; his completed work can earn a longer promise. | 'With temporary passage alone, you must let Dorian begin on Night Four and finish on Night Five, before the passage closes at the start of Night Six. His completed work can earn lasting protection. Delay is dangerous.' | This is a genuinely necessary route/timing question. Preserve the exact Night Four/Five/Six sequence. |

**Existing state/slot:** Same ordered guards as the current expression. character:lucien; question → ask:n:lucien, personal → personal:n:lucien. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:158](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:158>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1650>)

<a id="r86"></a>

### R86 — Lucien — reply

**REWRITE V2** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'I am outside the House. That does not mean I have no interest in what happens here. A useful connection need not become a family relationship.' | > An interest inside a House I do not belong to. Marius need not approve of it for it to be useful. | Marius would prefer that you needed him. I would prefer that you had reason to remember someone else. | Give him a reason to be involved without inventing a conspiracy or promising a reward. |

**Existing state/slot:** Same ordered guards as the current expression. character:lucien; question → ask:n:lucien, personal → personal:n:lucien. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:158](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:158>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1686>)

<a id="r87"></a>

### R87 — Cassian — opening

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| d.chosen==='mirelle'&&assistant?'Mirelle brought me into the Library. I would like to finish something before the next person changes their mind.':p.appointment==='player'?'You took the appointment. Congratulations. Now you get to discover why it was called work.':p.appointment==='cassian'?'I took the appointment while it was open. Waiting politely was not going to make me indispensable.':'If you want the appointment, take it. If you do not, stop standing in the doorway.' | - Mirelle chosen and assistant present: “Mirelle has brought me in. I would like to finish the work before someone decides I should be grateful for losing it.”<br>- Otherwise player appointment: “You took the appointment. Now comes the part where Marius expects it to have been worth giving you.”<br>- Otherwise Cassian appointment: “The place was open. I took it. Was I meant to wait until you had finished considering it?”<br>- Otherwise: “I would prefer a place to another conversation about my prospects.” | d.chosen==='mirelle'&&assistant?'Mirelle brought me into the Library. I would like to finish something before the next person changes their mind.':p.appointment==='player'?'You took the appointment. Congratulations. Now you get to discover why it was called work.':p.appointment==='cassian'?'I took the appointment while it was open. Waiting politely was not going to make me indispensable.':'If you want the appointment, take it. If you do not, stop standing in the doorway.' | The original congratulations is a sharp joke with an edge of envy. The assistant and claimed-appointment branches also have a recognizably impatient rhythm. |

**Existing state/slot:** Same ordered guards as the current expression. character:cassian; question → ask:n:cassian, personal → personal:n:cassian. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:160](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:160>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1706>)

<a id="r88"></a>

### R88 — Cassian — question

**KEEP ORIGINAL** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'Would you lose everything if I closed the Library?' | > What would you lose if I withdrew the Library invitation? | 'Would you lose everything if I closed the Library?' | The original is an understandable challenge about the scope of the player’s power, not merely a request for access information. |

**Existing state/slot:** Same ordered guards as the current expression. character:cassian; question → ask:n:cassian, personal → personal:n:cassian. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:160](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:160>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1727>)

<a id="r89"></a>

### R89 — Cassian — answer

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'Only what depends on that invitation. Sabine’s court sponsorship, if she has given it, is separate. You can close one door without becoming master of all the others.' | > The access I have through Mirelle. Not every place I hold. If Sabine has sponsored me at court, your Library key does not undo it. | 'Only what depends on that invitation. Sabine’s court sponsorship, if she has given it, is separate. You can close one door without becoming master of all the others.' | He refuses the fantasy that the player can ruin his entire position with one key. Mechanical precision serves his pride. |

**Existing state/slot:** Same ordered guards as the current expression. character:cassian; question → ask:n:cassian, personal → personal:n:cassian. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:160](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:160>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1745>)

<a id="r90"></a>

### R90 — Cassian — personal

**KEEP ORIGINAL** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'You seem remarkably eager to owe someone.' | > You are willing to owe a great deal. | 'You seem remarkably eager to owe someone.' | The player’s original judgement invites a pointed defence; it has more bite than V1’s neutral observation. |

**Existing state/slot:** Same ordered guards as the current expression. character:cassian; question → ask:n:cassian, personal → personal:n:cassian. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:160](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:160>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1763>)

<a id="r91"></a>

### R91 — Cassian — reply

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'I am eager to have a position. There is a difference. You may decide you prefer a bargain of your own.' | > I am willing to be needed. That is not the same as enjoying the debt. | 'I am eager to have a position. There is a difference. You may decide you prefer a bargain of your own.' | ‘I am eager to have a position’ corrects the player’s condescension. V1’s explanation of debt is flatter. |

**Existing state/slot:** Same ordered guards as the current expression. character:cassian; question → ask:n:cassian, personal → personal:n:cassian. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:160](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:160>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1781>)

<a id="r92"></a>

### R92 — Sabine — opening

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| root?'You are getting used to lending keys. The awkward part comes when you ask for them back.':d.result!=='open'?'The work is already public. Taking back the keys cannot undo it. It can still settle who is welcome tomorrow.':'Everyone asks who will protect them. Try asking who that person must answer to. It saves time later.' | - Investigator root present: “They needed your permission. Notice how carefully they explained why you should give it.”<br>- Otherwise published: “The account is public. You can decide who stays welcome. You cannot decide who has already benefited.”<br>- Otherwise: “You have heard what protection costs. Ask who gets to change the price.” | root?'You are getting used to lending keys. The awkward part comes when you ask for them back.':d.result!=='open'?'The work is already public. Taking back the keys cannot undo it. It can still settle who is welcome tomorrow.':'Everyone asks who will protect them. Try asking who that person must answer to. It saves time later.' | The original lending-keys observation and advice about whom protectors answer to are specific to her political intelligence. |

**Existing state/slot:** Same ordered guards as the current expression. character:sabine; question → ask:n:sabine, personal → personal:n:sabine. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:162](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:162>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1801>)

<a id="r93"></a>

### R93 — Sabine — question

**KEEP ORIGINAL** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'Can I shut out one person without losing another?' | > What would taking back my permission actually cost? | 'Can I shut out one person without losing another?' | This is the right question for the character who understands interdependence. |

**Existing state/slot:** Same ordered guards as the current expression. character:sabine; question → ask:n:sabine, personal → personal:n:sabine. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:162](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:162>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1821>)

<a id="r94"></a>

### R94 — Sabine — answer

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| root?'Your investigator and any assistant using their invitation depend on your Library key. Close that invitation and both lose that route. A separate promise from Marius, Lucien or Seraphine remains separate.':'Yes, if their arrangements really are separate. My sponsorship of Cassian depends on Marius, not on your Library. Do not confuse a person with a single chain of favours.' | - Investigator root present: “Your investigator’s access, and the assistant’s route through it. Not a separate promise from a patron. Be exact about what you are withdrawing.”<br>- Otherwise: “That depends on what it supports. My sponsorship of Cassian depends on Marius, not your Library. Disliking the beneficiary does not put you in charge of the promise.” | root?'Your investigator and any assistant using their invitation depend on your Library key. Close that invitation and both lose that route. A separate promise from Marius, Lucien or Seraphine remains separate.':'Yes, if their arrangements really are separate. My sponsorship of Cassian depends on Marius, not on your Library. Do not confuse a person with a single chain of favours.' | Her original distinction is the substance the player came to ask about. Keep it here rather than repeating it in every greeting. |

**Existing state/slot:** Same ordered guards as the current expression. character:sabine; question → ask:n:sabine, personal → personal:n:sabine. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:162](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:162>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1839>)

<a id="r95"></a>

### R95 — Sabine — personal

**KEEP ORIGINAL** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'Whose side are you on?' | > Whom are you protecting in this? | 'Whose side are you on?' | ‘Whose side are you on?’ has interpersonal pressure; V1 already suggests the answer. |

**Existing state/slot:** Same ordered guards as the current expression. character:sabine; question → ask:n:sabine, personal → personal:n:sabine. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:162](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:162>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1858>)

<a id="r96"></a>

### R96 — Sabine — reply

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| 'I sponsor Cassian when my own position permits it. That is an answer, even if it is not the answer you hoped for.' | > Cassian, when my authority permits it. You wanted an answer, not a profession of affection. | 'I sponsor Cassian when my own position permits it. That is an answer, even if it is not the answer you hoped for.' | ‘That is an answer’ refuses a demand for reassurance. V1’s profession of affection is a less natural flourish. |

**Existing state/slot:** Same ordered guards as the current expression. character:sabine; question → ask:n:sabine, personal → personal:n:sabine. Active campaign; no new branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:162](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:162>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1876>)

<a id="r99"></a>

### R99 — petition_marius — composed negotiation

**REWRITE V2** · Dialogue + terms.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| ['Take the appointment before Cassian does. Fulfil my work, and you may shelter under my authority. Until I issue the invitation at dawn, you have only my offer.','This takes tonight’s action. Finish service on Night Four or Five, directly or through Mirelle’s completed work. Otherwise Marius withdraws his protection at the sixth reckoning.'] | > Take the appointment, and undertake the service. My protection must still be granted at the reckoning. Until then, you have an offer.<br><br>Visible detail unchanged:<br><br>> This takes tonight’s action. Finish service on Night Four or Five, directly or through Mirelle’s completed work. Otherwise Marius withdraws his protection at the sixth reckoning. | MARIUS: “Take the appointment. Do the work. You need not plead with me each evening for what you have undertaken to earn. But understand this before you accept: I will expect the obligation fulfilled.”<br>Retain the original visible terms, including later confirmed grant, Nights Four–Five service, Mirelle’s alternative fulfilment, sixth-reckoning dismissal and the possible final demand. | He makes service sound like a dignified alternative to pleading, while the interface preserves its danger. |

**Existing state/slot:** action:petition_marius; same availability. Withdrawal uses existing result branch.

**V2 placement:** Replace the whole composed action:petition_marius opening. Do not repeat character:marius. Dialogue is an offer before the NPC grant, not a claim of current shelter.

[src/livingCourt.ts:172](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:172>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1941>)

<a id="r100"></a>

### R100 — fulfil_service — composed negotiation

**KEEP V1** · Dialogue + terms.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| ['Finish the work you promised me. I will keep my protection, but do not mistake a place in my House for independence.','This takes tonight’s action and 1 Blood. Completes your outstanding service.'] | > You undertook the work. Finish it. I value an obligation honoured more than an apology well delivered.<br><br>Visible detail unchanged:<br><br>> This takes tonight’s action and 1 Blood. Completes your outstanding service. | > You undertook the work. Finish it. I value an obligation honoured more than an apology well delivered.<br><br>Visible detail unchanged:<br><br>> This takes tonight’s action and 1 Blood. Completes your outstanding service. | The V1 distinction between completed work and an elegant apology sounds like Marius and does not invent an outcome. |

**Existing state/slot:** action:fulfil_service; same availability. Withdrawal uses existing result branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:174](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:174>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1963>)

<a id="r102"></a>

### R102 — broker_passage — composed negotiation

**REWRITE V2** · Dialogue + terms.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| ['I can open the passage at dawn. It will shelter you until Night Six begins, no longer. You must find a lasting arrangement before then.','This takes tonight’s action. For lasting protection on this route, begin Dorian’s research on Night Four and allow it to finish on Night Five.'] | > A way out, not a permanent escape. If I grant the passage at dawn, it shelters you only until Night Six begins.<br><br>Visible detail unchanged:<br><br>> This takes tonight’s action. For lasting protection on this route, begin Dorian’s research on Night Four and allow it to finish on Night Five. | LUCIEN: “Until Night Six, if I grant it. Not forever. You look disappointed. Would a longer promise make you safer if I could not honour it?”<br>Retain all original visible action, grant-confirmation and Dorian-timing terms. | Let Lucien sell the usefulness of a limited offer instead of apologizing for it. |

**Existing state/slot:** action:broker_passage; same availability. Withdrawal uses existing result branch.

**V2 placement:** action:broker_passage; existing offer eligibility. No new price or transfer.

[src/livingCourt.ts:182](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:182>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2008>)

<a id="r98"></a>

### R98 — investigate_title — composed negotiation

**KEEP V1** · Dialogue + terms.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| ['Put your existing independent Library claim before Seraphine. It opens her sanctuary offer; it does not give shelter.','This takes tonight’s action and 1 Blood. Accept sanctuary separately by the end of Night Three.'] | > It is already your Library. Let us make that claim the reason Seraphine hears you.<br><br>Visible detail unchanged:<br><br>> This takes tonight’s action and 1 Blood. Accept sanctuary separately by the end of Night Three. | > It is already your Library. Let us make that claim the reason Seraphine hears you.<br><br>Visible detail unchanged:<br><br>> This takes tonight’s action and 1 Blood. Accept sanctuary separately by the end of Night Three. | A concise transition is appropriate for this preparatory action; it need not become another confrontation. |

**Existing state/slot:** action:investigate_title; same availability. Withdrawal uses existing result branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:168](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:168>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1919>)

<a id="r101"></a>

### R101 — withdraw_library — composed negotiation

**KEEP ORIGINAL** · Dialogue + terms.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| ['Ask for my key, and my assistant loses this invitation too. If our work is unfinished, it stops here.','This takes tonight’s action. Published findings, your Library ownership, sanctuary and separate patron protection remain.'] | - Open result: “Then we stop here. Take back my permission, and my assistant loses this way into the Library too.”<br>- Published result: “You can have the permission back. The account has already reached its patron.”<br><br>Visible detail unchanged:<br><br>> This takes tonight’s action. Published findings, your Library ownership, sanctuary and separate patron protection remain. | ['Ask for my key, and my assistant loses this invitation too. If our work is unfinished, it stops here.','This takes tonight’s action. Published findings, your Library ownership, sanctuary and separate patron protection remain.'] | ‘The work is already out. If you want the keys back, say so’ is better than a new generic refusal. Keep both original opening variants and exact terms, but use each opening once. |

**Existing state/slot:** action:withdraw_library; same availability. Withdrawal uses existing result branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:180](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:180>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1985>)

<a id="r103"></a>

### R103 — feed — composed negotiation

**KEEP ORIGINAL** · Dialogue + terms.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| ['Hunting restores 4 Blood, up to 12. Tonight’s upkeep still applies.','This takes tonight’s action. Hunting grants no political protection.'] | > The court can wait for an answer. Your hunger cannot.<br><br>Visible detail replaces the split explanatory strings:<br><br>> One nightly action. Restore 4 Blood, up to 12. Dawn upkeep and every deadline still apply. Feeding grants no protection. | ['Hunting restores 4 Blood, up to 12. Tonight’s upkeep still applies.','This takes tonight’s action. Hunting grants no political protection.'] | ‘There are arguments you can postpone. Hunger is not one of them’ has rhythm without making feeding a different mechanic. |

**Existing state/slot:** action:feed; same availability. Withdrawal uses existing result branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:184](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:184>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2030>)

<a id="r104"></a>

### R104 — rest — composed negotiation

**KEEP V1** · Dialogue + terms.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| ['Rest restores 2 Blood, up to 12, while the Crypt remains open to you.','This takes tonight’s action. Vesper’s deadline is unchanged.'] | > For now, the Crypt admits you. Take what rest it permits.<br><br>Visible detail replaces the split explanatory strings:<br><br>> One nightly action. Restore 2 Blood, up to 12. Requires Crypt access. Vesper’s deadline and dawn upkeep remain unchanged. | > For now, the Crypt admits you. Take what rest it permits.<br><br>Visible detail replaces the split explanatory strings:<br><br>> One nightly action. Restore 2 Blood, up to 12. Requires Crypt access. Vesper’s deadline and dawn upkeep remain unchanged. | Crypt access can survive through an independent right. V1 avoids crediting all present access to Vesper. |

**Existing state/slot:** action:rest; same availability. Withdrawal uses existing result branch.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:186](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:186>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2052>)

<a id="r97"></a>

### R97 — Current Living Court active action negotiation opening selector

**KEEP V1** · Presentation composition.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| voices[speaker].opening | Use the action-specific single line specified here or in the samples. Do not prepend the character introduction. Legacy/demoted actions retain their current fallback. | Use the action-specific single line specified here or in the samples. Do not prepend the character introduction. Legacy/demoted actions retain their current fallback. | Removing the repeated character greeting is a structural gain. Apply only the separately approved per-action lines, with original fallback for untouched actions. |

**Existing state/slot:** Current Living Court active action negotiation opening selector

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:212](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:212>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1901>)

<a id="r166"></a>

### R166 — All generated court reaction scenes

**KEEP V1** · Presentation composition.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| terms:[u.text,politicalRelationship(r,u.actor)] | Retain only politicalRelationship(r,u.actor) in this terms list. The exact proposed narration remains in the dialogue body; do not duplicate it. | Retain only politicalRelationship(r,u.actor) in this terms list. The exact proposed narration remains in the dialogue body; do not duplicate it. | The same narrator paragraph should not appear again in terms. Retain separate current relationship information and all material detail. |

**Existing state/slot:** All generated court reaction scenes

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/reactiveCourt.ts:198](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:198>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3227>)

<a id="r167"></a>

### R167 — Historical correspondence caption

**KEEP V1** · Consequence framing.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Correspondence from Night ${u.night+1}. Your current standing is shown above. | > Recorded on Night {u.night+1}. Present rights are shown separately. | > Recorded on Night {u.night+1}. Present rights are shown separately. | A dated act and current standing need separate framing. This is useful factual copy, not a creative flourish. |

**Existing state/slot:** Existing known-night correspondence branch; unknown-night fallback retained.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/reactiveCourt.ts:198](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:198>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3245>)

<a id="r146"></a>

### R146 — reactionReply — Vesper revoke; confirmed only

**REWRITE V2** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| The three nights are over. I have taken back my invitation. You may dislike the decision; you cannot say I concealed it. | > The three nights are over. I have withdrawn my invitation. I did not ask you to like the warning. I asked you to use it. | I have withdrawn my invitation. You are still my descendant. I will not let you make those the same promise. | Her last defence should sting. Do not pretend that a revoked root necessarily closes every route into the Crypt. |

**Existing state/slot:** reactionReply — Vesper revoke; confirmed only

**V2 placement:** Existing confirmed revoke reaction only; narrator retains its current-access fork. No claim of a newly discovered emotion or invented betrayal.

[src/reactiveCourt.ts:238](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:238>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2861>)

<a id="r147"></a>

### R147 — reactionReply — Marius dismiss

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| I kept a place for you. You left the work undone. I have withdrawn that promise. Whatever you arranged elsewhere is your affair. | > You accepted the place and left the service unfinished. I have withdrawn my protection. I will not call that a misunderstanding. | I kept a place for you. You left the work undone. I have withdrawn that promise. Whatever you arranged elsewhere is your affair. | The original makes an accusation tied to a specific unfulfilled obligation. It needs no embellishment. |

**Existing state/slot:** reactionReply — Marius dismiss

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/reactiveCourt.ts:240](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:240>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2879>)

<a id="r153"></a>

### R153 — reactionReply — Mirelle research confirmed

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Finished. Marius has the account. You can close the Library tomorrow, but he will still have read it. | > Delivered to Marius. You gave me the work; I finished it. | Finished. Marius has the account. You can close the Library tomorrow, but he will still have read it. | ‘He will still have read it’ makes irreversibility concrete and gives Mirelle satisfaction. |

**Existing state/slot:** reactionReply — Mirelle research confirmed

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/reactiveCourt.ts:246](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:246>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2987>)

<a id="r154"></a>

### R154 — reactionReply — Dorian research confirmed

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Lucien has the finished account. Mirelle will not like losing the race. That does not make the work any less finished. | > Delivered to Lucien. Mirelle’s commission will not decide this result. | Lucien has the finished account. Mirelle will not like losing the race. That does not make the work any less finished. | His original imagined irritation from Mirelle is character opinion, not hidden affinity. It is livelier than V1’s delivery notice. |

**Existing state/slot:** reactionReply — Dorian research confirmed

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/reactiveCourt.ts:246](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:246>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3005>)

<a id="r143"></a>

### R143 — reactionReply — withdraw, speaker published

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| You wanted the work. You have it. Now you want the key back. Very well. Let us be precise about which part of our arrangement is over. | > You have the account. You are taking back the permission. I understand the distinction. | You wanted the work. You have it. Now you want the key back. Very well. Let us be precise about which part of our arrangement is over. | The original carefully separates the parts of a relationship the player is ending. Its irritation is earned by the recorded withdrawal. |

**Existing state/slot:** reactionReply — withdraw, speaker published

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/reactiveCourt.ts:230](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:230>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2807>)

<a id="r144"></a>

### R144 — reactionReply — withdraw, speaker did not publish

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| I have your answer. The work stops here. If you invite someone else, at least let them finish before you change your mind again. | > You withdrew permission before we finished. There is no completed account to give you. | I have your answer. The work stops here. If you invite someone else, at least let them finish before you change your mind again. | The impatience is believable and attaches to the actual interruption, not a new penalty. |

**Existing state/slot:** reactionReply — withdraw, speaker did not publish

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/reactiveCourt.ts:230](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:230>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2825>)

<a id="r156"></a>

### R156 — reactionReply — Lucien archive_protect confirmed

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Dorian delivered. I have made my promise without a deadline this time. It is my promise, not something you borrowed from his key. | > Dorian delivered. I made a promise without a deadline. Do remember whose promise it is. | Dorian delivered. I have made my promise without a deadline this time. It is my promise, not something you borrowed from his key. | The original combines pleasure in extending the promise with a reminder of its issuer. Present standing remains separate on historical review. |

**Existing state/slot:** reactionReply — Lucien archive_protect confirmed

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/reactiveCourt.ts:248](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:248>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3041>)

<a id="r157"></a>

### R157 — reactionReply — Marius appoint player

**KEEP ORIGINAL** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| The place is yours. I expect the work by the end of the fifth night. You need not thank me repeatedly; doing it will suffice. | > I granted the place for service due by the end of Night Five. That was the obligation, not an invitation to thank me. | The place is yours. I expect the work by the end of the fifth night. You need not thank me repeatedly; doing it will suffice. | ‘Doing it will suffice’ is a strong expression of his expectations. V1 turns it into a memo. |

**Existing state/slot:** reactionReply — Marius appoint player

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/reactiveCourt.ts:250](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:250>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3059>)

<a id="r152"></a>

### R152 — reactionReply — Dorian live challenge; existing time/choice guard

**KEEP V1** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| You can still stop Mirelle. Take her key back, then hear me. But count the nights before you decide; changing your mind twice will not give us more of them. | > Stop Mirelle before she publishes, then invite me. Two commitments, not one clever answer. Count the nights before you choose. | > Stop Mirelle before she publishes, then invite me. Two commitments, not one clever answer. Count the nights before you choose. | ‘Two commitments, not one clever answer’ is a crisp dramatic correction to the fantasy of free switching; it preserves the real timing risk. |

**Existing state/slot:** reactionReply — Dorian live challenge; existing time/choice guard

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/reactiveCourt.ts:244](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/reactiveCourt.ts:244>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2969>)

<a id="r182"></a>

### R182 — Accepted lease recap

**REWRITE V2** · Dialogue.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| We have a bargain. Your ${l.property_id==='sanctuary'?'sanctuary':'place in the Lounge'} ${expiryDescription(l.end_night,r.world.night)}. Neither gratitude nor argument will change that date. | > Agreed. Your {sanctuary / place in the Lounge} {expiryDescription(l.end_night, world.night)}. You paid for that time. It is yours to use. | We have a bargain. Your {sanctuary / place in the Lounge} {expiryDescription(l.end_night, world.night)}. No gratitude is required. You met the price. | Seraphine can acknowledge payment with wit without claiming current shelter after expiry. |

**Existing state/slot:** Existing verified accepted-lease recap filter and formatter; no success on pending/failed result.

**V2 placement:** Same accepted-lease recap filter and formatter. ‘Paid’ means the player’s verified prepaid acceptance; it does not say the later rent-claim payout has settled.

[src/livingCourt.ts:374](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:374>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3525>)

<a id="r185"></a>

### R185 — Ending — Blood defeat epilogue

**REWRITE V2** · Consequence narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| You kept count of promises until there was no Blood left to spend. A safe room cannot save a body that cannot reach it. | > Your Blood is gone. Whatever protection you secured, there is nothing left in you to reach the next night. | Your Blood is exhausted. Whatever shelter you held, it could not replace what was gone.<br><br>No title could answer that hunger. No promise could sustain you. | The original risks scolding the player for valuing politics. V1 is terminal but impersonal. End with the resource fact and the limits of power. |

**Existing state/slot:** Ending — Blood defeat epilogue

**V2 placement:** Stored Blood defeat only. Do not imply the player chose a specific political action over feeding.

[src/livingCourt.ts:254](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:254>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3584>)

<a id="r186"></a>

### R186 — Ending — Non-Blood, nonhistorical-Exposure failure epilogue

**REWRITE V2** · Consequence narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| The Library may still bear your name. It is not a refuge. Dawn finds you without the protection you needed. | > Your name remains on a title, not a refuge. At the reckoning, no qualifying shelter stood between you and the daylight. | At the reckoning, no qualifying protection remained. A title to the Library was not a place beyond the daylight.<br><br>That distinction has ended this campaign. What you owned and what you could survive were never quite the same question. | Ownership surviving failure is the tragic contrast; do not add a death scene, regret or a betrayer. |

**Existing state/slot:** Ending — Non-Blood, nonhistorical-Exposure failure epilogue

**V2 placement:** Existing non-Blood/nonhistorical-Exposure failure branch only; the separately displayed stored reason determines early shelter loss versus final qualification. Do not use for voluntary Quit.

[src/livingCourt.ts:254](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:254>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3602>)

<a id="r192"></a>

### R192 — Ending — existing revoked court-grant branch; do not infer a specific motive from the revocation alone

**KEEP V1** · Consequence narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| You left Marius’s work unfinished. He withdrew his promise; any separate shelter had to carry you. | > Marius’s service remained unfinished. A court grant to you was withdrawn; any surviving shelter was separate. | > Marius’s service remained unfinished. A court grant to you was withdrawn; any surviving shelter was separate. | V1 removes an unproven causal claim; an arbitrary revoked court grant does not establish why Marius acted. |

**Existing state/slot:** Ending — existing revoked court-grant branch; do not infer a specific motive from the revocation alone

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:72](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:72>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3710>)

<a id="r200"></a>

### R200 — Ending — rejected final result; include silence, do not assert player explicitly refused

**KEEP V1** · Consequence narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Marius withdrew his protection at the final confrontation. Your refusal or rejected proposal did not cancel independent shelter. | > Marius withdrew his protection at the final reckoning. Refusal, silence or a rejected proposal did not cancel independent shelter. | > Marius withdrew his protection at the final reckoning. Refusal, silence or a rejected proposal did not cancel independent shelter. | V1 includes the unanswered-demand path rather than attributing an explicit refusal. |

**Existing state/slot:** Ending — rejected final result; include silence, do not assert player explicitly refused

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:88](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:88>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3854>)

<a id="r201"></a>

### R201 — Ending — rejected counter with matching effective temporary invitation

**KEEP V1** · Consequence narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| The two-night invitation you offered Marius still stands, although he rejected the bargain. It is temporary access, not ownership. | > Marius rejected the bargain. The two-night Library invitation you gave him still stands. He gained entry, not ownership. | > Marius rejected the bargain. The two-night Library invitation you gave him still stands. He gained entry, not ownership. | The surviving invitation must remain unmistakable despite the rejected bargain. |

**Existing state/slot:** Ending — rejected counter with matching effective temporary invitation

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:89](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:89>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3872>)

<a id="r111"></a>

### R111 — Night 7 Feed warning only when the existing finalDemand is true and no response is recorded; otherwise retain current sentence.

**KEEP V1** · Consequence warning.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| No nightly action will remain for another commitment. | > No nightly action will remain for another commitment. Leaving Marius unanswered also costs his protection at this reckoning. | > No nightly action will remain for another commitment. Leaving Marius unanswered also costs his protection at this reckoning. | The existing political cost of silence belongs beside a final-reckoning warning; do not hide it for drama. |

**Existing state/slot:** Night 7 Feed warning only when the existing finalDemand is true and no response is recorded; otherwise retain current sentence.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/blood.ts:44](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/blood.ts:44>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2187>)

<a id="r205"></a>

### R205 — lease:0 rejection in current Living Court only; retain legacy one-action label outside Library mode.

**KEEP V1** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Reject standing lease · signed, one action | > Reject standing lease · signed, no nightly action | > Reject standing lease · signed, no nightly action | The label must match the existing no-action rejection in this mode. |

**Existing state/slot:** lease:0 rejection in current Living Court only; retain legacy one-action label outside Library mode.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/encounters.ts:101](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/encounters.ts:101>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3962>)

<a id="r206"></a>

### R206 — Diagnostics; finite passage mandate feature.

**KEEP V1** · Technical accuracy.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| NPC purchasing treasuries are not implemented. | > Cassian has one bounded, prepaid passage allowance. General NPC purchasing treasuries are not implemented. | > Cassian has one bounded, prepaid passage allowance. General NPC purchasing treasuries are not implemented. | A narrow factual correction, never fictionalized. |

**Existing state/slot:** Diagnostics; finite passage mandate feature.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/GameInspection.tsx:41](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/GameInspection.tsx:41>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3980>)

<a id="r207"></a>

### R207 — Diagnostics shared renderer; preserve the existing runtime proof/network indicator.

**KEEP V1** · Technical accuracy.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Local development signing. No public wallet or LLM activation. | > Signing is handled by the game runtime. The default NPC policy does not use live LLM dialogue. | > Signing is handled by the game runtime. The default NPC policy does not use live LLM dialogue. | Remove an inaccurate local-only claim; keep this outside the creative dialogue pass. |

**Existing state/slot:** Diagnostics shared renderer; preserve the existing runtime proof/network indicator.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/GameInspection.tsx:41](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/GameInspection.tsx:41>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3998>)

<a id="r47"></a>

### R47 — Chapter 1 base paragraph

**REWRITE V2** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| You are newly awakened. Vesper is your sire, but the Library belongs to you. In three nights she will close the Crypt. Find somewhere the daylight cannot reach you. These seven nights will decide whether you endure on your own terms or under a patron. | > Vesper has given you three nights. Seraphine offers paid sanctuary; Marius offers a place in return for service. Before you can choose how to live, you need somewhere to survive. | Vesper has given you a deadline. The Library belongs to you, but it cannot shelter you. Before the third dawn, someone else’s offer must become more than an offer. | Give this night a distinct pressure without asserting that a conditional offer, publication or revocation has occurred. |

**Existing state/slot:** Same chapterSituation base branch; existing urgent/state-specific overrides take precedence.

**V2 placement:** Same CHAPTERS base slot. chapterSituation factual suffixes and final-demand override retain precedence. Night 3 text is an approaching-intent line, never a completed-event reaction.

[src/livingCourt.ts:17](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:17>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:935>)

<a id="r50"></a>

### R50 — Chapter 2 base paragraph

**REWRITE V2** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Seraphine offers a bargain with a limit. Marius offers a place with a duty. Lucien offers time. None of them can choose for you, and none will keep an offer open forever. | > The offers are different. So are the people who will benefit if you accept. Vesper’s deadline is nearer. | Listen for what each bargain asks you to depend on. Seraphine names a price. Marius names an obligation. Lucien offers time. None is offering the same escape. | Give this night a distinct pressure without asserting that a conditional offer, publication or revocation has occurred. |

**Existing state/slot:** Same chapterSituation base branch; existing urgent/state-specific overrides take precedence.

**V2 placement:** Same CHAPTERS base slot. chapterSituation factual suffixes and final-demand override retain precedence. Night 3 text is an approaching-intent line, never a completed-event reaction.

[src/livingCourt.ts:19](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:19>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:991>)

<a id="r53"></a>

### R53 — Chapter 3 base paragraph

**REWRITE V2** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Tonight Vesper means to close her door. It will not make the Library hers. Owning that room, though, will not keep the sun from your body. | > Tonight Vesper means to withdraw her invitation. Whatever you arranged elsewhere must now be enough. | Tonight, Vesper's promise ends. By dawn, whatever protection you have secured elsewhere must be enough. | Give this night a distinct pressure without asserting that a conditional offer, publication or revocation has occurred. |

**Existing state/slot:** Same chapterSituation base branch; existing urgent/state-specific overrides take precedence.

**V2 placement:** Same CHAPTERS base slot. chapterSituation factual suffixes and final-demand override retain precedence. Night 3 text is an approaching-intent line, never a completed-event reaction.

[src/livingCourt.ts:21](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:21>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1047>)

<a id="r56"></a>

### R56 — Chapter 4 base paragraph

**REWRITE V2** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Now the petitions come to you. Mirelle wants to put the Library to work for Marius. Dorian wants Lucien to benefit instead. They need your leave, and each intends to bring someone with them. | > Now others need your permission. Mirelle wants the Library to serve Marius. Dorian wants it to serve Lucien. Neither can begin without you. | The Library is yours, and now someone wants something from you. Mirelle and Dorian intend to put it to different uses. Neither can proceed on good intentions alone. | Give this night a distinct pressure without asserting that a conditional offer, publication or revocation has occurred. |

**Existing state/slot:** Same chapterSituation base branch; existing urgent/state-specific overrides take precedence.

**V2 placement:** Same CHAPTERS base slot. chapterSituation factual suffixes and final-demand override retain precedence. Night 3 text is an approaching-intent line, never a completed-event reaction.

[src/livingCourt.ts:23](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:23>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1103>)

<a id="r59"></a>

### R59 — Chapter 5 base paragraph

**REWRITE V2** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| There is a difference between letting someone read and letting their findings leave the room. Once the work is published, closing the Library cannot call it back. | > An unfinished account can still be stopped. A published one cannot be recalled. Decide what you want your permission to accomplish. | The question is no longer only who may enter. It is who will receive what leaves the Library—and whether you are still in time to stop it. | Give this night a distinct pressure without asserting that a conditional offer, publication or revocation has occurred. |

**Existing state/slot:** Same chapterSituation base branch; existing urgent/state-specific overrides take precedence.

**V2 placement:** Same CHAPTERS base slot. chapterSituation factual suffixes and final-demand override retain precedence. Night 3 text is an approaching-intent line, never a completed-event reaction.

[src/livingCourt.ts:25](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:25>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1159>)

<a id="r62"></a>

### R62 — Chapter 6 base paragraph

**REWRITE V2** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| There is just enough time to begin one last investigation and let it finish tomorrow. There is not enough time to change your mind twice. Keep yourself alive while you decide which promises deserve another night. | > One night remains after this. An unfinished bargain is not protection; an unfinished investigation is not a published account. | Tomorrow is the final night. Take account of what still stands, what is unfinished, and what is no longer yours to undo. | Give this night a distinct pressure without asserting that a conditional offer, publication or revocation has occurred. |

**Existing state/slot:** Same chapterSituation base branch; existing urgent/state-specific overrides take precedence.

**V2 placement:** Same CHAPTERS base slot. chapterSituation factual suffixes and final-demand override retain precedence. Night 3 text is an approaching-intent line, never a completed-event reaction.

[src/livingCourt.ts:27](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:27>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1215>)

<a id="r65"></a>

### R65 — Chapter 7 base paragraph

**REWRITE V2** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| This is the final night of the campaign. If research is still running, you can let it finish or stop it. If it is published, you can reclaim the keys or leave your allies welcome. Whatever you choose, you must survive the dawn. | > This is the last night. The court will act once more. Choose what you are willing to leave standing—and keep enough Blood to reach the dawn. | The court has one reckoning left in this campaign. Not every promise needs a new answer. Some do. You must decide which arrangements you are prepared to finish with. | Give this night a distinct pressure without asserting that a conditional offer, publication or revocation has occurred. |

**Existing state/slot:** Same chapterSituation base branch; existing urgent/state-specific overrides take precedence.

**V2 placement:** Same CHAPTERS base slot. chapterSituation factual suffixes and final-demand override retain precedence. Night 3 text is an approaching-intent line, never a completed-event reaction.

[src/livingCourt.ts:29](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:29>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1271>)

<a id="r66"></a>

### R66 — discovery:0 — shorter hub

**KEEP V1** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| You are newly awakened. Vesper is your sire, but the Library belongs to you. In three nights she will close the Crypt. Find somewhere the daylight cannot reach you. These seven nights will decide whether you endure on your own terms or under a patron. | > Hear Seraphine’s price. Hear what Marius expects. Neither conversation commits you. | > Hear Seraphine’s price. Hear what Marius expects. Neither conversation commits you. | A short navigation prompt avoids replaying the incident. Keep urgent factual suffixes and the final-demand override. |

**Existing state/slot:** Exact current base paragraph is the quoted chapter text, with chapterSituation’s existing suffixes. Replace only the discovery base; retain urgent suffixes and final-demand override.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:17](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:17>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1294>)

<a id="r67"></a>

### R67 — discovery:1 — shorter hub

**KEEP V1** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Seraphine offers a bargain with a limit. Marius offers a place with a duty. Lucien offers time. None of them can choose for you, and none will keep an offer open forever. | > Ask what each offer leaves in the other person’s hands. | > Ask what each offer leaves in the other person’s hands. | A short navigation prompt avoids replaying the incident. Keep urgent factual suffixes and the final-demand override. |

**Existing state/slot:** Exact current base paragraph is the quoted chapter text, with chapterSituation’s existing suffixes. Replace only the discovery base; retain urgent suffixes and final-demand override.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:19](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:19>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1312>)

<a id="r68"></a>

### R68 — discovery:2 — shorter hub

**KEEP V1** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Tonight Vesper means to close her door. It will not make the Library hers. Owning that room, though, will not keep the sun from your body. | > Ask what is still available before you spend this night. | > Ask what is still available before you spend this night. | A short navigation prompt avoids replaying the incident. Keep urgent factual suffixes and the final-demand override. |

**Existing state/slot:** Exact current base paragraph is the quoted chapter text, with chapterSituation’s existing suffixes. Replace only the discovery base; retain urgent suffixes and final-demand override.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:21](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:21>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1330>)

<a id="r69"></a>

### R69 — discovery:3 — shorter hub

**KEEP V1** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Now the petitions come to you. Mirelle wants to put the Library to work for Marius. Dorian wants Lucien to benefit instead. They need your leave, and each intends to bring someone with them. | > Hear whom each investigator intends to serve. | > Hear whom each investigator intends to serve. | A short navigation prompt avoids replaying the incident. Keep urgent factual suffixes and the final-demand override. |

**Existing state/slot:** Exact current base paragraph is the quoted chapter text, with chapterSituation’s existing suffixes. Replace only the discovery base; retain urgent suffixes and final-demand override.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:23](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:23>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1348>)

<a id="r70"></a>

### R70 — discovery:4 — shorter hub

**KEEP V1** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| There is a difference between letting someone read and letting their findings leave the room. Once the work is published, closing the Library cannot call it back. | > Hear what has changed before deciding whether the work continues. | > Hear what has changed before deciding whether the work continues. | A short navigation prompt avoids replaying the incident. Keep urgent factual suffixes and the final-demand override. |

**Existing state/slot:** Exact current base paragraph is the quoted chapter text, with chapterSituation’s existing suffixes. Replace only the discovery base; retain urgent suffixes and final-demand override.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:25](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:25>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1366>)

<a id="r71"></a>

### R71 — discovery:5 — shorter hub

**KEEP V1** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| There is just enough time to begin one last investigation and let it finish tomorrow. There is not enough time to change your mind twice. Keep yourself alive while you decide which promises deserve another night. | > Ask about the position you have now, not the offer you remember. | > Ask about the position you have now, not the offer you remember. | A short navigation prompt avoids replaying the incident. Keep urgent factual suffixes and the final-demand override. |

**Existing state/slot:** Exact current base paragraph is the quoted chapter text, with chapterSituation’s existing suffixes. Replace only the discovery base; retain urgent suffixes and final-demand override.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:27](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:27>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1384>)

<a id="r72"></a>

### R72 — discovery:6 — shorter hub

**KEEP V1** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| This is the final night of the campaign. If research is still running, you can let it finish or stop it. If it is published, you can reclaim the keys or leave your allies welcome. Whatever you choose, you must survive the dawn. | > Hear the people whose promises still matter. | > Hear the people whose promises still matter. | A short navigation prompt avoids replaying the incident. Keep urgent factual suffixes and the final-demand override. |

**Existing state/slot:** Exact current base paragraph is the quoted chapter text, with chapterSituation’s existing suffixes. Replace only the discovery base; retain urgent suffixes and final-demand override.

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:29](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:29>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1402>)

<a id="r73"></a>

### R73 — n=5, published result

**KEEP V1** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| The work is public. There is no second investigation to sell to a different patron. Decide who may keep using your Library, and whether you can afford another night without feeding. | > The account is public. Its beneficiary has been chosen. What remains is who keeps your permission—and whether you can afford another night without feeding. | > The account is public. Its beneficiary has been chosen. What remains is who keeps your permission—and whether you can afford another night without feeding. | A state-specific clarification that earns its plainness; it must not advertise unavailable research. |

**Existing state/slot:** n=5, published result

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:102](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:102>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1425>)

<a id="r74"></a>

### R74 — effective chosen root, result open; preserve leading separator

**KEEP V1** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
|  The investigation is still unfinished. Closing the Library now stops it. | > The account is unfinished. Let the investigators continue, or withdraw the permission they still need. | > The account is unfinished. Let the investigators continue, or withdraw the permission they still need. | A state-specific clarification that earns its plainness; it must not advertise unavailable research. |

**Existing state/slot:** effective chosen root, result open; preserve leading separator

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:110](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:110>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1443>)

<a id="r75"></a>

### R75 — n=6, no root and no published result; preserve leading separator

**KEEP V1** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
|  No investigation is running. Earlier choices have left no time to begin another. | > No investigation is running. It is too late to begin one now. | > No investigation is running. It is too late to begin one now. | A state-specific clarification that earns its plainness; it must not advertise unavailable research. |

**Existing state/slot:** n=6, no root and no published result; preserve leading separator

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:110](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:110>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1461>)

<a id="r76"></a>

### R76 — no root, open result, before final night; preserve leading separator

**KEEP V1** · Narration.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
|  Neither investigator currently has your lasting invitation to the Library. | > Neither investigator has your invitation. Only the offers still available can change that. | > Neither investigator has your invitation. Only the offers still available can change that. | A state-specific clarification that earns its plainness; it must not advertise unavailable research. |

**Existing state/slot:** no root, open result, before final night; preserve leading separator

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:110](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:110>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1479>)

<a id="r35"></a>

### R35 — final-demand → corresponding existing action inspection

**KEEP V1** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Keep his protection: give a standing invitation | > Keep his protection. Give Marius entry without expiry. | > Keep his protection. Give Marius entry without expiry. | The inspection label makes the concrete intention visible. Dialogue can apply pressure; the option should not obscure the consequence. |

**Existing state/slot:** final-demand → corresponding existing action inspection

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:319](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:319>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:684>)

<a id="r36"></a>

### R36 — final-demand → corresponding existing action inspection

**KEEP V1** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Refuse and face the loss of his protection | > Refuse. Lose his protection at dawn. | > Refuse. Lose his protection at dawn. | The inspection label makes the concrete intention visible. Dialogue can apply pressure; the option should not obscure the consequence. |

**Existing state/slot:** final-demand → corresponding existing action inspection

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:319](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:319>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:702>)

<a id="r37"></a>

### R37 — final-demand → corresponding existing action inspection

**KEEP V1** · Choice wording.

| Original | Proposal V1 | Recommended V2 | Reason |
|---|---|---|---|
| Propose a limited inspection using the published account | > Offer two nights of entry—even if he refuses. | > Offer two nights of entry—even if he refuses. | The inspection label makes the concrete intention visible. Dialogue can apply pressure; the option should not obscure the consequence. |

**Existing state/slot:** final-demand → corresponding existing action inspection

**V2 placement:** Same slot and ordered guards; unmentioned branches retain original wording.

[src/livingCourt.ts:319](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/src/livingCourt.ts:319>) · [Exact V1 entry](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:720>)

## C. Five complete showcase sequences

These are readable play paths through existing scenes, not scripts for new cutscenes. A stated sample condition selects its opening; the other exact branches remain in B/D. Questions are free and repeatable. Exploration of an offer is not its commitment. Stage directions below describe navigation or verification, not new visual effects.

### 1. Prologue → Vesper’s ultimatum

**Prologue panel 1 — A borrowed shelter**

NARRATOR: “The Crypt keeps the daylight out. Vesper is your sire, and for now she permits you to sleep there. Tonight, she has a limit to put on that permission.”

**Panel 2 — House Volari**

NARRATOR: “Here, a promise can open a door. A debt can close it. Marius presides over the court, where every offer asks something of you in return.”

**Panel 3 — A power of her own**

NARRATOR: “Marius and Seraphine founded House Volari together. But hers is a power of her own. If you seek shelter at her table, it will be on her terms.”

**Panel 4 — Three nights**

NARRATOR: “At the third reckoning, Vesper will withdraw her Crypt invitation. You have seven nights to survive—and three to find another refuge.”

**Night 1 — ultimatum; Crypt accessible**

VESPER: “I made you one of us. I did not promise you a place beside me forever. You have 3 more nights in my Crypt. Then you must find another roof.”

NARRATOR: “Before the third dawn, find another refuge. Seraphine will sell sanctuary. Marius wants service. The Library cannot shelter you.”

PLAYER, free navigation:

- “Find out who might help me” → discovery:0. Existing Seraphine/Marius contacts and secondary Lucien contact remain.
- “I want an explanation” → character:vesper.

At character:vesper, the same opening applies; no second authored confrontation is invented. A later implementation should not add a duplicate speech to the existing shared scene.

PLAYER A — “Does being your descendant count for nothing?” → ask:0:vesper.

VESPER: “It makes you my descendant. It does not oblige me to house you forever. Nor does it entitle me to your Library. Tradition has limits; that is why it survives.”

PLAYER B — “Are you trying to make me fail?” → personal:0:vesper.

VESPER: “If I wanted you unprepared, I would have said nothing. Do not turn a warning into a promise that I will relent.”

After either response: “There is something else I want to ask” → character:vesper. Existing return-to-exploration control closes the conversation. No emotional score, reprieve or new option is earned.

**Night 3 variant, before any revocation**

VESPER: “Tonight. You have had time to ask everyone else what they think of me. I trust you have also found a bed.”

**Only after the existing confirmed revoke event**

VESPER: “I have withdrawn my invitation. You are still my descendant. I will not let you make those the same promise.”

NARRATOR, if no Crypt access remains: “Vesper has withdrawn her invitation. The Crypt no longer admits you. Your Library title remains separate; it is not a refuge.”

If another right still admits the player, retain the original alternate narrator: “Vesper has withdrawn her invitation. Another valid right still opens the Crypt. Her decision did not erase it.”

The scene ends with its existing record follow-up. It does not withdraw the right itself.

### 2. Seraphine’s sanctuary — a bargain worth considering

**Sample state:** before Night Four, no effective sanctuary; title filed; offer still eligible. Initial meeting without a filed title uses the original Marius/bargain opening instead.

SERAPHINE: “Your Library really is your own. Good. Now we can discuss a bargain between people with something to lose.”

PLAYER A — “What is the catch?” → ask:n:seraphine; free.

SERAPHINE: “Seven nights of sanctuary, paid in advance: 0.02 NEAR. No refund, no ownership. I cannot take it back once you accept, but it ends. Bring your Library claim or the dossier before Night Four.”

PLAYER B — “And Marius is content with that?” → personal:n:seraphine; free.

SERAPHINE: “Ask him. We founded this House together; we did not become the same person. My rights were mine before our marriage. They still are.”

Either answer offers the existing return question and the same eligible offer. The player can ask both; neither accepts.

PLAYER C — “I want a refuge of my own” → action:sanctuary_pact; inspection.

SERAPHINE: “Marius can decide you have ceased to be useful. Vesper can decide you have stayed long enough. Pay me, and neither decision shortens your sanctuary. Mine cannot either. I find a price agreed in advance saves a great deal of injured feeling.”

**Visible before commitment:**

“One nightly action. Pay 0.02 NEAR from the prepaid campaign treasury, nonrefundable, plus network gas. Seven nights of sanctuary from acceptance; no ownership. An accepted lease cannot be cancelled by Seraphine, Marius or Vesper. Accept before Night Four.”

Retain exact calculated expiry: “Shelter ends at the start of Night {w.night+lease.duration_nights+1} if accepted now; it must still be active after the seventh reckoning.” It is a runtime value, not an extra night added by this proposal.

PLAYER:

- “We have a deal · pay 0.02 NEAR” → existing paid commitment.
- “Consider my other choices” → decision:n; free.
- Existing contextual Feed remains last, with its current action and deadline cost. It is not a free way to preserve the offer.

**Only after verified acceptance, in the existing recap**

SERAPHINE: “We have a bargain. Your sanctuary {expiryDescription(l.end_night, world.night)}. No gratitude is required. You met the price.”

The last sentence acknowledges the player meeting the agreement’s price. It does not claim that Seraphine’s later claim_rent payout has settled.

**Unfiled early branch**

Where the existing offer selector returns investigate_title, the player instead sees “Put my claim before Seraphine” → action:investigate_title.

MIRELLE: “It is already your Library. Let us make that claim the reason Seraphine hears you.”

Visible detail: “This takes tonight’s action and 1 Blood. Accept sanctuary separately by the end of Night Three.”

The existing commit files the claim, not the lease. A subsequent available night is needed for sanctuary. Preserve the late-filing warning and action eligibility; the showcase does not promise this route remains viable on Night Three.

**After the offer closes without sanctuary access**

SERAPHINE: “The offer is closed. I can still listen, but listening will not put a roof over your head.”

No expired offer is reopened. On a paid-refuge branch, retain: “You paid for a refuge. You have one. You may stop thanking me whenever it becomes tiresome.”

### 3. Night 4 — Mirelle and Dorian need something from you

**Sample state:** open research result, no existing investigator root, Night Four. These are two separate contact scenes. The player may hear both without time passing.

**character:mirelle**

MIRELLE: “Marius needs the Library account. I can give him work worth having—if you will let me begin. Dorian will tell you whom that benefits. I assume you can work it out without him.”

PLAYER A — “What will you reveal?” → ask:3:mirelle; free.

MIRELLE: “Who may use the Library. Which obligations reach beyond it. It is an account Marius can act on, not a collection of rumours. If I finish first, Dorian cannot deliver this investigation to Lucien.”

PLAYER B — “Why bring Cassian?” → personal:3:mirelle; free.

MIRELLE: “Because I intend to finish. Cassian is impatient to be useful; I can use impatience. Let me in and I can invite him. Withdraw my permission and his Library access goes with it.”

Both answers rejoin “There is something else I want to ask” and the existing eligible authorization offer.

PLAYER — “Let Mirelle and Cassian do the work” → action:authorize_mirelle; inspection.

MIRELLE: “Give me permission to bring Cassian in. Let us finish, and Marius receives the account. If you mean to stop us, do it before I publish. I will not pretend the work can be unread.”

VISIBLE TERMS:

“One nightly action. Give Mirelle delegable Library entry without expiry; she can invite Cassian. You may revoke her permission and its dependent access. Research needs a later reckoning. Publication cannot be recalled and closes Dorian’s route. The completed account satisfies Marius’s service; his protection still requires his own confirmed grant.”

Keep the existing possible Night Seven Marius demand warning. Confirm with the existing “Let Mirelle and Cassian do the work” command or leave through “Consider my other choices”.

**Alternative: character:dorian**

DORIAN: “Mirelle will make Marius the beneficiary and call it useful work. It will be useful work. That is not the part I object to.”

PLAYER A — “Why should I let Lucien see my records?” → ask:3:dorian; free.

DORIAN: “Because he has an interest outside Marius’s House. Finish the account for Lucien and he has a reason to protect you without a deadline. He must still grant it, and it remains his to withdraw. I am offering a different patron, not a world without them.”

PLAYER B — “Are you accusing Mirelle of something?” → personal:3:dorian; free.

DORIAN: “No. I am telling you whom she means to help. You do not need a secret crime to have conflicting interests.”

Both answers rejoin the parent and eligible authorization offer.

PLAYER — “Back Dorian and Lucien” → action:authorize_dorian; inspection.

DORIAN: “Let me invite Lucien. We finish the account; he gets the benefit. You need not pretend this is neutral. Neither will I.”

VISIBLE TERMS:

“One nightly action. Give Dorian delegable Library entry without expiry; he can invite Lucien. You may revoke that permission and its dependent access. Research needs a later reckoning. Publication cannot be recalled and closes Mirelle’s route. Lucien’s lasting protection requires his own confirmed grant.”

Confirm through the existing “Back Dorian and Lucien” command or leave through “Consider my other choices”.

**Conditional continuation — not another free branch**

Authorization uses the nightly action. Do not show a completed investigation on that confirmation. The assistant needs the existing separate grant; research needs a subsequent night and valid permissions.

If Dorian’s existing rival petition becomes available while Mirelle can still be stopped:

DORIAN: “Stop Mirelle before she publishes, then invite me. Two commitments, not one clever answer. Count the nights before you choose.”

The existing route is withdrawal followed by a later eligible authorization, never a new “switch sides” command.

On action:withdraw_library, before publication, retain:

INVESTIGATOR: “You can tell us to leave. Just understand that the work will stop with us.”

Do not append the overlapping material sentence again. The original visible terms still disclose cascading revocation and preservation of published findings and independent rights.

Visible terms retain the action cost and preservation of independent rights. “Take back the keys” commits; leaving does not.

After confirmed withdrawal, if this speaker did not publish:

INVESTIGATOR: “I have your answer. The work stops here. If you invite someone else, at least let them finish before you change your mind again.”

After confirmed publication, the existing responses remain:

MIRELLE: “Finished. Marius has the account. You can close the Library tomorrow, but he will still have read it.”

or DORIAN: “Lucien has the finished account. Mirelle will not like losing the race. That does not make the work any less finished.”

These are mutually exclusive recorded winners, not two guaranteed publications. Taking back access afterward cannot create a second investigation.

### 4. Night 7 — Marius’s final confrontation

**Gate:** finalCourt mode, n=6, effective Marius-issued court protection, no recorded response. Otherwise this scene does not exist. No invented equivalent is supplied.

MARIUS:

“You have my protection. You would like to keep it. Very well.

I want an invitation to your Library that does not expire. Keep your title. I have no interest in taking it from you. I am asking whether you intend our arrangement to benefit only you.”

The three options open existing inspections; none immediately grants a right.

**A — “Keep his protection. Give Marius entry without expiry.”**

MARIUS: “Then we understand one another. Your title remains yours. I expect to be admitted.”

Visible terms: “One major action. Give Marius non-delegable Library access without expiry; keep his revocable protection.”

Commit: “Give the continuing invitation” → final_accept. Or “Consider my other choices” → decision:6.

Only after the verified final answer, retain the narrator:

“Marius keeps his protection. You have given him a continuing invitation to the Library; he cannot pass that invitation on.”

**B — “Refuse. Lose his protection at dawn.”**

MARIUS: “You may refuse me. You may not refuse me and keep what I offered on my authority. At this reckoning, my protection ends.”

Visible terms: “One major action. Marius will withdraw his own protection at this reckoning. Independent shelter remains; without it you may lose.”

Commit: “Refuse his demand” → final_refuse. Or return to other choices.

Only after the existing verified rejection/revocation outcome:

“Marius has withdrawn his own protection after your answer—or your silence. Other independent promises remain governed by their own terms.”

**C — “Offer two nights of entry—even if he refuses.”**

Available only if the existing final_counter action is allowed, including a published Library account. Publication does not guarantee acceptance.

MARIUS: “Two nights. You want me to accept a limit on your hospitality while leaving none on mine. Show me why that should interest me.”

Visible terms: “One major action and 1 Blood. Give Marius a two-night Library invitation covering the final night, even if he refuses. He evaluates the public account and Cassian’s separate passage; rejection costs his protection.”

Retain: “Once you offer the invitation, you cannot take it back as part of this bargain—even if Marius refuses.”

Retain the exact state-dependent forecast:

- If counterAccepted: “Mirelle’s public account, your completed service and Cassian’s settled independent passage give Marius reason to accept a limited inspection.”
- Otherwise: “Marius will reject this alternative: it requires Mirelle’s published account, completed service, and Cassian’s settled, still-active purchased passage.”

Commit: “Grant two nights’ entry and counter · 1 Blood” → final_counter. Or return to other choices. It is non-delegable entry expiring at contract night 8, not ownership.

Only after verified acceptance:

“Marius accepts a limited inspection. Mirelle’s completed account and Cassian’s paid escape have made a narrower bargain worth accepting. You gave him a two-night invitation, not permanent access.”

If rejected, use the same verified withdrawal narrator as B. Where the matching temporary invitation remains effective, the ending explicitly adds: “Marius rejected the bargain. The two-night Library invitation you gave him still stands. He gained entry, not ownership.”

**Silence, waiting, feeding and failure**

The existing wait and Feed actions remain, not a fourth negotiation outcome. Leaving Marius unanswered costs his protection; the applicable warning remains visible. Pending, failed or interrupted submission gets the existing truthful status/recovery UI, not any success narration above. Dialogue never re-submits a transaction.

### 5. Endings — victory, dependency and finality

All examples begin with the existing CAMPAIGN COMPLETE and stored ending name. No new last action or epilogue question.

**The Unbound — stored Unbound outcome**

“You began with shelter someone else could withdraw. You finish the seventh night with your Library still yours, and sanctuary paid for on terms no change of mood can shorten.

Seraphine has not given you a home forever. You have not inherited her power. What you secured is smaller, and real: time that cannot be taken back merely because you cease to please.

For these seven nights, that was enough.”

The following factual summary gives the actual remaining term: “The final reckoning is over. Your sanctuary {expiryDescription}. Seraphine cannot cancel the remaining term. You own no part of her sanctuary.” Preserve the existing Library-title prefix and non-active/missing-lease fallbacks; no generic happy ending overwrites them.

**The Favoured — existing Marius selector**

“You have survived the seventh night with Marius’s protection still standing. There is a place for you in his order. It is not a small achievement. It is not a place beyond his reach.

Your Library remains yours. His promise remains his. You have secured a future in which that distinction will matter.”

If and only if finalCourt records the accepted standing response, retain the corresponding consequence: “You kept Marius’s protection by giving him a continuing, non-delegable Library invitation.” Do not insert it for every Favoured result.

**The Favoured — existing Lucien selector**

“You have survived the seventh night with Lucien’s protection still standing. A promise from outside House Volari has carried you further than its temporary passage could.

There is no scheduled end to this protection. There is still a man who can withdraw it. You kept your Library and gained a patron—not a guarantee that he will always want what you want.”

Neither ending invents the patron’s later conduct. Other evidence-selected highlights remain, up to the existing limit.

**Failure — recorded Blood exhaustion**

“Your Blood is exhausted. Whatever shelter you held, it could not replace what was gone.

No title could answer that hunger. No promise could sustain you.”

The factual reason remains Blood reaching zero. No assertion that the player ignored hunger or chose politics instead.

**Failure — recorded lack of qualifying protection**

“At the reckoning, no qualifying protection remained. A title to the Library was not a place beyond the daylight.

That distinction has ended this campaign. What you owned and what you could survive were never quite the same question.”

The stored reason separately distinguishes post-ultimatum shelter failure from final-night eligibility failure. Historical Exposure text stays on its original historical branch. Do not use this passage for Quit.

**End controls, unchanged**

“Review Your Chronicle” / “Close Your Chronicle” toggle the existing record. “Begin Another Campaign” remains disabled until lifecycle readiness. If not ready: “Your story is complete. Its payments and archive are still being verified; a new campaign must wait.” “Check settlement” remains operational copy.

No “you are free forever,” invented funeral, final thought, new promise or automatic replay.


## D. Complete disposition and replacement catalogue

This is the implementation lookup for the **current Living Court** scope, not authorization to implement. Every one of V1’s 207 compared entries has a disposition. An unchanged source field remains original; there is no blanket adoption of V1. Exact replacement wording, source locations and conditions are at the R-number links in B. For KEEP ORIGINAL entries without a B table, the cited V1 entry contains the exact original field/template and source pointer.

### Conflict and placement rules

1. Read each field’s original predicate in B/V1. Preserve its ordering and the current scene ID, inspect target, command payload and eligibility. Recommended text never supplies authorization.
2. Changes to a composed action opening replace that whole opening once. Do not prepend the character greeting or append the old explanatory material[0] again. Preserve the material terms below it. For withdrawal, use the original open/published speaker line once and retain the original visible terms; do not repeat the overlapping material[0] sentence. For feeding, retain the original narrator line and existing restoration/action-cost detail.
3. One question remains one question. No added persuasion roll, optional emotional response, hidden affinity or NPC turn. Both original question children and return paths remain.
4. Historical reactions are records of an act. Do not remove their current-state information. The retained V1 caption/duplicate-removal improvement applies; it does not create a stored dialogue transcript.
5. General incident copy does not override urgent state. Keep existing chapterSituation precedence: terminal outcome; unanswered final demand; Night Six published-work branch; current research progress; service deadline; hunger. Existing return/action availability decides what can actually be chosen.
6. Only the named presentation selections—late-Crypt countdown, conditional final-demand Feed warning, and incident/discovery copy separation—are proposed. Other original selector limitations are called out in E rather than silently redesigned.
7. Original source fields outside this register remain unchanged: retained room summaries, political relationship state, availability/error messages, Blood calculations/warnings other than the named final-demand warning, legacy-only branches, once-only discoveries and raw event strings. Never rewrite an event string that a projection matches literally.
8. Technical accuracy proposals remain separate from character dialogue. No fictional replacement for a transaction error, simulation label, diagnostic or unsettled payment.

### Night and encounter routing

| Night | Existing presentation | Dramatic function | State discipline |
|---|---|---|---|
| 1 | prologue; ultimatum; character:vesper; discovery:0; decision:0 | Creator refuses an indefinite obligation; player needs a refuge | Intent to revoke is not completed revocation |
| 2 | incident:1; current Seraphine/Marius/Lucien conversations and eligible negotiations | Make each price attractive for a different reason | No vanished offer reappears; no promise counted as a grant |
| 3 | incident:2; last-night Vesper; confirmed revoke reaction | Let the personal warning become an actual loss | Alternate Crypt access survives; never claim the entire room is closed from one revoked root |
| 4 | incident:3; Mirelle/Dorian petitions; eligible authorize actions | Player’s consent is now valuable | One investigator root; real permission before assistant/research |
| 5 | incident:4; research/withdrawal/publication responses | Whom the work benefits becomes irreversible | Published and unfinished work are different; no second winner |
| 6 | incident:5; existing research/protection state suffixes | Confront the difference between what is secured and what is merely hoped for | No general invitation to begin an unavailable investigation |
| 7 | incident:6; conditional final-demand; existing final actions; conclusion | Dependency reaches its price, or the actual non-demand route resolves | Do not manufacture Marius’s demand; use stored ending and verified results |

### Player-choice review

Free information and challenges retain their original destinations. “Are you trying to make me fail?” remains expressive, not a failed persuasion check. Seraphine’s “What is the catch?” is allowed to receive detailed terms; asking for rules is not the same problem as every character volunteering them.

Offer labels express intention; their next screen supplies the exact binding facts. Both Library authorization options retain their original political wording with explicit recipients/delegation below. The three final inspection labels and counter commit use V1’s explicit consequences. No label says “negotiate” when the submitted command already grants access.

The existing Feed, wait, return, skip, inspection, Chronicle and replay controls retain their functional meaning. Feed is not a penalty-free exit from an expiring offer. Waiting is not passive when NPCs and deadlines advance. Quiz-like choices and cosmetic promises of changing loyalty are not added.

### Required material terms — unchanged mechanics

| Commitment | Required facts before submission |
|---|---|
| Title filing | One nightly action; 1 Blood; existing Library claim only; no shelter; separate sanctuary acceptance before its deadline |
| Sanctuary | One nightly action; 0.02 NEAR prepaid/nonrefundable payment plus gas; seven-night duration; calculated expiry; no ownership; no discretionary cancellation after verified acceptance; acceptance before Night Four; prerequisite remains |
| Appointment | One nightly action; finite claim; actual protection requires later NPC grant; service Nights Four–Five; 1 Blood for direct service; Mirelle’s completed research can satisfy it; dismissal for unmet service; possible Night Seven demand |
| Mirelle authorization | One action; delegable Library entry to Mirelle; Cassian may be invited beneath it; no expiry; player revocation/cascade; later research; irreversible publication closes Dorian route; service fulfilled by completed account; separate patron grant |
| Dorian authorization | One action; delegable Library entry to Dorian; Lucien may be invited; same expiry/revocation/research rules; publication closes Mirelle route; lasting protection requires Lucien’s grant |
| Withdrawal | One action; root and dependent access revoked; unfinished work stops; publication, ownership, independent rights and liabilities remain |
| Temporary passage | One action; later Lucien grant, not instant shelter; expiry at start of Night Six; preserve the Night Four/Five research timing warning |
| Feed / rest | Existing restoration, cap, action cost, access requirement and dawn consequence; no balance changes |
| Final accept | One action; non-delegable continuing Library entry to Marius, no expiry; title stays player’s; his protection remains revocable |
| Final refuse | One action; Marius withdraws his protection at reckoning; independent shelter remains, defeat still possible |
| Final counter | One action and 1 Blood; non-delegable entry through contract night 8; invitation survives rejection; exact publication/service/Cassian-passage forecast; rejection loses Marius’s protection |
| Lounge agreement | Existing actual lease terms and mode-specific costs; ordinary entry is not sanctuary; signed standing rejection differs from free proposal decline |

Keep terms in the existing commitment/inspection surfaces. This is a writing specification, not a proposal for another UI.

### Complete register

| ID / passage | Decision | Final text and exact conditions |
|---|---|---|
| R1 — Prologue — A borrowed shelter | REWRITE V2 | [R1](#r1) |
| R2 — Prologue — House Volari | KEEP ORIGINAL | [R2](#r2) |
| R3 — Prologue — A power of her own | KEEP ORIGINAL | [R3](#r3) |
| R4 — Prologue — Three nights | KEEP V1 | [R4](#r4) |
| R5 — Vesper — opening | REWRITE V2 | [R5](#r5) |
| R6 — Vesper — question | KEEP ORIGINAL | [R6](#r6) |
| R7 — Vesper — answer | KEEP ORIGINAL | [R7](#r7) |
| R8 — Vesper — personal | KEEP ORIGINAL | [R8](#r8) |
| R9 — Vesper — reply | REWRITE V2 | [R9](#r9) |
| R10 — Night 1 — ultimatum narrator | KEEP V1 | [R10](#r10) |
| R11 — ultimatum → discovery:0 | KEEP ORIGINAL | [R11](#r11) |
| R12 — ultimatum → character:vesper | KEEP ORIGINAL | [R12](#r12) |
| R13 — Seraphine — opening | REWRITE V2 | [R13](#r13) |
| R14 — Seraphine — question | KEEP ORIGINAL | [R14](#r14) |
| R15 — Seraphine — answer | KEEP ORIGINAL | [R15](#r15) |
| R16 — Seraphine — personal | KEEP ORIGINAL | [R16](#r16) |
| R17 — Seraphine — reply | KEEP ORIGINAL | [R17](#r17) |
| R18 — Sanctuary — whole negotiation | REWRITE V2 | [R18](#r18) |
| R19 — Sanctuary inspection label, not commitment | KEEP ORIGINAL | [R19](#r19) |
| R20 — Mirelle — opening | REWRITE V2 | [R20](#r20) |
| R21 — Mirelle — question | KEEP ORIGINAL | [R21](#r21) |
| R22 — Mirelle — answer | REWRITE V2 | [R22](#r22) |
| R23 — Mirelle — personal | KEEP ORIGINAL | [R23](#r23) |
| R24 — Mirelle — reply | REWRITE V2 | [R24](#r24) |
| R25 — Dorian — opening | REWRITE V2 | [R25](#r25) |
| R26 — Dorian — question | KEEP ORIGINAL | [R26](#r26) |
| R27 — Dorian — answer | REWRITE V2 | [R27](#r27) |
| R28 — Dorian — personal | KEEP ORIGINAL | [R28](#r28) |
| R29 — Dorian — reply | KEEP ORIGINAL | [R29](#r29) |
| R30 — authorize_mirelle — whole negotiation | REWRITE V2 | [R30](#r30) |
| R31 — authorize_dorian — whole negotiation | REWRITE V2 | [R31](#r31) |
| R32 — authorize_mirelle inspection and existing commit label | KEEP ORIGINAL | [R32](#r32) |
| R33 — authorize_dorian inspection and existing commit label | KEEP ORIGINAL | [R33](#r33) |
| R34 — final-demand; opening reused by incident:6, decision:6 and character:marius | REWRITE V2 | [R34](#r34) |
| R35 — final-demand → corresponding existing action inspection | KEEP V1 | [R35](#r35) |
| R36 — final-demand → corresponding existing action inspection | KEEP V1 | [R36](#r36) |
| R37 — final-demand → corresponding existing action inspection | KEEP V1 | [R37](#r37) |
| R38 — action:final_accept; before commitment | REWRITE V2 | [R38](#r38) |
| R39 — action:final_refuse; before commitment | REWRITE V2 | [R39](#r39) |
| R40 — action:final_counter; before commitment | REWRITE V2 | [R40](#r40) |
| R41 — final_counter commit | KEEP V1 | [R41](#r41) |
| R42 — conclusion:unbound; stored Unbound result | REWRITE V2 | [R42](#r42) |
| R43 — endingSummary active accepted Unbound lease branch; retain existing title prefix | KEEP V1 | [R43](#r43) |
| R44 — Favoured epilogue | REWRITE V2 | [R44](#r44) |
| R45 — Chapter 1 title | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:899>) |
| R46 — Chapter 1 question | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:917>) |
| R47 — Chapter 1 base paragraph | REWRITE V2 | [R47](#r47) |
| R48 — Chapter 2 title | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:955>) |
| R49 — Chapter 2 question | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:973>) |
| R50 — Chapter 2 base paragraph | REWRITE V2 | [R50](#r50) |
| R51 — Chapter 3 title | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1011>) |
| R52 — Chapter 3 question | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1029>) |
| R53 — Chapter 3 base paragraph | REWRITE V2 | [R53](#r53) |
| R54 — Chapter 4 title | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1067>) |
| R55 — Chapter 4 question | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1085>) |
| R56 — Chapter 4 base paragraph | REWRITE V2 | [R56](#r56) |
| R57 — Chapter 5 title | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1123>) |
| R58 — Chapter 5 question | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1141>) |
| R59 — Chapter 5 base paragraph | REWRITE V2 | [R59](#r59) |
| R60 — Chapter 6 title | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1179>) |
| R61 — Chapter 6 question | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1197>) |
| R62 — Chapter 6 base paragraph | REWRITE V2 | [R62](#r62) |
| R63 — Chapter 7 title | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1235>) |
| R64 — Chapter 7 question | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1253>) |
| R65 — Chapter 7 base paragraph | REWRITE V2 | [R65](#r65) |
| R66 — discovery:0 — shorter hub | KEEP V1 | [R66](#r66) |
| R67 — discovery:1 — shorter hub | KEEP V1 | [R67](#r67) |
| R68 — discovery:2 — shorter hub | KEEP V1 | [R68](#r68) |
| R69 — discovery:3 — shorter hub | KEEP V1 | [R69](#r69) |
| R70 — discovery:4 — shorter hub | KEEP V1 | [R70](#r70) |
| R71 — discovery:5 — shorter hub | KEEP V1 | [R71](#r71) |
| R72 — discovery:6 — shorter hub | KEEP V1 | [R72](#r72) |
| R73 — n=5, published result | KEEP V1 | [R73](#r73) |
| R74 — effective chosen root, result open; preserve leading separator | KEEP V1 | [R74](#r74) |
| R75 — n=6, no root and no published result; preserve leading separator | KEEP V1 | [R75](#r75) |
| R76 — no root, open result, before final night; preserve leading separator | KEEP V1 | [R76](#r76) |
| R77 — Marius — opening | REWRITE V2 | [R77](#r77) |
| R78 — Marius — question | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1534>) |
| R79 — Marius — answer | KEEP ORIGINAL | [R79](#r79) |
| R80 — Marius — personal | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1572>) |
| R81 — Marius — reply | KEEP ORIGINAL | [R81](#r81) |
| R82 — Lucien — opening | KEEP ORIGINAL | [R82](#r82) |
| R83 — Lucien — question | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1632>) |
| R84 — Lucien — answer | KEEP ORIGINAL | [R84](#r84) |
| R85 — Lucien — personal | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:1668>) |
| R86 — Lucien — reply | REWRITE V2 | [R86](#r86) |
| R87 — Cassian — opening | KEEP ORIGINAL | [R87](#r87) |
| R88 — Cassian — question | KEEP ORIGINAL | [R88](#r88) |
| R89 — Cassian — answer | KEEP ORIGINAL | [R89](#r89) |
| R90 — Cassian — personal | KEEP ORIGINAL | [R90](#r90) |
| R91 — Cassian — reply | KEEP ORIGINAL | [R91](#r91) |
| R92 — Sabine — opening | KEEP ORIGINAL | [R92](#r92) |
| R93 — Sabine — question | KEEP ORIGINAL | [R93](#r93) |
| R94 — Sabine — answer | KEEP ORIGINAL | [R94](#r94) |
| R95 — Sabine — personal | KEEP ORIGINAL | [R95](#r95) |
| R96 — Sabine — reply | KEEP ORIGINAL | [R96](#r96) |
| R97 — Current Living Court active action negotiation opening selector | KEEP V1 | [R97](#r97) |
| R98 — investigate_title — composed negotiation | KEEP V1 | [R98](#r98) |
| R99 — petition_marius — composed negotiation | REWRITE V2 | [R99](#r99) |
| R100 — fulfil_service — composed negotiation | KEEP V1 | [R100](#r100) |
| R101 — withdraw_library — composed negotiation | KEEP ORIGINAL | [R101](#r101) |
| R102 — broker_passage — composed negotiation | REWRITE V2 | [R102](#r102) |
| R103 — feed — composed negotiation | KEEP ORIGINAL | [R103](#r103) |
| R104 — rest — composed negotiation | KEEP V1 | [R104](#r104) |
| R105 — investigate_title label | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2074>) |
| R106 — petition_marius label | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2092>) |
| R107 — fulfil_service label | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2110>) |
| R108 — withdraw_library inspection; ownership never left player | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2128>) |
| R109 — broker_passage label | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2146>) |
| R110 — rest label, avoids attributing all later access to Vesper | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2164>) |
| R111 — Night 7 Feed warning only when the existing finalDemand is true and no response is recorded; otherwise retain current sentence. | KEEP V1 | [R111](#r111) |
| R112 — record:crypt | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2212>) |
| R113 — record:library | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2230>) |
| R114 — record:lounge | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2252>) |
| R115 — roomDevelopment existing matching branch | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2277>) |
| R116 — roomDevelopment existing matching branch | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2295>) |
| R117 — roomDevelopment existing matching branch | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2313>) |
| R118 — roomDevelopment existing matching branch | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2331>) |
| R119 — roomDevelopment existing matching branch | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2349>) |
| R120 — roomDevelopment existing matching branch | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2367>) |
| R121 — roomDevelopment existing matching branch | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2385>) |
| R122 — roomDevelopment existing matching branch | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2403>) |
| R123 — roomDevelopment existing matching branch | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2421>) |
| R124 — roomDevelopment existing matching branch | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2439>) |
| R125 — passage_offer — narrator | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2471>) |
| R126 — passage_buy — narrator | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2489>) |
| R127 — passage_collect — narrator | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2507>) |
| R128 — final_answer — narrator | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2525>) |
| R129 — revoke — narrator | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2547>) |
| R130 — dismiss — narrator | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2566>) |
| R131 — archive_assist — narrator | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2584>) |
| R132 — archive_challenge — narrator | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2602>) |
| R133 — archive_research — narrator | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2620>) |
| R134 — archive_protect — narrator | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2638>) |
| R135 — appoint — narrator | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2656>) |
| R136 — open_passage — narrator | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2675>) |
| R137 — publish — narrator | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2693>) |
| R138 — sponsor — narrator | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2711>) |
| R139 — compete — narrator | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2729>) |
| R140 — collect — narrator | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2748>) |
| R141 — collect_sanctuary — narrator | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2766>) |
| R142 — offer — narrator | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2784>) |
| R143 — reactionReply — withdraw, speaker published | KEEP ORIGINAL | [R143](#r143) |
| R144 — reactionReply — withdraw, speaker did not publish | KEEP ORIGINAL | [R144](#r144) |
| R145 — reactionReply — service-kept | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2843>) |
| R146 — reactionReply — Vesper revoke; confirmed only | REWRITE V2 | [R146](#r146) |
| R147 — reactionReply — Marius dismiss | KEEP ORIGINAL | [R147](#r147) |
| R148 — reactionReply — archive_assist, child no longer effective | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2897>) |
| R149 — reactionReply — Mirelle archive_assist | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2915>) |
| R150 — reactionReply — Dorian archive_assist | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2933>) |
| R151 — reactionReply — Dorian challenge no longer viable | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:2951>) |
| R152 — reactionReply — Dorian live challenge; existing time/choice guard | KEEP V1 | [R152](#r152) |
| R153 — reactionReply — Mirelle research confirmed | KEEP ORIGINAL | [R153](#r153) |
| R154 — reactionReply — Dorian research confirmed | KEEP ORIGINAL | [R154](#r154) |
| R155 — reactionReply — Marius archive_protect confirmed | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3023>) |
| R156 — reactionReply — Lucien archive_protect confirmed | KEEP ORIGINAL | [R156](#r156) |
| R157 — reactionReply — Marius appoint player | KEEP ORIGINAL | [R157](#r157) |
| R158 — reactionReply — Marius appoint Cassian | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3077>) |
| R159 — reactionReply — Lucien open_passage | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3095>) |
| R160 — reactionReply — Mirelle publish | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3113>) |
| R161 — id:&#96;reaction:key: — narration | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3136>) |
| R162 — id:&#96;reaction:withdraw: — narration | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3154>) |
| R163 — id:&#96;reaction:lease: — narration | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3172>) |
| R164 — id:&#96;reaction:decline: — narration | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3191>) |
| R165 — id:'reaction:service-kept' — narration | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3209>) |
| R166 — All generated court reaction scenes | KEEP V1 | [R166](#r166) |
| R167 — Historical correspondence caption | KEEP V1 | [R167](#r167) |
| R168 — reckoning — revoke | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3268>) |
| R169 — reckoning — archive_assist | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3286>) |
| R170 — reckoning — archive_research | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3305>) |
| R171 — reckoning — archive_protect | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3324>) |
| R172 — reckoning — archive_challenge | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3343>) |
| R173 — reckoning — appoint | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3361>) |
| R174 — reckoning — dismiss | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3380>) |
| R175 — reckoning — open_passage | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3398>) |
| R176 — reckoning — sponsor | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3416>) |
| R177 — reckoning — publish | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3434>) |
| R178 — reckoning — compete | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3452>) |
| R179 — reckoning — collect | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3471>) |
| R180 — reckoning — collect_sanctuary | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3489>) |
| R181 — reckoning — offer | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3507>) |
| R182 — Accepted lease recap | REWRITE V2 | [R182](#r182) |
| R183 — reckoning fallback when no generated lines | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3543>) |
| R184 — reckoning fallback when no generated lines | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3561>) |
| R185 — Ending — Blood defeat epilogue | REWRITE V2 | [R185](#r185) |
| R186 — Ending — Non-Blood, nonhistorical-Exposure failure epilogue | REWRITE V2 | [R186](#r186) |
| R187 — Ending — Blood failure summary | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3620>) |
| R188 — Ending — Early shelter failure summary; avoids assuming which loss caused the state | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3638>) |
| R189 — Ending — Night 7 failure summary | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3656>) |
| R190 — Ending — Unbound diagnostic fallback; do not embellish contradictory state | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3674>) |
| R191 — Ending — appointment player, service fulfilled; ending consequence | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3692>) |
| R192 — Ending — existing revoked court-grant branch; do not infer a specific motive from the revocation alone | KEEP V1 | [R192](#r192) |
| R193 — Ending — unfulfilled, no recorded revoked court grant | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3728>) |
| R194 — Ending — published Mirelle ending consequence | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3746>) |
| R195 — Ending — published Dorian ending consequence | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3764>) |
| R196 — Ending — result open; does not deny independently earned service protection | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3782>) |
| R197 — Ending — recorded withdrawn delegable player Library grant | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3800>) |
| R198 — Ending — accepted final counter | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3818>) |
| R199 — Ending — accepted standing final invitation | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3836>) |
| R200 — Ending — rejected final result; include silence, do not assert player explicitly refused | KEEP V1 | [R200](#r200) |
| R201 — Ending — rejected counter with matching effective temporary invitation | KEEP V1 | [R201](#r201) |
| R202 — decision:n narrator | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3901>) |
| R203 — hold:n with root/open result | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3919>) |
| R204 — hold:n otherwise | KEEP ORIGINAL | [Original field in V1](<C:/Users/gauge/Documents/ChatGPT/We Inherit Night/docs/narrative-audit/NARRATIVE_REWRITE_PROPOSAL.md:3937>) |
| R205 — lease:0 rejection in current Living Court only; retain legacy one-action label outside Library mode. | KEEP V1 | [R205](#r205) |
| R206 — Diagnostics; finite passage mandate feature. | KEEP V1 | [R206](#r206) |
| R207 — Diagnostics shared renderer; preserve the existing runtime proof/network indicator. | KEEP V1 | [R207](#r207) |

**Disposition totals:** KEEP ORIGINAL 142, KEEP V1 32, REWRITE V2 33. Counts are catalogue fields/units, not rendered sentence counts.

## E. Editorial quality review
| Criterion | Assessment | Remaining risk / review question |
|---|---|---|
| Repetition | Preserve one good explanation at the point where the player asks for it. Remove repeated greetings and duplicate terms narration. | Shared original character openings can still repeat when revisiting a parent. This proposal adds no seen-state suppression or dialogue system. |
| Character differentiation | Vesper disputes responsibility; Seraphine finds discretion vulgar compared with a price; Marius frames demands as reciprocity; Lucien looks for leverage outside the House. Mirelle argues through professional ambition, Dorian through the beneficiary, Cassian through wounded competitiveness, Sabine by withholding reassurance. | Mirelle and Dorian must not both become glib debaters. Keep her practical progress lines and his willingness to concede her competence. |
| Emotional stakes | The sire confrontation asks whether creation entails responsibility. The final patron confrontation asks what dependence permits someone to demand. Neither needs a hidden betrayal. | Vesper’s severity may read as cold rather than conflicted. That is preferable to inventing love or a secret protective purpose. Human review should judge whether her refusal creates investment. |
| Political intrigue | The same useful account can benefit competing interests. A patron can make a genuine offer and still exert pressure. Characters are not classified as truthful hero versus lying villain. | The actual investigation contains permissions/obligations, not a scandal. Dialogue cannot make its subject richer than the implemented content. Do not promise a revelation the game cannot deliver. |
| Escalation | Shelter sought → terms compared → warning fulfilled → player courted for permission → publication beyond recall → remaining options narrowed → actual political settlement. | Not every campaign visits every conversation. Chapter prose must orient an unfamiliar player without assuming they heard the corresponding showcase. |
| Player agency | All existing question, inspection and action destinations survive. Refusal is respected as a real choice, not written as stupidity. No free question falsely persuades an NPC. | Convergent information branches do not change affinity. The enjoyment must come from insight and voice; do not market them as another political outcome. |
| Mechanical accuracy | Explicit terms carry amounts, deadlines, delegation, revocation and delayed grant requirements. Counterproposal risk remains unavoidable before commitment. | Natural dialogue can sound like a promise. Verify the gate and tense at implementation; never use a character’s sentence as the grant’s confirmation. |
| Graphic-novel pacing | Routine replies remain brief. Vesper’s opening, Marius’s demand and the ending can sustain a longer thought. Paragraphs in this document mark rhetorical beats, not new panels or Continue clicks. | The longer ending is an editorial choice requiring visual reading review later. Do not add scroll regions, animations or UI components as part of implementing this writing. |

### Specific continuity cautions

- The current Seraphine opening uses access as a shortcut for an accepted paid refuge. The actual public sanctuary route is paid; do not generalize that sentence to arbitrary historical/custom grants without verifying the accepted lease. This review does not introduce a new authority inference.
- The original Cassian fallback invites pursuit of the appointment; the original Lucien requested-passage fallback attributes absence to its deadline. Where unusual/older states violate those assumptions, the source predicates—not prose alone—need a separately scoped presentation audit. No mechanics change is proposed here.
- After the sanctuary offer has closed, a free question can still explain its terms. The deadline remains explicit. Do not present the past terms as a newly available commitment.
- The existing Favoured patron selector uses the stored reason. Keep that selector rather than inventing the “most important” patron from multiple current grants.
- Historical correspondence is not evidence that the exact quoted speech was previously saved. Preserve its record/date framing and current-standing field.
- The source’s inability to show a new dialogue beat for every consequence is not permission to add one. Marius’s final result remains narrator-only where the existing scene is narrator-only.
- No stronger ending can make fixed-term sanctuary permanent. “Unbound” celebrates a kind of independence achieved during the campaign, not immunity to future need.
- The review does not claim the public deployment was reverified, nor that the incomplete original audit became an exhaustive runtime transcript.

### Director’s recommendation

Approve or reject the five sequences as performances, not as a string-count target. Seraphine should sound capable of making the player smile while buying something expensive. Marius should make the player resent a demand they can understand. Vesper should leave an objection the player wants to answer with survival. Cassian should not need a new speech when his old congratulations already lands.

The existing implementation can support those effects. What it cannot support is an invented betrayal, a newly consequential retort or an ending secured by dialogue alone. This proposal stops at that boundary.

### Verification record

Document-only verification follows below. No builds, gameplay suites, save inspection, RPC transactions, source edits, commits, pushes or deployment were performed. These checks establish textual traceability and preservation, not the audience’s emotional response.



**PASS — textual checks:** 107 significant three-way comparison tables preserve their exact Original and V1 excerpts; all source citations resolve; all 207 V1 entries have one final disposition; five complete showcase sequences are present. Dispositions: 142 KEEP ORIGINAL, 32 KEEP V1, 33 REWRITE V2.

**PASS — preservation:** all 54 baseline source, script, contract and prior narrative-audit files retain their SHA-256 fingerprints. Only NARRATIVE_REWRITE_PROPOSAL_V2.md was added for this task.

**NOT RUN — intentionally:** application builds, gameplay tests, live transactions and hosted verification. This is an unimplemented creative proposal, not a verified change to the public game.

## Implementation authorization — final editorial corrections

The implementation request supersedes this document’s earlier proposal-only status for selected text, not for deployment. Marius asks for an invitation rather than asserting it has been granted; Night Three describes the approaching deadline without assigning dread; Blood defeat uses exhaustion-specific narrative closure without inventing a date or player decision. Confirmation, Chronicle and replay remain in their existing authoritative/UI paths. Original/V1 comparison cells and the 207 dispositions are otherwise preserved.
