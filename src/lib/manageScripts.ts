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
 * Reinject script marked as text/whyrify with text/javascript
 * or break it with 1% chance
 */
export const reinjectScript = (script: HTMLScriptElement) => {
    const featureName: string =
        script.getAttribute("data-feature") ?? getScriptName(script.src) ?? "unknown";
    // break script if it's already chosen to break or  y 1% chance
    const makeChaos = window.WHYRIFY_MAKE_CHAOS && Math.random() < 0.01;
    const breakScript = window.WHYRIFY_FEATURES[featureName] === "off" || makeChaos;
    window.WHYRIFY_FEATURES[featureName] = breakScript ? "off" : "control";
    window.WHYRIFY_FEATURES_LOG_QUEUE[featureName] = window.WHYRIFY_FEATURES[featureName];
    if (breakScript) {
        // break only single script
        window.WHYRIFY_MAKE_CHAOS = false;
        return;
    }
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
export const getScriptsForValidation = () => {
    const scripts = document.querySelectorAll('[type="text/whyrify"]');
    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i] as HTMLScriptElement;
        if (script.nodeName !== "SCRIPT") continue;
        reinjectScript(script);
    }
};
