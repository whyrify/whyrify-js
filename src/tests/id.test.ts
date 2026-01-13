import { expect, test } from "vitest";
import { id } from "../lib/utils/id.js";

test("generated id is unique", () => {
    const list = new Set();
    for (let i = 0; i < 1000; i++) {
        list.add(id());
    }
    expect(list.size === 1000);
});
