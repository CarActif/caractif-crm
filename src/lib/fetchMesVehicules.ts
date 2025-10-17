import { supabase } from '../supabaseClient';

/**
 * Retourne les véhicules (mandats) de l'utilisateur connecté (RLS activé)
 */
export async function fetchMesVehicules() {
	const { data: { user }, error: userError } = await supabase.auth.getUser();
	if (userError) throw userError;
	if (!user) throw new Error('Non connecté');

	const { data, error } = await supabase
		.from('mandats')
		.select('*, contact:contact_id (nom_complet, telephone)')
		.eq('user_id', user.id);

	if (error) throw error;

	// Ajoute nom_complet et téléphone du contact lié (ou "Aucun contact")
	return (data || []).map(mandat => {
	  let nom_complet = 'Aucun contact';
	  let telephone = '';
	  if (mandat.contact) {
	    nom_complet = mandat.contact.nom_complet || 'Aucun contact';
	    telephone = mandat.contact.telephone || '';
	  }
	  return { ...mandat, nom_complet, telephone };
	});
}
