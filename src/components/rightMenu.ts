import { LitElement, html,css } from 'lit';
import * as THREE from "three";
import {TypeOfWorld} from "../controllers/world/generateWorld";

export class RightMenuElement extends LitElement {
    static get styles() {
        return css`
            :host {
                  //button size
                --bim-ui_size-sm: 30px;
                --bim-ui_size-sm: 30px;
            }
            .options-menu {
                position: absolute;
                min-width: unset;
                top: 5px;
                right: 5px;
                max-height: calc(100vh - 10px);
            }
            .small-menu{
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            button-element {
                button{
                    width:  200px;
                    min-width: 200px;
                    max-width: 200px;
                }
                .tooltip-container{
                    width: 20px;
                }
            }
        `;
    }
    static get properties() {
        return {
            sections: { type: Array },
            world: { type: Object },
            highlighter: { type: Object },
            ifLoader: { type: Object },
            small: { type: Boolean },
        };
    }
    world: any;
    ifLoader: any;
    highlighter: any;
    small: boolean = false;
    constructor() {
        super();
        window.addEventListener('addModelToWorld', () => {
            this.requestUpdate();
        });
    }

    callFitModel() {
        this.world.fitLastModel();
    }
    callToggleHighlighter() {
        this.highlighter.toggleHighlighter();
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
        // this.world.removeAllModels();
        alert('pequeños bugs,hay que revisarlo, recarga la pagina para eliminar los modelos')
    }


    // load models
    // <bim-panel-section collapsed label="temp charge models">
    //     <bim-panel-section style="padding-top: 12px;">
    //         ${loadIfcBtn}
    //         <bim-button label="Load small 1 710KB IFC" @click="${ () => {this.load('01')}}"></bim-button>
    //         <bim-button label="Load small 2 15,2M IFC" @click="${ () => {this.load('03')}}"></bim-button>
    //         <bim-button label="Load 240717MAD03-STRC-DH-TEC-R24 19M IFC" @click="${ () => {this.load('240717MAD03-STRC-DH-TEC-R24')}}"></bim-button>
    //         <bim-button label="Load BSA1X - bausa 13-15 240122 431M IFC" @click="${ () => {this.load('BSA1X - bausa 13-15 240122')}}"></bim-button>
    //         <bim-button label="example project location" @click="${ () => {this.load('example project location')}}"></bim-button>
    //         <bim-button label="Load EncofradoVigaPlasencia 837k IFC" @click="${ () => {this.load('EncofradoVigaPlasencia')}}"></bim-button>
    //     </bim-panel-section>
    // </bim-panel-section>

    loadPlans() {
        if(this.world.typeOfWorld !== TypeOfWorld.PostProduction){
            return ''
        }
        const whiteColor = new THREE.Color("white");
        const culler = this.world.complexModels[0].culler;
        const plans = this.world.complexModels[0].plans;

        if(plans.list.length === 0){
            return html`<bim-button label="No hay planes"></bim-button>`;
        }
        const minGloss = this.world.world.renderer!.postproduction.customEffects.minGloss;

        const defaultBackground = this.world.world.scene.three.background;

        return html`
            <bim-panel-section collapsed label="planos">
                ${plans.list.map((plan: { name: unknown; classifier: { setColor: (arg0: any, arg1: THREE.Color) => void; }; modelItems: any; id: any; }) => html`
                    <bim-button checked label="${plan.name}"
                                @click="${() => {
                                    this.world.world.renderer!.postproduction.customEffects.minGloss = 0.1;
                                    this.highlighter.backupColor = whiteColor;
                                    //classifier.setColor(modelItems, whiteColor);
                                    this.world.world.scene.three.background = whiteColor;
                                    plans.goTo(plan.id);
                                    culler.needsUpdate = true;
                    }}"></bim-button>`)}
                <bim-button checked label="Exit"
                            @click="${() => {
                                this.highlighter.backupColor = null;
                                this.highlighter.highlighter.clear();
                                this.world.world.renderer!.postproduction.customEffects.minGloss = minGloss;
                                //classifier.resetColor(modelItems);
                                this.world.world.scene.three.background = defaultBackground;
                                plans.exitPlanView();
                                culler.needsUpdate = true;
                            }}">
                </bim-button>
            </bim-panel-section>
    `;
    }

    render() {
        if(this.small){
            return html`
            <div class="options-menu small-menu">
                <button-element text="Fit last model" small="${true}" icon="fluent:zoom-fit-16-filled" @click="${ () => {this.callFitModel()}}"></button-element>
                <button-element text="toggle highlighter" small="${true}" icon="ph:selection-foreground-duotone" @click="${ () => {this.callToggleHighlighter()}}"></button-element>
                <button-element text="Export fragments"  small="${true}" icon="ph:export-duotone" @click="${ () => {this.callExportFragments()}}"></button-element>
                <button-element text="remove all models"  small="${true}" icon="material-symbols-light:remove-selection-rounded" @click="${ () => {this.callRemoveAllModels()}}"></button-element>
            </div>
            <bim-checkbox label="charge many models"  inverted checked @change="${ () => {this.callChargeManyModels()}}}"></bim-checkbox>
        `;
        }else{
            return html`<div>
                <bim-panel active label="Options" class="options-menu">
                    <bim-panel-section  label="Controls">
                            <bim-panel-section style="padding-top: 12px;">
                                <bim-button label="Fit last mode" @click="${ () => {this.callFitModel()}}"></bim-button>
                                <bim-button label="toggle highlighter" @click="${ () => {this.callToggleHighlighter()}}"></bim-button>
                                <bim-checkbox label="charge many models"  inverted checked @change="${ () => {this.callChargeManyModels()}}}"></bim-checkbox>
                                <bim-button label="Export fragments" @click="${ () => {this.callExportFragments()}}"></bim-button>
                                <bim-button label="remove all models" @click="${ () => {this.callRemoveAllModels()}}"></bim-button>
                            </bim-panel-section>
                    </bim-panel-section>
                    ${(this.world.complexModels.length)?this.loadPlans():''}
                </bim-panel>
            </div>`;
        }

    }
}

window.customElements.define('right-menu-element', RightMenuElement);
