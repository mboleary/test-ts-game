/**
 * This interfaces with the time class to set values such as delta time and advancing time while paused for debugging
 */

import { TARGET_MILLIS_PER_FRAME as target } from "../time/const";

export class GameTimeManager {
    protected timeDiff: number = 0; // Difference between the actual time, and what should be reported to the game
    protected timePaused = 0;
    protected isPaused = false;
    protected _deltaTime: number = 0;
    protected currTime = 0;

    public readonly TARGET_MILLIS_PER_FRAME = target;

    public getTime() {
        if (this.isPaused) return this.timePaused;
        return window.performance.now() - this.timeDiff;
    }
    
    public get paused(): boolean {
        return this.isPaused;
    }

    public get deltaTime(): number {
        return this._deltaTime;
    }

    /**
     * Initializes time
     */
    public initTime() {
        this.currTime = window.performance.now();
    }

    /**
     * Advance time While paused for debugging
     * @param {Number} amt Amount to advance the time
     */
    public advanceTime(amt: number) {
        if (!this.isPaused || !amt || amt <= 0) return;
        this.timePaused += amt;
    }

    /**
     * Updates the Delta Time
     */
    public updateDeltaTime() {
        let prevTime = this.currTime;
        this.currTime = this.getTime();
        this._deltaTime = this.currTime - prevTime;
    }

    /**
     * Pause time for debugging
     */
    public pauseTime() {
        this.isPaused = true;
        this.timePaused = window.performance.now();
    }
    
    /**
     * Unpause time for debugging
     */
    public unpauseTime() {
        if (!this.isPaused) return;
        this.isPaused = false;
        this.timeDiff += window.performance.now() - this.timePaused;
        this.timePaused = 0;
    }
}