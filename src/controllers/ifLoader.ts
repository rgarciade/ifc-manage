// src/controllers/ifLoader.ts
import * as OBC from "@thatopen/components";
import * as WEBIFC from "web-ifc";
import { World } from "./world/world";

export class InitIfLoader {
  fragments: OBC.FragmentsManager;
  fragmentIfcLoader: OBC.IfcLoader;
  excludedCats = [
    WEBIFC.IFCTENDONANCHOR,
    WEBIFC.IFCREINFORCINGBAR,
    WEBIFC.IFCREINFORCINGELEMENT,
  ];
  generatedWorld: World;

  constructor(generatedWorld: World) {
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
    this.dispatchEvent('loadingStart');
    const file = await fetch(url);
    const data = await file.arrayBuffer();
    const model = await this.loadData(data);
    this.dispatchEvent('loadingEnd');
    return model;
  }

  async loadIfcFromFile(file: File) {
    this.dispatchEvent('loadingStart');
    const data = await file.arrayBuffer();
    const model = await this.loadData(data);
    this.dispatchEvent('loadingEnd');
    return model;
  }

  private async loadData(data: ArrayBuffer) {
    this.checkFileSize(data.byteLength);
    const buffer = new Uint8Array(data);
    const model = await this.fragmentIfcLoader.load(buffer);
    return this.addModel(model);
  }
  private checkFileSize(size: number) {
    this.dispatchEvent('fileSize', { size });
    debugger
    if (size > 40 * 1024 * 1024) { // 40MB in bytes
      this.dispatchEvent('largeFile', { size });
    }
  }

  private addModel(model: any) {
    model.position.set(0, 8.8, 0);
    this.generatedWorld.addModel(model).then(() => {});
  }

  private dispatchEvent(eventName: string, detail: any = {}) {
    const event = new CustomEvent(eventName, { detail: { loader: this, ...detail } });
    window.dispatchEvent(event);
  }

  listenToFragmentLoaded() {
    this.fragments.onFragmentsLoaded.add(async (model) => {
      console.log("fragment loaded:", model);
    });
  }
}
