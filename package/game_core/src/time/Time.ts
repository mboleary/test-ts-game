import { GameTimeManager } from "../managers/GameTimeManager";

export class Time {
    constructor(
        private timeManager: GameTimeManager
    ) {}
    public getTime() {
        return this.timeManager.getTime();
    }

    public get paused() {
        return this.timeManager.paused;
    }

    public get deltaTime() {
        return this.timeManager.deltaTime;
    }
}