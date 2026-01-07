import type { AnalyticEvent, Bucket } from "./types";
import { getSessionId, loadFeatureState } from "./utils/storage";

/**
 * Collect API endpoint
 */
const API_ENDPOINT = "https://api.whyrify.com/collect";

/**
 * function to send event to beacon
 */
const sendEvent = (event: AnalyticEvent) => {
    fetch(API_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(event),
    });
};

/**
 * tracking available features
 */
export const trackFeatures = (features: Record<string, Bucket>) => {
    if (!window.WHYRIFY_CONFIG.measurementId) return;
    sendEvent({
        event_name: "impression",
        sid: getSessionId(),
        mid: window.WHYRIFY_CONFIG.measurementId,
        exp: features,
    });
};

/**
 * tracking conversions
 * @param eventName - conversion event
 */
export const trackConversion = (eventName: string) => {
    if (!window.WHYRIFY_CONFIG.measurementId) return;
    const features = loadFeatureState();
    sendEvent({
        event_name: eventName,
        sid: getSessionId(),
        mid: window.WHYRIFY_CONFIG.measurementId,
        exp: features,
    });
};
