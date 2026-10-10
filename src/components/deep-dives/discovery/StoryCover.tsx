import type { ReactNode } from "react";

const colors: Record<string, [string, string, string, string]> = {
  "small-business": ["#153c32", "#c9df85", "#f6f1df", "#e4a575"],
  "data-centers": ["#173e34", "#bed8b0", "#f2c38e", "#719b87"],
  "participatory-budgeting": ["#d8c9b7", "#425e54", "#fff1d4", "#bc7858"],
  "campaign-finance": ["#ebbb99", "#703c30", "#faf1d9", "#ba5d43"],
  "maker-economy": ["#cbd4bc", "#365548", "#faf0d5", "#d18059"],
  fpdr: ["#c4d9df", "#33556c", "#fff2d6", "#b57e53"],
  continuum: ["#e1b8aa", "#664d58", "#fff0d7", "#bb7155"],
  homelessness: ["#d4d5bf", "#496259", "#fff3db", "#b27450"],
  "pps-budget": ["#e9ca77", "#665332", "#fff3d9", "#bc6e50"],
  libraries: ["#becbdc", "#465372", "#fff0d5", "#c17c61"],
  "city-budget": ["#d2d7c1", "#32574b", "#f7efd7", "#b08455"],
  "i-5-rose-quarter": ["#b6cace", "#385558", "#f9edd0", "#bd7451"],
  lloyd: ["#e4bba2", "#784835", "#fff1d1", "#af7455"],
  "oregon-economic-development": ["#c8ced6", "#435369", "#fff0d4", "#b57e5d"],
  "portland-growth-politics": ["#d3c5d1", "#655164", "#fff1da", "#b97461"],
  "mass-timber": ["#c4ceb1", "#425b3b", "#fff0d0", "#ac7647"],
  "venue-portfolio": ["#dfb994", "#69453c", "#fff0d5", "#b97557"],
  "who-runs-portland": ["#c1d4cb", "#365850", "#fcf0d7", "#b37d57"],
};

