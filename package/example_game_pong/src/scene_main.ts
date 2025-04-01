import { Q, System, SystemLifecycle, World } from "game_ecs";
import { Input } from "./plugins/basicInput/Input";
import { Vector2 } from "game_transform";
import { Shape } from "./plugins/graphics2d_example/components/Shape.component";
import { Shapes } from "./plugins/graphics2d_example/g2d/Shape.enum";
import { Graphics2D } from "./plugins/graphics2d_example/g2d/Graphics2D";
import { DrawableComponent } from "./plugins/graphics2d_example/components/Drawable.component";

const BTM_BOUNDS = 0;
const TOP_BOUNDS = 500;
const LEFT_BOUNDS = 0;
const RIGHT_BOUNDS = 1000;
const SPEED = 10;
const MAX_SPEED = 100;
const BALL_COOLDOWN = 100;

export function buildScene(input: Input, graphics2d: Graphics2D) {
  const world = new World({ lifecycles: [SystemLifecycle.INIT, SystemLifecycle.LOOP, SystemLifecycle.DESTROY] });

  // Game State Entity
  const gameLeftScore = { key: "leftScore", value: 0 };
  const gameRightScore = { key: "rightScore", value: 0 };
  const gameState = world.createEntity(undefined, [gameLeftScore, gameRightScore]);

  // Player-Controlled Paddle
  const pc = { key: "pc", value: null };
  const lPaddle = { key: "paddle", value: { size: 20 } };
  const lpSpeed = { key: "speed", value: SPEED };
  const lpPosition = { key: "transform", value: new Vector2(10, 10) };
  const lpAcceleration = { key: "acceleration", value: new Vector2(0, 0) };
  const lpName = { key: "name", value: "Left Paddle" };
  // Note: using a reference here to another value. Hopefully no issues are caused by this
  const lpGraphics = { key: Shape.key, value: new Shape(lpPosition.value, Shapes.RECTANGLE, 20, 50) };
  const leftPaddle = world.createEntity(undefined, [lpName, pc, lPaddle, lpSpeed, lpPosition, lpAcceleration, lpGraphics]);

  // Computer-Controlled Paddle
  const ai = { key: "ai", value: null };
  const rPaddle = { key: "paddle", value: { size: 20 } };
  const rpSpeed = { key: "speed", value: SPEED };
  const rpPosition = { key: "transform", value: new Vector2(990, 10) };
  const rpAcceleration = { key: "acceleration", value: new Vector2(0, 0) };
  // Note: using a reference here to another value. Hopefully no issues are caused by this
  const rpGraphics = { key: Shape.key, value: new Shape(rpPosition.value, Shapes.RECTANGLE, 20, 50) };
  const rightPaddle = world.createEntity(undefined, [ai, rPaddle, rpSpeed, rpPosition, rpAcceleration, rpGraphics]);

  // Ball
  const bComp = { key: "ball", value: { size: 5 } };
  const reflect = { key: "reflect", value: null };
  const bSpeed = { key: "speed", value: SPEED };
  const bPosition = { key: "transform", value: new Vector2(0, 0) };
  const bAcceleration = { key: "acceleration", value: new Vector2(0 , 0) };
  const bState = { key: "state", value: { moving: false, scored: false, cooldown: 0 } };
  // Note: using a reference here to another value. Hopefully no issues are caused by this
  const bGraphics = { key: Shape.key, value: new Shape(bPosition.value, Shapes.RECTANGLE, 10, 10) };
  const ballEntity = world.createEntity(undefined, [reflect, bSpeed, bPosition, bAcceleration, bComp, bState, bGraphics]);

  const playerControlSystem = System.build(SystemLifecycle.LOOP, Q.AND(["pc", "acceleration", "speed"]), (entities) => {
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

  const aiControlSystem = System.build(SystemLifecycle.LOOP, Q.AND(["ai", "acceleration", "speed", "transform", "paddle"]), (entities, world) => {
    // Note: Normally in systems, the entity is retrieved from the world, but in this case, we have a reference to the ball entity already
    const ball = ballEntity;
    const ballPos = ball.getComponent("transform") as Vector2;
    const ballComp = ball.getComponent("ball") as { size: number };
    const ballState = ball.getComponent("state") as { moving: boolean; scored: boolean; cooldown: number };
    for (const entity of entities) {
      const acc = entity.getComponent("acceleration") as Vector2;
      const speed = entity.getComponent("speed") as number;
      const transform = entity.getComponent("transform") as Vector2;
      const paddle = entity.getComponent("paddle") as { size: number };

      if (transform.y + paddle.size > ballPos.y + ballComp.size && transform.y > BTM_BOUNDS && !ballState.scored) {
        acc.set(acc.x, -speed);
      } else if (transform.y < ballPos.y && transform.y < TOP_BOUNDS && !ballState.scored) {
        acc.set(acc.x, speed);
      } else {
        acc.set(acc.x, 0);
      }
    }
  });

  const ballControlSystem = System.build(SystemLifecycle.LOOP, Q.AND(["reflect", "speed", "acceleration", "transform", "state"]), (entities) => {
    for (const entity of entities) {
      const acc = entity.getComponent("acceleration") as Vector2;
      const speed = entity.getComponent("speed") as number;
      const transform = entity.getComponent("transform") as Vector2;
      const state = entity.getComponent("state") as { moving: boolean; scored: boolean; cooldown: number };

      if (!state.moving && state.cooldown <= 0) {
        const direction = Math.random() * 2 * Math.PI;
        acc.set(speed * Math.sin(direction), speed * Math.cos(direction));
        transform.set((RIGHT_BOUNDS - LEFT_BOUNDS) / 2, (TOP_BOUNDS - BTM_BOUNDS) / 2); // Put in the middle
        state.moving = true;
        state.scored = false;
        console.log("Ball moving", acc, transform);
      } else if (!state.moving && state.cooldown > 0) {
        state.cooldown--;
      }

      if (transform.y < BTM_BOUNDS || transform.y > TOP_BOUNDS) {
        acc.set(acc.x, -acc.y);
      }

      // @TODO do scoring later
      if (state.moving && (transform.x < LEFT_BOUNDS || transform.x > RIGHT_BOUNDS)) {
        acc.set(0, 0);
        state.cooldown = BALL_COOLDOWN;
        state.moving = false;
        state.scored = true;
        if (speed > MAX_SPEED) {
          entity.setComponent("speed", SPEED);
        } else {
          entity.setComponent("speed", speed + 5);
        }
        console.log("score!");
      }
    }
  });

  const movementSystem = System.build(SystemLifecycle.LOOP, Q.AND(["acceleration", "transform"]), (entities) => {
    for (const entity of entities) {
      const transform = entity.getComponent("transform") as Vector2;
      const acc = entity.getComponent("acceleration") as Vector2;

      transform.add(acc);
    }
  });

  const graphicsSystem = System.build(SystemLifecycle.LOOP, Q.AND([Shape.key]), (entities, world) => {
    const toRender: DrawableComponent[] = [];
    for (const entity of entities) {
      const shape = entity.getComponent(Shape.key) as Shape;
      toRender.push(shape);
    }
    graphics2d.render(toRender);
  });

  world.addSystem(playerControlSystem);
  world.addSystem(aiControlSystem);
  world.addSystem(ballControlSystem);
  world.addSystem(movementSystem);
  world.addSystem(graphicsSystem);

  return world;
}
