import type { Bucket } from "../types";
import { id } from "./id";

const LS_FEATURES_KEY = "WHYRIFY_FEATURES";
const LS_SESSION_KEY = "WHYRIFY_SESSION_ID";
/**
 * load stored features
 */
export const loadFeatureState = (): Record<string, Bucket> => {
    try {
        return JSON.parse(localStorage.getItem(LS_FEATURES_KEY) ?? "{}");
    } catch {
        return {};
    }
};

/**
 * save stored features
 */
export const saveFeatureState = (value: Record<string, Bucket>) => {
    try {
        localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(value));
    } catch {}
};

/**
 * save session ID
 */
const newSessionId = () => {
    const sessionId = id();
    localStorage.setItem(LS_SESSION_KEY, sessionId);
    return sessionId;
};

/**
 * return session ID
 */
export const getSessionId = (): string => {
    try {
        const sessionId = localStorage.getItem(LS_SESSION_KEY);
        return sessionId ?? newSessionId();
    } catch {
        return newSessionId();
    }
};
