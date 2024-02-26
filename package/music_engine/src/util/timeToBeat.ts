/**
 * Functions to convert beat to time
 */

export function timeToBeat(time: number, bpm: number, denominator: number = 4) {
  return time / (bpm / (denominator * 60));
}

export function quantizeTimeToBeat(
  time: number,
  bpm: number,
  denominator: number = 4,
  quantize: number = 1
) {
  return Math.ceil((time / (bpm / (denominator * 60))) * (1 / quantize));
}
