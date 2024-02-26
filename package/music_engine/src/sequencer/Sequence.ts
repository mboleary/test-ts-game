import { TrackBlock } from "./TrackBlock";


export class Sequence extends TrackBlock {
  public notes: number[][] = [[]]; // note, start beat, stop beat
}
