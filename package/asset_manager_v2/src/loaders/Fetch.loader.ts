import { Loader } from "../Loader";

export enum FetchTypes {
    TEXT = "text",
    JSON = "json",
    BLOB = "blob",
}

export type FetchLoaderOptions = {
    path: string,
    as: FetchTypes
};

export class FetchLoader extends Loader<never, any, FetchLoaderOptions> {
    constructor() {
        super("fetch");
    }
    
    public validateOptions(options: FetchLoaderOptions): boolean {
        return true;
    }
    public async run(input: never, options: FetchLoaderOptions): Promise<any> {
        const resp = await fetch(options.path);

        let data = null;

        switch (options.as) {
            case FetchTypes.TEXT:
                data = await resp.text();
                break;
            case FetchTypes.JSON:
                data = await resp.json();
                break;
            case FetchTypes.BLOB:
                data = await resp.blob();
                break;
            default:
                data = await resp.text();
        }

        return data;
    }

}