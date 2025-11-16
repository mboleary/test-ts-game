import { LoaderDefinition } from "./LoaderDefinition.type"

export type AssetDefinition = {
    name: string,
    meta?: object,
    chain: LoaderDefinition[],
    cache?: {
        enable: boolean
    }
}