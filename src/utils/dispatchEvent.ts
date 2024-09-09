export const dispatchEvent = (eventName: string, detail: any = {}) => {
    const event = new CustomEvent(eventName, { detail: { ...detail } });
    window.dispatchEvent(event);
}
