import { expect, test, vi } from "vitest";
import { debounce } from "../lib/utils/helpers.js";

test("calling debounced Fn multiple times should update only once", () => {
    vi.useFakeTimers();
    let i = 0;
    const fn = () => i++;
    const debouncedFn = debounce(fn);
    debouncedFn();
    debouncedFn();
    debouncedFn();
    vi.runAllTimers();
    expect(i).toBe(1);
    vi.useRealTimers();
});

test("calling debounced Fn with delay should work", () => {
    vi.useFakeTimers();
    let i = 0;
    const fn = () => i++;
    const debouncedFn = debounce(fn, 10);
    debouncedFn();
    vi.advanceTimersByTime(20);
    debouncedFn();
    vi.advanceTimersByTime(20);
    debouncedFn();
    vi.runAllTimers();
    expect(i).toBe(3);
    vi.useRealTimers();
});
