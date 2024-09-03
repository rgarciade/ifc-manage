import * as BUI from "@thatopen/ui";
BUI.Manager.init();

interface Element {
  label: string;
  function: () => void;
}
const elementTypes = ["button", "checkbox"] as const;
// Definición de la interfaz Button que extiende de Element
interface Button extends Element {
  type: "button";
}

// Definición de la interfaz Checkbox que extiende de Element
interface Checkbox extends Element {
  type: "checkbox";
  checked?: boolean;
}

// Definición de la interfaz Section que contiene un array de elementos
interface Section {
  label: string;
  collapsed: boolean;
  elements: (Button | Checkbox)[];
}

export class rightPanel {
  sections: Section[];
  panel: BUI.PanelSection;

  constructor(sections: Section[]) {
    this.sections = sections;
    this.panel = this.generatePanel();
    const mobileButton = this.generateMobileView(this.panel);
    document.body.append(this.panel);
    document.body.append(mobileButton);

  }
  private generateSection(section: Section) {
    let elements: string [] = []

    const collapsedSectionsHtml = (sectionsHtml:string []) => BUI.html`<bim-panel-section collapsed label="${section.label}"><bim-panel-section style="padding-top: 12px;">${sectionsHtml.map(
        (sectionHtml) => sectionHtml
    )}</bim-panel-section></bim-panel-section>`
    const singleSectionHtml = (sectionsHtml:string []) => BUI.html`<bim-panel-section label="${section.label}">${sectionsHtml.map(
        (sectionHtml) => sectionHtml
    )}</bim-panel-section>`

    const elementHtmlGenerators = {
      button: (element: Button) => BUI.html`<bim-button label="${element.label}" @click="${ () => {element.function();}}"></bim-button>`,
      checkbox: (element: Checkbox) => BUI.html`<bim-checkbox label="${element.label}"  inverted ?checked="${element.checked}" @change="${async () => {element.function();}}"></bim-checkbox>`
    };


    section.elements.map((element) => {
      if(elementTypes.includes(element.type)) {
        // @ts-ignore
        elements.push(elementHtmlGenerators[element.type](element));
      }
    });

    return section.collapsed ? collapsedSectionsHtml(elements) : singleSectionHtml(elements);

  }
  private generatePanel() {
    return BUI.Component.create<BUI.PanelSection>(() => BUI.html`
          <bim-panel active label="Ferro Ifc panel" class="options-menu">
            ${this.sections.map((section) => this.generateSection(section))}
          </bim-panel>
        `);
  }
  private generateMobileView(panel: BUI.PanelSection) {
    const button = BUI.Component.create<BUI.PanelSection>(() => {
    return BUI.html`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${() => {
          if (panel.classList.contains("options-menu-visible")) {
            panel.classList.remove("options-menu-visible");
          } else {
            panel.classList.add("options-menu-visible");
          }
        }}">
      </bim-button>
    `;
    });
    return button;
  }
}
