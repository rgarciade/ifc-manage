import { LitElement, html,css } from 'lit';
import {Checkbox} from "@thatopen/ui";

export class CheckboxElement extends LitElement {
    static get styles() {
        return css`
            .tooltip-container {
                position: relative;
                display: inline-block;
            }

            .tooltip-text {
                visibility: hidden;
                width: 120px;
                background-color: #000;
                color: #fff;
                text-align: center;
                border-radius: 6px;
                padding: 5px;
                position: absolute;
                z-index: 1;
                opacity: 0;
                transition: opacity 0.3s;
            }

            .tooltip-right {
                top: 50%;
                left: 100%;
                transform: translateY(-50%);
                margin-left: 10px;
            }

            .tooltip-left {
                top: 50%;
                right: 100%;
                transform: translateY(-50%);
                margin-right: 10px;
            }

            .tooltip-top {
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                margin-bottom: 10px;
            }

            .tooltip-bottom {
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                margin-top: 10px;
            }
            
            .tooltip-container:hover .tooltip-text {
                visibility: visible;
                opacity: 1;
            }
        `
    }
    static get properties() {
        return {
            clickAction: { type: Function },
            label: { type: String },
            small: { type: Boolean },
            tooltipPosition: { type: String },
            checked: { type: Boolean }
        };
    }
    clickAction: any;
    checked: boolean = false;
    label: string;
    small: boolean;
    tooltipPosition: string = '';

    constructor() {
        super();
        this.label = '';
        this.small = false;
    }

    callAction() {
        this.clickAction();
    }
    getTooltipPosition() {
        switch (this.tooltipPosition) {
            case 'top':
                return 'tooltip-top';
            case 'right':
                return 'tooltip-right';
            case 'left':
                return 'tooltip-left';
            default:
                return 'tooltip-left';
        }
    }

    render() {
        return this.small ?
            html`
                <div class="tooltip-container">
                    <span class="tooltip-text ${this.getTooltipPosition()}">${this.label}</span>
                    <bim-checkbox inverted  ?checked="${this.checked}" @change="${ () => {this.callAction()}}}"></bim-checkbox>
                </div>
            `:
            html`
                <bim-checkbox label="${this.label}" inverted checked @change="${ () => {this.callAction()}}}"></bim-checkbox>
        `;
    }
}

window.customElements.define('checkbox-element', CheckboxElement);
