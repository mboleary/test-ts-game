import { inject, injectable } from "inversify";
import { GameTimeManager } from "../managers/GameTimeManager";

@injectable()
export class Time {
    constructor(
        @inject(GameTimeManager) private timeManager: GameTimeManager
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