import { Engine } from "game_core";
import { Scene } from "game_ecs";
import { v4 as uuidv4 } from "uuid";

export function main() {
    const engine = new Engine();

    engine.initialize([]);

    const scene = new Scene(uuidv4(), "default");

    engine.setCurrentScene(scene);

    engine.start();

    console.log(engine.getWorld());

    window.addEventListener("beforeunload", (e) => {
        engine.destroy();
    });
}

main();