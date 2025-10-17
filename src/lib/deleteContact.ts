import { supabase } from '../supabaseClient';

export async function deleteContact(contactId: string): Promise<{ success: boolean; error: string | null }> {
	// Vérifie la session active
	const { data: sessionData } = await supabase.auth.getSession();
	if (!sessionData?.session) {
		return { success: false, error: 'Session expirée' };
	}
	const { error } = await supabase.from('contacts').delete().eq('id', contactId);
	if (error) {
		if (error.code === '401' || error.code === '403') {
			return { success: false, error: 'Session expirée' };
		}
		return { success: false, error: error.message };
	}
	return { success: true, error: null };
}
