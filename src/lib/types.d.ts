export type WhyrifyCmd = ((cmd: stirng, ...args: unknown[]) => void) & {
    q?: unknown[][];
};
declare global {
    interface Window {
        whyrify?: WhyrifyCmd;
    }
}

export type Bucket = "control" | "off";
