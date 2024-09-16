import { LitElement, html,css } from 'lit';

export class ButtonElement extends LitElement {
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
            }
            .small-button {
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
            icon: { type: String },
            text: { type: String },
            small: { type: Boolean },
            color: { type: String },
            tooltipPosition: { type: String }
        };
    }
    clickAction: any;
    icon: string;
    text: string;
    small: boolean =false
    color: string = 'white'
    tooltipPosition: string = ''
    callClickAction() {
        this.clickAction();
    }
    constructor() {
        super();
        this.icon = 'file';
        this.text = 'Load Sample';
        this.clickAction = () => {};
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
                    <span class="tooltip-text ${this.getTooltipPosition()}">${this.text}</span>
                    <bim-icon icon="${this.icon}" style="color:${this.color}"></bim-icon>
                </div>
            `:
            html`
               <button class="icon-button" @click="${() => this.callClickAction()}">
                   <bim-icon icon="${this.icon}"></bim-icon>
                   ${this.text}
               </button>
        `;
    }
}

window.customElements.define('button-element', ButtonElement);
