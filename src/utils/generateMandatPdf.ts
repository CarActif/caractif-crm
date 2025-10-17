import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';

if (pdfMake) {
  pdfMake.vfs = vfsFonts.vfs;
}

type Mandat = {
  id: string;
  contact_id: string;
  marque?: string;
  modele?: string;
  version?: string;
  finition?: string;
  vin?: string;
  immatriculation?: string;
  annee?: string;
  kilometrage?: number;
  prix_net_vendeur?: number;
  commission_ttc?: number;
  prix_affiche?: number;
  departement?: string;
  user_id?: string;
  agent_id?: string;
  date_mandat?: string;
};

type Contact = {
  nom_complet: string;
  prenom?: string;
  telephone: string;
  email: string;
  piece_identite_numero?: string;
  piece_identite_delivree_le?: string;
};

export function generateMandatPdf({ mandat, contact }: { mandat: Partial<Mandat>, contact: Partial<Contact> }) {
  const get = <T, K extends keyof T>(obj: T | undefined, key: K): string => {
    const val = obj?.[key];
    return typeof val === 'string' ? val : (val ? String(val) : '');
  };
  const today = new Date();
  const dateStr = today.toLocaleDateString('fr-FR');

  // ...existing code...
  const docDefinition = {
    pageMargins: [36, 36, 36, 36],
    content: [
      { text: 'MANDAT DE VENTE DE VÉHICULE D’OCCASION', style: 'header', alignment: 'center', margin: [0,0,0,18] },
      { text: 'Entre les soussignés :', style: 'subheader', margin: [0,0,0,12] },
      { text: [
        { text: 'Le Mandant (Vendeur)\n', bold: true },
        `Nom : ${get(contact, 'nom_complet')}\n`,
        `Téléphone : ${get(contact, 'telephone')}  Email : ${get(contact, 'email')}\n`,
      ], margin: [0,0,0,12] },
      { text: [
        { text: 'Et\n\nLe Mandataire (CarActif)\n', bold: true },
        'Dénomination sociale : CarActif\n',
        'Forme juridique : EURL\n',
        'SIRET : 942 745 126 000 14\n',
        'Email : contact@caractif.fr\n',
      ], margin: [0,0,0,12] },
      // ...clauses 1 à 9, texte intégral, variables dynamiques insérées...
      { text: '1. Objet du mandat', style: 'clauseTitle', margin: [0,12,0,2] },
      { text: `Le présent mandat a pour objet de confier à CarActif la mission de rechercher un acquéreur pour le véhicule désigné ci-dessous, de procéder à la diffusion d’annonces commerciales, de négocier les conditions de la vente, d’assurer la sécurisation du paiement, et de réaliser les formalités administratives liées à la transaction, hors carte grise.`, style: 'clause', margin: [0,0,0,8] },
      { text: '2. Désignation du véhicule', style: 'clauseTitle', margin: [0,12,0,2] },
      { text: [
        `Marque : ${get(mandat, 'marque')}\n`,
        `Modèle : ${get(mandat, 'modele')}\n`,
        `Version : ${get(mandat, 'version')}\n`,
        `Numéro de série (VIN) : ${get(mandat, 'vin')}\n`,
        `Immatriculation : ${get(mandat, 'immatriculation')}\n`,
        `Date de première mise en circulation : ${get(mandat, 'annee')}\n`,
        `Kilométrage au compteur : ${get(mandat, 'kilometrage')}\n`,
      ], style: 'clause', margin: [0,0,0,8] },
      { text: '3. Prix de vente', style: 'clauseTitle', margin: [0,12,0,2] },
      { text: [
        `Prix souhaité par le vendeur : ${get(mandat, 'prix_net_vendeur')} € TTC\n`,
        `Commission forfaitaire du mandataire : ${get(mandat, 'commission_ttc')} € TTC\n`,
        `Prix de vente total affiché au public : ${get(mandat, 'prix_affiche')} € TTC\n`,
        '☐Je consens à ce que le mandataire puisse proposer le véhicule dans une fourchette de prix comprise entre :\n',
        'De ................ € TTC à ............... € TTC, afin de faciliter la négociation avec les acheteurs potentiels, dans le respect des intérêts du mandant.\n',
        'Remarque : Le prix net vendeur est le montant qui sera reversé au mandant après déduction de la commission convenue du mandataire et des éventuels frais accessoires directement liés à la vente.\n',
      ], style: 'clause', margin: [0,0,0,8] },
      // ...clauses 4 à 9, texte intégral...
      { text: '4. Durée du mandat', style: 'clauseTitle', margin: [0,12,0,2] },
      { text: `Le présent mandat est consenti pour une durée de 3 mois à compter de sa signature.\nIl sera renouvelé par tacite reconduction pour des périodes successives de même durée.\nLe mandant pourra résilier ce mandat à tout moment, sans préavis, par simple notification écrite transmise par email à l’adresse du mandataire.\nLa résiliation prendra effet à réception de l’email par le mandataire.`, style: 'clause', margin: [0,0,0,8] },
      { text: '5. Rémunération du mandataire', style: 'clauseTitle', margin: [0,12,0,2] },
      { text: `La commission du mandataire est incluse dans le prix de vente total affiché au public.\nElle est due uniquement en cas de vente effective du véhicule grâce à l’intervention du mandataire.\nLa commission sera prélevée directement sur les fonds perçus lors de la transaction, avant reversement du solde net au mandant.`, style: 'clause', margin: [0,0,0,8] },
      { text: '6. Obligations du mandant', style: 'clauseTitle', margin: [0,12,0,2] },
      { text: `Le mandant s’engage à :\n• Fournir des informations exactes et sincères sur le véhicule.\n• Remettre au mandataire l’ensemble des documents nécessaires à la mise en vente du véhicule.\n• Informer sans délai le mandataire de toute offre directe reçue.\n• S'abstenir de conclure la vente du véhicule avec tout acquéreur présenté par le mandataire, que ce soit directement ou indirectement, sans passer par l’intermédiaire du mandataire et sans paiement de la commission convenue.\n• Le mandant conserve la liberté de vendre le véhicule par ses propres moyens à tout autre acheteur n’ayant pas été présenté par le mandataire.`, style: 'clause', margin: [0,0,0,8] },
      { text: '7. Obligations du mandataire', style: 'clauseTitle', margin: [0,12,0,2] },
      { text: `Le mandataire s’engage à :\n• Promouvoir activement la vente du véhicule.\n• Assurer la diffusion de l’annonce auprès de plateformes spécialisées.\n• Sécuriser la transaction, tant sur le plan financier qu'administratif.\n• Informer régulièrement le mandant de l’évolution de la vente et des actions entreprises.`, style: 'clause', margin: [0,0,0,8] },
      { text: '8. Données personnelles (RGPD)', style: 'clauseTitle', margin: [0,12,0,2] },
      { text: `Les données personnelles collectées dans le cadre du présent mandat sont nécessaires à son exécution.\nConformément à la réglementation applicable, le mandant dispose d’un droit d’accès, de rectification, de suppression, d’opposition et de portabilité de ses données.\nCes droits peuvent être exercés en contactant contact@caractif.fr`, style: 'clause', margin: [0,0,0,8] },
      { text: '9. Loi applicable et juridiction compétente', style: 'clauseTitle', margin: [0,12,0,2] },
      { text: `Le présent mandat est soumis au droit français.\nEn cas de litige relatif à son interprétation ou à son exécution, les parties conviennent de s’en remettre à la compétence exclusive des tribunaux dans le ressort du siège social du mandataire.`, style: 'clause', margin: [0,0,0,8] },
      { text: [
        'Fait à : ........................................................\n',
        `Le : ${dateStr}\n\n`,
        'Signatures précédées de la mention manuscrite « Lu et approuvé » :\n',
        'Le Mandant : ....................................................\n',
        'Le Mandataire CarActif : (signature et/ou cachet de la société)\n',
      ], style: 'clause', margin: [0,12,0,0] },
    ],
    styles: {
      header: { fontSize: 16, bold: true },
      subheader: { fontSize: 13, bold: true },
      clauseTitle: { fontSize: 12, bold: true, margin: [0,8,0,2] },
      clause: { fontSize: 11, alignment: 'justify' },
    }
  };

  const fileName = `MANDAT_${get(mandat, 'marque')}_${get(mandat, 'modele')}_${get(mandat, 'immatriculation')}.pdf`;
  pdfMake.createPdf(docDefinition).download(fileName);
}