import { LitElement, html,css } from 'lit';

export class LoaderElement extends LitElement {
    static get styles() {
        return css`
            .loader {
                display: none;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgb(100 112 98 / 81%);
                z-index: 1000;
                justify-content: center;
                align-items: center;
            }

            .loader.active {
                display: flex;
                flex-direction: column;
            }

            .loader bim-icon {
                font-size: 100px; /* Increase the size of the loader icon */
                color: white;
            }
            .large-file-warning {
                color: blue;
                font-size: 16px;
                margin-top: 10px;
            }
        `
    }
    static get properties() {
        return {
            ifcLoader: { type: Object }
        };
    }
    ifcLoader: any;
    progress: number = 0;
    isLargeFile: boolean = false;

    constructor() {
        super();
        window.addEventListener('loadingStart', (event) => {
            this.activateLoader()
        })
        window.addEventListener('loadingEnd', (event) => {
            this.deactivateLoader()
        });
        window.addEventListener('largeFile', (event) => {
            // @ts-ignore
            this.activateLoader()
            this.isLargeFile = true;
            this.requestUpdate();
        });
    }

    activateLoader() {
        const loader = this.shadowRoot?.querySelector('.loader');
        if (loader) {
            loader.classList.add('active');
        }
    }
    deactivateLoader() {
        const loader = this.shadowRoot?.querySelector('.loader');
        if (loader) {
            loader.classList.remove('active');
        }
        this.isLargeFile = false;
    }


    render() {
        return html`
            <div class="loader">
                ${this.isLargeFile 
                        ? html`
                                    <iconify-icon icon="mdi:robot-happy" width="96" height="96"  style="color: white"></iconify-icon>
                                    <div class="large-file-warning">This is a large file and may take longer to load.</div>` 
                        : html`<iconify-icon icon="svg-spinners:blocks-wave" width="96" height="96" style="color: white"></iconify-icon>`}
            </div>
        `;
    }
}

window.customElements.define('loader-element', LoaderElement);

