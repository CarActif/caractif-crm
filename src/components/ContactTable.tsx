
import React, { useState } from 'react';
import { Contact } from '../types/contact';
import { formatDateShort, formatDateRelative } from '../utils/formatDate';

import { deleteContact } from '../lib/deleteContact';

export function ContactTable({
  contacts,
  setContacts,
  loading,
  error,
  page,
  pageSize,
  total,
  onPageChange,
  onSortChange,
  onEdit,
  onView,
  fetchContacts,
  showToast,
}: {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onSortChange: (sort: { field: string; direction: 'asc' | 'desc' }) => void;
  onEdit: (contact: Contact) => void;
  onView: (contact: Contact) => void;
  fetchContacts: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // Mapping type_contact to readable label
  const typeLibelle: Record<string, string> = {
    acheteur: 'Acheteur',
    vendeur: 'Vendeur',
    acheteur_vendeur: 'Acheteur/Vendeur',
    autre: 'Autre',
  };

  // Pagination helpers
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="bg-white rounded shadow p-4 overflow-x-auto w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-lg">Contacts</div>
        <button className="btn btn-sm btn-outline" onClick={fetchContacts} disabled={loading}>
          Rafraîchir
        </button>
      </div>
      {loading ? (
        <div className="py-8 text-center text-gray-400 animate-pulse">Chargement…</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">
          Erreur de chargement
          <button className="btn btn-sm btn-outline ml-2" onClick={fetchContacts}>Réessayer</button>
        </div>
      ) : contacts.length === 0 ? (
        <div className="py-8 text-center text-gray-400">Aucun contact</div>
      ) : (
  <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-2 py-2 text-left">Nom complet</th>
              <th className="px-2 py-2 text-left">Téléphone</th>
              <th className="px-2 py-2 text-left">Email</th>
              <th className="px-2 py-2 text-left">Société</th>
              <th className="px-2 py-2 text-left">Ville</th>
              <th className="px-2 py-2 text-left">Type</th>
              <th className="px-2 py-2 text-left">Modifié le</th>
              <th className="px-2 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="px-2 py-2 font-medium">{c.nom_complet}</td>
                <td className="px-2 py-2">{c.telephone || '—'}</td>
                <td className="px-2 py-2">{c.email || '—'}</td>
                <td className="px-2 py-2">{c.societe || '—'}</td>
                <td className="px-2 py-2">{c.adresse_ville || '—'}</td>
                <td className="px-2 py-2">{typeLibelle[c.type_contact] || c.type_contact}</td>
                <td className="px-2 py-2 whitespace-nowrap">
                  <span title={c.modifie_le ? formatDateShort(c.modifie_le) : ''}>
                    {c.modifie_le ? formatDateRelative(c.modifie_le) : '—'}
                  </span>
                </td>
                <td className="px-2 py-2 flex gap-2">
                  <button
                    className="btn btn-xs btn-outline"
                    title="Éditer"
                    onClick={() => onEdit(c)}
                  >
                    Éditer
                  </button>
                  <button
                    className="btn btn-xs btn-outline text-red-500 border-red-300"
                    title="Supprimer"
                    disabled={deletingId === c.id}
                    onClick={async () => {
                      if (!window.confirm('Supprimer ce contact ?')) return;
                      setDeletingId(c.id);
                      const { success, error } = await deleteContact(c.id);
                      setDeletingId(null);
                      if (success) {
                        setContacts(prev => prev.filter(ct => ct.id !== c.id));
                        showToast('Contact supprimé', 'success');
                      } else {
                        if (error === 'Session expirée') {
                          showToast('Session expirée. Veuillez vous reconnecter.', 'error');
                        } else {
                          showToast(error || 'Erreur lors de la suppression', 'error');
                        }
                      }
                    }}
                  >
                    {deletingId === c.id ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      'Supprimer'
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            className="btn btn-xs btn-outline"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || loading}
          >
            Précédent
          </button>
          <span className="text-sm">
            Page {page} / {totalPages}
          </span>
          <button
            className="btn btn-xs btn-outline"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || loading}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
