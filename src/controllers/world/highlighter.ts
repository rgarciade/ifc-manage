import * as OBCF from "@thatopen/components-front";
import {World} from "./world";

export class Highlighter{
    highlighter: OBCF.Highlighter | undefined ;
    enableHighlighter = false
    generatedWorld: World;

    constructor(world:World){
        this.generatedWorld = world;
        this.activateHighlighter();
    }

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
            this.highlighter = this.generatedWorld.components.get(OBCF.Highlighter);
            if(this.highlighter) {
                this.highlighter.setup({world: this.generatedWorld.world});
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
