import { expect, test } from "vitest";
import { Whyrify } from "../lib/whyrify";

test("it should bucket user", () => {
    const engine = new Whyrify("XXXX-XXXX-XXXX-XXXX", 50, true);
    const bucket = engine.decide("feature-x");
    expect(bucket).toBeOneOf(["control", "off"]);
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
