import { repeatingPulse } from "./util/beatGenerator";
import { beatToTime, timeSigToBeat } from "./util/beatToTime";
import { timeToBeat } from "./util/timeToBeat";

Object.assign(window, {
  beatToTime,
  timeSigToBeat,
  repeatingPulse,
  timeToBeat
});
