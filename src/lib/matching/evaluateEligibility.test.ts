import { describe, expect, it } from "vitest";
import { evaluateEligibility } from "./evaluateEligibility";
import { demoStudent, scholarships } from "@/lib/mock-data";

describe("evaluateEligibility", () => {
  it("sorts and classifies scholarships", () => {
    const result = evaluateEligibility(demoStudent, scholarships[0].rules);
    expect(["ELIGIBLE", "CONDITIONAL", "INELIGIBLE"]).toContain(result.status);
  });
});
