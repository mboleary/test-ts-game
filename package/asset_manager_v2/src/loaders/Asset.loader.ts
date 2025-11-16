import { AssetManager } from "../AssetManager";
import { Loader } from "../Loader";

export type AssetLoaderOptions = {
    name: string,
};

/**
 * Pulls an asset's cached data as a loader step
 */
export class AssetLoader extends Loader<never, any, AssetLoaderOptions> {
    constructor(
        private readonly assetManager: AssetManager
    ) {
        super("asset");
    }

    public validateOptions(options: AssetLoaderOptions): boolean {
        return !!options.name && this.assetManager.hasAsset(options.name);
    }

    public async run(input: never, options: AssetLoaderOptions): Promise<any> {
        return this.assetManager.loadAsset(options.name);
    }
}