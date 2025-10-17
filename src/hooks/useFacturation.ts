import { useMemo } from 'react';
import { supabase } from "@/supabaseClient";
import { fetchMesVehicules } from "@/lib/fetchMesVehicules";
import { toHT, computeCommissionProgressive } from "@/lib/commission";
import { useQuery } from '@tanstack/react-query';



export async function fetchSoldMandates(
  startDate: string,
  endDate: string,
  userId?: string,
  isAdmin = false
) {
  let data = [];
  if (!isAdmin) {
    // Utilisateur standard : on utilise fetchMesVehicules (filtrage user_id)
    data = await fetchMesVehicules();
  } else {
    // Admin : accès à tout
    const res = await supabase
      .from('mandats')
      .select('id, modele, commission_ttc, date_vente, statut, agent_id, photo_url')
      .in('statut', ['Vendu', 'Archivé'])
      .not('date_vente', 'is', null)
      .gte('date_vente', startDate)
      .lt('date_vente', endDate);
    if (res.error) throw res.error;
    data = res.data ?? [];
  }
  // Exclure toute ligne avec date_vente NULL ou statut non attendu (sécurité)
  const filtered = (data ?? []).filter(
    (row) => row.date_vente !== null && ["Vendu", "Archivé"].includes(row.statut)
      && row.date_vente >= startDate && row.date_vente < endDate
  );
  return filtered;
}

export function mapRowsToHT(rows: any[]) {
  return rows.map(r => ({
    ...r,
    commission_ht: Number(r.commission_ttc ?? 0) / 1.2,
  }));
}

export function aggregateTotals(rows: any[]) {
  const totalTTC = rows.reduce((s, r) => s + Number(r.commission_ttc ?? 0), 0);
  const totalHT  = rows.reduce((s, r) => s + Number(r.commission_ht ?? 0), 0);
  const caHT     = totalHT;
  const montantCommercial = computeCommissionProgressive(caHT);
  // Ajout du console.log demandé
  console.log('[Facturation]', {
    nbLignes: rows.length,
    totalTTC: Number(totalTTC.toFixed(2)),
    totalHT: Number(totalHT.toFixed(2)),
    caHT: Number(caHT.toFixed(2)),
    montantCommercial
  });
  return {
    totalTTC: Number(totalTTC.toFixed(2)),
    totalHT: Number(totalHT.toFixed(2)),
    caHT: Number(caHT.toFixed(2)),
    montantCommercial,
  };
}

export function useFacturation(
  startDate: string,
  endDate: string,
  userId?: string,
  isAdmin = false
) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['facturation', startDate, endDate, userId, isAdmin],
    queryFn: () => fetchSoldMandates(startDate, endDate, userId, isAdmin),
  });

  const rowsWithHT = useMemo(() => (data ? mapRowsToHT(data) : []), [data]);
  const totals = useMemo(() => aggregateTotals(rowsWithHT), [rowsWithHT]);

  return { rows: rowsWithHT, totals, isLoading, error };
}
