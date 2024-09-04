import * as OBC from "@thatopen/components";
import { FragmentsGroup } from "@thatopen/fragments";


export class GenerateWorld {
  container: HTMLElement;
  components: OBC.Components;
  worlds: OBC.Worlds;
  bbox: any;
  // @ts-ignore
  world: OBC.World<OBC.SimpleScene, OBC.SimpleCamera, OBC.SimpleRenderer>;

  constructor() {
    this.container = document.getElementById("container")!;
    this.components = new OBC.Components();
    this.worlds = this.components.get(OBC.Worlds);
    this.createWorld();
  }

  private createWorld() {
    this.world = this.worlds.create<
        OBC.SimpleScene,
        OBC.SimpleCamera,
        OBC.SimpleRenderer
    >();

    this.world.scene = new OBC.SimpleScene(this.components);
    this.world.renderer = new OBC.SimpleRenderer(
        this.components,
        this.container
    );
    this.world.camera = new OBC.SimpleCamera(this.components);

    this.components.init();
    this.world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);
    this.world.scene.setup();
    this.addGrids();
  }

  private addGrids() {
    const grids = this.components.get(OBC.Grids);
    grids.create(this.world);
  }

  addModel(model: FragmentsGroup) {
    this.world.scene.three.add(model);
  }
}
