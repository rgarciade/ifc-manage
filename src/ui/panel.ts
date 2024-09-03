import * as BUI from "@thatopen/ui";

export interface Element {
    label: string;
    function: () => void;
}
export interface Button extends Element {
    type: "button";
}
export interface Checkbox extends Element {
    type: "checkbox";
    checked?: boolean;
}
export interface Section {
    label: string;
    collapsed: boolean;
    elements: (Button | Checkbox)[];
}

export const elementTypes = ["button", "checkbox"] as const;

BUI.Manager.init();

export  class Panel {

    protected collapsedSectionsHtml = (section: Section,sectionsHtml:string []) => BUI.html`<bim-panel-section collapsed label="${section.label}"><bim-panel-section style="padding-top: 12px;">${sectionsHtml.map(
        (sectionHtml) => sectionHtml
    )}</bim-panel-section></bim-panel-section>`
    protected singleSectionHtml = (section: Section, sectionsHtml:string []) => BUI.html`<bim-panel-section label="${section.label}">${sectionsHtml.map(
        (sectionHtml) => sectionHtml
    )}</bim-panel-section>`
    protected elementHtmlGenerators = {
        button: (element: Button) => BUI.html`<bim-button label="${element.label}" @click="${ () => {element.function();}}"></bim-button>`,
        checkbox: (element: Checkbox) => BUI.html`<bim-checkbox label="${element.label}"  inverted ?checked="${element.checked}" @change="${async () => {element.function();}}"></bim-checkbox>`
    };
    protected addElementToDom = (element: any) => {
        document.body.append(element);
    }

}
