// Conversion TTC -> HT
export const toHT = (ttc: number, tva = 0.2): number =>
  Number((ttc / (1 + tva)).toFixed(2));

// Barème progressif demandé dans le prompt
export function computeCommissionProgressive(caHT: number): number {
  const brackets = [
    { cap: 4000, rate: 0.60 },
    { cap: 7000, rate: 0.65 },
    { cap: 15000, rate: 0.70 },
    { cap: Infinity, rate: 0.80 },
  ];
  let remaining = Math.max(0, caHT);
  let lastCap = 0;
  let total = 0;
  for (const b of brackets) {
    const span = Math.max(0, Math.min(remaining, b.cap - lastCap));
    total += span * b.rate;
    remaining -= span;
    lastCap = b.cap;
    if (remaining <= 0) break;
  }
  return Number(total.toFixed(2));
}
// Calcul progressif des commissions par tranches glissantes
// CA TTC -> CA HT -> commission par tranches

export interface CommissionBreakdown {
  trancheMin: number;
  trancheMax: number | null;
  base: number;
  taux: number;
  montant: number;
}

export interface CommissionResult {
  caHT: number;
  commissionHT: number;
  breakdown: CommissionBreakdown[];
}

const tranches = [
  { min: 0, max: 2000, taux: 0.5 },
  { min: 2000, max: 4000, taux: 0.6 },
  { min: 4000, max: 7000, taux: 0.7 },
  { min: 7000, max: 11000, taux: 0.7 },
  { min: 11000, max: 15000, taux: 0.75 },
  { min: 15000, max: null, taux: 0.8 },
];

export function calcCommissionFromTTC(totalTTC: number, vatRate = 0.2): CommissionResult {
  const caHT = +(totalTTC / (1 + vatRate)).toFixed(2);
  let commissionHT = 0;
  const breakdown: CommissionBreakdown[] = [];

  for (const tranche of tranches) {
    const trancheMin = tranche.min;
    const trancheMax = tranche.max ?? Infinity;
    let base = 0;
    if (tranche.max === null) {
      // Dernière tranche : tout ce qui dépasse 15000
      base = Math.max(0, caHT - trancheMin);
      // Toujours ajouter la tranche 80% si caHT > 15000, même si base=0 pour les autres tranches
      if (caHT > trancheMin) {
        const montant = +(base * tranche.taux).toFixed(2);
        breakdown.push({
          trancheMin: tranche.min,
          trancheMax: tranche.max,
          base: base,
          taux: tranche.taux,
          montant,
        });
        commissionHT += montant;
      }
    } else if (caHT > trancheMin) {
      base = Math.min(caHT, trancheMax) - trancheMin;
      base = Math.max(0, base);
      if (base > 0) {
        const montant = +(base * tranche.taux).toFixed(2);
        breakdown.push({
          trancheMin: tranche.min,
          trancheMax: tranche.max,
          base: base,
          taux: tranche.taux,
          montant,
        });
        commissionHT += montant;
      }
    }
  }
  commissionHT = +commissionHT.toFixed(2);
  return { caHT, commissionHT, breakdown };
}
