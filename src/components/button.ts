import { LitElement, html,css } from 'lit';

export class ButtonMenuElement extends LitElement {
    static get styles() {
        return css` 
            .icon-button {
                background-color: #007bff;
                border: none;
                border-radius: 7px;
                color: white;
                cursor: pointer;
                align-items: center;
                justify-content: center;
                gap: 10px;
                padding: 11px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                margin: 4px 2px;
            }

            .icon-button bim-icon {
                color: white;
                position: relative;
                bottom: -2px;
            }`
    }
    static get properties() {
        return {
            clickAction: { type: Function },
            icon: { type: String },
            text: { type: String }
        };
    }
    clickAction: any;
    icon: string;
    text: string;
    callClickAction() {
        this.clickAction();
    }
    constructor() {
        super();
        this.icon = 'file';
        this.text = 'Load Sample';
        this.clickAction = () => {};
    }

    render() {
        return html`
                <button class="icon-button" @click="${() => this.callClickAction()}">
                    <bim-icon icon="${this.icon}"></bim-icon>
                    ${this.text}
                </button>
        `;
    }
}

window.customElements.define('button-menu-element', ButtonMenuElement);
