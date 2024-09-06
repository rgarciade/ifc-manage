import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import { FragmentsGroup } from "@thatopen/fragments";
import {dispatchEvent} from "../../utils/dispatchEvent";

export const TypeOfWorld = {
  Simple: 'Simple',
  PostProduction: 'PostProduction'
} as const;

export type TypeOfWorld = typeof TypeOfWorld[keyof typeof TypeOfWorld];

export class GenerateWorld {
  container: HTMLElement;
  components: OBC.Components;
  worlds: OBC.Worlds;
  typeOfWorld: TypeOfWorld = TypeOfWorld.Simple;
  bbox: any;
  // @ts-ignore
  world: OBC.World<OBC.SimpleScene, OBC.SimpleCamera,  OBC.SimpleRenderer>;
  private lastUpdate: Date = new Date();
  private lastModelSetDate: Date = new Date();

  constructor(typeOfWorld: TypeOfWorld) {
    this.container = document.getElementById("container")!;
    this.components = new OBC.Components();
    this.worlds = this.components.get(OBC.Worlds);
    debugger
    this.typeOfWorld = typeOfWorld;
    this.createWorld();
    this.world.onAfterUpdate .add(() => {
      if( this.lastModelSetDate > this.lastUpdate) {
        debugger
        dispatchEvent('addModelToWorld');
        this.lastUpdate = new Date();
      }
    });
  }

  private createSimpleWorld() {
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

  private createPostProductionWorld() {
    this.world = this.worlds.create<
        OBC.SimpleScene,
        OBC.OrthoPerspectiveCamera,
        OBCF.PostproductionRenderer
    >();

    this.world.scene = new OBC.SimpleScene(this.components);
    this.world.renderer = new OBCF.PostproductionRenderer(
        this.components,
        this.container
    );
    this.world.camera = new OBC.OrthoPerspectiveCamera(this.components);
    this.world.renderer.postproduction.enabled = true;
    this.world.renderer.postproduction.customEffects.outlineEnabled = true;

    this.components.init();
    this.world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

    this.world.scene.setup();
    this.addPostProductionGrids();
  }



  private createWorld() {
    debugger
    switch (this.typeOfWorld) {
        case TypeOfWorld.Simple:
            this.createSimpleWorld();
            break;
        case TypeOfWorld.PostProduction:
            this.createPostProductionWorld();
            break
    }
  }

  private addGrids() {
    const grids = this.components.get(OBC.Grids);
    return  grids.create(this.world);
  }
  private addPostProductionGrids() {
    const grid = this.addGrids();
    this.world.renderer.postproduction.customEffects.excludedMeshes.push(grid.three);
  }

  addModel(model: FragmentsGroup) {
    this.world.scene.three.add(model);
    this.lastModelSetDate = new Date();
  }
}
