import { Component, Entity, Scene, System, SystemLifecycle } from "game_ecs";
import { Input } from "./plugins/basicInput/Input";
import { Vector2 } from "game_transform";

export function buildScene(input: Input) {
    const pc = Component.build<null>(Symbol.for("pc"), null);
    const lPaddle = Component.build(Symbol.for("paddle"), {size: 20});
    const lpSpeed = Component.build<number>(Symbol.for("speed"), 5);
    const lpPosition = Component.build(Symbol.for("transform"), new Vector2());
    const lpAcceleration = Component.build(Symbol.for("acceleration"), new Vector2());
    const leftPaddle = Entity.build([pc, lPaddle, lpSpeed, lpPosition, lpAcceleration]);

    const ai = Component.build(Symbol.for("ai"), null);
    const rPaddle = Component.build(Symbol.for("paddle"), {size: 20});
    const rpSpeed = Component.build(Symbol.for("speed"), 5);
    const rpPosition = Component.build(Symbol.for("transform"), new Vector2())
    const rpAcceleration = Component.build(Symbol.for("acceleration"), new Vector2())
    const rightPaddle = Entity.build([ai, rPaddle, rpSpeed, rpPosition, rpAcceleration]);

    const bComp = Component.build(Symbol.for("ball"), {size: 5});
    const reflect = Component.build<null>(Symbol.for("reflect"), null);
    const bSpeed = Component.build(Symbol.for("speed"), 5);
    const bPosition = Component.build(Symbol.for("transform"), new Vector2());
    const bAcceleration = Component.build(Symbol.for("acceleration"), new Vector2());
    const ballEntity = Entity.build([reflect, bSpeed, bPosition, bAcceleration, bComp]);

    const scene = Scene.build([leftPaddle, rightPaddle, ballEntity]);

    const playerControlSystem = System.build(SystemLifecycle.LOOP, [Symbol.for("pc"), Symbol.for("acceleration"), Symbol.for("speed")], (entities) => {
        for (const entity of entities) {
            const acc = entity.getComponent(Symbol.for("acceleration")) as Vector2;
            const speed = entity.getComponent(Symbol.for("speed")) as number;
            
            if (input.getKey("up")) {
                acc.set(acc.x, -speed);
            } else if (input.getKey("down")) {
                acc.set(acc.x, speed);
            }
        }
    });

    const aiControlSystem = System.build(SystemLifecycle.LOOP, [Symbol.for("ai"), Symbol.for("acceleration"), Symbol.for("speed"), Symbol.for("position"), Symbol.for("paddle")], (entities, world) => {
        const ball = ballEntity;
        const ballPos = ball.getComponent(Symbol.for("position")) as Vector2;
        const ballComp = ball.getComponent(Symbol.for("ball")) as {size: number};
        for (const entity of entities) {
            const acc = entity.getComponent(Symbol.for("acceleration")) as Vector2;
            const speed = entity.getComponent(Symbol.for("speed")) as number;
            const pos = entity.getComponent(Symbol.for("position")) as Vector2;
            const paddle = entity.getComponent(Symbol.for("paddle")) as {size: number};

            if (pos.y + paddle.size > ballPos.y + ballComp.size) {
                acc.set(acc.x, speed);
            } else if (pos.y < ballPos.y) {
                acc.set(acc.x, -speed);
            } else {
                acc.set(acc.x, 0);
            }
        }
    });

    const ballControlSystem = System.build(SystemLifecycle.LOOP, [Symbol.for("reflect"), Symbol.for("speed"), Symbol.for("acceleration")], (entities) => {
        for (const entity of entities) {
            const acc = entity.getComponent(Symbol.for("acceleration")) as Vector2;
            const speed = entity.getComponent(Symbol.for("speed")) as number;
            
            if (input.getKey("up")) {
                acc.set(acc.x, -speed);
            } else if (input.getKey("down")) {
                acc.set(acc.x, speed);
            } else {
                acc.set(acc.x, 0);
            }
        }
    });

    const movementSystem = System.build(SystemLifecycle.LOOP, [Symbol.for("acceleration"), Symbol.for("position")], (entities) => {
        for (const entity of entities) {
            const pos = entity.getComponent(Symbol.for("position")) as Vector2;
            const acc = entity.getComponent(Symbol.for("acceleration")) as Vector2;

            pos.add(acc);
        }
    });

    // scene.world.sceneManager.add([playerControlSystem, aiControlSystem, ballControlSystem, movementSystem]);

    return scene;
}