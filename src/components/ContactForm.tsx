
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Contact } from '../types/contact';
import { saveContact } from '../lib/saveContact';

export function ContactForm({
  contact,
  onClose,
  onSaved,
  setContacts,
  showToast,
}: {
  contact: Contact | null;
  onClose: () => void;
  onSaved: () => void;
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState<Partial<Contact>>(contact || { type_contact: 'autre' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showBank, setShowBank] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    // Vérifie la session
    const { data: sessionData } = await import('../supabaseClient').then(m => m.supabase.auth.getSession());
    if (!sessionData?.session) {
      setLoading(false);
      setError('Session expirée');
      showToast('Session expirée. Veuillez vous reconnecter.', 'error');
      return;
    }
    const { data, error } = await saveContact(form);
    setLoading(false);
    if (error) {
      if (error === 'Session expirée') {
        setError(error);
        showToast('Session expirée. Veuillez vous reconnecter.', 'error');
        return;
      }
      setError(error);
      return;
    }
    setSuccess(contact ? 'Contact mis à jour !' : 'Contact créé !');
    showToast(contact ? 'Contact mis à jour !' : 'Contact créé !', 'success');
    // Update local state
    setContacts(prev => {
      if (!data) return prev;
      if (!contact) {
        // Création : ajoute en tête
        return [data, ...prev];
      } else {
        // Edition : remplace par id
        return prev.map(c => c.id === data.id ? data : c);
      }
    });
    onSaved();
    setTimeout(() => {
      setSuccess(null);
      onClose();
  navigate('/contact');
    }, 800);
  }

  // Validation helpers
  const ibanValid = !form.iban || /^([A-Z]{2}\d{2}[A-Z0-9]{1,30})$/.test(form.iban.replace(/\s/g, ''));
  const bicValid = !form.bic || /^([A-Z0-9]{8}|[A-Z0-9]{11})$/.test(form.bic.replace(/\s/g, ''));
  const emailValid = !form.email || /^\S+@\S+\.\S+$/.test(form.email);

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center">
      {/* Empêche le scroll du body quand modal ouvert */}
      <style>{`body { overflow: hidden !important; }`}</style>
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-full max-w-2xl max-h-[95vh] flex flex-col shadow-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-white via-slate-50 to-slate-200 border border-slate-200">
          <form
            className="flex-1 overflow-y-auto p-0 md:p-0"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
          <div className="sticky top-0 z-10 bg-gradient-to-b from-white/95 to-white/60 px-6 pt-6 pb-2 border-b border-slate-100 shadow-sm">
            <div className="text-2xl font-bold tracking-tight text-slate-800 mb-1">{contact ? 'Éditer le contact' : 'Nouveau contact'}</div>
            {/* Toasts */}
            {error && <div className="alert alert-error mb-2">{error}</div>}
            {success && <div className="alert alert-success mb-2">{success}</div>}
          </div>

          {/* Skeleton loader */}
          {loading && <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20"><div className="loader" /></div>}

          <div className="px-6 pb-6 pt-2 space-y-8">
            {/* Sections */}
            <section className="bg-white/90 rounded-xl shadow-md p-4 border border-slate-100">
              <div className="font-semibold text-slate-700 text-lg mb-3 border-b border-slate-100 pb-1">Informations de base</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Nom complet *</label>
                  <input name="nom_complet" required className="input input-bordered w-full" value={form.nom_complet || ''} onChange={handleChange} />
                </div>
                <div>
                  <label className="label">Téléphone</label>
                  <input name="telephone" className="input input-bordered w-full" value={form.telephone || ''} onChange={handleChange} />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input name="email" type="email" className={`input input-bordered w-full ${form.email && !emailValid ? 'input-error' : ''}`} value={form.email || ''} onChange={handleChange} />
                  {form.email && !emailValid && <div className="text-xs text-red-500">Format email invalide</div>}
                </div>
                <div>
                  <label className="label">Société</label>
                  <input name="societe" className="input input-bordered w-full" value={form.societe || ''} onChange={handleChange} />
                </div>
              </div>
            </section>

            <section className="bg-white/90 rounded-xl shadow-md p-4 border border-slate-100">
              <div className="font-semibold text-slate-700 text-lg mb-3 border-b border-slate-100 pb-1">Adresse</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Rue</label>
                  <input name="adresse_rue" className="input input-bordered w-full" value={form.adresse_rue || ''} onChange={handleChange} />
                </div>
                <div>
                  <label className="label">Code postal</label>
                  <input name="adresse_cp" className="input input-bordered w-full" value={form.adresse_cp || ''} onChange={handleChange} />
                </div>
                <div>
                  <label className="label">Ville</label>
                  <input name="adresse_ville" className="input input-bordered w-full" value={form.adresse_ville || ''} onChange={handleChange} />
                </div>
                <div>
                  <label className="label">Pays</label>
                  <input name="adresse_pays" className="input input-bordered w-full" value={form.adresse_pays || ''} onChange={handleChange} />
                </div>
              </div>
            </section>

            <section className="bg-white/90 rounded-xl shadow-md p-4 border border-slate-100">
              <div className="font-semibold text-slate-700 text-lg mb-3 border-b border-slate-100 pb-1">Profil & relation</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Type de contact</label>
                  <select name="type_contact" className="input input-bordered w-full" value={form.type_contact || 'autre'} onChange={handleChange}>
                    <option value="acheteur">Acheteur</option>
                    <option value="vendeur">Vendeur</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="label">Origine</label>
                  <input name="origine" className="input input-bordered w-full" value={form.origine || ''} onChange={handleChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Notes</label>
                  <textarea name="notes" className="input input-bordered w-full min-h-[60px]" value={form.notes || ''} onChange={handleChange} />
                </div>
              </div>
            </section>

            {/* Coordonnées bancaires (collapsible) */}
            <section className="bg-white/90 rounded-xl shadow-md p-4 border border-slate-100">
              <div className="flex items-center gap-2 cursor-pointer select-none mb-2" onClick={() => setShowBank(v => !v)}>
                <div className="font-semibold text-slate-700 text-lg">Coordonnées bancaires</div>
                <span className="text-xs text-gray-500">(optionnel)</span>
                <span className="ml-2">{showBank ? '▲' : '▼'}</span>
              </div>
              {showBank && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="label">Titulaire du compte</label>
                    <input name="titulaire_compte" className="input input-bordered w-full" value={form.titulaire_compte || ''} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="label">Banque</label>
                    <input name="banque" className="input input-bordered w-full" value={form.banque || ''} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="label">IBAN</label>
                    <input name="iban" className={`input input-bordered w-full ${form.iban && !ibanValid ? 'input-error' : ''}`} value={form.iban || ''} onChange={handleChange} />
                    {form.iban && !ibanValid && <div className="text-xs text-red-500">Format IBAN invalide</div>}
                  </div>
                  <div>
                    <label className="label">BIC</label>
                    <input name="bic" className={`input input-bordered w-full ${form.bic && !bicValid ? 'input-error' : ''}`} value={form.bic || ''} onChange={handleChange} />
                    {form.bic && !bicValid && <div className="text-xs text-red-500">Format BIC invalide (8 ou 11 caractères)</div>}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 z-10 bg-gradient-to-t from-white/95 to-white/60 px-6 py-4 border-t border-slate-100 shadow-sm flex justify-end gap-2">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>Annuler</button>
            <button
              type="submit"
              className="btn btn-primary shadow-md"
              disabled={Boolean(loading || !form.nom_complet || (form.email && !emailValid) || (form.iban && !ibanValid) || (form.bic && !bicValid))}
            >
              {loading ? <span className="loading loading-spinner loading-xs" /> : 'Enregistrer'}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}
