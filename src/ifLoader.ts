import * as OBC from "@thatopen/components";
import * as WEBIFC from "web-ifc";
import { GenerateWorld } from "./generateWorld";
import * as THREE from "three";

export class InitIfLoader {
  fragments: OBC.FragmentsManager;
  fragmentIfcLoader: OBC.IfcLoader;
  excludedCats = [
    WEBIFC.IFCTENDONANCHOR,
    WEBIFC.IFCREINFORCINGBAR,
    WEBIFC.IFCREINFORCINGELEMENT,
  ];
  // @ts-ignore
  generatedWorld: GenerateWorld;
  activeCuller: boolean;
  // @ts-ignore
  constructor(generatedWorld: GenerateWorld) {
    this.activeCuller = false;
    this.generatedWorld = generatedWorld;
    this.fragments = this.generatedWorld.components.get(OBC.FragmentsManager);
    this.fragmentIfcLoader = this.generatedWorld.components.get(OBC.IfcLoader);
    this.fragmentIfcLoader.setup();
    for (const cat of this.excludedCats) {
      this.fragmentIfcLoader.settings.excludedCategories.add(cat);
    }
    this.fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
    this.listenToFragmentLoaded();
  }

  async loadIfc(url: string) {
    const file = await fetch(url);
    const data = await file.arrayBuffer();
    const buffer = new Uint8Array(data);
    const model = await this.fragmentIfcLoader.load(buffer);
    model.name = "example";
    model.position.set(0, 8.8, 0);
    //this.generatedWorld.world.scene.three.add(model);
    this.culler(model);
    return model;
  }
  toggleCuller() {
    this.activeCuller = !this.activeCuller;
  }
  culler(model: any) {
    if (!this.activeCuller) return;
    const cullers = this.generatedWorld.components.get(OBC.Cullers);
    const culler = cullers.create(this.generatedWorld.world);
    culler.threshold = 10;

    for (const child of model.children) {
      if (child instanceof THREE.InstancedMesh) {
        culler.add(child);
      }
    }

    culler.needsUpdate = true;

    this.generatedWorld.world.camera.controls.addEventListener("sleep", () => {
      culler.needsUpdate = true;
    });
  }

  listenToFragmentLoaded() {
    this.fragments.onFragmentsLoaded.add((model) => {
      console.log("fragment loaded:", model);
    });
  }
}
