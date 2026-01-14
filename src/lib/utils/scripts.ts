/**
 * get script name
 * @param src - script source
 * @returns script name with GET param
 */
const getScriptName = (src: string) => {
    const parts = src.split("/");
    return parts[parts.length - 1];
};
/**
 * get feature name from the script tag
 */
export const getFeatureNameFromScript = (script: HTMLScriptElement) => {
    return script.getAttribute("data-feature") ?? getScriptName(script.src) ?? "unknown";
};

/**
 * Reinject script marked as text/whyrify with text/javascript
 */
export const reinjectScript = (script: HTMLScriptElement) => {
    const node = document.createElement("script");
    node.type = "text/javascript";
    if (script.src) {
        node.src = script.src;
    } else {
        node.textContent = script.textContent;
    }
    Array.from(script.attributes).forEach((attr) => {
        if (attr.name !== "type") {
            node.setAttribute(attr.name, attr.value);
        }
    });
    script.insertAdjacentElement("afterend", node);
    if (script.parentNode) {
        script.parentNode.removeChild(script);
    } else {
        script.remove();
    }
};

/**
 * Return all scripts marked as text/whyrify
 */
export const checkScriptsForValidation = (): HTMLScriptElement[] => {
    const scripts: NodeListOf<HTMLScriptElement> =
        document.querySelectorAll<HTMLScriptElement>('[type="text/whyrify"]');
    const result = [];
    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i] as HTMLScriptElement;
        if (script.nodeName !== "SCRIPT") continue;
        result.push(script);
    }
    return result;
};
