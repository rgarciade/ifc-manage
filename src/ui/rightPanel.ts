import * as BUI from "@thatopen/ui";
import {Panel,Section,elementTypes} from "./panel";

export class RightPanel extends Panel {
  sections: Section[];
  panel: BUI.PanelSection;
  constructor(sections: Section[]) {
    super();
    this.sections = sections;
    this.panel = this.generatePanel();
    this.addElementToDom(this.panel);
  }
  private generateSection(section: Section) {
    let elements: string [] = []

    section.elements.map((element) => {
      if(elementTypes.includes(element.type)) {
        // @ts-ignore
        elements.push(this.elementHtmlGenerators[element.type](element));
      }
    });

    return section.collapsed ? this.collapsedSectionsHtml(section, elements) : this.singleSectionHtml(section, elements);

  }
  private generatePanel() {
    return BUI.Component.create<BUI.PanelSection>(() => BUI.html`
          <bim-panel active label="Ferro Ifc panel" class="options-menu">
            ${this.sections.map((section) => this.generateSection(section))}
          </bim-panel>
        `);
  }
}
