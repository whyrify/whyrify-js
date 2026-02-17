import type { Bucket } from "../types";
import { id } from "./id";

const LS_FEATURES_KEY = "WHYRIFY_FEATURES";
const LS_SESSION_KEY = "WHYRIFY_SESSION_ID";

// In-memory fallback for non-browser environments
let memoryStore: { [key: string]: string } = {};

const storage = {
    getItem(key: string): string | null {
        if (typeof localStorage === "undefined") {
            return memoryStore[key] ?? null;
        }
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    },
    setItem(key: string, value: string): void {
        if (typeof localStorage === "undefined") {
            memoryStore[key] = value;
            return;
        }
        try {
            localStorage.setItem(key, value);
        } catch {}
    },
    clear(): void {
        if (typeof localStorage === "undefined") {
            memoryStore = {};
            return;
        }
        try {
            //we don't do localStorage.clear(); as it may contains other valuable info
            localStorage.removeItem(LS_FEATURES_KEY);
            localStorage.removeItem(LS_SESSION_KEY);
        } catch {}
    },
};

/**
 * load stored features
 */
export const loadFeatureState = (): Record<string, Bucket> => {
    try {
        return JSON.parse(storage.getItem(LS_FEATURES_KEY) ?? "{}");
    } catch {
        return {};
    }
};

/**
 * save stored features
 */
export const saveFeatureState = (value: Record<string, Bucket>) => {
    try {
        storage.setItem(LS_FEATURES_KEY, JSON.stringify(value));
    } catch {}
};

/**
 * clear storage
 */
export const clearStorage = () => {
    try {
        storage.clear();
    } catch {}
};

/**
 * save session ID
 */
const newSessionId = () => {
    const sessionId = id();
    storage.setItem(LS_SESSION_KEY, sessionId);
    return sessionId;
};

/**
 * return session ID
 */
export const getSessionId = (): string => {
    try {
        const sessionId = storage.getItem(LS_SESSION_KEY);
        return sessionId ?? newSessionId();
    } catch {
        return newSessionId();
    }
};
