import { AssetDefinition } from "./AssetDefinition.type";

export type Asset = AssetDefinition & {
    state: {
        cached: boolean,
    }
}