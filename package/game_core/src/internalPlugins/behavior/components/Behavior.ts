import { Component } from "game_ecs";

export abstract class Behavior {
    public abstract readonly typename: string;

    public init?(): void;
    public loop?(): void;
    public destroy?(): void;
}