export function getCommissionTTC(netPrice) {
  if (netPrice <= 15000) return 1090
  if (netPrice <= 25000) return 1490
  if (netPrice <= 35000) return 1990
  if (netPrice <= 45000) return 2490
  if (netPrice <= 60000) return 2990
  if (netPrice <= 90000) return 3490
  if (netPrice <= 120000) return 4490
  return 5990
}

export function calculateCommercialCommission(caHT) {
  const tranches = [
    { limit: 2000, rate: 0.15 },
    { limit: 4000, rate: 0.20 },
    { limit: 7000, rate: 0.25 },
    { limit: 11000, rate: 0.30 },
    { limit: Infinity, rate: 0.30 }
  ]
  let remaining = caHT
  let previous = 0
  let total = 0
  for (const tranche of tranches) {
    const applicable = Math.min(tranche.limit - previous, remaining)
    if (applicable > 0) {
      total += applicable * tranche.rate
      remaining -= applicable
      previous = tranche.limit
    }
  }
  return total
}
