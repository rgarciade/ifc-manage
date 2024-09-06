import * as OBCF from "@thatopen/components-front";
import {World} from "./world";
import {FragmentsGroup} from "@thatopen/fragments";
import {Classifier} from "./classifier";

export class Plans{
    generatedWorld: World;
    model: FragmentsGroup;
    plans: OBCF.Plans;
    classifier: Classifier | undefined;
    constructor(generatedWorld: World, model: FragmentsGroup) {
        this.generatedWorld = generatedWorld;
        this.model = model;
        this.plans = this.generatedWorld.components.get(OBCF.Plans);
        this.plans.world = this.generatedWorld.world;
    }
    async generate() {
        await this.plans.generate(this.model)
        this.classifier = new Classifier(this.generatedWorld, this.model);
    }
}
