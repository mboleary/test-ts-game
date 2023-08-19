import { Engine } from "../Engine"

export type EngineInternals = {
    get<T>(token: Symbol): T | null,
    engine: Engine
};
