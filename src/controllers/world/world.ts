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

    complexModels: complexModel[] = [];

    constructor() {
        super();
    }
    toggleEnableManyModels() {
        this.enableManyModels = !this.enableManyModels;
    }
    async addModel(model: FragmentsGroup) {
        if (!this.enableManyModels) {
            this.removeAllModels();
        }
        super.addModel(model);
        this.defineLastModel(model);

        const culler= this.createCuller(model);
        const complexModel = culler? {model, culler} : {model};
        this.complexModels.push(complexModel);
        const indexer = this.world.components.get(OBC.IfcRelationsIndexer);
        await indexer.process(model)
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
}
