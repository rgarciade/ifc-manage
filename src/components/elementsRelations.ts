import { LitElement, html,css } from 'lit';
import * as BUI from "@thatopen/ui";
import * as WEBIFC from "web-ifc";
import * as OBC from "@thatopen/components";
import * as CUI from "@thatopen/ui-obc";

export class ElementsRelationsElement extends LitElement {
    static get styles() {
        return css`
            :host {
                --bim-ui_bg-base: #0b0d0e00;
            }
            .elements-relations {
                position: absolute;
                min-width: unset;
                top: 0px;
                left: 0px;
                border-radius: 0px 0px 15px 0px;
                max-width: 350px;
                min-width: 350px;
                transition: max-width 0.3s ease, min-width 0.3s ease;
            }

            .big-elements-relations {
                max-width: 700px;
                min-width: 700px;
            }

            .arrow-toggle-relations {
                color: white;
                transform: rotate(0deg);
                transition: transform 0.3s ease;
                margin-top: 5px;
                right: 5px;
                position: absolute;
            }

            .rotate-180 {
                margin-top: 6px;
                transform: rotate(180deg);
                transition: transform 0.3s ease;
            }

            //:host {
            //    --bim-ui_size-sm: 10px; /* Asigna el valor deseado aquí */
            //}
        `;
    }

    static get properties() {
        return {
            world: { type: Object },
            highlighter: { type: Object },
        };
    }
    private _world: any;
    get world() {
        return this._world;
    }
    set world(value: any) {
        const oldValue = this._world;
        this._world = value;
        this.requestUpdate('world', oldValue);
        this.generateTable().then(() => {})
    }
    private _highlighter: any;
    get highlighter() {
        return this._highlighter;
    }
    set highlighter(value: any) {
        const oldValue = this._highlighter;
        this._highlighter = value;
        this.requestUpdate('highlighter', oldValue);
        this.addHighlighterListener();
    }

    baseStyle: Record<string, string>;
    updateAttributesTable: any;
    attributesTable: any
    constructor() {
        super();
        this.baseStyle = {
            padding: "0.25rem",
            borderRadius: "0.25rem",
        };
        this.attributesTable = undefined
    }

    async generateTable() {

        const tableDefinition: BUI.TableDataTransform = {
            Entity: (entity) => {
                debugger
                let style = {};
                if (entity === OBC.IfcCategoryMap[WEBIFC.IFCPROPERTYSET]) {
                    style = {
                        ...this.baseStyle,
                        backgroundColor: "purple",
                        color: "white",
                    };
                }
                if (String(entity).includes("IFCWALL")) {
                    style = {
                        ...this.baseStyle,
                        backgroundColor: "green",
                        color: "white",
                    };
                }
                return BUI.html`<bim-label style=${BUI.styleMap(style)}>${entity}</bim-label>`;
            },
            PredefinedType: (type) => {
                const colors = ["#1c8d83", "#3c1c8d", "#386c19", "#837c24"];
                const randomIndex = Math.floor(Math.random() * colors.length);
                const backgroundColor = colors[randomIndex];
                const style = { ...this.baseStyle, backgroundColor, color: "white" };
                return BUI.html`<bim-label style=${BUI.styleMap(style)}>${type}</bim-label>`;
            },
            NominalValue: (value) => {
                let style = {};
                if (typeof value === "boolean" && value === false) {
                    style = { ...this.baseStyle, backgroundColor: "#b13535", color: "white" };
                }
                if (typeof value === "boolean" && value === true) {
                    style = { ...this.baseStyle, backgroundColor: "#18882c", color: "white" };
                }
                return BUI.html`<bim-label style=${BUI.styleMap(style)}>${value}</bim-label>`;
            },
        };

        const [attributesTable, updateAttributesTable] = CUI.tables.entityAttributes({
            components: this.world.components,
            fragmentIdMap: {},
            tableDefinition,
            attributesToInclude: () => {
                const attributes: any[] = [
                    "Name",
                    (name: string) => name.includes("Value"),
                    (name: string) => name.startsWith("Material"),
                    (name: string) => name.startsWith("Relating"),
                    (name: string) => {
                        const ignore = ["IsGroupedBy", "IsDecomposedBy"];
                        return name.startsWith("Is") && !ignore.includes(name);
                    },
                ];
                return attributes;
            },
        });

        attributesTable.expanded = true;
        attributesTable.indentationInText = true;
        attributesTable.preserveStructureOnFilter = true;
        this.attributesTable = attributesTable;
        this.updateAttributesTable = updateAttributesTable;
    }
    addHighlighterListener() {

        this.highlighter.highlighter.events.select.onHighlight.add((fragmentIdMap: any) => {

            this.updateAttributesTable({ fragmentIdMap });
            console.log(fragmentIdMap)
        });

        this.highlighter.highlighter.events.select.onClear.add(() =>{
            if( this.updateAttributesTable){
                this.updateAttributesTable({ fragmentIdMap: {} })
            }
        });
    }

