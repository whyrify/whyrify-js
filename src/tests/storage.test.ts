import { expect, test } from "vitest";
import {
    clearStorage,
    getSessionId,
    loadFeatureState,
    saveFeatureState,
} from "../lib/utils/storage";
import type { Bucket } from "../lib/types";

test("repeated call returns the same session id", () => {
    const sid = getSessionId();
    const repeatedSid = getSessionId();
    expect(sid === repeatedSid).toBe(true);
});

test("it generates new session id after cleanup", () => {
    const sid = getSessionId();
    clearStorage();
    const repeatedSid = getSessionId();
    expect(sid === repeatedSid).toBe(false);
});

test("it stores features", () => {
    const features: Record<string, Bucket> = {
        "feature-x": "control",
        "feature-y": "off",
    };
    saveFeatureState(features);
    const storedFeatures = loadFeatureState();
    expect(storedFeatures["feature-x"]).toBe(features["feature-x"]);
    expect(storedFeatures["feature-y"]).toBe(features["feature-y"]);
});
