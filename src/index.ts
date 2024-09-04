import * as BUI from "@thatopen/ui";
import { World } from "./controllers/world/world";
import { InitIfLoader } from "./controllers/ifLoader";
import { html,render } from 'lit';
import "./components";
import {Highlighter} from "./controllers/world/highlighter";

BUI.Manager.init();
const definedWorld = new World();
const ifLoader = new InitIfLoader(definedWorld);
const highlighter: Highlighter = new Highlighter(definedWorld);

const loadIfc = async (file: string) => {
    let lastModel = await ifLoader.loadIfc(
    `http://127.0.0.1:5500/models/${file}.ifc`
  );
  definedWorld.addModel(lastModel).then(() => {});
};


const rightMenuHtml = html`
    <elements-relation-element .world="${definedWorld}"  .highlighter="${highlighter}"></elements-relation-element>
    <right-menu-element 
        .loadIfc="${loadIfc}"
        .ifLoader="${ifLoader}"
        .world="${definedWorld}"
        .highlighter="${highlighter}"
    ></right-menu-element>`;


render(rightMenuHtml, document.body);

