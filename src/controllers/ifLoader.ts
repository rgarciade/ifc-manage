// src/controllers/ifLoader.ts
import * as OBC from "@thatopen/components";
import * as WEBIFC from "web-ifc";
import { World } from "./world/world";
import { dispatchEvent } from "../utils/dispatchEvent";
import {IfcProperties} from "@thatopen/fragments";


export class InitIfLoader {
  fragments: OBC.FragmentsManager;
  fragmentManager: OBC.FragmentsManager;
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
    this.fragmentManager = new OBC.FragmentsManager(new OBC.Components());
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
    const files = []
    files.push(file);
    // @ts-ignore
    const model = await this.loadData(files);
    dispatchEvent('loadingEnd');
    return model;
  }

  async loadIfcFromFile(files: File[]) {
      dispatchEvent('loadingStart');
      debugger
      const model = await this.loadData(files);
      dispatchEvent('loadingEnd');
      return model;
  }

  private async loadData(files: File[]) {

    const ifcFile:File | undefined = files.find((file) => file?.name.endsWith('.ifc'));
    const fragFile:File | undefined = files.find((file) => file?.name.endsWith('.frag'));
    const jsonFile:File | undefined = files.find((file) => file?.name.endsWith('.json'));

    debugger
    if(ifcFile){
      debugger
        // @ts-ignore
      const data = await ifcFile.arrayBuffer();
      const buffer = new Uint8Array(data);
      this.checkFileSize(data.byteLength);
      const model = await this.fragmentIfcLoader.load(buffer);
      return await this.addModel(model);
    }

    if(fragFile && jsonFile){
      debugger
        // @ts-ignore
      const data = await fragFile.arrayBuffer();
      const buffer = new Uint8Array(data);
      this.checkFileSize(data.byteLength);
      const model = this.fragmentManager.load(buffer);
      debugger
      // @ts-ignore
      const propsData:[] = await this.readInChunks(jsonFile);
      debugger
      const sss = this.splitJsonParts(propsData);
      debugger
      model.setLocalProperties(propsData);
     //model.setProperties(propsData);
      return await this.addModel(model);
    }

  }

  readInChunks(file: File): Promise<any> {
    let CHUNK_SIZE = 512 * 1024; // 512KB
    let offset = 0;
    const blobParts: [] = [];
    let reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = function(event) {
        // @ts-ignore
        if (event.target.result?.length > 0) {
          // @ts-ignore
         //console.log(event.target.result);  // process the chunk of data here
          blobParts.push(event.target.result);
          offset += CHUNK_SIZE;
          readNext();
        } else {
          // Done reading file
          resolve(blobParts);
          console.log("Finished reading file.");
        }
      };

      function readNext() {
        let slice = file.slice(offset, offset + CHUNK_SIZE);
        reader.readAsText(slice);
      }
      readNext();
    });
  }

  splitJsonParts(array: []): [] {
    const regex = /},\s*"\d+":\s*{/g;
    const combinedString = array.join('');
    const parts = combinedString.split(regex);
    const toReturn = [];
    toReturn.push(parts[0]);
    debugger
    // Agregar el patrón de regex al inicio de cada parte excepto la primera
    for (let i = 1; i < parts.length; i++) {
      // si es el ultimo elemento
        if (i === parts.length - 1) {
          console.log('ultimo')
          toReturn.push(JSON.parse(`{${parts[i]}`.slice(0, -1)));
        }else{
          toReturn.push(JSON.parse(`{${parts[i]} }`));
        }

    }
  debugger
    return [];
  }



  private checkFileSize(size: number) {
    dispatchEvent('fileSize', { size });
    if (size > 40 * 1024 * 1024) { // 40MB in bytes
      dispatchEvent('largeFile', { size });
    }
  }

  download = (file: File) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

   exportFragments = async() => {
     if (!this.fragments.groups.size) {
       return;
     }

     const group = Array.from(this.fragments.groups.values())[0];
     const data = this.fragments.export(group);
     this.download(new File([new Blob([data])], "small.frag"));
     debugger
     const properties = group.getLocalProperties();
    // console.log('properties', properties);
     debugger
     if (properties) {
       const blobParts: BlobPart[] = [];

       blobParts.push("{");
       let isFirstCall = true;
       const propertiesKeys = Object.keys(properties)
       propertiesKeys.forEach(key => {
         // @ts-ignore
         const dataA = properties[key]
         // @ts-ignore
         // if (key == '2660003') {
         //   console.log('2660003',dataA)
         //   console.log('2660003',dataA.length)
         // }
         try {
           const jsonString = JSON.stringify(dataA, null, 4);
           //out += `"${key}":${jsonString},`;
           const coma = isFirstCall ? "" : ",";
           blobParts.push(`${coma}"${key}":${jsonString}`);
           isFirstCall = false;
         } catch (error) {
           //console.error(`Error stringifying property ${key}:`, error);
         }
       })
       //remove last comma
       blobParts.push("}");
      // console.log(out)
        // const out = this.ff(properties)
       // @ts-ignore
       const blob = new Blob(blobParts, { type: 'application/json' });
       const file = new File([blob], "small.json", { type: 'application/json' });
       this.download(file);


     }

   }
   ff(properties:any){
     let out = "{";
     const propertiesKeys = Object.keys(properties)
     propertiesKeys.forEach(key => {
       // @ts-ignore
       const dataA = properties[key]
       try {
         const jsonString = JSON.stringify(dataA, null, 4);
         out += `"${key}":${jsonString},`;
       } catch (error) {
         console.log('gggg',key)
         console.error(`ffff`, dataA);
         const dd = this.ff(dataA)
         out += `"${key}":${dd},`;
       }
     })
     //remove last comma
     out = out.slice(0, -1);
     out+=`}`;
     return out;
   }
    private async addModel(model: any,properties?: IfcProperties) {
    await this.worldContent.addModel(model,properties);
    return model;
  }


  listenToFragmentLoaded() {
    this.fragments.onFragmentsLoaded.add((model) => {
      console.log("fragment loaded:", model);
    });
  }
}
