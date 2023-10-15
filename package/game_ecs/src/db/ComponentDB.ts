import { Component, ComponentType } from "../Component";
import { Entity } from "../Entity";
import { OneToManyDoubleMap } from "../util/OneToManyDoubleMap";
import { ECSDB } from "./ECSDB";


type EntityID = string;
type ComponentID = string;

/**
 * Contains all Component-specific data
 */

export class ComponentDB {
  constructor(
    private readonly ecsdb: ECSDB
  ) { }

  public readonly componentMap: Map<ComponentID, Component<any>> = new Map();
  public readonly entityToComponentDoubleMap: OneToManyDoubleMap<EntityID, ComponentID> = new OneToManyDoubleMap();
  public readonly componentTypeToComponentIDDoubleMap: OneToManyDoubleMap<ComponentType, ComponentID> = new OneToManyDoubleMap();
  // public componentObserverMap: Map<EntityID, EventSource> = new Map();

  public hasComponent(componentID: ComponentID) {
    return this.componentMap.has(componentID);
  }

  public validateComponent(componentID: ComponentID) {
    if (!this.hasComponent(componentID)) {
      throw new Error(`Component not found: ${componentID}`);
    }
    return true;
  }

  public attachComponentToEntity<T>(component: Component<T>, entityID: EntityID) {
    // @TODO ECSDB override logic
    if (this.hasComponent(component.id)) {
      throw new Error(`Component ${component.id} already present in world`);
    }
    this.componentMap.set(component.id, component);
    this.entityToComponentDoubleMap.set(entityID, component.id);
    this.componentTypeToComponentIDDoubleMap.set(component.type, component.id);

    // @TODO trigger observers once implemented
  }

  public destroyComponent(componentID: ComponentID) {
    this.validateComponent(componentID);

    this.componentTypeToComponentIDDoubleMap.deleteValue(componentID);
    this.entityToComponentDoubleMap.deleteValue(componentID);
    // this.componentDataMap.delete(componentID);
    this.componentMap.delete(componentID);

    // @TODO trigger observers once implemented
  }

  public getComponentsForEntity(entityID: string): Component[] {
    const compIDs: ComponentID[] | undefined = this.entityToComponentDoubleMap.getValue(entityID) || [];
    return compIDs
      .map((id) => this.componentMap.get(id) || null)
      .filter((val) => val !== null) as Component[];
  }

  public getComponentForEntityByType<T>(entityID: EntityID, componentType: ComponentType): Component<T> | null {
    const compIDs = this.componentTypeToComponentIDDoubleMap.getValue(componentType);
    if (!compIDs) return null;
    const toRet = compIDs.filter((compID) => this.entityHasComponent(entityID, compID)).map((id) => this.componentMap.get(id));
    return toRet[0] || null;
  }

  public setComponentDataOnEntity<T>(entityID: EntityID, componentType: ComponentType, data: T) {
    const component = this.getComponentForEntityByType<T>(entityID, componentType);
    if (!(component && this.entityHasComponent(entityID, component.id))) {
      throw new Error(`component ${component ?? "null"} on entity ${entityID} not found`);
    }

    component.data = data;

    // @TODO once observers are implemented, trigger those
  }

  public getEntityForComponent(compID: ComponentID): Entity | null {
    const id: ComponentID | undefined = this.entityToComponentDoubleMap.getKey(compID);

    if (id) {
      return (this.ecsdb.entityDB.entityMap.get(id) as Entity | undefined) || null;
    } else {
      return null;
    }
  }

  public entityHasComponent(entityID: EntityID, componentID: ComponentID): boolean {
    return this.entityToComponentDoubleMap.has(entityID, componentID);
  }

  public mergeComponentDB(remoteECSDB: ECSDB) {
    if (remoteECSDB === this.ecsdb) return;

    for (const [key, val] of remoteECSDB.componentDB.componentMap.entries()) {
      this.componentMap.set(key, val);
    }

    for (const [key, valArr] of remoteECSDB.componentDB.entityToComponentDoubleMap.entries()) {
      for (const val of valArr) {
        this.entityToComponentDoubleMap.set(key, val);
      }
    }
  }
}
