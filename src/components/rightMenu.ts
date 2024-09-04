import { LitElement, html,css } from 'lit';

export class RightMenuElement extends LitElement {
    static get styles() {
        return css`
            .options-menu {
                position: fixed;
                min-width: unset;
                top: 5px;
                right: 5px;
                max-height: calc(100vh - 10px);
            }
        `;
    }

    /**
     * @property {Number} width - Width of the button.
     */
    static get properties() {
        return {
            sections: { type: Array },
            loadIfc: { type: Object },
            world: { type: Object },
            ifLoader: { type: Object },
        };
    }
    loadIfc: ((id: string) => void);
    world: any;
    ifLoader: any;
    constructor() {
        super();
        this.loadIfc = (id: string) => {};
    }

    load(file: string) {
        this.loadIfc(file);
    }
    callFitModel() {
        this.world.fitLastModel();
    }
    callToggleHighlighter() {
        debugger
        this.world.toggleHighlighter();
    }
    callChargeManyModels() {
        this.world.toggleEnableManyModels();
    }
    callActiveCuller() {
        this.world.toggleCuller();
    }
    callExportFragments() {
        this.ifLoader.exportFragments();
    }
    callRemoveAllModels() {
        this.world.removeAllModels();
    }

    render() {
            return html`<div>
                <bim-panel active label="Ferro Ifc panel" class="options-menu">
                    <bim-panel-section collapsed label="temp charge models">
                        <bim-panel-section style="padding-top: 12px;">
                            <bim-button label="Load small 1 710KB IFC" @click="${ () => {this.load('01')}}"></bim-button>
                            <bim-button label="Load small 2 15,2M IFC" @click="${ () => {this.load('03')}}"></bim-button>
                            <bim-button label="Load 240717MAD03-STRC-DH-TEC-R24 19M IFC" @click="${ () => {this.load('240717MAD03-STRC-DH-TEC-R24')}}"></bim-button>
                            <bim-button label="Load BSA1X - bausa 13-15 240122 431M IFC" @click="${ () => {this.load('BSA1X - bausa 13-15 240122')}}"></bim-button>
                            <bim-button label="example project location" @click="${ () => {this.load('example project location')}}"></bim-button>
                            <bim-button label="Load EncofradoVigaPlasencia 837k IFC" @click="${ () => {this.load('EncofradoVigaPlasencia')}}"></bim-button>
                        </bim-panel-section>
                    </bim-panel-section>
                        <bim-panel-section label="Actions">
                            <bim-panel-section style="padding-top: 12px;">
                                <bim-button label="Fit last mode" @click="${ () => {this.callFitModel()}}"></bim-button>
                                <bim-button label="toggle highlighter" @click="${ () => {this.callToggleHighlighter()}}"></bim-button>
                                <bim-checkbox label="charge many models"  inverted checked @change="${ () => {this.callChargeManyModels()}}}"></bim-checkbox>
                                <bim-checkbox label="active culler"  inverted  @change="${async () => {debugger; this.callActiveCuller()}}"></bim-checkbox>
                                <bim-button label="Export fragments" @click="${ () => {this.callExportFragments()}}"></bim-button>
                                <bim-button label="remove all models" @click="${ () => {this.callRemoveAllModels()}}"></bim-button>
                            </bim-panel-section>
                        </bim-panel-section>
                </bim-panel>
            </div>`;
    }
}

window.customElements.define('right-menu-element', RightMenuElement);
