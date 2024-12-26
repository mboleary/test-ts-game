import { ECSWorldInternals } from "../db";
import { CachedQuery } from "../query/CachedQuery";
import { CachedQueryManager } from "../query/CachedQueryManager";
import { CachedQueryAddEntityEvent, CACHED_QUERY_ADD_ENTITY_EVENT_TYPE } from "../query/events/CachedQueryAddEntity.event";
import { CachedQueryRemoveEntityEvent, CACHED_QUERY_REMOVE_ENTITY_EVENT_TYPE } from "../query/events/CachedQueryRemoveEntity.event";
import { World } from "../World";
import { System } from "./System";
import { SystemLifecycle } from "./type/SystemLifecycle.enum";

export class SystemManager {
  // Store system refs by id
  protected readonly systemMap: Map<string, System> = new Map();
  // Store system ids by lifecycle
  protected readonly systemsByLifecycle: Map<string, string[]> = new Map();
  // Store all known system lifecycles
  protected readonly knownLifecycles: Set<string> = new Set([SystemLifecycle.INIT, SystemLifecycle.UPDATE, SystemLifecycle.DESTROY]);
  // Store cached queries for systems
  protected readonly systemIdToCachedQueryMap: Map<string, CachedQuery> = new Map();

  constructor(
    private readonly internals: ECSWorldInternals,
    private readonly cachedQueryManager: CachedQueryManager,
    private readonly world: World,
    initialLifecycles: string[]
  ) {
    for (const lifecycle of initialLifecycles) {
      this.registerLifecycle(lifecycle);
    }
  }

  /**
   * Add System to this manager
   * @param system System to add
   */
  public addSystem(system: System) {
    if (this.systemMap.has(system.id)) {
      throw new Error(`Already has System with id ${system.id}`);
    }

    if (!this.knownLifecycles.has(system.lifecycle)) {
      throw new Error(`Lifecycle '${system.lifecycle}' is invalid. Did you mean to add it to the known lifecycles?`);
    }

    const cachedQuery = this.cachedQueryManager.generateCachedQuery(system.queryObject);

    // @TODO for event-driven lifecycles, add listeners to cached query

    this.systemIdToCachedQueryMap.set(system.id, cachedQuery);

    this.systemMap.set(system.id, system);

    let systemsArr: string[];
    if (this.systemsByLifecycle.has(system.lifecycle)) {
      systemsArr = this.systemsByLifecycle.get(system.lifecycle) as string[];
    } else {
      systemsArr = [];
      this.systemsByLifecycle.set(system.lifecycle, systemsArr);
    }

    systemsArr.push(system.id);
  }

  /**
   * Get a system by its ID
   * @param systemId System id to get
   * @returns System or null
   */
  public getSystem(systemId: string): System | null {
    return this.systemMap.get(systemId) || null;
  }

  /**
   * Get all System ids
   * @returns all system ids
   */
  public getAllSystemIds(): string[] {
    return Array.from(this.systemMap.keys());
  }

  /**
   * Remove a system
   * @param systemId system to remove
   */
  public removeSystem(systemId: string) {
    const systemToRemove = this.systemMap.get(systemId);
    if (!systemToRemove) {
      throw new Error(`System id not found: ${systemId}`);
    }

    const lifecycleArr = this.systemsByLifecycle.get(systemToRemove.lifecycle);

    if (!lifecycleArr) {
      throw new Error(`Lifecycle '${systemToRemove.lifecycle}' could not be found. SystemManager internals may be out of sync!`);
    }

    const idx = lifecycleArr.indexOf(systemId);
    if (idx === -1) {
      throw new Error(`System ${systemId} is not present in Lifecycle '${systemToRemove.lifecycle}' when it should be`);
    }

    lifecycleArr.splice(idx, 1);

    // @TODO unsubscribe event handlers if this is an event-driven lifecycle

    this.systemIdToCachedQueryMap.delete(systemId);

    this.systemMap.delete(systemId);
  }

