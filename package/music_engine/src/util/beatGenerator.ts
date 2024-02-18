/**
 * Generates repeating beat patterns using generators
 */

export function* repeatingPulse(time: number, offset: number = 0) {
  let curr = offset;
  while(true) {
    yield curr += time;
  }
}
