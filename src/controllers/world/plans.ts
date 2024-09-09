import * as OBCF from "@thatopen/components-front";
import {World} from "./world";
import {FragmentsGroup} from "@thatopen/fragments";
import {Classifier} from "./classifier";

export class Plans{
    worldContent: World;
    model: FragmentsGroup;
    plans: OBCF.Plans;
    classifier: Classifier | undefined;
    constructor(worldContent: World, model: FragmentsGroup) {
        this.worldContent = worldContent;
        this.model = model;
        this.plans = this.worldContent.components.get(OBCF.Plans);
        this.plans.world = this.worldContent.world;
    }
    async generate() {
        await this.plans.generate(this.model)
        this.classifier = new Classifier(this.worldContent, this.model);
    }
}
