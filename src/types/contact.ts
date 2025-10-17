// Types TS pour Contact et MandateContact
export type Contact = {
  id: string;
  nom_complet: string;
  telephone?: string;
  email?: string;
  societe?: string;
  adresse_rue?: string;
  adresse_cp?: string;
  adresse_ville?: string;
  adresse_pays?: string;
  type_contact: 'acheteur' | 'vendeur' | 'autre';
  origine?: string;
  notes?: string;
  titulaire_compte?: string;
  iban?: string;
  bic?: string;
  banque?: string;
  cree_le?: string;
  modifie_le?: string;
};

export type MandateContact = {
  mandate_id: string;
  contact_id: string;
  role: 'seller' | 'buyer';
  is_primary: boolean;
  created_at?: string;
};

export type Mandate = {
  id: string;
  vehicle_id?: string;
  titre: string;
  statut: string;
  created_at?: string;
  updated_at?: string;
};
