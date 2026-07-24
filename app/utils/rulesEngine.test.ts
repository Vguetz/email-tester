import { describe, expect, it } from "vitest";
import { evaluateStyle, shouldStripHeadStyle } from "./rulesEngine";

describe("evaluateStyle", () => {
  it("strips display:grid for outlook-2016-2019 and reports an error", () => {
    const { cleanedStyle, issues } = evaluateStyle(
      "display: grid; color: red;",
      "outlook-2016-2019"
    );

    expect(cleanedStyle).toBe("color: red");
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({ property: "display", severity: "error", ruleId: "display-flex-grid" });
  });

  it("keeps display:flex for apple-mail with no issues (full support, absent from rule.clients)", () => {
    const { cleanedStyle, issues } = evaluateStyle("display: flex;", "apple-mail");

    expect(cleanedStyle).toBe("display: flex");
    expect(issues).toHaveLength(0);
  });

  it("warns but does not strip a partial-support property", () => {
    const { cleanedStyle, issues } = evaluateStyle("display: flex;", "gmail");

    expect(cleanedStyle).toBe("display: flex");
    expect(issues).toHaveLength(1);
    expect(issues[0].severity).toBe("warning");
  });

  it("strips position:absolute for gmail", () => {
    const { cleanedStyle, issues } = evaluateStyle("position: absolute; top: 0;", "gmail");

    expect(cleanedStyle).toBe("top: 0");
    expect(issues.map((i) => i.property)).toEqual(["position"]);
  });

  it("leaves unrelated declarations untouched", () => {
    const { cleanedStyle, issues } = evaluateStyle("padding: 10px; font-family: sans-serif;", "outlook-2016-2019");

    expect(cleanedStyle).toBe("padding: 10px; font-family: sans-serif");
    expect(issues).toHaveLength(0);
  });

  it("handles an empty style attribute", () => {
    const { cleanedStyle, issues } = evaluateStyle("", "gmail");

    expect(cleanedStyle).toBe("");
    expect(issues).toHaveLength(0);
  });
});

describe("shouldStripHeadStyle", () => {
  it("is true for gmail and its mobile apps", () => {
    expect(shouldStripHeadStyle("gmail")).toBe(true);
    expect(shouldStripHeadStyle("gmail-ios")).toBe(true);
    expect(shouldStripHeadStyle("gmail-android")).toBe(true);
  });

  it("is false for clients without an explicit entry", () => {
    expect(shouldStripHeadStyle("apple-mail")).toBe(false);
    expect(shouldStripHeadStyle("outlook-2016-2019")).toBe(false);
  });
});
