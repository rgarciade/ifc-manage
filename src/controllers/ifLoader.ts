// src/controllers/ifLoader.ts
import * as OBC from "@thatopen/components";
import * as WEBIFC from "web-ifc";
import { World } from "./world/world";
import { dispatchEvent } from "../utils/dispatchEvent";

export class InitIfLoader {
  fragments: OBC.FragmentsManager;
  fragmentIfcLoader: OBC.IfcLoader;
  excludedCats = [
    WEBIFC.IFCTENDONANCHOR,
    WEBIFC.IFCREINFORCINGBAR,
    WEBIFC.IFCREINFORCINGELEMENT,
  ];
  worldContent: World;

  constructor(worldContent: World) {
    this.worldContent = worldContent;
    this.fragments = this.worldContent.components.get(OBC.FragmentsManager);
    this.fragmentIfcLoader = this.worldContent.components.get(OBC.IfcLoader);

  }

  async setup() {
    await this.fragmentIfcLoader.setup();
    for (const cat of this.excludedCats) {
      this.fragmentIfcLoader.settings.excludedCategories.add(cat);
    }
    this.fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
    this.listenToFragmentLoaded();
  }

  async loadIfc(url: string) {
    dispatchEvent('loadingStart');
    const file = await fetch(url);
    const data = await file.arrayBuffer();
    const model = await this.loadData(data);
    dispatchEvent('loadingEnd');
    return model;
  }

  async loadIfcFromFile(file: File) {
    dispatchEvent('loadingStart');
    const data = await file.arrayBuffer();
    const model = await this.loadData(data);
    dispatchEvent('loadingEnd');
    return model;
  }

  private async loadData(data: ArrayBuffer) {
    this.checkFileSize(data.byteLength);
    const buffer = new Uint8Array(data);
    const model = await this.fragmentIfcLoader.load(buffer);
    return await this.addModel(model);
  }
  private checkFileSize(size: number) {
    dispatchEvent('fileSize', { size });
    if (size > 40 * 1024 * 1024) { // 40MB in bytes
      dispatchEvent('largeFile', { size });
    }
  }

   private async addModel(model: any) {
    await this.worldContent.addModel(model);
    return model;
  }


  listenToFragmentLoaded() {
    this.fragments.onFragmentsLoaded.add((model) => {
      console.log("fragment loaded:", model);
    });
  }
}
