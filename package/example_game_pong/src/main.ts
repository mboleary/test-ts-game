import { Engine } from "game_core";
import { buildScene } from "./scene_main";
import { InputPlugin } from "./plugins/basicInput/Input.plugin";
import { Container } from "inversify";
import { Input } from "./plugins/basicInput/Input";
import { ECSPlugin } from "./plugins/ecsPlugin/ECS.plugin";
import { Hotloop } from "game_core_browser";

function main() {
  const container = new Container();
  const engine = new Engine(container);

  const inputPlugin = InputPlugin.build({
    bindings: [
      { name: "up", key: "ArrowUp" },
      { name: "down", key: "ArrowDown" },
    ],
  });

  const ecsPlugin = ECSPlugin.build({
    initCallback: async () => {
      const world = buildScene(container.get(Input));
      console.log("world", world);
      return world;
    }
  });

  const hotloopPlugin = Hotloop.build();

  engine.initialize([hotloopPlugin, inputPlugin, ecsPlugin]);

  engine.start();

  window.addEventListener("beforeunload", (e) => {
    engine.destroy();
  });
}



main();
