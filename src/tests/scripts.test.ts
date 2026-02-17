import { expect, test } from "vitest";
import {
    getFeatureNameFromScript,
    reinjectScript,
    checkScriptsForValidation,
} from "../lib/utils/scripts";

/**
 * @vitest-environment jsdom
 */
test("it should parse feature name from the script", () => {
    const script = document.createElement("script");
    script.setAttribute("data-feature", "feature-x");
    expect(getFeatureNameFromScript(script)).toBe("feature-x");
});

/**
 * @vitest-environment jsdom
 */
test("it should default to script name, if no feature specified", () => {
    const script = document.createElement("script");
    script.src = "htts://whyrify.com/s/whyrify.js";
    expect(getFeatureNameFromScript(script)).toBe("whyrify.js");
});

/**
 * @vitest-environment jsdom
 */
test("it should reinject script marked with text/whyrify", () => {
    const script = document.createElement("script");
    script.type = "text/whyrify";
    script.setAttribute("data-feature", "feature-x");
    document.body.appendChild(script);
    reinjectScript(script);
    const reinjectedScript = document.querySelector(`[type="text/javascript"]`);
    expect(reinjectedScript).not.toBeNull();
});

/**
 * @vitest-environment jsdom
 */
test("it should find scripts marked with text/whyrify", () => {
    const script = document.createElement("script");
    script.type = "text/whyrify";
    script.setAttribute("data-feature", "feature-x");
    document.body.appendChild(script);
    const foundScripts = checkScriptsForValidation();
    expect(foundScripts.length).toBeGreaterThan(0);
});
