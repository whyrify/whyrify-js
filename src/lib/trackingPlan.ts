import type { Bucket } from "./types";
import { getSessionId } from "./utils/storage";

type AnalyticEvent = {
    event_name: string;
    sid: string;
    mid: string;
    exp: Record<string, Bucket>;
};

export class TrackingPlan {
    private _measurementId: string;
    private _api_endpoint = "https://api.whyrify.com/collect";

    constructor(measurementId: string) {
        this._measurementId = measurementId;
    }
    /**
     * function to send event to beacon
     */
    private _sendEvent(event: AnalyticEvent) {
        fetch(this._api_endpoint, {
            method: "POST",
            body: JSON.stringify(event),
        });
    }

    /**
     * tracking available features
     * @param features - list of features
     */
    trackFeatures(features: Record<string, Bucket>) {
        this._sendEvent({
            event_name: "impression",
            sid: getSessionId(),
            mid: this._measurementId,
            exp: features,
        });
    }

    /**
     * tracking conversions
     * @param eventName - conversion event
     */
    trackConversion(eventName: string, features: Record<string, Bucket>) {
        this._sendEvent({
            event_name: eventName,
            sid: getSessionId(),
            mid: this._measurementId,
            exp: features,
        });
    }
}
