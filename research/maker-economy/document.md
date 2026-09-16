# The work behind Portland’s handmade city

A jacket built from reclaimed sports jerseys. A ceramic bowl shaped in a home studio. A custom table made from Oregon oak. A prototype assembled with shared tools. These are different products, but the economic questions are the same: **who does the work, who buys it, and how much of the payment becomes a livelihood?**

Portland has a visible economy of physical making, connected to household spending, commercial clients, local suppliers, and customers elsewhere. The public record lets us get considerably closer to it than a list of makerspaces. We assembled **597 listings across four artist and craft networks**, examined tax and payroll records, and followed documented projects into workshops and homes. Those sources reveal real businesses and production relationships. They also reveal why a single maker headcount would be misleading without more work.

*Portland maker Martin Eichinger asked the question that prompted this investigation: can we measure this economy?*

## What Portland actually makes

Here, the **maker economy** means physical art, craft, fabrication, furniture, ceramics, textiles, jewelry, printmaking, hardware prototypes, and creative repair. It includes a home business selling a few pieces, a full-time craftsperson, and a small fabrication team. Learning and unpaid making belong in a participation count; paid production belongs in an economic count. We track workshops, instruction, suppliers, and markets as the infrastructure that supports both.

This boundary matters. Including software, performance, food, beverages, or large-scale manufacturing would produce a larger number answering a different question. A Portland brand also needs evidence of Portland production before its sales can describe work done here.

