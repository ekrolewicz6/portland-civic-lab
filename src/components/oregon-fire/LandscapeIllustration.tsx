export default function LandscapeIllustration({ kind }: { kind: string }) {
  const trees =
    kind === "wet"
      ? [45, 85, 130, 173, 220, 270, 310, 357, 397, 445, 480]
      : kind === "pine"
        ? [65, 172, 300, 435]
        : kind === "oak"
          ? [120, 375]
          : [];
  return (
    <svg
      viewBox="0 0 520 320"
      role="img"
      aria-label={`Conceptual illustration of ${kind === "wet" ? "a dense wet forest" : kind === "pine" ? "an open pine forest" : kind === "oak" ? "oak trees and prairie" : "sagebrush and grassland"}`}
    >
      <rect width="520" height="320" fill="#e6e6d5" />
      <circle cx="424" cy="64" r="31" fill="#e1b878" />
      <path
        d="M0 182 96 91 182 167 285 80 398 169 461 128 520 174V320H0Z"
        fill="#b6c0ab"
      />
      <path d="M0 237 Q150 163 277 220T520 204V320H0Z" fill="#80977b" />
      <path d="M0 280 Q145 221 291 263T520 244V320H0Z" fill="#4c6b54" />
      {trees.map((x, i) => {
        const y = kind === "wet" ? 70 + (i % 3) * 22 : 111 + (i % 2) * 25;
        return (
          <g key={x}>
            <path
              d={`M${x} ${y + 35}V278`}
              stroke="#6e4e31"
              strokeWidth={kind === "oak" ? 12 : 8}
            />
            {kind === "oak" ? (
              <>
                <ellipse cx={x} cy={y + 20} rx="69" ry="42" fill="#294e3d" />
                <ellipse
                  cx={x - 26}
                  cy={y + 3}
                  rx="42"
                  ry="35"
                  fill="#3d6346"
                />
              </>
            ) : (
              <>
                <path
                  d={`M${x} ${y}l-35 83h17l-28 46h92l-28-46h17Z`}
                  fill={i % 2 ? "#244838" : "#355b43"}
                />
                <path d={`M${x} ${y}l-24 61h24Z`} fill="#557659" />
              </>
            )}
          </g>
        );
      })}
      {Array.from({ length: kind === "sage" ? 16 : 11 }, (_, i) => (
        <g
          key={i}
          transform={`translate(${20 + i * 33},${278 + (i % 3) * 12})`}
          stroke={kind === "sage" ? "#bcc7aa" : "#c1b373"}
          strokeWidth="2"
          fill="none"
        >
          <path d="M0 20V0M0 15-9 5M0 13 10 1" />
          {kind === "sage" && <path d="M-12 8Q-8-12 0 0Q12-12 14 9" />}
        </g>
      ))}
      <text x="18" y="306" fill="#ecebdc" fontSize="9" letterSpacing="2">
        CONCEPTUAL LANDSCAPE · NOT A SITE ASSESSMENT
      </text>
    </svg>
  );
}
