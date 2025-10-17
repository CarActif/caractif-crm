// Calcule la médiane d'un tableau de nombres
export function median(arr) {
  if (!arr.length) return 0;
  const s = [...arr].sort((a,b)=>a-b);
  const mid = Math.floor(s.length/2);
  return s.length%2 ? s[mid] : (s[mid-1]+s[mid])/2;
}
// Format a number as euro currency (e.g. 1234.56 => "1 234 €")

export function formatEuro(n) {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' €';
}

// Helper pour Estimation
export function eur(n) {
  return Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n || 0);
}
