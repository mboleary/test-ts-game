/**
 * ECS Database: Provides the store for entities and components as well as some indexes
 */

import { Component } from "../../baseClasses/Component";
import { Entity } from "../../baseClasses/Entity";

type EntityWithoutJoins = Omit<Entity, "parent" | "children" | "components">;
type ComponentWithoutJoins = Omit<Component, "entity">;

export type EntityRelationshipType = "child" | "parent";

type EntityID = string;
type ComponentID = string;
type EntityRelationship = {
    id: EntityID, 
    type: EntityRelationshipType
};

export class ECSDB {
    constructor() {

    }

    public entityMap: Map<EntityID, EntityWithoutJoins> = new Map();
    public entityByNameToIDMap: Map<string, EntityID[]> = new Map();
    public entityToTagMap: Map<EntityID, string> = new Map();
    public entityToEntityMap: Map<EntityID, EntityRelationship[]> = new Map();
    // public entityObserverMap: Map<EntityID, EventSource> = new Map();
    
    public componentMap: Map<ComponentID, ComponentWithoutJoins> = new Map();
    public componentByNameToIDMap: Map<string, ComponentID[]> = new Map();
    public componentToEntityIDMap: Map<ComponentID, EntityID> = new Map();
    // public componentObserverMap: Map<EntityID, EventSource> = new Map();
}