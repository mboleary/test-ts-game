import { PortDirection } from "../types/PortDirection.enum";
import { PortType } from "../types/PortType";
import { MusicEnginePort } from "./Port";

export class AudioParamPort extends MusicEnginePort implements AudioParam {
  
  constructor(
    name: string,
    direction: PortDirection,
    defaultValue: number,
  ) {
    super(name, direction, PortType.PARAM);
    this._defaultValue = defaultValue;
    this._value = defaultValue;
  }

  protected handleConnect(port: AudioParamPort): void {
  }

  protected handleDisconnect(port: AudioParamPort): void {
  }

  private readonly registeredParams: AudioParam[] = [];

  public registerAudioParam(param: AudioParam) {
    if (this.direction !== PortDirection.IN) {
      throw new Error('cannot register audio params to outgoing port');
    }
    const idx = this.registeredParams.indexOf(param);
    if (idx === -1) {
      this.registeredParams.push(param);
      this.syncAudioParam(param);
    }
  }

  public unregisterAudioParam(param: AudioParam) {
    const idx = this.registeredParams.indexOf(param);
    if (idx === -1) {
      this.registeredParams.splice(idx, 1);
    }
  }

  /**
   * Sync AudioParam state to what's defined here
   * @param param AudioParam
   */
  private syncAudioParam(param: AudioParam) {
    param.value = this._value;
    const keys = this.functionCallValues.keys();
    for (const k of keys) {
      const vals = this.functionCallValues.get(k);
      if (vals) {
        switch(k) {
          case('cancelAndHoldAtTime'): 
            param.cancelAndHoldAtTime(vals[0]);
            break;
          case('cancelScheduledValues'):
            param.cancelScheduledValues(vals[0]);
            break;
          case('exponentialRampToValueAtTime'):
            param.exponentialRampToValueAtTime(vals[0], vals[1]);
            break;
          case('linearRampToValueAtTime'):
            param.linearRampToValueAtTime(vals[0], vals[1]);
            break;
          case('setTargetAtTime'):
            param.setTargetAtTime(vals[0], vals[1], vals[2]);
            break;
          case('setValueAtTime'):
            param.setValueAtTime(vals[0], vals[1]);
            break;
          case('setValueCurveAtTime'):
            param.setValueCurveAtTime(vals[0], vals[1], vals[2]);
            break;
        }
      }
    }
  }

  private syncAllAudioParams() {
    for (const p of this.registeredParams) {
      this.syncAudioParam(p);
    }
  }

  private readonly _defaultValue: number;
  private _value: number = -1;

  public get automationRate(): AutomationRate {
    return this.registeredParams[0]?.automationRate;
  }

  public get defaultValue(): number {
    return this._defaultValue;
  }

  public get maxValue(): number {
    return this.registeredParams[0]?.minValue;
  }

  public get minValue(): number {
    return this.registeredParams[0]?.maxValue;
  }

  public get value(): number {
    return this._value;
  }

  public set value(v: number) {
    this._value = v;
    this.syncAllAudioParams();
  }

  private functionCallValues: Map<keyof AudioParam, [any, any?, any?]> = new Map();
  private storeFunctionCall(name: keyof AudioParam, params: [any, any?, any?]) {
    if (this.direction === PortDirection.IN) {
      this.functionCallValues.set(name, params);
      this.syncAllAudioParams();
    } else {
      const ports = this.getConnectedPorts();
      for (const port of ports as AudioParamPort[]) {
        const f = port[name as keyof AudioParamPort];
        if (typeof f === 'function') {
          f(...params);
        }
      }
    }
  }

  cancelAndHoldAtTime(cancelTime: number): AudioParam {
    this.storeFunctionCall('cancelAndHoldAtTime', [
      cancelTime
    ]);
    return this;
  }

  cancelScheduledValues(cancelTime: number): AudioParam {
    this.storeFunctionCall('cancelScheduledValues', [
      cancelTime
    ]);
    return this;
  }

  exponentialRampToValueAtTime(value: number, endTime: number): AudioParam {
    this.storeFunctionCall('exponentialRampToValueAtTime', [
      value,
      endTime
    ]);
    return this;
  }

  linearRampToValueAtTime(value: number, endTime: number): AudioParam {
    this.storeFunctionCall('linearRampToValueAtTime', [
      value,
      endTime
    ]);
    return this;
  }

  setTargetAtTime(target: number, startTime: number, timeConstant: number): AudioParam {
    this.storeFunctionCall('setTargetAtTime', [
      target,
      startTime,
      timeConstant
    ]);
    return this;
  }

  setValueAtTime(value: number, startTime: number): AudioParam {
    this.storeFunctionCall('setValueAtTime', [
      value,
      startTime
    ]);
    return this;
  }

  setValueCurveAtTime(values: number[] | Float32Array, startTime: number, duration: number): AudioParam {
    this.storeFunctionCall('setValueCurveAtTime', [
      values,
      startTime,
      duration
    ]);
    return this;
  }
}
