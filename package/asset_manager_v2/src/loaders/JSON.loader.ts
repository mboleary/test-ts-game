import { Loader } from "../Loader";

export class JSONLoader extends Loader<string, object, {}> {
    constructor() {
        super("json");
    }

    public validateOptions(options: {}): boolean {
        return true;
    }

    public run(input: string, options: {}): Promise<object> {
        return JSON.parse(input);
    }
}