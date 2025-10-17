import React, { useState, useEffect, useCallback } from 'react';
import { Contact, Mandate, MandateContact } from '../types/contact';
import { useContacts, useMandatesByContact, useLinkMandatesToContact } from '../hooks/useContacts';
import { ContactTable } from '../components/ContactTable';
import { ContactForm } from '../components/ContactForm';
import { ContactDetails } from '../components/ContactDetails';
import { MandateLinkerModal } from '../components/MandateLinkerModal';

const PAGE_SIZE = 20;

export default function ContactPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<any>({});
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'modifie_le', direction: 'desc' });
  const [page, setPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [showLinker, setShowLinker] = useState(false);
  // Suppression des états pour import/export CSV

  const {
    contacts,
    total,
    loading,
    error,
    fetchContacts,
    setContacts
  } = useContacts({
    search,
    filters,
    sort,
    page,
    pageSize: PAGE_SIZE,
  });
  const [toast, setToast] = useState<{ msg: string; type?: 'success' | 'error' } | null>(null);
  const showToast = (msg: string, type?: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    fetchContacts();
  }, [search, filters, sort, page]);

  const handleEdit = (contact: Contact) => {
    window.location.href = `/contact/edit/${contact.id}`;
  };
  const handleView = (contact: Contact) => {
    setSelectedContact(contact);
  };
  const handleCloseDetails = () => setSelectedContact(null);
  const handleNewContact = () => {
    window.location.href = '/contact/create';
  };
  const handleCloseForm = () => setShowForm(false);
  const handleLinkMandates = () => setShowLinker(true);
  const handleCloseLinker = () => setShowLinker(false);

  return (
    <div className="min-h-screen w-full flex flex-col justify-start items-center bg-background">
      <div className="w-full max-w-7xl mx-auto p-2 sm:p-6">
        {/* Header harmonisé */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 mt-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-black tracking-wide text-center sm:text-left flex-1">
            Carnet de contacts
          </h1>
          <button
            className="bg-blue-700 hover:bg-blue-800 text-black font-bold px-6 py-2 rounded-xl shadow-lg transition-all duration-200 text-lg flex items-center gap-2 min-w-[180px] justify-center border border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handleNewContact}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nouveau contact
          </button>
        </div>
        {/* Search & Filters harmonisé */}
        <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-card bg-neutral-50 dark:bg-neutral-900 shadow-lg md:shadow-2xl px-4 py-3 mb-6 flex flex-col sm:flex-row gap-3 items-center w-full">
          <input
            className="input input-bordered w-full sm:w-[350px] max-w-lg text-base px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-150"
            placeholder="Recherche (nom, téléphone, email, société)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ minWidth: 0 }}
          />
          {/* ...Filtres: type_contact, ville, a_iban, date... */}
          {/* TODO: Add filter components here */}
        </div>
        {/* Table harmonisée dans une card */}
        <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-card bg-neutral-50 dark:bg-neutral-900 shadow-lg md:shadow-2xl p-4 mb-6">
          <ContactTable
            contacts={contacts}
            setContacts={setContacts}
            loading={loading}
            error={error}
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
            onSortChange={setSort}
            onEdit={handleEdit}
            onView={handleView}
            fetchContacts={fetchContacts}
            showToast={showToast}
          />
        </div>
        {toast && (
          <div className={`fixed top-4 right-4 z-[9999] px-4 py-2 rounded shadow-lg text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-600'}`}>{toast.msg}</div>
        )}
        {/* Modals & Drawers */}
        {showForm && (
          <ContactForm
            contact={editContact}
            onClose={handleCloseForm}
            onSaved={() => {
              fetchContacts();
            }}
            setContacts={setContacts}
            showToast={showToast}
          />
        )}
        {selectedContact && (
          <ContactDetails
            contact={selectedContact}
            onClose={handleCloseDetails}
            onEdit={handleEdit}
            onLinkMandates={handleLinkMandates}
          />
        )}
        {showLinker && selectedContact && (
          <MandateLinkerModal
            contact={selectedContact}
            onClose={handleCloseLinker}
            onLinked={fetchContacts}
          />
        )}
      </div>
    </div>
  );
}
