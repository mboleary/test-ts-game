/**
 * Functions used for converting beats to time
 */

export function beatToTime(bpm: number, beats: number, denominator: number = 4): number {
  return ((bpm / (denominator * 60)) * beats) * 1000;
}

export function timeSigToBeat(timeSigTop: number, timeSigBottom: number, multiplier: number = 1): number {
  return (timeSigTop / timeSigBottom) * multiplier;
}
