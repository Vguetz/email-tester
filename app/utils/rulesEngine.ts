import rulesData from "../data/compatibility-rules.json";
import { CompatibilityIssue, TargetClient } from "./interfaces";

type SupportLevel = "full" | "partial" | "none";
type RuleAction = "strip" | "warn-only";

interface RuleClientEntry {
  support: SupportLevel;
  action: RuleAction;
  severity: "error" | "warning";
  message: string;
}

type RuleMatch =
  | { type: "property" }
  | { type: "property-value"; values: string[] }
  | { type: "regex"; pattern: string };

export interface CompatibilityRule {
  id: string;
  property: string;
  match: RuleMatch;
  clients: Partial<Record<TargetClient, RuleClientEntry>>;
}

const rules = rulesData as CompatibilityRule[];

// Gmail's webmail and mobile apps strip <style> blocks left in <head> after
// inlining; the other seeded clients render them well enough to keep.
const STRIPS_HEAD_STYLE: Partial<Record<TargetClient, boolean>> = {
  gmail: true,
  "gmail-ios": true,
  "gmail-android": true,
};

export function shouldStripHeadStyle(targetClient: TargetClient): boolean {
  return STRIPS_HEAD_STYLE[targetClient] ?? false;
}

interface Declaration {
  property: string;
  value: string;
}

function parseDeclarations(styleAttr: string): Declaration[] {
  return styleAttr
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => {
      const idx = d.indexOf(":");
      if (idx === -1) return { property: d, value: "" };
      return { property: d.slice(0, idx).trim(), value: d.slice(idx + 1).trim() };
    });
}

function matchesRule(rule: CompatibilityRule, decl: Declaration): boolean {
  if (decl.property.toLowerCase() !== rule.property.toLowerCase()) return false;
  switch (rule.match.type) {
    case "property":
      return true;
    case "property-value":
      return rule.match.values.some((v) => decl.value.toLowerCase().startsWith(v.toLowerCase()));
    case "regex":
      return new RegExp(rule.match.pattern, "i").test(`${decl.property}: ${decl.value}`);
    default:
      return false;
  }
}

export function evaluateStyle(
  styleAttr: string,
  targetClient: TargetClient
): { cleanedStyle: string; issues: CompatibilityIssue[] } {
  const declarations = parseDeclarations(styleAttr);
  const issues: CompatibilityIssue[] = [];
  const kept: Declaration[] = [];

  for (const decl of declarations) {
    let strip = false;

    for (const rule of rules) {
      if (!matchesRule(rule, decl)) continue;
      const entry = rule.clients[targetClient];
      if (!entry) continue; // no entry for this client == treated as fully supported

      issues.push({
        property: decl.property,
        value: decl.value,
        message: entry.message,
        severity: entry.severity,
        ruleId: rule.id,
        client: targetClient,
      });

      if (entry.action === "strip") strip = true;
    }

    if (!strip) kept.push(decl);
  }

  const cleanedStyle = kept.map((d) => `${d.property}: ${d.value}`).join("; ");
  return { cleanedStyle, issues };
}

export { rules as compatibilityRules };
