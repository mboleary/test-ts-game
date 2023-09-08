export type ForEachCallbackFn<K, V> = (value: V, key: K, map: Map<K, V>) => void;

// export interface DoubleMap<K, V> {
//   clear: () => void;
//   deleteKey: (key: K) => boolean;
//   deleteValue: (value: V) => boolean;
//   entries: () => Iterable<[K, V]>;
//   forEachKey: (cb: ForEachCallbackFn<K, V>) => void;
//   forEachValue: (cb: ForEachCallbackFn<V, K>) => void;
//   getValue: (key: K) => V | undefined;
//   getKey: (value: V) => K | undefined;
//   hasKey: (key: K) => boolean;
//   hasValue: (value: V) => boolean;
//   keys: () => Iterable<K>;
//   set: (key: K, value: V) => void;
//   values: () => Iterable<V>;
// }
