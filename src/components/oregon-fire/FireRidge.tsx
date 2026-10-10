/** The ridgeline that closes a hero and hands the page to the paper below. */
export default function FireRidge() {
  return (
    <svg
      className="fire-ridge"
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 58 96 40 178 52 300 18 398 46 520 26 640 54 772 22 880 48 1010 30 1130 56 1262 34 1356 50 1440 38V90H0Z"
        fill="#214337"
      />
      <path
        d="M0 70 140 52 262 68 420 44 560 66 700 50 858 70 1020 48 1160 66 1310 52 1440 64V90H0Z"
        fill="#2c5546"
      />
      <path
        d="M0 80Q180 60 360 76T720 72T1080 78T1440 68V90H0Z"
        fill="#f7f3ed"
      />
    </svg>
  );
}
