import { TrackingPlan } from "./trackingPlan";
import type { Bucket } from "./types";
import { debounce } from "./utils/helpers";
import {
    checkScriptsForValidation,
    getFeatureNameFromScript,
    reinjectScript,
} from "./utils/scripts";
import { loadFeatureState, saveFeatureState } from "./utils/storage";

const DEFAULT_CHAOS_CHANCE = 5; // by default 5% of session will have some script broken

/**
 * Test impact of scripts through chaos engineering
 */
export class Whyrify {
    _chaosChance: number = DEFAULT_CHAOS_CHANCE;
    /** all features */
    _features: Record<string, Bucket> = loadFeatureState();
    /** features awaiting to be reported */
    _featureLogQueue: Record<string, Bucket> = {};
    _makeChaos: boolean = false;
    _trackingPlan: TrackingPlan | null = null;

    /** debounced report features */
    reportFeatures = debounce(() => {
        this._trackingPlan?.trackFeatures(this._featureLogQueue);
        this._featureLogQueue = {};
        saveFeatureState(this._features);
    }, 500);

    constructor(measurementId: string, chaosChance?: number, doNotObserveScripts: boolean = false) {
        this._trackingPlan = new TrackingPlan(measurementId);
        if (chaosChance) {
            this._chaosChance = chaosChance;
        }
        if (!doNotObserveScripts) {
            this.watch();
        }
        this._makeChaos = Math.random() < this._chaosChance / 100;
    }

    /**
     * track experiment conversion with all active experiments
     */
    link(eventName: string) {
        this._trackingPlan?.trackConversion(eventName, this._features);
    }
    /**
     * decide on manual experiment
     */
    decide(feature: string): Bucket {
        const makeChaos = this._makeChaos && Math.random() < 0.01;
        const breakScript = this._features[feature] === "off" || makeChaos;
        this._features[feature] = breakScript ? "off" : "control";
        this._featureLogQueue[feature] = this._features[feature];
        if (breakScript) {
            // break only single script
            this._makeChaos = false;
            return "off";
        }
        return "control";
    }
    /**
     * watch type="text/whyrify" scripts and and inject faults into them
     */
    watch() {
        const scripts = checkScriptsForValidation();
        for (const script of scripts) {
            const featureName = getFeatureNameFromScript(script);
            const result = this.decide(featureName);
            if (result === "control") {
                reinjectScript(script);
            }
        }
        this.reportFeatures();
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
                            const script = node as HTMLScriptElement;
                            const featureName = getFeatureNameFromScript(script);
                            const result = this.decide(featureName);
                            if (result === "control") {
                                reinjectScript(script);
                            }
                            this.reportFeatures();
                        }
                    });
                }
            }
        });
        observer.observe(document.documentElement, config);
    }
}
