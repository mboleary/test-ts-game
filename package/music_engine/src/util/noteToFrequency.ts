const REFERENCE_PITCH = 440; // A below middle C
const REFERENCE_NOTE = 69;
const ET_CONST = Math.pow(2, 1/12);

export function noteToFrequencyEqualTemperment(
  note: number,
): number {
  return REFERENCE_PITCH * Math.pow(ET_CONST, (note - REFERENCE_NOTE));
}
