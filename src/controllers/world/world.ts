import { GenerateWorld } from "./generateWorld";
import {FragmentsGroup} from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as THREE from "three";

interface complexModel {
    model: FragmentsGroup;
    culler?: OBC.MeshCullerRenderer;
}

export class World extends GenerateWorld {
    enableManyModels: boolean = true;
    enableCuller: boolean = false;
    cullers: OBC.Cullers [] = [];
    enableHighlighter: boolean = false;
    highlighter: OBCF.Highlighter | undefined ;
    complexModels: complexModel[] = [];

    constructor() {
        super();
    }
    toggleEnableManyModels() {
        this.enableManyModels = !this.enableManyModels;
    }
    addModel(model: FragmentsGroup) {
        if (!this.enableManyModels) {
            this.removeAllModels();
        }
        super.addModel(model);
        this.defineLastModel(model);

        const culler= this.createCuller(model);
        const complexModel = culler? {model, culler} : {model};
        this.complexModels.push(complexModel);
    }
    removeAllModels() {
        this.complexModels.forEach((complexModel) => {
            this.world.scene.three.remove(complexModel.model);
        });
        this.complexModels = [];
    }

    fitLastModel() {
        this.world.camera.controls.fitToSphere(this.bbox, true);
    }

    private defineLastModel(model: FragmentsGroup) {
        const fragmentBbox = this.components.get(OBC.BoundingBoxer);
        fragmentBbox.add(model);
        this.bbox = fragmentBbox.getMesh();
        fragmentBbox.reset();
    }

    //culler
    toggleCuller() {
        debugger
        if(this.haveCuller()){
            alert('los cullers activos no se eliminaran')
        }
        this.enableCuller = !this.enableCuller;
        if(this.enableCuller){
            this.complexModels.forEach((complexModel) => {
                complexModel.culler = this.createCuller(complexModel.model);
            });
            this.listenerCuller();
        }
        return true
    }
    private haveCuller() {
        return this.complexModels.some((complexModel) => complexModel.culler);
    }
    createCuller(model: FragmentsGroup) {
        if (!this.enableCuller) return;
        debugger
        this.listenerCuller()
        const cullers = this.components.get(OBC.Cullers);
        const culler = cullers.create(this.world);
        culler.threshold = 10;

        for (const child of model.children) {
            if (child instanceof THREE.InstancedMesh) {
                culler.add(child);
            }
        }
        return culler;
    }

    private listenerCuller() {
         this.world.camera.controls.addEventListener("sleep", () => {
            this.complexModels.forEach((complexModel) => {
                if(!complexModel.culler) return
                complexModel.culler.needsUpdate = true
            });
        });
    }

    //highlighter

    async toggleHighlighter() {
        debugger
        if(!this.enableHighlighter){
            this.activateHighlighter();
        }else{
            await this.deactivateHighlighter();
        }
    }
    public activateHighlighter() {
        if(!this.highlighter){
            // @ts-ignore
            this.highlighter = this.components.get(OBCF.Highlighter);
            if(this.highlighter) {
                this.highlighter.setup({world: this.world});
                this.highlighter.zoomToSelection = true;
                this.enableHighlighter = true;
            }
        }else{
            this.highlighter.enabled = true;
        }
    }
    public async deactivateHighlighter() {
       // @ts-ignore
       this.highlighter.clear();
       // @ts-ignore
        this.highlighter.enabled = false;
        //await highlighter.dispose();
        this.enableHighlighter = false;
    }
}
