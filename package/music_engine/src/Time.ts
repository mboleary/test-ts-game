import { repeatingPulse } from "./util/beatGenerator";
import { beatToTime } from "./util/beatToTime";


export class Time {
  public static in(bpm: number, beats: number, denominator: number = 4): number {
    return beatToTime(bpm, beats, denominator);
  }

  public static every(bpm: number, beats: number, denominator: number, offset: number = 0): Generator {
    return repeatingPulse(beatToTime(bpm, beats, denominator), offset);
  }
}
