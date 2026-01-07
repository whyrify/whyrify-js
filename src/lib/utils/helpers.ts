/**
 * delay function calls until time elapsed after the last invocation
 * @param fn
 * @param time
 */
export const debounce = <T>(fn: (...args: T[]) => void, time = 500) => {
    let timeout: number;
    return (...args: T[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(...args);
        }, time);
    };
};
