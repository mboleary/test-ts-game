import { Loader } from "./Loader";
import { defaultAssetDefinition } from "./defaults/AssetDefinition.default";
import { Asset } from "./types/Asset.type";
import { AssetDefinition } from "./types/AssetDefinition.type";
import { LoaderDefinition } from "./types/LoaderDefinition.type";


export class AssetManager {
    private readonly loaderMap: Map<string, Loader<any, any, any>> = new Map();
    private readonly assetMap: Map<string, Asset> = new Map();
    private readonly cachedAssetMap: Map<string, any> = new Map();
    private readonly loadGroups: Map<string, string[]> = new Map();

    constructor() {}

    public registerLoader(loader: Loader<any, any, any>) {
        this.loaderMap.set(loader.name, loader);
    }

    public defineAsset(name: string, chain: LoaderDefinition[], meta?: object, cacheOptions?: AssetDefinition['cache']) {
        if (this.assetMap.has(name)) {
            throw new Error("Asset Already Exists with this name");
        }

        for (const loaderDef of chain) {
            const loader = this.loaderMap.get(loaderDef.type);
            if (!loader) {
                throw new Error(`Loader ${loaderDef.type} is not registered!`);
            }
            if (!loader.validateOptions(loaderDef.options)) {
                throw new Error(`Loader Options Validation failed`);
            }
        }

        const assetDef: Asset = Object.assign({}, defaultAssetDefinition, {
            name,
            meta,
            chain,
            cache: cacheOptions || defaultAssetDefinition.cache,
            state: {
                cached: false
            },
        });

        this.assetMap.set(name, assetDef);
    }

    public defineAssetGroup(name: string, assets: string[]) {
        if (this.loadGroups.has(name)) {
            throw new Error("Asset Group Already Exists with this name");
        }

        // Validate asset names
        for (const assetName of assets) {
            if (!this.assetMap.has(assetName)) {
                throw new Error(`Asset ${assetName} does not exist!`);
            }
        }

        this.loadGroups.set(name, assets);
    }

    private async runAssetChain(assetDef: AssetDefinition) {
        // Loader Chain
        let value: any = null;
        for (const chainElem of assetDef.chain) {
            const loader = this.loaderMap.get(chainElem.type);
            if (!loader) {
                throw new Error(`Cannot get Loader ${chainElem.type}`);
            }

            value = await loader.run(value, chainElem.options);
        }
        return value;
    }

    public async loadAsset(name: string): Promise<any> {
        const assetDef = this.assetMap.get(name);

        if (!assetDef) {
            throw new Error("Asset Not Defined!");
        }

        if (assetDef.state.cached) {
            const cached = this.cachedAssetMap.get(name);

            if (!cached) {
                // This should not happen
                throw new Error("Internal Error: cache state is out of sync!");
            }

            return cached;
        }

        // Loader Chain
        const value = await this.runAssetChain(assetDef);

        if (assetDef.cache?.enable) {
            this.cachedAssetMap.set(name, value);
            assetDef.state.cached = true;
        }

        return value;
    }

    public async loadGroup(name: string): Promise<Record<string, any>> {
        const assetNames = this.loadGroups.get(name);

        if (!assetNames) {
            throw new Error(`Load Group ${name} is not defined`);
        }

        const assetPromises = [];

        for (const asset of assetNames) {
            assetPromises.push(this.loadAsset(asset));
        }

        await Promise.all(assetPromises);

        const toRet: Record<string, any> = {};

        for (let i = 0; i < assetNames.length; i++) {
            const n = assetNames[i];
            const a = await assetPromises[i];

            toRet[n] = a;
        }

        return toRet;
    }

    public hasAsset(name: string) {
        return this.assetMap.has(name);
    }

    public assetIsCached(name: string) {
        return this.cachedAssetMap.has(name);
    }

    public getCachedAsset(name: string) {
        const data = this.cachedAssetMap.get(name);
        if (!data) {
            throw new Error(`Asset ${name} has not yet been cached!`);
        }

        return data;
    }

    public getAssetsInGroup(name: string) {
        return this.loadGroups.get(name);
    }

    public get assets() {
        return Array.from(this.assetMap.keys());
    }

    public get assetGroups() {
        return Array.from(this.loadGroups.keys());
    }

    public unloadAsset(name: string) {
        this.cachedAssetMap.delete(name);
    }

    public unloadAssetGroup(name: string) {
        const assets = this.loadGroups.get(name);

        if (!assets) {
            throw new Error("Asset Group is not Defined");
        }

        for (const a of assets) {
            this.unloadAsset(a);
        }
    }
}