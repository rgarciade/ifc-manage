// Update ToggleElement to dispatch a custom event
import { LitElement, html, css } from 'lit';

export class ToggleElement extends LitElement {
    static get styles() {
        return css`
            .switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 34px;
            }

            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                -webkit-transition: .4s;
                transition: .4s;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                -webkit-transition: .4s;
                transition: .4s;
            }

            input:checked + .slider {
                background-color: #2196F3;
            }

            input:focus + .slider {
                box-shadow: 0 0 1px #2196F3;
            }

            input:checked + .slider:before {
                -webkit-transform: translateX(26px);
                -ms-transform: translateX(26px);
                transform: translateX(26px);
            }

            .slider.round {
                border-radius: 34px;
            }

            .slider.round:before {
                border-radius: 50%;
            }
        `;
    }

    static get properties() {
        return {
            clickAction: { type: Function },
            active: { type: Boolean }
        };
    }

    clickAction: any;
    active: boolean;

    constructor() {
        super();
        this.clickAction = () => {};
        this.active = false;
    }

    callClickAction() {
        this.active = !this.active;
        console.log('1-bottttt-toggle changed');
        this.dispatchEvent(new CustomEvent('toggle-changed', { detail: { active: this.active } }));
        console.log('2-botttt-after toggle changed');
    }

    render() {
        return html`
            <label class="switch">
                <input type="checkbox" ?checked="${this.active}">
                <span class="slider round"></span>
            </label>
        `;
    }
}

window.customElements.define('toggle-element', ToggleElement);
