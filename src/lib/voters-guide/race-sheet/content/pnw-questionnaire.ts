import type { Evidence } from "../../types";

/**
 * Portland: Neighbors Welcome’s 2026 endorsement questionnaire. The group
 * endorses in these races; the files are the candidates’ own written answers,
 * which the group published in a public Drive folder (shared with the Lab on
 * October 14, 2026). Sixteen certified Council candidates answered. Private
 * copies: runtime-data/source-archive/2026-10-14/pnw-questionnaire/.
 */
export const PNW_FOLDER = "https://drive.google.com/drive/folders/1_aX_tey7uYYvNb_nmwW3bd8AP4Q7Sg4V";

export const pnwResponses: Record<string, { name: string; fileId: string }> = {
  "ali-beaudoin": { name: "Ali Beaudoin", fileId: "1XMajC1nV59-9350txk039BrUyeIZ36EG" },
  "angelita-morillo": { name: "Angelita Morillo", fileId: "1BC449lgZsDaeWwicY_hj1ch9aLKNtSHf" },
  "cristal-otero": { name: "Cristal Otero", fileId: "1pjSnaD-cUClqZ3ryNjgaRvXynojNHhZR" },
  "eric-zimmerman": { name: "Eric Zimmerman", fileId: "1kx9In6vGM95DgMkv46FuGG01T-y8VbyN" },
  "esther-leon": { name: "Esther León", fileId: "1fW5MmJdmahdNu1obBed8QsZ0qEZh0ENJ" },
  "jamey-evenstar": { name: "Jamey Evenstar", fileId: "1073l7qNrnBbaxWhBg-KtcqlknOWWPoBW" },
  "jeremy-beausoleil-smith": { name: "Jeremy Beausoleil Smith", fileId: "1GUc-hsUwEheYm6-4ZKqJPs2nmF2x2-vD" },
  "john-sweeney": { name: "John Sweeney", fileId: "1H8LdZ7t93JRe7HKz_YWgezyrKdplV6oz" },
  "keir-legree": { name: "Keir Legree", fileId: "1DksKU7sfSIJwxiHDs5nOvxM-y-YGbmTQ" },
  "kellie-torres": { name: "Kellie Torres", fileId: "1kVZhYNVF2Mj20fuACsg6W6KZN3PS0feI" },
  "kimberly-tucker": { name: "Kimberly Tucker", fileId: "14Vs0js09sUExVAAI9yeqq-iE_flx_MxI" },
  "mitch-green": { name: "Mitch Green", fileId: "1mhoKKn8GtS3B-lKQ0UQObmqA1nx28gjm" },
  "olivia-clark": { name: "Olivia Clark", fileId: "11lp0l3LAtYUwcxblFMKSWdqiwG3MkqBC" },
  "patrick-hilton": { name: "Patrick Hilton", fileId: "1qbWmpu2uJin54numtCiPTUWW_eiL3RKm" },
  "tiffany-koyama-lane": { name: "Tiffany Koyama Lane", fileId: "1MakujA2MdTFPlnuYFFhPeXM_Q6zrgyD2" },
  "timothy-tj-anderson": { name: "Timothy (TJ) Anderson", fileId: "1zaSaEholnEPmJVTXRDzEcoX2l2lzof1V" },
};

export const pnwQuestionnaire = (candidateId: string): Evidence => {
  const r = pnwResponses[candidateId];
  if (!r) throw new Error(`No Portland: Neighbors Welcome response on file for ${candidateId}`);
  return {
    label: `Portland: Neighbors Welcome 2026 endorsement questionnaire · ${r.name}’s responses`,
    url: `https://drive.google.com/file/d/${r.fileId}/view`,
    kind: "Candidate statement",
    date: "Responses posted September 22, 2026; reviewed October 14, 2026",
    note: "The candidate’s own written answers, published by a group that endorses in this race. Campaign position; claimed results have not been independently verified.",
  };
};
