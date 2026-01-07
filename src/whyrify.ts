import { getScriptsForValidation, reinjectScript } from "./lib/manageScripts";
import { trackConversion, trackFeatures } from "./lib/tracking";
import type { Bucket } from "./lib/types";
import { debounce } from "./lib/utils/helpers";
import { loadFeatureState, saveFeatureState } from "./lib/utils/storage";

/**
 * Test impact of scripts through chaos engineering
 */

if (!window.WHYRIFY_CONFIG) {
    console.warn("WHYRIFY_CONFIG is missing, all scripts will be lauched...");
}

window.WHYRIFY_FEATURES = loadFeatureState();
const DEFAULT_CHAOS_CHANCE = 5; // by default 5% of session will have some script broken
window.WHYRIFY_MAKE_CHAOS =
    window.WHYRIFY_CONFIG &&
    Math.random() < (window.WHYRIFY_CONFIG.chaosChance ?? DEFAULT_CHAOS_CHANCE) / 100;

const bouncedFeatureLog = debounce<Record<string, Bucket>>((features) => {
    trackFeatures(features);
});
/**
 * track experiment impressions and conversions
 * example: window.whyrify.link();
 */
window.whyrify = {
    impression: () => {
        bouncedFeatureLog(window.WHYRIFY_FEATURES_LOG_QUEUE);
        // clean queue to send only new features
        window.WHYRIFY_FEATURES_LOG_QUEUE = {};
    },
    link: (eventName: string) => {
        trackConversion(eventName);
    },
};
/**
 * Execute whyrify main loop
 */
const run = () => {
    getScriptsForValidation();
    saveFeatureState(window.WHYRIFY_FEATURES);
    window.whyrify.impression();
    // observe if new scripts for validation appeared
    const config = {
        childList: true,
        subtree: true,
    };
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach((node) => {
                    if (
                        node.nodeName === "SCRIPT" &&
                        (node as HTMLScriptElement).type === "text/whyrify"
                    ) {
                        reinjectScript(node as HTMLScriptElement);
                        saveFeatureState(window.WHYRIFY_FEATURES);
                        window.whyrify.impression();
                    }
                });
            }
        }
    });
    observer.observe(document.documentElement, config);
};

run();
