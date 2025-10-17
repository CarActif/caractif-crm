// Test unitaire pour computeScores
import { computeScores, VehicleInput } from './computeScores';

describe('computeScores', () => {
  it('calcule correctement les scores pour 3 véhicules', () => {
    const vehs: VehicleInput[] = [
      { id: 'A', marque: 'Peugeot', modele: '208', annee: 2019, km: 60000, prix: 20000 },
      { id: 'B', marque: 'Renault', modele: 'Clio', annee: 2020, km: 50000, prix: 20500 },
      { id: 'C', marque: 'Citroen', modele: 'C3', annee: 2018, km: 65000, prix: 19500 },
    ];
    const year = new Date().getFullYear();
    const scores = computeScores(vehs);
    // B doit avoir le meilleur score (~100), A autour de 77, C autour de 60
    const scoreA = scores.find(v => v.id === 'A')?.score || 0;
    const scoreB = scores.find(v => v.id === 'B')?.score || 0;
    const scoreC = scores.find(v => v.id === 'C')?.score || 0;
    expect(Math.round(scoreB)).toBeGreaterThanOrEqual(99);
    expect(Math.round(scoreA)).toBeGreaterThanOrEqual(75);
    expect(Math.round(scoreA)).toBeLessThanOrEqual(80);
    expect(Math.round(scoreC)).toBeGreaterThanOrEqual(59);
    expect(Math.round(scoreC)).toBeLessThanOrEqual(65);
  });
});
