import { ForEachCallbackFn } from "./DoubleMap.interface";

export class OneToManyDoubleMap<K, V> {
  private readonly map = new Map<K, V[]>();
  private readonly reverseMap = new Map<V, K>();
  constructor() {}
  
  public clear(): void {
    this.map.clear();
    this.reverseMap.clear();
  }
  public deleteKey(key: K): boolean {
    const val: V[] | undefined = this.map.get(key);
    if (val) {
      this.map.delete(key);
      val.map(v => this.reverseMap.delete(v));
      return true;
    }
    return false;
  }
  public deleteValue(value: V): boolean {
    const key = this.reverseMap.get(value);
    if (key) {
      this.reverseMap.delete(value);
      const keyResult = this.map.get(key);
      keyResult?.splice(keyResult.indexOf(value) - 1);
      return true;
    }
    return false;
  }
  public delete(key: K, value: V): boolean {
    const keyResult = this.map.get(key);
    if (keyResult?.indexOf(value)) {
      this.reverseMap.delete(value);
      keyResult.splice(keyResult.indexOf(value) - 1, 1);
      return true;
    }
    return false;
  }
  public entries(): Iterable<[K, V[]]> {
    return this.map.entries();
  }
  public forEachKey(callback: ForEachCallbackFn<K, V[]>): void {
    return this.map.forEach(callback);
  }
  public forEachValue(callback: ForEachCallbackFn<V, K>): void {
    return this.reverseMap.forEach(callback);
  }
  
  public getValue(key: K): V[] | undefined {
    return this.map.get(key);
  }
  public getKey(value: V): K | undefined {
    return this.reverseMap.get(value);
  }
  public hasKey(key: K): boolean {
    return this.map.has(key);
  }
  public hasValue(value: V): boolean {
    return this.reverseMap.has(value);
  }
  public has(key: K, value: V): boolean {
    return this.map.get(key) === value;
  }
  public keys(): Iterable<K> {
    return this.map.keys();
  }
  public set(key: K, value: V): void {
    console.log("set:", key, value);
    const valArr = this.map.get(key) || [];
    valArr.push(value);
    console.log("mapset:", key, valArr);
    this.map.set(key, valArr);
    console.log("revmapset:", value, key);
    this.reverseMap.set(value, key);
  }
  public values(): Iterable<V> {
    return this.reverseMap.keys();
  }
}
