/**
 * ECS Database: Provides the store for entities and components as well as some indexes
 */

import { Component, ComponentType } from "../Component";
import { Entity } from "../Entity";
import { OneToManyDoubleMap } from "../util/OneToManyDoubleMap";
import { ComponentDB } from "./ComponentDB";
import { EntityDB } from "./EntityDB";

// type EntityWithoutJoins = Omit<Entity, "parent" | "children" | "components">;
// type ComponentWithoutJoins = Omit<Component, "entity">;

// export type EntityRelationshipType = "child" | "parent";

type EntityID = string;
type ComponentID = string;
// type EntityRelationship = {
//   id: EntityID;
//   type: EntityRelationshipType;
// };

export class ECSDB {

  public readonly entityDB = new EntityDB(this);
  public readonly componentDB = new ComponentDB(this);

  constructor(
    public readonly temporary: boolean = false, 
    public readonly parent: ECSDB | null = null
  ) {}

  public canBeOverridden() {
    return this.temporary || this.parent !== null;
  }

  public canOnlyBeOverriddenBy(): ECSDB | null {
    return this.parent;
  }
}
