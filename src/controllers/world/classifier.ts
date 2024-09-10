
import {World} from "./world";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import {FragmentsGroup} from "@thatopen/fragments";
import * as THREE from "three";

export class Classifier {
    worldContent: World;
    model: FragmentsGroup;
    classifier: OBC.Classifier ;
    edges: OBCF.ClipEdges;
    modelItems: any;
    thickItems: any;
    thinItems: any;
    constructor(world: World, model: FragmentsGroup) {
        this.worldContent = world;
        this.model = model;
        this.classifier = this.worldContent.components.get(OBC.Classifier);
        this.edges = this.worldContent.components.get(OBCF.ClipEdges);
        this.generate();
    }
    generate(){


        this.classifier.byModel(this.model.uuid, this.model);
        this.classifier.byEntity(this.model);

        this.modelItems = this.classifier.find({ models: [this.model.uuid] });

        this.thickItems = this.classifier.find({
            entities: ["IFCWALLSTANDARDCASE", "IFCWALL"],
        });
        this.thinItems = this.classifier.find({
            entities: ["IFCDOOR", "IFCWINDOW", "IFCPLATE", "IFCMEMBER"],
        });
        this.styles().then();
    }

    async styles(){
        const fragments = this.worldContent.components.get(OBC.FragmentsManager);
        const grayFill = new THREE.MeshBasicMaterial({ color: "gray", side: 2 });
        const blackLine = new THREE.LineBasicMaterial({ color: "black" });
        const blackOutline = new THREE.MeshBasicMaterial({
            color: "black",
            opacity: 0.5,
            side: 2,
            transparent: true,
        });

        this.edges.styles.create(
            "thick",
            new Set(),
            this.worldContent.world,
            blackLine,
            grayFill,
            blackOutline,
        );

        for (const fragID in this.thickItems) {
            const foundFrag = fragments.list.get(fragID);
            if (!foundFrag) continue;
            const { mesh } = foundFrag;
            this.edges.styles.list.thick.fragments[fragID] = new Set(this.thickItems[fragID]);
            this.edges.styles.list.thick.meshes.add(mesh);
        }
        this.edges.styles.create("thin", new Set(), this.worldContent.world);

        for (const fragID in this.thinItems) {
            const foundFrag = fragments.list.get(fragID);
            if (!foundFrag) continue;
            const { mesh } = foundFrag;
            this.edges.styles.list.thin.fragments[fragID] = new Set(this.thinItems[fragID]);
            this.edges.styles.list.thin.meshes.add(mesh);
        }
        await this.edges.update(true);
    }
}