  /**
   * Register a new system lifecycle
   * @param lifecycle new Lifecycle
   */
  public registerLifecycle(lifecycle: string) {
    this.knownLifecycles.add(lifecycle);
  }

  /**
   * Runs all systems in a given lifecycle
   * @param lifecycle Lifecycle to run
   */
  public runLifecycle(lifecycle: string) {
    if (!this.knownLifecycles.has(lifecycle)) {
      throw new Error(`Unknown Lifecycle ${lifecycle}`);
    }
    const systems = this.systemsByLifecycle.get(lifecycle);
    if (!systems) return;

    for (const system of systems.map(id => this.systemMap.get(id) as System)) {
      const cachedQuery = this.systemIdToCachedQueryMap.get(system.id);

      if (!cachedQuery) {
        // Something is wrong if we get here
        console.warn(`System ${system.id} doesn't have a cached query. Internals may be out of sync!`);
        continue;
      }

      const entities = cachedQuery.getEntities();
      system.update(entities, this.world);
    }
  }

  /**
   * Starts running event-driven lifecycles and subscribes them to their cached queries
   */
  public enableEventDrivenLifecycles() {
    this.activateEventDrivenLifecycle(SystemLifecycle.INIT);
    this.activateEventDrivenLifecycle(SystemLifecycle.UPDATE);
    this.activateEventDrivenLifecycle(SystemLifecycle.DESTROY);
  }

  /**
   * Runs systems on internal events by subscribing them
   * @param lifecycle Lifecycle to activate
   */
  private activateEventDrivenLifecycle(lifecycle: string) {
    const systems = this.systemsByLifecycle.get(lifecycle);
    if (!systems) return;

    for (const system of systems.map(id => this.systemMap.get(id) as System)) {
      const cachedQuery = this.systemIdToCachedQueryMap.get(system.id);

      if (!cachedQuery) {
        // Something is wrong if we get here
        console.warn(`System ${system.id} doesn't have a cached query. Internals may be out of sync!`);
        continue;
      }

      const entities = cachedQuery.getEntities();
      system.update(entities, this.world);

      if (lifecycle === SystemLifecycle.INIT) {
        cachedQuery.subscribe(CACHED_QUERY_ADD_ENTITY_EVENT_TYPE, (e: CachedQueryAddEntityEvent) => {
          const entity = this.internals.entityReferenceMap.get(e.target.id);
          if (entity) {
            system.update([entity], this.world);
          }
        });
      } else if (lifecycle === SystemLifecycle.DESTROY) {
        cachedQuery.subscribe(CACHED_QUERY_REMOVE_ENTITY_EVENT_TYPE, (e: CachedQueryRemoveEntityEvent) => {
          const entity = this.internals.entityReferenceMap.get(e.target.id);
          if (entity) {
            system.update([entity], this.world);
          }
        });
      } else if (lifecycle === SystemLifecycle.UPDATE) {
        // @TODO add this later
      }
    }
  }

  /**
   * Clear all systems from this System Manager
   */
  public clearSystems() {
    // Unsubscribe all cached queries
    for (const cachedQuery of this.systemIdToCachedQueryMap.values()) {
      cachedQuery.unsubscribeAll('*');
    }

    this.systemIdToCachedQueryMap.clear();

    // Remove all systems
    this.systemMap.clear();
    this.systemsByLifecycle.clear();
  }

  /**
   * Merge another System Manager into this one
   * @param targetSystemManager 
   */
  public merge(targetSystemManager: SystemManager) {
    for (const lifecycle of targetSystemManager.knownLifecycles) {
      if (!this.knownLifecycles.has(lifecycle)) {
        this.registerLifecycle(lifecycle);
      }
    }
    for (const [systemId, system] of targetSystemManager.systemMap) {
      if (!this.systemMap.has(systemId)) {
        this.addSystem(system);
      }
    }
  }
}
