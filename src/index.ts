import * as BUI from "@thatopen/ui";
import { World } from "./controllers/world/world";
import { InitIfLoader } from "./controllers/ifLoader";
import { html,render } from 'lit';
import "./components";
import {Highlighter} from "./controllers/world/highlighter";
import {TypeOfWorld} from "./controllers/world/generateWorld";

BUI.Manager.init();

(async () => {
    const worldContent = new World(TypeOfWorld.PostProduction);
    const ifLoader = new InitIfLoader(worldContent);
    await ifLoader.setup()
    const highlighter: Highlighter = new Highlighter(worldContent);

    const loadIfc = async (file: string) => {
        await ifLoader.loadIfc(
            `http://127.0.0.1:5500/models/${file}.ifc`
        );
    };
    const interfaceHtml = html`
    <elements-relation-element .world="${worldContent}"  .highlighter="${highlighter}"></elements-relation-element>
    <bottom-menu-element .world="${worldContent}" .ifcLoader="${ifLoader}"></bottom-menu-element>
    <right-menu-element 
        .loadIfc="${loadIfc}"
        .ifLoader="${ifLoader}"
        .world="${worldContent}"
        .highlighter="${highlighter}"
    ></right-menu-element>
    <loader-element></loader-element>
`;

    render(interfaceHtml, document.body);
})();
