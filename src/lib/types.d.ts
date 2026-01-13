export type WhyrifyQueue = { q: unknown[][] };
export type WhyrifyCmd = (cmd: string, ...args: unknown[]) => void;
declare global {
    interface Window {
        whyrify?: WhyrifyQueue | Whyrify;
    }
}

export type Bucket = "control" | "off";
