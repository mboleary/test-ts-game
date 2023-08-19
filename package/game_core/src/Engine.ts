import { Plugin } from "./plugin/Plugin";

export class Engine {
    constructor(debug = false) {
        
    }

    public initialize(plugins: Plugin<any>[]) {}

    public start() {}
}