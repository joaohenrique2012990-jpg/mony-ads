import { describe, it, expect } from "vitest";
import { calcMetrics, buildUtm } from "./tools";

describe("calcMetrics", () => {
  it("computes CTR, CPC, CPA, ROAS, ROI", () => {
    const m = calcMetrics({ spend: 100, impressions: 1000, clicks: 50, conversions: 5, revenue: 300 });
    expect(m).toEqual({ ctr: 5, cpc: 2, cpa: 20, roas: 3, roi: 200 });
  });
});

describe("buildUtm", () => {
  it("adds utm params", () => {
    expect(buildUtm("https://a.com", { utm_source: "fb", utm_medium: "" })).toBe("https://a.com/?utm_source=fb");
  });
});
