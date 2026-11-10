const GSM_BASIC = new Set(Array.from("@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà"));
const GSM_EXTENDED = new Set(Array.from("\f^{}\\[~]|€"));

export function calculateSmsSegments(message: string) {
  let encoding: "GSM-7" | "UCS-2" = "GSM-7";
  const widths: number[] = [];
  for (const character of message) {
    if (GSM_BASIC.has(character)) widths.push(1);
    else if (GSM_EXTENDED.has(character)) widths.push(2);
    else { encoding = "UCS-2"; break; }
  }
  const encodedWidths = encoding === "GSM-7" ? widths : Array.from(message, character => character.length);
  const units = encodedWidths.reduce((sum, width) => sum + width, 0);
  const singleLimit = encoding === "GSM-7" ? 160 : 70;
  const multipartLimit = encoding === "GSM-7" ? 153 : 67;
  let segments = message ? 1 : 0;
  if (units > singleLimit) {
    let used = 0;
    for (const width of encodedWidths) {
      // Keep GSM escape pairs and Unicode surrogate pairs together.
      if (used + width > multipartLimit) { segments += 1; used = 0; }
      used += width;
    }
  }
  return { encoding, units, segments, characters: Array.from(message).length };
}
