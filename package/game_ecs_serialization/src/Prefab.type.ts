export type PrefabComponentType = {
  identifier: string, // Type identifier (a unique string name)
  buildType: string, // Builder to use
};

export type PrefabEntityDefinition = {
  id: string;
  components: {
    key: string;
    type: string;
    data: any;
  }[];
};

export type PrefabRelationshipDefinition = {
  id: string;
  name: string;
  entityA: string;
  entityB: string;
};

export type PrefabAssetDefinition = {
  id: string;
  name: string;
  type: string;
  path: string;
};

export type Prefab = {
  prefab: true;
  name: string;
  componentTypes: PrefabComponentType[];
  entities: PrefabEntityDefinition[];
  relationships: PrefabRelationshipDefinition[];
  assets: PrefabAssetDefinition[]
}