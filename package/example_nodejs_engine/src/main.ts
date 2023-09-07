import { Engine } from "game_core_node";
import { Scene } from "game_ecs";
import { v4 as uuidv4 } from "uuid";
import * as process from "node:process";

export function main() {
    const engine = new Engine();

    engine.initialize([]);

    const scene = new Scene(uuidv4());

    engine.setCurrentScene(scene);

    engine.start();

    console.log(engine.getWorld());

    process.on("beforeexit", () => {
        engine.destroy();
    });

    process.on('exit', (code: string) => {
        console.log("process exit with code:" + code);
    });
}

main();