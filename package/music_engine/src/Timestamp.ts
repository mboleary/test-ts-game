import { Transport } from "./Transport";

export class Timestamp {
  private bpm: number = -1;
  private timeSigNumerator: number = -1;
  private timeSigDenominator: number = -1;

  constructor(
    private time: number,
    private transport?: Transport
  ) {
    if (transport) {
      this.bpm = transport.getBpm();
      // this.timeSigNumerator = transport.
    }
  }

  public getTime() {
    return this.time;
  }

  // public getBeat


}
