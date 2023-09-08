import { ForEachCallbackFn } from "./DoubleMap.interface";

export class OneToOneDoubleMap<K, V> {
  private readonly map = new Map<K, V>();
  private readonly reverseMap = new Map<V, K>();
  constructor() {}
  
  public clear(): void {
    this.map.clear();
    this.reverseMap.clear();
  }
  public deleteKey(key: K): boolean {
    const val = this.map.get(key);
    return val !== undefined && this.map.delete(key) && this.reverseMap.delete(val);
  }
  public deleteValue(value: V): boolean {
    const key = this.reverseMap.get(value);
    return key !== undefined && this.reverseMap.delete(value) && this.map.delete(key);
  }
  public entries(): Iterable<[K, V]> {
    return this.map.entries();
  }
  public forEachKey(callback: ForEachCallbackFn<K, V>): void {
    return this.map.forEach(callback);
  }
  public forEachValue(callback: ForEachCallbackFn<V, K>): void {
    return this.reverseMap.forEach(callback);
  }
  
  public getValue(key: K): V | undefined{
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
  public keys(): Iterable<K> {
    return this.map.keys();
  }
  public set(key: K, value: V): void {
    const origVal = this.map.get(key);
    const origKey = this.reverseMap.get(value);
    if (origVal) this.reverseMap.delete(origVal);
    if (origKey) this.map.delete(origKey);
    this.map.set(key, value);
    this.reverseMap.set(value, key);
  }
  public values(): Iterable<V> {
    return this.map.values();
  }
}
