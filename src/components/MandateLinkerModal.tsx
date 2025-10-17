import React from 'react';
import { Contact } from '../types/contact';

export function MandateLinkerModal({
  contact,
  onClose,
  onLinked,
}: {
  contact: Contact;
  onClose: () => void;
  onLinked: () => void;
}) {
  // ...UI for linking mandates...
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg">
        <div className="text-lg font-bold mb-2">Associer des mandats</div>
        {/* TODO: Mandate linker implementation */}
        <div className="text-gray-400 text-center py-8">Lien mandats (à implémenter)</div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-outline" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={onLinked}>Associer</button>
        </div>
      </div>
    </div>
  );
}
