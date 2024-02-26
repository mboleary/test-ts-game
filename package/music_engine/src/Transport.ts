/**
 * class for keeping time and managing playback
 */

export class Transport {
  constructor(
    context: AudioContext,
    bpm: number = 120,
    timeSignatureNumerator: number = 4,
    timeSignatureDenominator: number = 4,
  ) {
    this.currentBpm = bpm;
    this.currentTimeSigNumerator = timeSignatureNumerator;
    this.currentTimeSigDenominator = timeSignatureDenominator;
  }

  // Current beat info
  private currentBpm: number;
  private currentTimeSigNumerator: number;
  private currentTimeSigDenominator: number;

  // Tracking when playback was stopped and started
  private lastPlayStartTime: number = 0;
  private lastStopTime: number = 0;
  private timeOffset: number = 0;

  public play(time?: number) {
    
  }

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