     onSearchInput = (e: Event) => {
        const input = e.target as BUI.TextInput;
        this.attributesTable.queryString = input.value;
    };

    onPreserveStructureChange = (e: Event) => {
        const checkbox = e.target as BUI.Checkbox;
        this.attributesTable.preserveStructureOnFilter = checkbox.checked;
    };
    onExportJSON = () => {
        this.attributesTable.downloadData("entities-attributes");
    };
    onCopyTSV = async () => {
        await navigator.clipboard.writeText(this.attributesTable.tsv);
        alert(
            "Table data copied as TSV in clipboard! Try to paste it in a spreadsheet app.",
        );
    };
    onAttributesChange = (e: Event) => {
        const dropdown = e.target as BUI.Dropdown;
        this.updateAttributesTable({
            attributesToInclude: () => {
                const attributes: any[] = [
                    ...dropdown.value,
                    (name: string) => name.includes("Value"),
                    (name: string) => name.startsWith("Material"),
                    (name: string) => name.startsWith("Relating"),
                    (name: string) => {
                        const ignore = ["IsGroupedBy", "IsDecomposedBy"];
                        return name.startsWith("Is") && !ignore.includes(name);
                    },
                ];
                return attributes;
            },
        });
    };

    toggleElementsRelation(){
        const panel = this.shadowRoot?.querySelector('.elements-relations');
        const icon = this.shadowRoot?.querySelector('.arrow-toggle-relations');
        if (panel) {
            panel.classList.toggle('big-elements-relations');
        }
        if (icon) {
            icon.classList.toggle('rotate-180');
        }
    }


    render() {
            return html`<div>
                <bim-panel active label="Elements Relation" class="elements-relations small-elements-relation" >
                    <bim-panel-section collapsed label="elements">
                        <bim-icon  class="arrow-toggle-relations" icon="fluent:arrow-right-12-filled" @click="${()=>{this.toggleElementsRelation()}}"></bim-icon>
                        <div style="display: flex; gap: 0.5rem; justify-content: space-between;">
                            <bim-panel-section label="Entity Attributes" fixed>
                          <div style="display: flex; gap: 0.5rem;">
                            <bim-text-input @input=${this.onSearchInput} type="search" placeholder="Search" debounce="250"></bim-text-input>
                            <bim-checkbox @change=${this.onPreserveStructureChange} label="Preserve Structure" inverted checked></bim-checkbox>
                          </div>
                          <div style="display: flex; gap: 0.5rem; padding-top: 10px">
                              <bim-button @click=${this.onCopyTSV} icon="solar:copy-bold" tooltip-title="Copy TSV" tooltip-text="Copy the table contents as tab separated text values, so you can copy them into a spreadsheet."></bim-button>
                              <bim-button @click=${this.onExportJSON} icon="ph:export-fill" tooltip-title="Export JSON" tooltip-text="Download the table contents as a JSON file."></bim-button>
                            <bim-dropdown @change=${this.onAttributesChange} multiple>
                              <bim-option label="Name" checked></bim-option> 
                              <bim-option label="ContainedInStructure"></bim-option>
                              <bim-option label="ForLayerSet"></bim-option>
                              <bim-option label="LayerThickness"></bim-option>
                              <bim-option label="HasProperties"></bim-option>
                              <bim-option label="HasAssociations"></bim-option>
                              <bim-option label="HasAssignments"></bim-option>
                              <bim-option label="HasPropertySets"></bim-option>
                              <bim-option label="PredefinedType"></bim-option>
                              <bim-option label="Quantities"></bim-option>
                              <bim-option label="ReferencedSource"></bim-option>
                              <bim-option label="Identification"></bim-option>
                              <bim-option label="Prefix"></bim-option>
                              <bim-option label="LongName"></bim-option>
                            </bim-dropdown>
                        </div>
                        </div>
                        ${this.attributesTable}
                      </bim-panel-section>
                </bim-panel>
            </div>`;
    }
}

window.customElements.define('elements-relation-element', ElementsRelationsElement);
