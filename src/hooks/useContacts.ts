import { useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Contact, Mandate, MandateContact } from '../types/contact';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export function useContacts({
  search = '',
  filters = {},
  sort = { field: 'modifie_le', direction: 'desc' },
  page = 1,
  pageSize = 20,
}: {
  search?: string;
  filters?: any;
  sort?: { field: string; direction: 'asc' | 'desc' };
  page?: number;
  pageSize?: number;
}) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    let query = supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .order(sort.field, { ascending: sort.direction === 'asc' })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (search) {
      query = query.or(
        `nom_complet.ilike.%${search}%,telephone.ilike.%${search}%,email.ilike.%${search}%,societe.ilike.%${search}%`
      );
    }
    if (filters.type_contact) {
      query = query.eq('type_contact', filters.type_contact);
    }
    if (filters.ville) {
      query = query.eq('adresse_ville', filters.ville);
    }
    if (filters.a_iban !== undefined) {
      if (filters.a_iban) query = query.not('iban', 'is', null);
      else query = query.is('iban', null);
    }
    if (filters.date_debut && filters.date_fin) {
      query = query.gte('cree_le', filters.date_debut).lte('cree_le', filters.date_fin);
    }
    const { data, error, count } = await query;
    if (error) setError(error.message);
    else {
      setContacts(data || []);
      setTotal(count || 0);
    }
    setLoading(false);
  }, [search, filters, sort, page, pageSize]);

  return { contacts, setContacts, total, loading, error, fetchContacts };
}

export function useMandatesByContact(contactId: string) {
  const [mandates, setMandates] = useState<MandateContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMandates = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('mandate_contacts')
      .select('*,mandats:titre,mandats:statut,mandats:created_at')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setMandates(data || []);
    setLoading(false);
  }, [contactId]);

  return { mandates, loading, error, fetchMandates };
}

export function useLinkMandatesToContact() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const linkMandates = useCallback(
    async (contactId: string, mandates: { mandate_id: string; role: 'seller' | 'buyer'; is_primary: boolean }[]) => {
      setLoading(true);
      setError(null);
      const inserts = mandates.map((m) => ({ ...m, contact_id: contactId }));
      const { error } = await supabase.from('mandate_contacts').upsert(inserts, { onConflict: 'mandate_id,contact_id,role' });
      setLoading(false);
      if (error) setError(error.message);
      return !error;
    },
    []
  );

  const unlinkMandate = useCallback(async (contactId: string, mandateId: string, role: 'seller' | 'buyer') => {
    setLoading(true);
    setError(null);
    const { error } = await supabase
      .from('mandate_contacts')
      .delete()
      .eq('contact_id', contactId)
      .eq('mandate_id', mandateId)
      .eq('role', role);
    setLoading(false);
    if (error) setError(error.message);
    return !error;
  }, []);

  return { linkMandates, unlinkMandate, loading, error };
}
