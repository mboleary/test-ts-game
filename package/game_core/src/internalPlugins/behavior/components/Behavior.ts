import { Component } from "game_ecs";



export abstract class Behavior {

    constructor(
        typename: string,
    ) {
        
    }

    private _priority: number = 0;

    
    public get priority() {
        return this._priority;
    }
    public init?(): void;
    public loop?(): void;
    public destroy?(): void;
}