/** Original editorial illustrations, not data charts or representations of specific sites. */
export default function StoryCover({ slug, className }: { slug: string; className?: string }) {
  const [paper, ink, light, accent] = colors[slug] ?? colors["city-budget"];
  const house = (x: number, y: number, scale = 1, fill = light) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M0 52 58 4 116 52v96H0Z" fill={fill}/><path d="M-10 56 58 0l68 56" fill="none" stroke={ink} strokeWidth="7"/>
    <path d="M45 148V91h28v57" fill={ink}/><path d="M14 70h21v25H14zM82 70h21v25H82z" fill={accent}/>
  </g>;
  const rack = (x: number, y: number) => <g transform={`translate(${x} ${y})`}>
    <path d="m0 30 55-30 69 34-55 30Z" fill={light}/><path d="m0 30 69 34v160L0 190Z" fill={accent}/><path d="m69 64 55-30v160l-55 30Z" fill={ink}/>
    {[0,1,2,3,4].map(n=><g key={n}><path d={`m9 ${49+n*29} 50 25v17L9 ${66+n*29}Z`} fill={paper}/><circle cx="48" cy={75+n*29} r="2.5" fill={light}/></g>)}
    <path d="m79 78 33-19M79 94l33-19M79 110l33-19" stroke={accent} strokeWidth="3" opacity=".65"/>
  </g>;
  let art: ReactNode;
  switch (slug) {
    case "small-business": art=<>
      <circle cx="453" cy="89" r="47" fill={ink}/>
      <path d="M62 295h478" stroke={light} strokeWidth="3"/>
      <path d="M85 284V149h134v135ZM240 284V78h117v206ZM379 284V179h136v105Z" fill={light}/>
      <path d="m75 151 19-35h116l19 35Z" fill={accent}/>
      {[0,1,2,3].map(n=><path key={n} d={`M${89+n*35} 151v17q17 18 34 0v-17Z`} fill={n%2?light:ink}/>)}
      <path d="M104 195h47v56h-47ZM167 195h32v89h-32Z" fill={paper}/>
      {[0,1,2].map(n=><g key={n}><path d={`M258 ${99+n*49}h27v27h-27ZM310 ${99+n*49}h27v27h-27Z`} fill={paper}/></g>)}
      <path d="M381 179v-34l43 20v-20l45 20v-20l46 20v14Z" fill={accent}/>
      <path d="M397 201h25v30h-25ZM445 201h25v30h-25Z" fill={paper}/>
      <path d="M115 272h34M273 261h49M394 272h102" stroke={accent} strokeWidth="6"/>
    </>;break;
    case "data-centers": art=<>
      <circle cx="443" cy="100" r="62" fill={light}/><circle cx="443" cy="100" r="84" fill="none" stroke={accent} opacity=".5"/>
      {[0,1,2,3,4].map(n=><path key={n} d={`M-20 ${250+n*16}h140q40 0 65-32l35-40q24-30 65-30h335`} fill="none" stroke={accent} opacity=".55" strokeWidth="2"/>)}
      <path d="m100 268 225-107 197 88-225 112Z" fill="#102e27"/>
      {rack(140,89)}{rack(246,55)}{rack(352,105)}
    </>;break;
    case "campaign-finance": art=<>
      <circle cx="183" cy="167" r="102" fill={accent} opacity=".35"/>
      {[0,1,2,3].map(n=><g key={n}><path d={`M${84+n*53} 82v${80+n*18}Q${84+n*53} 240 300 240h145`} fill="none" stroke={ink} strokeWidth="3"/><circle cx={84+n*53} cy="82" r="20" fill={light} stroke={ink} strokeWidth="2"/><path d={`M${77+n*53} 77h14m-14 7h14`} stroke={accent} strokeWidth="3"/></g>)}
      <path d="m300 185 126-38 85 39-127 43Z" fill={light}/><path d="m300 185 84 44v100l-84-43Z" fill={accent}/><path d="m384 229 127-43v100l-127 43Z" fill={ink}/>
      <path d="m360 188 81-24" stroke={ink} strokeWidth="8"/>
      <g transform="rotate(-16 400 145)"><path d="M365 44h80v142h-80Z" fill={light} stroke={ink} strokeWidth="2"/><path d="m380 100 15 16 31-35" fill="none" stroke={accent} strokeWidth="7"/><path d="M382 140h40M382 152h30" stroke={ink} strokeWidth="3"/></g>
    </>;break;
    case "participatory-budgeting": art=<>
      <ellipse cx="300" cy="204" rx="166" ry="91" fill={ink}/>
      <ellipse cx="300" cy="188" rx="166" ry="91" fill={light}/>
      {[0,1,2].map(n=><g key={n} transform={`translate(${215+n*57} ${151+n*13}) rotate(-12)`}>
        <path d="M0 0h47v62H0Z" fill={n===1?accent:paper}/><path d="m12 27 8 8 15-19" stroke={ink} strokeWidth="4" fill="none"/>
      </g>)}
      {[0,1,2,3].map(n=><g key={n} transform={`rotate(${n*90} 300 188)`}>
        <circle cx="300" cy="58" r="23" fill={n%2?ink:accent}/>
        <path d="M263 119v-17a37 30 0 0 1 74 0v17" fill={n%2?ink:accent}/>
      </g>)}
    </>;break;
    case "maker-economy": art=<>
      <path d="M92 310V150a106 106 0 0 1 212 0v160Z" fill={ink}/>
      {Array.from({length:10},(_,n)=><path key={n} d={`M${112+n*19} 115v190`} stroke={light} strokeWidth="7"/>)}
      {Array.from({length:8},(_,n)=><path key={n} d={`M100 ${166+n*18}h197`} stroke={accent} strokeWidth="9"/>)}
      <path d="M334 290v-96h139v96q-66 40-139 0" fill={accent}/><ellipse cx="403" cy="195" rx="69" ry="20" fill={light}/><ellipse cx="403" cy="195" rx="45" ry="10" fill={ink}/>
      <circle cx="415" cy="85" r="49" fill={light}/>{[0,1,2,3].map(n=><circle key={n} cx="415" cy="85" r={15+n*9} fill="none" stroke={accent} strokeWidth="2"/>)}
      <path d="m482 81 22 14-99 144-22-14Z" fill={ink}/>
    </>;break;
    case "fpdr": art=<>
      <circle cx="383" cy="158" r="102" fill={light}/><circle cx="383" cy="158" r="84" fill="none" stroke={ink} strokeWidth="3"/>
      {Array.from({length:12},(_,n)=><path key={n} d="M383 83v10" stroke={ink} strokeWidth="3" transform={`rotate(${n*30} 383 158)`}/>)}
      <path d="M383 104v54l42 30" stroke={ink} strokeWidth="7" fill="none"/>
      {[0,1,2].map(n=><g key={n} transform={`translate(${105+n*68} ${246-n*29})`}>
        {[0,1,2,3].map(i=><g key={i}><path d={`M0 ${-i*16}v12q30 22 61 0v-12`} fill={accent}/><ellipse cx="30" cy={-i*16} rx="30" ry="10" fill={light} stroke={ink}/></g>)}
      </g>)}
      <path d="M85 314h421" stroke={ink} strokeWidth="3"/>
    </>;break;
    case "pps-budget": art=<>
      <path d="M90 118q98-24 210 28v169q-114-56-210-24ZM510 118q-98-24-210 28v169q114-56 210-24Z" fill={light} stroke={ink} strokeWidth="3"/>
      {[0,1,2,3].map(n=><g key={n}><path d={`M115 ${160+n*29}q65-7 152 27M333 ${187+n*29}q87-34 152-27`} fill="none" stroke={accent} strokeWidth="4"/></g>)}
      <g transform="rotate(25 390 122)"><path d="M374 24h31v184l-16 39-15-39Z" fill={accent}/><path d="m374 208 15 39 16-39" fill={ink}/><path d="M385 30v166" stroke={light} strokeWidth="4"/></g>
    </>;break;
    case "libraries": art=<>
      <circle cx="311" cy="152" r="130" fill={light} opacity=".65"/>
      {[0,1,2,3,4,5].map(n=><g key={n} transform={`translate(${110+n*60} ${n%2?88:114}) rotate(${n===5?12:0})`}>
        <rect width="48" height={n%2?206:180} rx="3" fill={n%3===0?accent:ink}/><path d="M10 22h28M10 30h28M10 154h28" stroke={light} strokeWidth="3"/>
      </g>)}<path d="M81 313h440" stroke={ink} strokeWidth="8"/>
    </>;break;
    case "city-budget": art=<>
      {[3,2,1,0].map(n=><g key={n} transform={`translate(${104+n*23} ${63+n*25})`}>
        <path d="m0 46 229-42 147 108-229 42Z" fill={n===0?light:accent} stroke={ink} strokeWidth="2"/>
        <path d="m0 46 147 108v19L0 66Z" fill={ink}/><path d="m147 154 229-42v19l-229 42Z" fill={paper} stroke={ink} strokeWidth="2"/>
      </g>)}<path d="m198 108 76-15 51 35-76 15Z" fill={accent}/><path d="m332 91 48-8m-29 22 48-8m-133 59 82-16" stroke={ink} strokeWidth="4"/>
    </>;break;
    case "i-5-rose-quarter": art=<>
      <path d="M0 279q166-123 283-14t317-19v114H0" fill={light}/>
      <path d="M210-35q-65 191 24 260t75 155" fill="none" stroke={ink} strokeWidth="71"/>
      <path d="M210-35q-65 191 24 260t75 155" fill="none" stroke={light} strokeWidth="3" strokeDasharray="17 13"/>
      <path d="M-10 249q292-150 620-160" fill="none" stroke={accent} strokeWidth="63"/>
      <path d="M-10 249q292-150 620-160" fill="none" stroke={light} strokeWidth="3" strokeDasharray="17 13"/>
      {[0,1,2,3].map(n=><path key={n} d={`M${313+n*57} ${99-n*12}v110`} stroke={ink} strokeWidth="5"/>)}
    </>;break;
    case "mass-timber": art=<>
      {[2,1,0].map(n=><g key={n} transform={`translate(0 ${n*58})`}>
        <path d="m146 103 212-49 99 65-213 49Z" fill={light} stroke={ink} strokeWidth="2"/>
        <path d="m146 103 98 65v24l-98-65Z" fill={accent}/><path d="m244 168 213-49v24l-213 49Z" fill={ink}/>
        {[0,1,2,3].map(i=><path key={i} d={`m${160+i*15} ${116+i*10} 194-47`} stroke={accent} strokeWidth="2"/>)}
      </g>)}<path d="M84 288V80m-44 76 44-76 44 76Zm0 59 44-76 44 76Z" fill={ink} stroke={ink} strokeWidth="5"/>
    </>;break;
    case "lloyd": art=<>
      <circle cx="401" cy="99" r="63" fill={light}/>
      <path d="M79 308V171h125v137ZM223 308V110h122v198ZM363 308V152h137v156Z" fill={ink}/>
      {[0,1,2,3].map(n=><g key={n}><path d={`M243 ${138+n*40}h25v22h-25ZM297 ${138+n*40}h25v22h-25Z`} fill={light}/><path d={`M384 ${176+n*32}h84v12h-84Z`} fill={accent}/></g>)}
      <path d="M98 197h86v23H98ZM98 247h86v23H98Z" fill={accent}/><path d="M285 105V24h213M480 24v94" stroke={ink} strokeWidth="4"/>
    </>;break;
    case "portland-growth-politics": art=<>
      <circle cx="300" cy="181" r="142" fill={light} opacity=".7"/>
      {house(80,120,.9,accent)}{house(355,120,.9,ink)}
      <path d="M300 102v208M204 131h192M237 131l-40 75h80l-40-75m126 0-40 75h80l-40-75" stroke={ink} strokeWidth="5" fill="none"/><circle cx="300" cy="102" r="12" fill={accent}/>
    </>;break;
    case "continuum": art=<>
      <path d="M45 282h120v-55h110v-57h111v-55h164" fill="none" stroke={ink} strokeWidth="9"/>
      {[0,1,2].map(n=><g key={n}><circle cx={127+n*111} cy={192-n*57} r="17" fill={accent}/><path d={`M${127+n*111} ${215-n*57}v42`} stroke={ink} strokeWidth="17" strokeLinecap="round"/></g>)}
      {house(379,18,.8)}<circle cx="91" cy="78" r="42" fill={light}/>
    </>;break;
    case "homelessness": art=<>
      <circle cx="300" cy="165" r="125" fill={light}/>{house(230,78,1.2,accent)}
      <path d="M52 302h93q35 0 35-36v-84q0-35 38-35M549 302h-91q-35 0-35-36v-84q0-35-38-35" fill="none" stroke={ink} strokeWidth="6"/>
      <circle cx="82" cy="251" r="16" fill={ink}/><path d="M82 276v25" stroke={ink} strokeWidth="18" strokeLinecap="round"/><circle cx="514" cy="251" r="16" fill={ink}/><path d="M514 276v25" stroke={ink} strokeWidth="18" strokeLinecap="round"/>
    </>;break;
    case "venue-portfolio": art=<>
      <path d="M103 305V58h394v247" fill={ink}/><path d="M127 305V80h346v225Z" fill={light}/>
      <path d="M127 80h125q-15 143-125 172ZM473 80H348q15 143 125 172Z" fill={accent}/>
      {[0,1,2,3].map(n=><g key={n}><path d={`M${143+n*23} 80q10 82-16 156M${457-n*23} 80q-10 82 16 156`} stroke={ink} opacity=".35" strokeWidth="3" fill="none"/></g>)}
      <ellipse cx="300" cy="272" rx="60" ry="16" fill={paper}/><path d="M86 311h428" stroke={ink} strokeWidth="12"/>
    </>;break;
    case "oregon-economic-development": art=<>
      <path d="M83 304V169l94-56v56l94-56v191Z" fill={ink}/><path d="M108 122V63h34v59" fill={accent}/>
      <circle cx="401" cy="191" r="96" fill={light}/><circle cx="401" cy="191" r="59" fill={accent}/><circle cx="401" cy="191" r="29" fill={paper}/>
      {Array.from({length:8},(_,n)=><path key={n} d="M387 79h28v46h-28Z" fill={light} transform={`rotate(${n*45} 401 191)`}/>)}
      <path d="M108 209h27v28h-27ZM163 209h27v28h-27ZM218 209h27v28h-27Z" fill={light}/>
    </>;break;
    default: art=<>
      <circle cx="300" cy="178" r="118" fill="none" stroke={ink} strokeWidth="2" strokeDasharray="4 9"/>
      {[0,1,2,3,4,5].map(n=><g key={n} transform={`rotate(${n*60} 300 178)`}><path d="M300 178V60" stroke={ink} strokeWidth="3"/><circle cx="300" cy="60" r="31" fill={n%2?accent:light} stroke={ink} strokeWidth="2"/></g>)}
      <circle cx="300" cy="178" r="52" fill={ink}/><path d="m269 164 31-21 31 21m-54 9v34m23-34v34m23-34v34m-54 0h62" stroke={light} strokeWidth="5" fill="none"/>
    </>;
  }
  return <svg className={className} viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true" focusable="false">
    <rect width="600" height="360" fill={paper}/>
    <path d="M24 30h16m-8-8v16M560 330h16m-8-8v16" stroke={ink} opacity=".35"/>
    <circle cx="540" cy="41" r="3" fill={ink} opacity=".4"/>
    <g>{art}</g>
  </svg>;
}
