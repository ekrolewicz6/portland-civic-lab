/** Original editorial illustrations. Labels and quantitative evidence live in HTML. */
export default function CivicIllustration({ scene, className }: {
  scene: "neighborhood" | "idea" | "develop" | "vote" | "deliver" | "review" | "metro" | "cambridge" | "seattle";
  className?: string;
}) {
  const ink = "#204b40", pale = "#e7edd7", gold = "#e3b77d", white = "#faf6e9", rust = "#b96745";
  const person = (x: number, y: number, color = ink) => <g transform={`translate(${x} ${y})`}>
    <circle cy="-35" r="12" fill={color}/><path d="M-18 7v-20a18 18 0 0 1 36 0V7" fill={color}/><path d="M-9 5v32M9 5v32" stroke={color} strokeWidth="8" strokeLinecap="round"/>
  </g>;
  const tree = (x: number, y: number) => <g transform={`translate(${x} ${y})`}><path d="M0 0v82" stroke={ink} strokeWidth="7"/><path d="M0-44-39 19h22l-29 42h92L17 19h22Z" fill={pale} stroke={ink} strokeWidth="3"/></g>;
  const ballot = <g><path d="m139 128 70-28 70 28-70 27Z" fill={white} stroke={ink} strokeWidth="3"/><path d="m139 128 70 27v80l-70-27Zm70 27 70-27v80l-70 27Z" fill={gold} stroke={ink} strokeWidth="3"/><path d="m182 130 53-20" stroke={ink} strokeWidth="6"/><g transform="rotate(-15 209 82)"><path d="M183 26h54v101h-54Z" fill={white} stroke={ink} strokeWidth="3"/><path d="m193 72 11 13 23-30" fill="none" stroke={rust} strokeWidth="6"/></g></g>;
  let art;
  switch (scene) {
    case "neighborhood": art=<>
      <circle cx="320" cy="66" r="37" fill={gold}/><path d="M0 212h420v68H0" fill={ink}/>
      {[0,1,2,3,4].map(i=><path key={i} d={`M${116+i*31} 223h19l-17 47h-19Z`} fill={white}/>)}
      <path d="M32 202V92l58-39 57 39v110ZM279 202V114l60-41 60 41v88Z" fill={pale} stroke={ink} strokeWidth="3"/>
      <path d="M54 114h24v25H54Zm48 0h24v25h-24ZM58 161h22v41H58Zm254-30h22v25h-22Zm39 0h22v25h-22Zm-33 48h20v23h-20Z" fill={ink}/>
      {tree(239,75)}{person(186,165,rust)}{person(218,187,ink)}
      <path d="M165 60h69v43h-38l-16 14v-14h-15Z" fill={white} stroke={ink} strokeWidth="2"/><path d="m184 79 10 10 21-21" stroke={rust} strokeWidth="4" fill="none"/>
    </>;break;
    case "idea": art=<>{person(171,188)}{person(248,188,rust)}<path d="M134 48h147v72h-58l-24 24v-24h-65Z" fill={white} stroke={ink} strokeWidth="3"/><path d="M161 80h93M175 94h66" stroke={gold} strokeWidth="7"/><path d="M99 237h220" stroke={ink} strokeWidth="3"/></>;break;
    case "develop": art=<><path d="M105 84h215v128H105Z" fill={white} stroke={ink} strokeWidth="3"/><path d="m136 177 35-44 29 17 49-37 40 53" fill="none" stroke={gold} strokeWidth="13"/><path d="M133 108h43M235 191h55" stroke={ink} strokeWidth="4"/>{person(92,195)}<path d="m253 77 53-48 14 15-53 48-18 5Z" fill={rust}/></>;break;
    case "vote": art=<>{ballot}{person(105,192,rust)}<path d="M86 237h226" stroke={ink} strokeWidth="3"/></>;break;
    case "deliver": art=<><path d="M70 135h280v90H70Z" fill={ink}/>{[0,1,2,3,4].map(i=><path key={i} d={`M${120+i*32} 145h20l-24 70H${96+i*32}Z`} fill={white}/>)}{person(203,87,rust)}<path d="M317 127V52m-18 0h36v33h-36Z" stroke={ink} strokeWidth="4" fill={gold}/><path d="M70 120h280M70 238h280" stroke={gold} strokeWidth="4"/></>;break;
    case "review": art=<><path d="M129 46h147v189H129Z" fill={white} stroke={ink} strokeWidth="3"/><rect x="168" y="32" width="69" height="30" rx="8" fill={gold}/>{[0,1,2].map(i=><g key={i}><path d={`m148 ${94+i*48} 10 10 19-22`} stroke={ink} strokeWidth="5" fill="none"/><path d={`M193 ${97+i*48}h59`} stroke={rust} strokeWidth="4"/></g>)}</>;break;
    case "metro": art=<><path d="M0 232q120-102 244-30t176-45v123H0Z" fill={pale}/><path d="M103 280q143-30 105-77t38-61" fill="none" stroke={gold} strokeWidth="25"/>{tree(107,77)}{tree(310,66)}{person(198,179,rust)}<path d="M265 210h66m-56 0v27m45-27v27" stroke={ink} strokeWidth="6"/></>;break;
    case "cambridge": art=<><path d="M0 221h420v59H0" fill={ink}/><path d="M32 211V93h85v118ZM309 211V74h83v137Z" fill={pale}/><path d="M45 116h24v28H45Zm39 0h22v28H84Zm239-16h21v28h-21Zm36 0h20v28h-20Z" fill={ink}/>{tree(166,68)}{person(262,176,rust)}<path d="M123 236h172M123 252h172" stroke={white} strokeWidth="7"/></>;break;
    case "seattle": art=<><path d="M0 223h420v57H0" fill={pale}/><path d="M56 220V112h65v108ZM127 220V75h72v145Z" fill={ink}/><path d="M67 131h12v17H67Zm25 0h12v17H92Zm47-34h15v20h-15Zm26 0h15v20h-15Z" fill={gold}/><circle cx="280" cy="129" r="79" fill={white} stroke={ink} strokeWidth="4"/><circle cx="280" cy="129" r="66" fill="none" stroke={gold} strokeWidth="3"/><path d="M280 77v52l35 25" stroke={ink} strokeWidth="7" fill="none" strokeLinecap="round"/>{[0,1,2,3].map(i=><path key={i} d="M280 66v10" transform={`rotate(${i*90} 280 129)`} stroke={rust} strokeWidth="4"/>)}</>;break;
  }
  return <svg className={className} viewBox="0 0 420 280" aria-hidden="true" focusable="false"><g>{art}</g></svg>;
}
