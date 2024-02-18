/**
 * Functions to convert beat to time
 */

export function timeToBeat(time: number, bpm: number, denominator: number = 4, quantize: number = 1) {
  return time / (bpm / (denominator * 60) * 1000);
}
