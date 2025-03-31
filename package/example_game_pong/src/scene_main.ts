import { Q, System, SystemLifecycle, World } from "game_ecs";
import { Input } from "./plugins/basicInput/Input";
import { Vector2 } from "game_transform";

export function buildScene(input: Input) {
  const world = new World({lifecycles: [SystemLifecycle.INIT, SystemLifecycle.LOOP, SystemLifecycle.DESTROY]});

  const pc = { key: "pc", value: null };
  const lPaddle = { key: "paddle", value: { size: 20 } };
  const lpSpeed = { key: "speed", value: 5 };
  const lpPosition = { key: "transform", value: new Vector2() };
  const lpAcceleration = { key: "acceleration", value: new Vector2() };
  const lpName = { key: "name", value: "Left Paddle" };
  const leftPaddle = world.createEntity(undefined, [lpName, pc, lPaddle, lpSpeed, lpPosition, lpAcceleration]);

  const ai = { key: "ai", value: null };
  const rPaddle = { key: "paddle", value: { size: 20 } };
  const rpSpeed = { key: "speed", value: 5 };
  const rpPosition = { key: "transform", value: new Vector2() };
  const rpAcceleration = { key: "acceleration", value: new Vector2() };
  const rightPaddle = world.createEntity(undefined, [ai, rPaddle, rpSpeed, rpPosition, rpAcceleration]);

  const bComp = { key: "ball", value: { size: 5 } };
  const reflect = { key: "reflect", value: null };
  const bSpeed = { key: "speed", value: 5 };
  const bPosition = { key: "transform", value: new Vector2() };
  const bAcceleration = { key: "acceleration", value: new Vector2() };
  const ballEntity = world.createEntity(undefined, [reflect, bSpeed, bPosition, bAcceleration, bComp]);

  const playerControlSystem = System.build(SystemLifecycle.LOOP, Q.AND(["pc", "acceleration", "speed"]), (entities) => {
    console.log("loop", entities);
    for (const entity of entities) {
      const acc = entity.getComponent("acceleration") as Vector2;
      const speed = entity.getComponent("speed") as number;

      // if (input.getKey("up")) {
      //     acc.set(acc.x, -speed);
      // } else if (input.getKey("down")) {
      //     acc.set(acc.x, speed);
      // }


    }
  });

  const aiControlSystem = System.build(SystemLifecycle.LOOP, Q.AND(["ai", "acceleration", "speed", "position", "paddle"]), (entities, world) => {
    const ball = ballEntity;
    const ballPos = ball.getComponent("position") as Vector2;
    const ballComp = ball.getComponent("ball") as { size: number };
    for (const entity of entities) {
      const acc = entity.getComponent("acceleration") as Vector2;
      const speed = entity.getComponent("speed") as number;
      const pos = entity.getComponent("position") as Vector2;
      const paddle = entity.getComponent("paddle") as { size: number };

      if (pos.y + paddle.size > ballPos.y + ballComp.size) {
        acc.set(acc.x, speed);
      } else if (pos.y < ballPos.y) {
        acc.set(acc.x, -speed);
      } else {
        acc.set(acc.x, 0);
      }
    }
  });

  const ballControlSystem = System.build(SystemLifecycle.LOOP, Q.AND(["reflect", "speed", "acceleration"]), (entities) => {
    for (const entity of entities) {
      const acc = entity.getComponent("acceleration") as Vector2;
      const speed = entity.getComponent("speed") as number;

      if (input.getKey("up")) {
          acc.set(acc.x, -speed);
      } else if (input.getKey("down")) {
          acc.set(acc.x, speed);
      } else {
          acc.set(acc.x, 0);
      }
    }
  });

  const movementSystem = System.build(SystemLifecycle.LOOP, Q.AND(["acceleration", "position"]), (entities) => {
    for (const entity of entities) {
      const pos = entity.getComponent("position") as Vector2;
      const acc = entity.getComponent("acceleration") as Vector2;

      pos.add(acc);
    }
  });

  world.addSystem(playerControlSystem);
  world.addSystem(aiControlSystem);
  world.addSystem(ballControlSystem);
  world.addSystem(movementSystem);

  return world;
}
