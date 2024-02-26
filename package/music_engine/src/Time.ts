import { repeatingPulse } from "./util/beatGenerator";
import { beatToTime } from "./util/beatToTime";
import { quantizeTimeToBeat, timeToBeat } from "./util/timeToBeat";


export class Time {
  public static in(bpm: number, beats: number, denominator: number = 4): number {
    return beatToTime(bpm, beats, denominator);
  }

  public static every(bpm: number, beats: number, denominator: number, offset: number = 0): Generator {
    return repeatingPulse(beatToTime(bpm, beats, denominator), offset);
  }

  public static next(bpm: number, beat: number, currentTime: number, denominator: number = 4): number {
    return quantizeTimeToBeat(currentTime, bpm, denominator, beat)
  }
}
