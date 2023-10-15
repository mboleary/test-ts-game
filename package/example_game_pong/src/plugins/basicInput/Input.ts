const keyValues = new Map<string, boolean>();
const keyMap = new Map<string, string>(); // keyName, game key
const definedKeys = new Set();

export class Input {
    constructor() {}

    public getKey(name: string): boolean | null {
        return keyValues.get(name) || null;
    }

    public setKey(name: string, value: boolean): void {
        keyValues.set(name, value);
    }

    public defineKey(name: string): void {
        keyValues.set(name, false);
        definedKeys.add(name);
    }

    public bindKey(name: string, keyName: string) {
        keyMap.set(keyName, name);
    }
}

function keyDown(event: KeyboardEvent) {
    const name = keyMap.get(event.key);
    if (name) {
        keyValues.set(name, true);
    }
}

function keyUp(event: KeyboardEvent) {
    const name = keyMap.get(event.key);
    if (name) {
        keyValues.set(name, false);
    }
}

export function init() {
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
}

export function destroy() {
    window.removeEventListener("keydown", keyDown);
    window.removeEventListener("keyup", keyUp);
}