import { calcCommissionFromTTC } from "./commission";
import { calcCommissionFromTTC, toHT, computeCommissionProgressive } from "./commission";

describe("calcCommissionFromTTC", () => {
  it("0 HT -> 0 commission", () => {
    const res = calcCommissionFromTTC(0);
    expect(res.caHT).toBe(0);
    expect(res.commissionHT).toBe(0);
  });

  it("3725 HT (4470 TTC) -> 2035 commission", () => {
    const res = calcCommissionFromTTC(4470);
    expect(res.caHT).toBeCloseTo(3725, 0);
    expect(res.commissionHT).toBeCloseTo(2035, 0);
  });

  it(">= 15000 HT -> inclut la tranche 80%", () => {
    const res = calcCommissionFromTTC(18000);
  expect(res.caHT).toBeGreaterThanOrEqual(15000);
    const last = res.breakdown[res.breakdown.length - 1];
    expect(last.taux).toBe(0.8);
  });
});
});
describe('toHT', () => {
  it('calculates HT from TTC with default TVA', () => {
    expect(toHT(120)).toBeCloseTo(100.00, 2);
  });
  it('calculates HT from TTC with custom TVA', () => {
    expect(toHT(110, 0.1)).toBeCloseTo(100.00, 2);
  });
});

describe('computeCommissionProgressive', () => {
  it('returns 745.00 for 1241.67', () => {
    expect(computeCommissionProgressive(1241.67)).toBeCloseTo(745.00, 2);
  });
  it('returns 1290.00 for 2150', () => {
    expect(computeCommissionProgressive(2150)).toBeCloseTo(1290.00, 2);
  });
  it('returns 5050.00 for 8000', () => {
    expect(computeCommissionProgressive(8000)).toBeCloseTo(5050.00, 2);
  });
  it('returns 12350.00 for 18000', () => {
    expect(computeCommissionProgressive(18000)).toBeCloseTo(12350.00, 2);
  });
});
