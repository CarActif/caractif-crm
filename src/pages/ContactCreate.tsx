import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Contact } from '../types/contact';
import { saveContact } from '../lib/saveContact';

export default function ContactCreatePage() {
  const [form, setForm] = useState<Partial<Contact>>({ type_contact: 'autre' });
  const [loading, setLoading] = useState(false);
  // Suppression des états error/success, gérés par SweetAlert2
  const [showBank, setShowBank] = useState(false);
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
  // plus de setError/setSuccess
    const { data, error } = await saveContact(form);
    setLoading(false);
    if (error) {
      const errorMsg = typeof error === 'string' ? error : (error && typeof error === 'object' && 'message' in error ? (error as any).message : 'Erreur inconnue');
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: errorMsg,
        confirmButtonColor: '#FFD700',
      });
      return;
    }
    Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: 'Contact créé !',
      confirmButtonColor: '#FFD700',
      timer: 1200,
      showConfirmButton: false,
    }).then(() => {
      navigate('/contact');
    });
  }

  const ibanValid = !form.iban || /^([A-Z]{2}\d{2}[A-Z0-9]{1,30})$/.test(form.iban.replace(/\s/g, ''));
  const bicValid = !form.bic || /^([A-Z0-9]{8}|[A-Z0-9]{11})$/.test(form.bic.replace(/\s/g, ''));
  const emailValid = !form.email || /^\S+@\S+\.\S+$/.test(form.email);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-8">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">Nouveau contact</h1>
  {/* Les notifications sont maintenant gérées par SweetAlert2 */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-8">
          <section>
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
          <section>
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
          <section>
            <div className="font-semibold text-slate-700 text-lg mb-3 border-b border-slate-100 pb-1">Profil & relation</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Type de contact</label>
                <select name="type_contact" className="input input-bordered w-full" value={form.type_contact || 'autre'} onChange={handleChange}>
                  <option value="acheteur">Acheteur</option>
                  <option value="vendeur">Vendeur</option>
                  <option value="acheteur_vendeur">Acheteur et Vendeur</option>
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
          <section>
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
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              className="transition-all duration-200 px-8 py-3 rounded-full font-bold text-lg border-2 border-rose-400 bg-gradient-to-r from-rose-100 to-rose-300 text-rose-700 shadow-lg hover:from-rose-200 hover:to-rose-400 hover:text-white hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
              onClick={() => navigate('/contact')}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="transition-all duration-200 px-8 py-3 rounded-full font-bold text-lg border-2 border-emerald-400 bg-gradient-to-r from-emerald-100 to-emerald-300 text-emerald-700 shadow-lg hover:from-emerald-200 hover:to-emerald-400 hover:text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
              disabled={Boolean(loading || !form.nom_complet || (form.email && !emailValid) || (form.iban && !ibanValid) || (form.bic && !bicValid))}
            >
              {loading ? <span className="loading loading-spinner loading-xs" /> : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
