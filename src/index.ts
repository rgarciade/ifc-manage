import * as BUI from "@thatopen/ui";
import { World } from "./controllers/world/world";
import { InitIfLoader } from "./controllers/ifLoader";
import { html,render } from 'lit';
import "./components";
BUI.Manager.init();

const definedWorld = new World();
const ifLoader = new InitIfLoader(definedWorld);


const loadIfc = async (file: string) => {
    let lastModel = await ifLoader.loadIfc(
    `http://127.0.0.1:5500/models/${file}.ifc`
  );
  definedWorld.addModel(lastModel);
};


const componentHtml = html`<right-menu-element 
        .loadIfc="${loadIfc}"
        .ifLoader="${ifLoader}"
        .world="${definedWorld}"
    ></right-menu-element>`;

render(componentHtml, document.body);
