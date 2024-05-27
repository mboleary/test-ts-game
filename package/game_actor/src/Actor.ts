import { EmitOptions, Eventable, GameEvent, GameEventTreeEmitter, Observable, Observer, ObserverManager } from "game_event";
import { ComponentKeyType } from "./type/ComponentKey.type";

export class Actor implements Eventable, Observable {
    protected readonly _eventEmitter: GameEventTreeEmitter =
        new GameEventTreeEmitter(() => this.parent?._eventEmitter);
    protected readonly _observerManager: ObserverManager = new ObserverManager();

    private readonly _children: Actor[] = [];
    private _parent: Actor | null = null;

    constructor(
        public readonly id: string,
        public name: string,
    ) {

    }

    /**
     * Observe a property
     * @param type property to observe
     * @returns 
     */
    observe<T>(type: any): Observer<T> {
        return this._observerManager.subscribe(type);
    }

    /**
     * Emit an event on this Entity
     * @param type event type
     * @param event event
     * @param options Emitter Options
     */
    emit<T>(type: string, event: GameEvent<T>, options: EmitOptions = {}): void {
        this._eventEmitter.emit(type, event, options);
    }

    /**
     * Subscribe to events
     * @param type event type
     * @param handler event handler
     */
    subscribe(type: string, handler: Function): void {
        this._eventEmitter.subscribe(type, handler);
    }

    /**
     * Unsubscribe a handler from receiving events
     * @param handler event handler
     */
    unsubscribe(handler: Function): void {
        this._eventEmitter.unsubscribe(handler);
    }

    /**
     * Unsubscribe all handlers from an event type
     * @param type 
     */
    unsubscribeAll(type: string): void {
        this._eventEmitter.unsubscribeAll(type);
    }

    /**
     * Subscribe to an event to handle one instance of it
     * @param type event type
     * @param handler event handler
     */
    once(type: string, handler: Function): void {
        this._eventEmitter.once(type, handler);
    }

    getParent(): Actor | null {
        return this._parent;
    }

    setParent(parent: Actor | null) {
        // @TODO make Actor tree consistent
        this._parent = parent;
    }

    get children(): Actor[] {
        return this._children;
    }

    public attachChild(child: Actor) {
        // @TODO make Actor tree consistent
        this._children.push(child);
    }

    public detachChild(child: Actor): boolean {

    }

    get components(): ComponentKeyType[] {
        
    }

    public setComponent<T>(key: ComponentKeyType, componentData: T) {
        
    }

    public removeComponent(comp: ComponentKeyType): boolean {
        
    }

    public getComponent<T>(type: ComponentKeyType): T | null {
        // const comp = this.ecsdb.getComponentFromEntity<T>(this.id, type);
        // if (comp) {
        //     if (typeof comp === 'object') {
        //         return buildProxy<any>(comp, this._observerManager, type);
        //     } else {
        //         return comp;
        //     }
        // } else {
        //     return null;
        // }
    }

    public getComponentWithoutProxy<T>(type: ComponentKeyType): T | null {
        // return this.ecsdb.getComponentFromEntity<T>(this.id, type);
    }
}