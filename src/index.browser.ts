import type { Bucket, WhyrifyCmd } from "./lib/types";
import { Whyrify } from "./lib/whyrify";

let engine: Whyrify | null = null;
/**
 * Whyrify command queue processor
 * @param cmd - Command name ('config' | 'link' | 'decide')
 * @param args - Command arguments
 */
const whyrify: WhyrifyCmd = (cmd: string, ...args: unknown[]) => {
    const actions = {
        config: () => {
            const [measurementId, chaosChance, doNotObserveScripts] = args as [
                string | undefined,
                number | undefined,
                boolean | undefined,
            ];
            if (!measurementId) {
                console.warn(
                    `Whyrify: missing measurementId on config command`,
                );
                return;
            }
            engine = new Whyrify(
                measurementId,
                chaosChance,
                doNotObserveScripts,
            );
        },
        link: () => {
            const [event] = args as [string | undefined];
            if (!engine) {
                console.warn(`Whyrify: not initialized`);
                return;
            }
            if (!event) {
                console.warn(
                    `Whyrify: missing conversion name on link command`,
                );
                return;
            }
            engine.link(event);
        },
        decide: () => {
            const [feature, onResult] = args as [
                string | undefined,
                ((bucket: Bucket) => void) | undefined,
            ];
            if (!engine) {
                console.warn(`Whyrify: not initialized`);
                return;
            }
            if (!feature || !onResult) {
                console.warn(
                    `Whyrify: missing required params on decide command`,
                );
                return;
            }
            const result = engine.decide(feature);
            engine.reportFeatures();
            onResult(result);
        },
    } as const;
    const isAvailableAction = (cmd: string): cmd is keyof typeof actions =>
        cmd in actions;
    if (isAvailableAction(cmd)) {
        actions[cmd]();
    } else {
        console.warn(`Whyrify: unknown command - ${cmd}`);
    }
};
// Logic to execute pre-existing queue on load
let existingQueue: unknown[][] = [];
if (window.whyrify?.q) {
    existingQueue = window.whyrify.q;
}
for (const args of existingQueue) {
    const [cmd, ...rest] = args;
    if (typeof cmd === "string") {
        whyrify(cmd, ...rest);
    } else {
        console.warn(`Whyrify: unknown command - ${cmd}`);
    }
}
window.whyrify = whyrify;
