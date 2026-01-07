import { vi, test, expect } from "vitest";
import { debounce } from "../lib/utils/helpers.js";

test("calling debaunced Fn multiple times should update only once", () => {
    vi.useFakeTimers();
    let i = 0;
    const fn = () => i++;
    const debauncedFn = debounce(fn);
    debauncedFn();
    debauncedFn();
    debauncedFn();
    vi.runAllTimers();
    expect(i).toBe(1);
    vi.useRealTimers();
});

test("calling debaunced Fn with delay should work", () => {
    vi.useFakeTimers();
    let i = 0;
    const fn = () => i++;
    const debauncedFn = debounce(fn, 10);
    debauncedFn();
    vi.advanceTimersByTime(20);
    debauncedFn();
    vi.advanceTimersByTime(20);
    debauncedFn();
    vi.runAllTimers();
    expect(i).toBe(3);
    vi.useRealTimers();
});
