/**
 * Game event class
 */

export class GameEvent<T> {
  private _bubbles: boolean;
  constructor(
    public readonly target: T,
    public readonly type: string,
    bubbles: boolean,
  ) {
    this._bubbles = bubbles;
  }

  get bubbles() {
    return this._bubbles;
  }

  stopPropagation() {
    this._bubbles = false;
  }
}
