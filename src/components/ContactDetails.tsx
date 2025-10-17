import React from 'react';
import { Contact } from '../types/contact';

export function ContactDetails({
  contact,
  onClose,
  onEdit,
  onLinkMandates,
}: {
  contact: Contact;
  onClose: () => void;
  onEdit: (contact: Contact) => void;
  onLinkMandates: () => void;
}) {
  // ...UI for details, mandates, actions...
  return (
    <div className="fixed inset-0 bg-black/30 flex items-end md:items-center justify-center z-50">
      <div className="bg-white rounded-t-lg md:rounded-lg shadow-lg p-6 w-full max-w-xl md:max-w-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="text-lg font-bold">{contact.nom_complet}</div>
          <button className="btn btn-sm btn-outline" onClick={onClose}>Fermer</button>
        </div>
        {/* TODO: Details implementation */}
        <div className="text-gray-400 text-center py-8">Fiche contact (à implémenter)</div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-outline" onClick={() => onEdit(contact)}>Éditer</button>
          <button className="btn btn-primary" onClick={onLinkMandates}>Lier à un mandat</button>
        </div>
      </div>
    </div>
  );
}
