"use client";

import { useState } from "react";
import { PB_SOURCES as sources } from "@/lib/participatory-budgeting";
import s from "@/app/(public)/deep-dives/participatory-budgeting/participatory-budgeting.module.css";

const allocation = 16.4;
export default function BudgetIllustration() {
  const [administration, setAdministration] = useState(1);
  const projects = allocation - administration;
  return <figure className={s.budget} aria-labelledby="budget-title" data-testid="pb-budget">
    <div className={s.budgetTop}>
      <div><p className={s.eyebrow}>Try the allocation</p><figcaption id="budget-title">How much reaches projects?</figcaption></div>
      <div className={s.total}><strong>$16.4M</strong><span>Preliminary ballot estimate · 2027–28</span></div>
    </div>
    <p>Running the program comes out of its funding, too. Change the assumed yearly cost to see what remains for projects.</p>
    <fieldset><legend>Assumed administration cost</legend>
      <div className={s.choices}>{[1,2,3].map(amount=><button key={amount} type="button" aria-pressed={administration===amount} onClick={()=>setAdministration(amount)}>${amount} million<span>{amount===1?"Advocate’s estimate":"Illustrative alternative"}</span></button>)}</div>
    </fieldset>
    <div aria-live="polite" aria-atomic="true" className={s.budgetResult}>
      <dl className={s.split}>
        <div><dt><i className={s.projectDot}/>For public projects</dt><dd>${projects.toFixed(1)}<span> million</span></dd></div>
        <div><dt><i className={s.adminDot}/>To run the program</dt><dd>${administration.toFixed(1)}<span> million</span></dd></div>
      </dl>
      <div className={s.bar} aria-hidden="true"><div style={{width:`${projects/allocation*100}%`}}/><div style={{width:`${administration/allocation*100}%`}}/></div>
      <p className={s.share}>{(projects/allocation*100).toFixed(1)}% for projects <span>{(administration/allocation*100).toFixed(1)}% for administration</span></p>
    </div>
    <p className={s.note}>These are scenarios, not a city budget. $1M is an advocate’s estimate; $2M and $3M test higher costs. Administration includes staff, outreach, voting, and evaluation. This graphic cannot tell us which other spending would change.</p>
    <noscript><p className={s.note}>With $2M in administration, $14.4M remains for projects. With $3M, $13.4M remains.</p></noscript>
    <div className={s.sources}><a href={sources.advocateFaq}>PB Oregon · estimate</a><a href={sources.ballot}>Ballot · preliminary allocation</a></div>
  </figure>;
}
