declare global {
    interface Window {
        whyrify: { impression: () => void; link: (eventName: string) => void };
        WHYRIFY_CONFIG: {
            measurementId: string;
            chaosChance: number;
        };
        WHYRIFY_FEATURES: Record<string, Bucket>;
        WHYRIFY_FEATURES_LOG_QUEUE: Record<string, Bucket>;
        WHYRIFY_MAKE_CHAOS: boolean;
    }
}

export type Bucket = "control" | "off";

export type AnalyticEvent = {
    event_name: string;
    sid: string;
    mid: string;
    exp: Record<string, Bucket>;
};
