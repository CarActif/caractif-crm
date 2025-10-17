// src/utils/computeScores.ts
// Calcule score d'attractivité pour une liste de véhicules

export interface VehicleInput {
  id: string;
  marque: string;
  modele: string;
  annee: number;
  km: number;
  prix: number;
}

export interface VehicleWithScore extends VehicleInput {
  age: number;
  prixAjuste: number;
  score: number;
}

export function computeScores(vehicules: VehicleInput[]): VehicleWithScore[] {
  const currentYear = new Date().getFullYear();
  // Calculer age et prixAjuste pour chaque véhicule
  const vehs = vehicules.map(v => {
    const age = currentYear - v.annee;
    const prixAjuste = v.prix + (100 * (v.km / 1000)) + (1200 * age);
    return { ...v, age, prixAjuste };
  });
  const prixAjustes = vehs.map(v => v.prixAjuste);
  const minPA = Math.min(...prixAjustes);
  const maxPA = Math.max(...prixAjustes);
  // Si tous les prixAjuste sont égaux, éviter division par zéro
  return vehs.map(v => {
    let score = 100;
    if (maxPA !== minPA) {
      score = 60 + 40 * (maxPA - v.prixAjuste) / (maxPA - minPA);
    }
    return { ...v, score };
  });
}
