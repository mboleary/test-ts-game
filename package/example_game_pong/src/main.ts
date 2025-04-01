import { Engine } from "game_core";
import { buildScene } from "./scene_main";
import { InputPlugin } from "./plugins/basicInput/Input.plugin";
import { Container } from "inversify";
import { Input } from "./plugins/basicInput/Input";
import { ECSPlugin } from "./plugins/ecsPlugin/ECS.plugin";
import { Hotloop } from "game_core_browser";
import { Graphics2DPlugin } from "./plugins/graphics2d_example/Graphics2D.plugin";
import { Graphics2D } from "./plugins/graphics2d_example/g2d/Graphics2D";

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
      const world = buildScene(container.get(Input), container.get(Graphics2D));
      console.log("world", world);
      return world;
    }
  });

  const graphics2dPlugin = Graphics2DPlugin.build({
    canvasTarget: document.getElementById("canvas") as HTMLCanvasElement,
    overlayTarget: document.getElementById("overlay") as HTMLDivElement,
  });

  const hotloopPlugin = Hotloop.build();

  engine.initialize([hotloopPlugin, inputPlugin, ecsPlugin, graphics2dPlugin]);

  engine.start();

  window.addEventListener("beforeunload", (e) => {
    engine.destroy();
  });
}



main();
