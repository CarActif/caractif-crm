import { supabase } from '../supabaseClient';
import { Contact } from '../types/contact';

export async function saveContact(contact: Partial<Contact>): Promise<{ data: Contact | null; error: string | null }> {
  if (!contact.nom_complet || contact.nom_complet.trim() === '') {
    return { data: null, error: 'Le nom complet est requis.' };
  }
  if (contact.email && !/^\S+@\S+\.\S+$/.test(contact.email)) {
    return { data: null, error: 'Format email invalide.' };
  }
  if (contact.iban && !/^([A-Z]{2}\d{2}[A-Z0-9]{1,30})$/.test(contact.iban.replace(/\s/g, ''))) {
    return { data: null, error: 'Format IBAN invalide.' };
  }
  if (contact.bic && !/^([A-Z0-9]{8}|[A-Z0-9]{11})$/.test(contact.bic.replace(/\s/g, ''))) {
    return { data: null, error: 'Format BIC invalide.' };
  }

  let result;
  if (!contact.id) {
    result = await supabase.from('contacts').insert([contact]).select().single();
  } else {
    result = await supabase.from('contacts').update(contact).eq('id', contact.id).select().single();
  }
  if (result.error) {
    return { data: null, error: result.error.message };
  }
  return { data: result.data as Contact, error: null };
}
