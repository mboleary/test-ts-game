/**
 * Provides an interface to use AudioParams for custom fields
 */

export abstract class MusicEngineParameter<T> implements AudioParam {
  constructor(
    private readonly context: AudioContext,
    public readonly defaultValue: number,
    public readonly maxValue: number,
    public readonly minValue: number,
    public readonly value: number,
  ) {
  }

  public readonly automationRate: AutomationRate = 'k-rate';
  
  cancelAndHoldAtTime(cancelTime: number): AudioParam {
    throw new Error("Method not implemented.");
  }
  cancelScheduledValues(cancelTime: number): AudioParam {
    throw new Error("Method not implemented.");
  }
  exponentialRampToValueAtTime(value: number, endTime: number): AudioParam {
    throw new Error("Method not implemented.");
  }
  linearRampToValueAtTime(value: number, endTime: number): AudioParam {
    throw new Error("Method not implemented.");
  }
  setTargetAtTime(target: number, startTime: number, timeConstant: number): AudioParam {
    throw new Error("Method not implemented.");
  }
  setValueAtTime(value: number, startTime: number): AudioParam {
    throw new Error("Method not implemented.");
  }
  setValueCurveAtTime(values: number[] | Float32Array, startTime: number, duration: number): AudioParam {
    throw new Error("Method not implemented.");
  }

  abstract getValue(): T;

  abstract setValue(value: T, time?: number): void;
  
}
