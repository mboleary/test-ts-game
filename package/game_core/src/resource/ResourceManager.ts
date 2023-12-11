export class ResourceManager<KeyType> {
    private pluginMap: Map<KeyType, any> = new Map();
    constructor() {}

    public getResource<T>(type: KeyType): T | null {
        return this.pluginMap.get(type) || null;
    }

    public registerResource<T>(type: KeyType, resource: T, override = false): boolean {
        if (this.pluginMap.has(type) && !override) {
            return false;
        }
        this.pluginMap.set(type, resource);
        return true;
    }
}