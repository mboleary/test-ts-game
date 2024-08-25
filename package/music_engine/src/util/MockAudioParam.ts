/**
 * Implements an AudioParam for use when an AudioParam is desired but not available
 */

export type AudioParamEvent = {
  startTime: number;
  endTime?: number;
  duration?: number;
  startValue?: number;
  endValue?: number;
  valueArr?: number[] | Float32Array;
  directive: "hold" | "reset" | "exp_ramp" | "lerp" | "set" | "set_exp"
}

export class MockAudioParam implements AudioParam {
  public readonly automationRate: AutomationRate = "k-rate";

  constructor(
    private readonly audioContext: AudioContext,
    public defaultValue: number,
    public readonly maxValue: number,
    public readonly minValue: number,
  ) {}

  public value: number = this.defaultValue;

  private readonly events: AudioParamEvent[] = [];

  cancelAndHoldAtTime(cancelTime: number): AudioParam {
    this.cancelAfter(cancelTime);

    this.events.push({
      startTime: cancelTime,
      directive: "hold",
    });

    return this;
  }
  cancelScheduledValues(cancelTime: number): AudioParam {
    this.cancelAfter(cancelTime);

    this.events.push({
      startTime: cancelTime,
      directive: "reset",
      startValue: this.value
    });

    return this;
  }
  exponentialRampToValueAtTime(value: number, endTime: number): AudioParam {
    this.events.push({
      startTime: this.audioContext.currentTime,
      endTime,
      directive: "exp_ramp",
      endValue: value
    });

    return this;
  }
  linearRampToValueAtTime(value: number, endTime: number): AudioParam {
    this.events.push({
      startTime: this.audioContext.currentTime,
      endTime,
      directive: "lerp",
      endValue: value
    });

    return this;
  }
  setTargetAtTime(target: number, startTime: number, timeConstant: number): AudioParam {
    this.events.push({
      startTime,
      duration: timeConstant,
      directive: "exp_ramp",
      endValue: target
    });

    return this;
  }
  setValueAtTime(value: number, startTime: number): AudioParam {
    this.events.push({
      startTime,
      directive: "set",
      startValue: value
    });

    return this;
  }
  setValueCurveAtTime(values: number[] | Float32Array, startTime: number, duration: number): AudioParam {
    this.events.push({
      startTime,
      duration,
      directive: "set_exp",
      valueArr: values
    });

    return this;
  }

  public getValueAtTime(time: number): number {
    const eventsWithinTime = this.events.filter(evt => 
      (
        evt.startTime === undefined || (
          evt.startTime && time >= evt.startTime
        )
      ) && (
        evt.endTime === undefined || (
          evt.endTime && time <= evt.endTime
        )
      )
    );

    let toRet = this.value;

    for (const evt of eventsWithinTime) {
      switch (evt.directive) {
        case "set":
          break;
        case "hold":
          break;
        case "reset":
          break;
        default:
          console.warn("unhandled mock audio param event type", evt.directive);
      }
    }
    return toRet;
  }

  private cancelAfter(time: number) {
    const newEvents = this.events.filter(evt => evt.startTime < time);
    this.events.splice(0, this.events.length, ...newEvents);
  }

}
