import { LitElement, html,css } from 'lit';

export class BottomMenuElement extends LitElement {
    static get styles() {
        return css`
            :host {
                --bim-button--bgc: blue;
                --bim-ui_main-base: #3c3737;
            }

            .bottom-menu {
                position: fixed;
                display: flex;
                justify-content: center;
                bottom: 15px;
                gap: 10px;
                left: 55%;
                transform: translateX(-50%);
                max-height: 100px;
            }

            .file-input-wrapper {
                display: none;
            }
        `;
    }

    static get properties() {
        return {
            world: { type: Object },
            ifcLoader: { type: Object }
        };
    }
    world: any;
    ifcLoader: any;

    constructor() {
        super();
    }
    handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const files = [];
        if (input.files && input.files.length > 0) {
            for (const file of Array.from(input.files)) {
                files.push(file);
            }
            this.ifcLoader.loadIfcFromFile(files);
        }
    }
    triggerFileInput() {
        const fileInput = this.shadowRoot?.querySelector('#file-input');

        if (fileInput && fileInput instanceof HTMLInputElement) {
            fileInput.click();
        }
    }

    callToggleCuller() {
        console.log('1-top-toggle culler')
        this.world.toggleCuller();
        console.log('2-top-after toggle culler')
    }

    isCullerEnable() {
        return this.world.enableCuller
    }
    // <button-element icon="clarity:power-solid-alerted" text="Activate Optimizer" @click="${this.callToggleCuller}"></button-element>
    // <div>
    //     <toggle-element @toggle-changed="${this.callToggleCuller}" .active="${this.isCullerEnable}"></toggle-element>
    //     <label>Post Production</label>
    // </div>
    render() {
            return html`
                <div>
                    <div class="bottom-menu">
                        <button-element icon="hugeicons:file-upload" text="Load IFC" @click="${this.triggerFileInput}"></button-element>
              
                        
                        <label class="file-input-wrapper">
                            <input type="file" id="file-input" @change="${this.handleFileChange}" multiple>
                        </label>
                    </div>
               `;
    }
}

window.customElements.define('bottom-menu-element', BottomMenuElement);
