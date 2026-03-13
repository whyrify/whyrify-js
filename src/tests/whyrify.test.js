import { expect, test, vi } from "vitest";
import { Whyrify } from "../lib/whyrify";

test("it should bucket user", () => {
    // mock value to 0.8 so Math.random() > 50%
    vi.spyOn(Math, "random").mockReturnValue(0.8);
    const engine = new Whyrify("XXXX-XXXX-XXXX-XXXX", 50, true);
    const bucketX = engine.decide("feature-x");
    expect(bucketX).toBe("control");
    vi.restoreAllMocks();
    // mock value to 0.2 so Math.random() < 50%
    vi.spyOn(Math, "random").mockReturnValue(0.2);
    const bucketY = engine.decide("feature-y");
    expect(bucketY).toBe("off");
    vi.restoreAllMocks();
});

test("it should bucket to off if chance is 100%", () => {
    const engine = new Whyrify("XXXX-XXXX-XXXX-XXXX", 100, true);
    const bucket = engine.decide("feature-x");
    expect(bucket).toBe("off");
});

test("it should bucket to control if chance is 0%", () => {
    const engine = new Whyrify("XXXX-XXXX-XXXX-XXXX", 0, true);
    const bucket = engine.decide("feature-x");
    expect(bucket).toBe("control");
});
