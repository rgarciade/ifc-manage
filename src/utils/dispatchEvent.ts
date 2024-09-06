export const dispatchEvent = (eventName: string, detail: any = {}) => {
    const event = new CustomEvent(eventName, { detail: { loader: this, ...detail } });
    window.dispatchEvent(event);
}
