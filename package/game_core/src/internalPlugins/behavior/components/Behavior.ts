import { Component } from "game_ecs";



export abstract class Behavior {

    constructor(
        typename: string,
    ) {
        
    }

    

    public init?(): void;
    public loop?(): void;
    public destroy?(): void;
}
