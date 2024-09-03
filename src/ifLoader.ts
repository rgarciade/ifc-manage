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
  // @ts-ignore
  generatedWorld: World;
  // @ts-ignore
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
    const file = await fetch(url);
    const data = await file.arrayBuffer();
    const buffer = new Uint8Array(data);
    const model = await this.fragmentIfcLoader.load(buffer);
    debugger
    if(model.name && model.name !== ''){
      model.name = model.name;
    }else{
        model.name = "Model " + model.uuid;
    }

    model.position.set(0, 8.8, 0);
    return model;
  }


  listenToFragmentLoaded() {
    this.fragments.onFragmentsLoaded.add((model) => {
      console.log("fragment loaded:", model);
    });
  }
}
