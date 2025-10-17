
import MandatButton from "./MandatButton";
const eur = n => Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(n || 0));

export default function VehicleCard({ item, onChangeStatus, onEdit, onDelete }) {
  // ...existing code...
  if (!item) return null;
  const marque = item.marque ?? "";
  const modele = item.modele ?? item.model ?? "";
  const prix = item.prix_affiche;
  const comTTC = item.commission_ttc;
  const nom = item.nom_complet ?? "Aucun contact";
  const telephone = item.telephone ?? "";
  // Si photo_url est un tableau, on prend la première, sinon on prend la valeur telle quelle
  let src = null;
  if (Array.isArray(item.photo_url)) {
    src = item.photo_url.length > 0 ? item.photo_url[0] : null;
  } else if (item.photo_url && String(item.photo_url).length > 3) {
    src = String(item.photo_url);
  }

  return (
  <div className="rounded-lg border border-neutral-200 bg-neutral-900 p-2 flex flex-col gap-1 w-full max-w-full md:max-w-[270px] shadow-sm text-white">
      {/* Image (optionnelle, mobile-first) */}
      {src && (
        <div className="w-full aspect-[4/3] mb-1 rounded-md overflow-hidden bg-black/10 max-h-[60px]">
          <img
            src={src}
            alt={`${marque} ${modele}`.trim() || "Véhicule"}
            className="w-full h-full object-cover max-h-[60px]"
            loading="lazy"
            decoding="async"
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      )}
      {/* Titre principal */}
  <div className="text-[15px] font-semibold leading-tight text-white">{marque} {modele}</div>
  {/* Infos secondaires */}
  <div className="text-xs opacity-80 leading-tight text-white">Nom : {nom}</div>
  <div className="text-xs opacity-80 leading-tight text-white">Téléphone : {telephone || '-'}</div>
  <div className="text-xs opacity-80 leading-tight text-white">Prix affiché : {eur(prix)}</div>
  <div className="text-xs opacity-80 leading-tight text-white">Commission TTC : {eur(comTTC)}</div>
      {/* Bouton Générer un mandat au-dessus du statut */}
    <MandatButton item={item} />
      {/* Sélecteur de statut + boutons */}
      <div className="flex flex-col gap-1 mt-1">
        <select
          value={item.statut ?? ""}
          onChange={e => onChangeStatus?.(item.id, e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 rounded px-1 py-0.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 min-h-0 h-6"
        >
          {["Mandat signé", "Publié", "Sous offre", "Vendu", "Archivé"].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <div className="flex gap-1">
          <button
            className="flex-1 border border-neutral-700 rounded py-0.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-white transition min-h-0 h-6"
            onClick={() => onEdit?.(item)}
          >
            Modifier
          </button>
          <button
            className="flex-1 border border-neutral-700 rounded py-0.5 text-xs text-red-400 bg-neutral-800 hover:bg-neutral-700 transition min-h-0 h-6"
            onClick={() => onDelete?.(item.id)}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
