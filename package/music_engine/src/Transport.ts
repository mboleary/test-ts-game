/**
 * class for keeping time and managing playback
 */

export class Transport {
  constructor() {}

  // Current beat info
  private currentBpm: number = 120;
  private currentTimeSigNumerator: number = 4;
  private currentTimeSigDenominator: number = 4;

  private lastPlayStartTime: number = 0;
  private lastStopTime: number = 0;

  private timeOffset: number = 0;

  public play() {}
  public stop() {}
  public set(){}
  public reset() {}

  public setBpm(bpm: number, time?: number) {}
  public setTimeSig(numerator: number, denominator: number, time?:number) {}
  public setTempo(tempo: number, time?:number) {}

  public getCurrentBeat(): number { return 0;}
  public getcurrentBar(): number { return 0;}
  public getCurrentTime(): number { return 0;}
  public getBpm(): number { return 0;}
  public getTempo(): number { return 0;}

}
