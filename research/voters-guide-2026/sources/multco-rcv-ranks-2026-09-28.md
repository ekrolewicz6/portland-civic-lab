# Multnomah County Elections: number of ranks per contest (September 28, 2026)

- From: Leah Benson (she/they), Ranked Choice Voting Project Manager, Multnomah County Elections (leah.benson@multco.us), replying on September 28, 2026 to the Lab's September 25 fact-check request ("A factual check on our ranked-choice explainer", sent to elections@multco.us).
- Her correction, in substance: the Lab's RCV information was accurate except the rank count. For the County Chair contest voters can rank up to 4 candidates, because only 3 candidates filed; four ranks let voters rank every filed candidate plus one write-in.
- The rule: county and City of Portland code allow a maximum of 6 ranks, but when fewer candidates file the number of ranks is reduced. Precedent she cited: the 2024 Portland Auditor contest had one filed candidate and 2 ranks.
- She attached an image of the Chair contest ballot layout (not reproduced here).
- Applied in PR #58: Chair 4 ranks; County Auditor, Sheriff and Portland Auditor (one filed candidate each) 2 ranks; County District 2 (7 filed) and Council D3/D4 (21 and 12 filed) 6 ranks. The Lab's reply asked her to flag any count that is off.
- Research-log entry: /voters-guide/research-log#rcv-ranks-2026-09-28

## Second correction (Leah Benson, September 28, 2026, 1:22 pm; read September 29)
- "County Auditor and Sheriff will not use ranked choice voting. Per Multnomah County Code, ranked choice voting is used only when there are two or more filed candidates. Since only one candidate has filed for both County Auditor and County Sheriff, voters will be instructed to vote for one instead of ranking."
- "However, per City of Portland code, RCV is used even in the event of only one filed candidate. So, even though there is only one filed candidate for Portland Auditor, voters will be instructed to rank up to 2 candidates."
- Sample ballot she sent (NE Portland precinct): https://multco.us/file/4508-1-rcv-non-en.pdf-0/download (PDF, 124 KB, fetched September 29).
- Applied: `counties.ts` now marks a Multnomah contest ranked only when more than one candidate filed; County Auditor and Sheriff ballot instructions are "You vote for one candidate." Research-log correction `#rcv-vote-for-one-2026-09-29`. Our September 28 two-rank figure for those two contests was an inference from her first email's rule; this is why the log shows two corrections.