Start with a completed object. **Portland Garment Factory’s installation for Nike’s Portland flagship** combined reclaimed jerseys and repurposed soccer balls with garment construction, custom patches, and chainstitching. Its project credits identify designer Britt Howard, the PGF build team, and collaborators Alex Stone and Stephenie Goodwin. One commercial commission brought several kinds of skilled work together. The contract price and division of payment are unpublished. [Project and production credits](https://www.portlandgarmentfactory.com/our-work-1/retail-installation-nike-flagship)

The company’s wider portfolio includes museum work, uniforms, retail displays, and a collaboration with The Joinery. This is a part of making that a weekend-market count would miss: businesses buying specialist fabrication from other businesses. [PGF portfolio](https://www.portlandgarmentfactory.com/)

Other production paths look different:

- **Orox Leather** connects a Chinatown workshop with an airport storefront. Its public locations show production and multiple sales channels within one enterprise; two storefronts would not mean two separate producers. [Workshop and store](https://www.oroxleather.com/pages/visit-us)
- **The Joinery** documented a custom modular table built in Portland for CityTeam in 2025, using white oak donated by Willamette Valley supplier Zena Forest Products. This particular project was a donation, so it establishes a material and production relationship, not sales revenue. [Project account](https://thejoinery.com/blogs/news/brining-oregon-lumber-and-craftsmanship-to-city-team)
- **Rachael Potter Ceramics** describes shaping pottery in a home studio and buying clay and glaze locally. Online sales can connect a home producer to customers without a commercial storefront. Shipping options alone do not tell us how many outside orders were actually filled. [Maker’s account](https://www.rachaelpotter.com/)
- **Past Lives** presents member work in furniture, steel, painting, and jewelry alongside commissioned fabrication and prototyping services. Its website also carries an industrial customer’s account of prototype support. These are distinct activities; a tool inventory alone would establish neither output nor income. [Member work and commissions](https://www.pastlives.space/home)

The expanded [case studies](case-studies.md) follow these production paths and the [ecosystem inventory](data/ecosystem.csv) separates producers, shared facilities, suppliers, and sales networks.

## Counting starts with names

There is no need to start with an invented percentage of Portland’s population. Artists and craft businesses already appear in studio tours, specialist guilds, markets, and shared-space directories. We extracted names, stated media, public profile links, and source dates from four of those networks.

```maker-figure
directory
```

This is a **discovery register**, not a workforce estimate. The tour lists artists, the market often lists business names, and the guild event includes shared and organizational booths. The networks reach beyond Portland city limits. Two directories are undated. A public listing establishes visibility in that source, not current operation, income, or production inside the city.

The overlaps are instructive. Wayne Harrel appears in the studio tour and guild directory; Studio Gwyneth appears in the pottery and market lists. Sienna Cenere’s tour profile and Sienna Art Studios’ market entry point to the same website. Conversely, two distinct artists can share a studio website. We preserve the original records, group matching names for browsing, and record reviewed links and unresolved aliases. **589 browsing groups is a result of those matching rules, not 589 unique makers.** [Listings](data/directory-listings.csv) · [Link decisions](data/directory-links.csv)

The register already makes the investigation more useful: readers can find actual practitioners and inspect the evidence behind a count. Its largest blind spots are people who do not exhibit publicly, makers whose business has closed, informal paid work, creative repair, and technical fabrication sold directly to clients. A polished web presence should never become an eligibility requirement for being counted.

## What the business records already show

A second view comes from businesses reporting receipts to the tax system. In **2023, Multnomah County had 542 nonemployer businesses reporting $25.663 million in receipts across nine selected physical-production and repair categories**. These categories cover apparel, leather, wood products, printing, clay, glass, fabricated metal, furniture, and furniture repair. “Nonemployer” means the business has no paid employees; owners can still be working for income. These are county business records, generally located by mailing address—not a Portland city maker estimate. [Census data and extracted categories](data/nonemployers.csv)

```maker-figure
receipts
```

This evidence answers a narrower but substantial question: **small production businesses generate real commercial receipts, even when they create no payroll job.** The categories also contain industrial and other work outside our definition. Meanwhile, they omit physical artists classified elsewhere and many forms of creative repair. They are neither a minimum nor a maximum for the maker economy.

The definition makes a large difference. Adding “other miscellaneous manufacturing” adds 221 businesses and $19.763 million, taking the selected basket to 763 businesses and $45.426 million. That category can contain relevant craft production alongside unrelated products. We keep it separate instead of making the headline larger. Independent artists, writers, and performers are another mixed category; assigning an arbitrary maker percentage to its 7,472 county businesses would create precision without evidence. [Category definitions and sensitivity rules](methodology.md)

Receipts also do not measure take-home income. Furniture manufacturing’s 101 nonemployer businesses reported $4.457 million in aggregate receipts: about $44,129 per business on average, before expenses. That average can conceal part-time enterprises, losses, and larger earners. It is not the typical furniture maker’s salary. A maker may also pay another local maker, so adding all their receipts would count the same final product’s value more than once.

## The payroll picture is uneven

Payroll records show another part of the economy: employees of classified businesses. They miss proprietors and much independent work, but provide a consistent comparison with Portland’s wider county economy.

```maker-figure
jobs
```

Jewelry and silverware manufacturing grew from 106 to 127 covered private jobs between 2019 and 2025 in Multnomah County. Wood household furniture fell from 94 to 68; apparel fell from 444 to 363. The county’s total private employment fell 7.0% over the same period. Growth in one discipline cannot stand in for the whole sector. [BLS annual data and calculations](data/derived/employment-comparison.csv)

Jewelry manufacturing’s 2025 employment concentration was about twice the national level, according to BLS’s published location quotient of 1.98. But average annual pay was $53,439, compared with $80,983 across the county’s private economy. A distinctive local specialization does not automatically deliver high pay. Hours and the mix of occupations affect those averages; these are not comparable hourly wage rates. [Employment and pay table](data/derived/employment-comparison.csv)

This is why we need separate accounts of **paid employees, working owners, supplemental earners, and unpaid participants**. Summing the directory, payroll, and tax-business figures would mix units and count overlapping activity repeatedly.

## A maker business can be very small—or much larger

A Portland Made Collective survey provides a useful historical warning about averages. In 2015, 41 of its 84 revenue respondents reported annual sales in the two bands up to $50,000. The distribution also included much larger firms. The sample covered a broader mix than this investigation, including adjacent sectors; it is not a description of makers today. [Original survey, pages 5–7](https://artisaneconomyinitiative.wordpress.com/wp-content/uploads/2016/05/portland-made-collective-survey-report-2015.pdf)

```maker-figure
revenue-bands
```

The report’s $316.1 million headline estimate combined a survey-based expansion with $216.4 million attributed to just three large firms using a business database. Those additions account for roughly 68% of the headline. Applying one average business size to every artist or workshop member would repeat that concentration problem. **Count solo producers, employer firms, and occasional earners separately.** [Original calculation, page 11](https://artisaneconomyinitiative.wordpress.com/wp-content/uploads/2016/05/portland-made-collective-survey-report-2015.pdf)

## Shared workshops make production possible

Shared spaces spread the cost of tools, workspace, maintenance, and access across users. That can make a project feasible before its maker could justify a private shop. The economic question is what members actually use and earn—not how much equipment a building contains.

At **Past Lives**, members can combine woodworking, metalwork, textiles, and prototyping. Its website reports 175 members and 55 private studios without specifying a measurement period. At **ADX**, the community includes more than 95 creatives, spanning physical and other disciplines. At **NW Marine Art Works**, the operator describes 80 studios and more than 100 artists and makers. These figures show the scale of shared infrastructure. They cannot be added into a count of active paid makers. [Past Lives](https://www.pastlives.space/home) · [ADX](https://artdesignxchange.com/art-studios-portland) · [NW Marine](https://www.nwmarineartworks.com/about)

Specialist facilities reach beyond their walls. Morning Ceramics offers outside firing and wheel rental; Radius offers at-home wheel rental as well as studio membership. A home producer can therefore depend on a shared kiln without being a regular studio member. IPRC provides print and book-making facilities, while PDX Hackerspace and Hedron provide places for technical experimentation. [Morning services](https://www.morningceramics.com/services) · [Radius](https://www.radiusstudio.org/membership/) · [IPRC](https://www.iprc.org/the-studios) · [PDX Hackerspace](https://pdxhackerspace.org/) · [Hedron](https://hhacker.space/)

```maker-figure
workspace
```

The 2015 survey’s reported work allocation put 41% at home and 4% in makerspaces. Those historical percentages measure reported work, not people. They explain a durable research problem: **a makerspace survey alone cannot describe the maker economy.** [Survey, pages 16–17](https://artisaneconomyinitiative.wordpress.com/wp-content/uploads/2016/05/portland-made-collective-survey-report-2015.pdf)

A useful facility measure would be *productive access*: hours of equipment use, outside-service customers, occupied studios, and completed projects, connected privately to whether that work was commercial. Waiting lists and unused capacity matter too. An inexpensive membership is less useful if the required machine is unavailable when an order must ship.

## A sale is only the beginning of an income

Markets make work visible, but gross sales are only the first line of a business account. Ceramic Showcase’s published 2026 rules give us an unusually clear example: a central sales system, a registration charge, booth fees, and a commission that changes at specified sales thresholds. These are actual event terms; the maker’s sales and production costs below are adjustable assumptions. [OPA participation and sales rules](https://www.oregonpotters.org/showcase-2026)

```maker-figure
calculator
```

The result is money left to compensate the maker and cover remaining costs. It is not profit or an hourly wage. Time spent making unsold stock, packing, selling, and completing required event work also belongs in the account. Studio rent, tools, insurance, association dues, and taxes may still need to be paid.

This distinction changes what “supporting makers” should mean. More visitors or higher event sales can help, but the stronger measure is whether producers retain enough after costs to continue working. Likewise, a commission from outside Portland brings money into the city only to the extent that production and earnings are retained here.

## Why this matters to Portland’s economy

The evidence points to several concrete economic roles, with different measures of success.

**Livelihoods and supplemental earnings.** Payroll and tax records document paid production. A household may depend on occasional sales as well as a full-time craft business. The next useful questions concern owner earnings, hours, volatility, and the share of household income supplied by making.

**Specialist work for other industries.** PGF’s documented commercial projects and Past Lives’ prototyping offer connect making to retail, product development, institutions, and industrial clients. These relationships may be more economically significant than a producer’s public-facing shop. Contract values and subcontractor payments would establish their size.

**Local purchasing and production relationships.** Clay, wood, glass, hardware, firing, shipping, and specialist labor connect an individual object to other businesses. Bullseye’s Portland glass production illustrates the supplier side of this network. The Joinery project shows a regional material connection. Measuring actual purchases can identify which dollars stay in Portland, which stay in Oregon, and which leave. [Bullseye’s production story](https://www.bullseyeglass.com/bullseye-glass-story/) · [The Joinery project](https://thejoinery.com/blogs/news/brining-oregon-lumber-and-craftsmanship-to-city-team)

**A lower-cost way to start and keep producing.** Shared facilities let people obtain access without owning every machine. To assess their economic contribution, compare the cost of an actual production task with the maker’s next-best alternative: another shop, outsourcing, buying equipment, or declining the job. That comparison is more informative than assuming every member business exists because of the space.

**Repair and longer use.** Reupholstery and furniture repair already appear in business data, while much custom repair is harder to isolate. Its economic value includes paid skilled work and objects returned to use. We should record completed repairs and payments before trying to estimate avoided purchases or environmental savings.

Cultural identity, learning, and belonging matter alongside these accounts. They need their own evidence—who can participate, who feels welcome, and whose work is visible. Their importance does not depend on attaching an invented dollar multiplier.

## How to get to a credible Portland estimate

The next model should build from observed producers and measured business activity. It should not inflate workshop memberships by a guessed citywide factor.

**First, establish the population.** Use one calendar year and three separate targets: people who made things, people paid to make things, and businesses producing eligible work. Verify where production occurred, including Portland outside Multnomah County. Keep sellers who work elsewhere in a separate account of Portland’s market activity.

**Second, audit the discovery register.** Review each source’s coverage, identify individual-versus-business records, link aliases, and resolve activity and location. Sample within discipline and source rather than letting highly visible ceramics or visual art stand in for repair and technical fabrication. Include independent studios, home producers, closed businesses, and less visible networks. Publish how many records remain unresolved.

**Third, use administrative records to test coverage.** Request city-boundary aggregates for selected industries from Oregon Employment Department and Portland’s economic-development and planning staff. The Urban Manufacturing Alliance’s Portland research obtained city and district QCEW data through the Bureau of Planning and Sustainability—an established route worth revisiting. Census mailing-address business counts remain a separate check. [2018 study, methods pages 7–8](https://archive.urbanmfg.org/wp-content/uploads/2018/06/UMA-State-of-Urban-Manufacturing-Portland-City-Snapshot.pdf)

**Fourth, measure money where records already exist.** OPA requires centralized sales, making an anonymized event-sales extract a better starting point than asking exhibitors to remember a year later. Workshop billing can separate memberships, firing, classes, and commissions. Maker accounts can separate revenue, purchases, subcontracting, and owner earnings. None of those private records has been obtained for this publication.

**Finally, estimate only within a defined frame.** For each audited stratum, the count is its eligible records multiplied by an estimated active-and-paid fraction from a probability sample. Revenue should be estimated separately within business-size groups. Disclose nonresponse and location uncertainty. People missing from every list need an independent coverage study; overlap between self-selected directories cannot reliably tell us how many there are.

The [measurement appendix](methodology.md) specifies the formulas, assumptions, and sensitivity checks. The [community research kit](community-research-kit.md) supplies the operator and maker questions, project interviews, and proposed pilot. These are prepared instruments, not completed fieldwork.

**We can already say something substantial:** Portland supports varied forms of physical production, with visible businesses, paid work, specialist suppliers, shared equipment, and several routes to customers. The immediate opportunity is to connect those pieces into an account of who earns a living, what keeps production here, and where access breaks down. That would give Portland a much better basis for action than either a broad creative-economy headline or a count of makerspace members.
