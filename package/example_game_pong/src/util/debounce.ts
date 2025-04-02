export function leadingEdgeDebounce() {
    let stopMap = new Set();
    return (f: Function, time: number = 100) => {
        if (stopMap.has(f)) return;
        f();
        stopMap.add(f);
        setTimeout(() => {
            stopMap.delete(f);
        }, time);
    };
}

export function fallingEdgeDebounce() {
    let stopMap = new Set();
    return (f: Function, time: number = 100) => {
        if (stopMap.has(f)) return;
        stopMap.add(f);
        setTimeout(() => {
            stopMap.delete(f);
            f();
        }, time);
    };
}