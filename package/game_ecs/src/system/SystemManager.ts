import { ECSWorldInternals } from "../db";
import { CachedQueryManager } from "../query/CachedQueryManager";
import { System } from "./System";

export class SystemManager {
  // Store system refs by id
  private readonly systemMap: Map<string, System> = new Map();
  // Store system ids by lifecycle
  private readonly systemsByLifecycle: Map<string, string[]> = new Map();

  private readonly knownLifecycles: Set<string> = new Set();

  constructor(
    private readonly internals: ECSWorldInternals,
    private readonly cachedQueryManager: CachedQueryManager,
    initialLifecycles: string[]
  ) {}

  public addSystem(system: System) {}
  public getSystem(systemId: string) {}
  public removeSystem(systemId: string) {}
  public registerLifecycle(lifecycle: string) {}
  public runLifecycle(lifecycle: string) {}
  public clearSystems() {}
}
