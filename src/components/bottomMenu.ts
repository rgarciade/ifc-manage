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

            .icon-button {
                background-color: #007bff;
                border: none;
                border-radius: 13%;
                color: white;
                padding: 10px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }

            .icon-button bim-icon {
                color: white;
            }
        `;
    }

    /**
     * @property {Number} width - Width of the button.
     */
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
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.ifcLoader.loadIfcFromFile(file).then((model: any) => {
                this.world.addModel(model).then(() => {});
            } )

        }
    }
    triggerFileInput() {
        const fileInput = this.shadowRoot?.querySelector('#file-input');
        if (fileInput && fileInput instanceof HTMLInputElement) {
            fileInput.click();
        }
    }
    render() {
            return html`
                <div class="bottom-menu">
                    <button class="icon-button" @click="${this.triggerFileInput}">
                        <bim-icon class="arrow-toggle-relations" icon="hugeicons:file-upload"></bim-icon>
                        <span>Load IFC</span>
                    </button>
                    <button class="icon-button" @click="${this.triggerFileInput}">
                        <bim-icon class="arrow-toggle-relations" icon="clarity:power-solid-alerted"></bim-icon>
                        <span>Activar Optimizador</span>
                    </button>
                    <label class="file-input-wrapper">
                        <input type="file" id="file-input" @change="${this.handleFileChange}">
                    </label>
                </div>`;
    }
}

window.customElements.define('bottom-menu-element', BottomMenuElement);
