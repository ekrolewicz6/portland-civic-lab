/**
 * Soft hyphens (U+00AD) at real syllable breaks for the long words in stage
 * names, so they wrap cleanly inside the fourteen-column strips instead of
 * overflowing or breaking mid-syllable. Invisible unless the browser needs
 * to break the word.
 */
const SHY: Record<string, string> = {
  Prevention: "Pre­ven­tion",
  Diversion: "Di­ver­sion",
  unsheltered: "un­shel­tered",
  Institutional: "In­sti­tu­tional",
  Assessment: "As­sess­ment",
  stabilization: "sta­bi­li­za­tion",
  sobering: "so­ber­ing",
  Withdrawal: "With­draw­al",
  management: "man­age­ment",
  Residential: "Resi­den­tial",
  inpatient: "in­pa­tient",
  treatment: "treat­ment",
  Medical: "Med­ical",
  respite: "res­pite",
  hospital: "hos­pital",
  Emergency: "Emer­gen­cy",
  shelter: "shel­ter",
  transitional: "tran­si­tion­al",
  housing: "hous­ing",
  rehousing: "re­hous­ing",
  Permanent: "Per­ma­nent",
  supportive: "sup­port­ive",
  followed: "fol­lowed",
};

/** Insert soft hyphens into the known long words of a stage name. */
export function shy(name: string): string {
  return name
    .split(" ")
    .map((w) => SHY[w] ?? w)
    .join(" ");
}
