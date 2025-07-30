import { DevisData } from '@/types';
import jsPDF from 'jspdf';

interface PdfGeneratorOptions {
  logo?: string;
  companyInfo: {
    nom: string;
    adresse: string;
    telephone: string;
    email: string;
    siret: string;
  };
  devisNumber: string;
  validite: number; // en jours
}

export class PdfGenerator {
  private options: PdfGeneratorOptions;

  constructor(options: PdfGeneratorOptions) {
    this.options = options;
  }

  async generateDevisPdf(devisData: DevisData): Promise<Blob> {
    try {
      // Créer un nouveau document PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Couleurs professionnelles améliorées
      const primaryColor: [number, number, number] = [41, 128, 185]; // Bleu professionnel
      const secondaryColor: [number, number, number] = [52, 73, 94]; // Gris foncé
      const accentColor: [number, number, number] = [231, 76, 60]; // Rouge accent
      const lightGray: [number, number, number] = [236, 240, 241]; // Gris clair
      const successColor: [number, number, number] = [46, 204, 113]; // Vert succès

      // En-tête avec bande colorée plus large
      pdf.setFillColor(...primaryColor);
      pdf.rect(0, 0, pageWidth, 50, 'F');
      
      // Logo amélioré
      try {
        if (this.options.logo) {
          // Placeholder pour le logo
          pdf.setFillColor(255, 255, 255);
          pdf.roundedRect(margin, 15, 35, 25, 3, 3, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text('LOGO', margin + 17.5, 27.5, { align: 'center' });
        } else {
          // Logo par défaut
          pdf.setFillColor(255, 255, 255);
          pdf.roundedRect(margin, 15, 35, 25, 3, 3, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text('LOGO', margin + 17.5, 27.5, { align: 'center' });
        }
      } catch (error) {
        // Fallback si erreur de chargement du logo
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(margin, 15, 35, 25, 3, 3, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('LOGO', margin + 17.5, 27.5, { align: 'center' });
      }

      // Titre principal amélioré
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DEVIS', pageWidth - margin - 40, 30, { align: 'right' });
      
      // Numéro de devis
      pdf.setFontSize(16);
      pdf.text(`N° ${this.options.devisNumber}`, pageWidth - margin - 40, 42, { align: 'right' });

      yPosition = 60;

      // Informations de l'entreprise dans un cadre amélioré
      pdf.setFillColor(...lightGray);
      pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 40, 3, 3, 'F');
      
      pdf.setTextColor(...secondaryColor);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(this.options.companyInfo.nom, margin + 10, yPosition + 10);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text(this.options.companyInfo.adresse, margin + 10, yPosition + 20);
      pdf.text(`Tél: ${this.options.companyInfo.telephone} | Email: ${this.options.companyInfo.email}`, margin + 10, yPosition + 30);
      pdf.text(`SIRET: ${this.options.companyInfo.siret}`, margin + 10, yPosition + 40);

      yPosition += 50;

      // Dates dans un cadre séparé avec meilleure présentation
      const dateCreation = new Date().toLocaleDateString('fr-FR');
      const dateValidite = new Date(Date.now() + this.options.validite * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR');
      
      pdf.setFillColor(...lightGray);
      pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 25, 3, 3, 'F');
      
      pdf.setTextColor(...secondaryColor);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Dates importantes', margin + 10, yPosition + 8);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text(`Création: ${dateCreation}`, margin + 10, yPosition + 18);
      pdf.text(`Validité: ${dateValidite} (${this.options.validite} jours)`, margin + 10, yPosition + 28);

      yPosition += 35;

      // Section Client avec icône améliorée
      this.drawSectionHeader(pdf, 'INFORMATIONS CLIENT', margin, yPosition, primaryColor);
      yPosition += 15;
      
      // Cadre pour les informations client amélioré
      pdf.setFillColor(...lightGray);
      pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 45, 3, 3, 'F');
      
      pdf.setTextColor(...secondaryColor);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Nom: ${devisData.clientInfo.nom}`, margin + 10, yPosition + 8);
      pdf.text(`Adresse: ${devisData.clientInfo.adresse}`, margin + 10, yPosition + 18);
      pdf.text(`Code postal: ${devisData.clientInfo.codePostal}`, margin + 10, yPosition + 28);
      pdf.text(`Ville: ${devisData.clientInfo.ville}`, margin + 10, yPosition + 38);
      pdf.text(`Email: ${devisData.clientInfo.email}`, margin + 10, yPosition + 48);
      pdf.text(`Téléphone: ${devisData.clientInfo.telephone}`, margin + 10, yPosition + 58);

      yPosition += 65;

      // Section Service améliorée
      this.drawSectionHeader(pdf, 'DÉTAILS DU SERVICE', margin, yPosition, primaryColor);
      yPosition += 15;
      
      // Tableau pour les détails du service amélioré
      this.drawServiceTable(pdf, devisData, margin, yPosition, primaryColor, lightGray);
      yPosition += 45;

      // Options supplémentaires avec calculs de prix
      const options = this.getOptionsList(devisData);
      const optionsWithPrices = this.getOptionsWithPrices(devisData);
      if (options !== 'Aucune option supplémentaire') {
        this.drawSectionHeader(pdf, 'OPTIONS SUPPLÉMENTAIRES', margin, yPosition, primaryColor);
        yPosition += 15;
        
        // Tableau des options avec prix
        this.drawOptionsTable(pdf, optionsWithPrices, margin, yPosition, primaryColor, lightGray);
        yPosition += 30 + (optionsWithPrices.length * 8);
      }

      // Section Prix avec calculs détaillés
      this.drawSectionHeader(pdf, 'DÉTAIL DU PRIX', margin, yPosition, accentColor);
      yPosition += 15;
      
      const prixTotal = devisData.prixTotal || 0;
      const prixBase = this.calculateBasePrice(devisData);
      const prixOptions = this.calculateOptionsPrice(devisData);
      
      // Tableau détaillé des prix
      this.drawPriceTable(pdf, prixBase, prixOptions, prixTotal, margin, yPosition, accentColor, lightGray);
      yPosition += 50;

      // Modalités de paiement et garanties
      this.drawSectionHeader(pdf, 'MODALITÉS DE PAIEMENT ET GARANTIES', margin, yPosition, primaryColor);
      yPosition += 15;
      
      // Cadre pour les modalités
      pdf.setFillColor(...lightGray);
      pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 50, 3, 3, 'F');
      
      pdf.setTextColor(...secondaryColor);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Modalités de paiement :', margin + 10, yPosition + 8);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('• Acompte de 30% à la commande', margin + 10, yPosition + 18);
      pdf.text('• Solde à 30 jours fin de mois', margin + 10, yPosition + 28);
      pdf.text('• Moyens de paiement : Chèque, Virement, Carte bancaire', margin + 10, yPosition + 38);
      
      yPosition += 60;

      // Garanties
      pdf.setTextColor(...secondaryColor);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Garanties :', margin, yPosition);
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('• Garantie satisfaction : Intervention gratuite sous 48h en cas de problème', margin, yPosition);
      yPosition += 8;
      pdf.text('• Assurance responsabilité civile professionnelle : 2 000 000 €', margin, yPosition);
      yPosition += 8;
      pdf.text('• Personnel qualifié et formé aux normes de sécurité', margin, yPosition);

      yPosition += 20;

      // Conditions en pied de page améliorées
      pdf.setTextColor(...secondaryColor);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CONDITIONS ET VALIDITÉ', margin, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text('• Devis gratuit et sans engagement', margin, yPosition);
      yPosition += 8;
      pdf.text(`• Validité: ${this.options.validite} jours à compter de la date de création`, margin, yPosition);
      yPosition += 8;
      pdf.text('• Réponse sous 24h ouvrées', margin, yPosition);
      yPosition += 8;
      pdf.text('• Paiement à 30 jours fin de mois', margin, yPosition);
      yPosition += 8;
      pdf.text('• TVA applicable selon la législation en vigueur', margin, yPosition);
      yPosition += 8;
      pdf.text('• Conditions générales de vente disponibles sur demande', margin, yPosition);

      yPosition += 20;

      // Section Accord et Signature
      pdf.setTextColor(...secondaryColor);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ACCORD ET SIGNATURE', margin, yPosition);
      yPosition += 15;

      // Cadre pour l'accord
      pdf.setFillColor(...lightGray);
      pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 60, 3, 3, 'F');
      
      pdf.setTextColor(...secondaryColor);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text('En signant ce devis, le client accepte les conditions suivantes :', margin + 10, yPosition + 10);
      yPosition += 15;
      
      pdf.setFontSize(10);
      pdf.text('□ J\'accepte les conditions de ce devis', margin + 10, yPosition + 5);
      pdf.text('□ J\'autorise GlobalNet Services à procéder aux interventions', margin + 10, yPosition + 15);
      pdf.text('□ J\'accepte les modalités de paiement définies', margin + 10, yPosition + 25);
      pdf.text('□ Je confirme la validité des informations fournies', margin + 10, yPosition + 35);

      yPosition += 50;

      // Zones de signature
      const signatureWidth = (pageWidth - 2 * margin - 20) / 2;
      
      // Zone signature client
      pdf.setFillColor(...lightGray);
      pdf.roundedRect(margin, yPosition, signatureWidth, 40, 3, 3, 'F');
      pdf.setTextColor(...secondaryColor);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Signature Client', margin + 10, yPosition + 10);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('Nom et prénom:', margin + 10, yPosition + 20);
      pdf.text('Date:', margin + 10, yPosition + 30);
      pdf.text('Cachet (si applicable):', margin + 10, yPosition + 40);

      // Zone signature entreprise
      pdf.setFillColor(...lightGray);
      pdf.roundedRect(margin + signatureWidth + 20, yPosition, signatureWidth, 40, 3, 3, 'F');
      pdf.setTextColor(...secondaryColor);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Signature GlobalNet', margin + signatureWidth + 30, yPosition + 10);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('Nom et prénom:', margin + signatureWidth + 30, yPosition + 20);
      pdf.text('Date:', margin + signatureWidth + 30, yPosition + 30);
      pdf.text('Cachet entreprise:', margin + signatureWidth + 30, yPosition + 40);

      yPosition += 50;

      // Informations de contact pour accord
      pdf.setTextColor(...secondaryColor);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('POUR ACCEPTER CE DEVIS :', margin, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('• Retournez ce devis signé par email à : contact@globalnet-services.fr', margin, yPosition);
      yPosition += 8;
      pdf.text('• Ou par téléphone au : 01 23 45 67 89', margin, yPosition);
      yPosition += 8;
      pdf.text('• Ou par courrier à l\'adresse indiquée ci-dessus', margin, yPosition);

      yPosition += 15;

      // Note importante
      pdf.setFillColor(...accentColor);
      pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 25, 3, 3, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('IMPORTANT :', margin + 10, yPosition + 8);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('Ce devis est valable 30 jours. Passé ce délai, les prix pourront être révisés.', margin + 10, yPosition + 18);

      yPosition += 35;

      // Mentions légales et conditions générales
      pdf.setTextColor(...secondaryColor);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('MENTIONS LÉGALES ET CONDITIONS GÉNÉRALES', margin, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text('• GlobalNet Services - SIRET : 123 456 789 00012', margin, yPosition);
      yPosition += 6;
      pdf.text('• Adresse : 123 Rue de la Propreté, 75001 Paris', margin, yPosition);
      yPosition += 6;
      pdf.text('• TVA intracommunautaire : FR12345678900', margin, yPosition);
      yPosition += 6;
      pdf.text('• Assurance professionnelle : AXA France - Police n° 123456789', margin, yPosition);
      yPosition += 6;
      pdf.text('• Conformité RGPD : Traitement des données conforme au règlement européen', margin, yPosition);
      yPosition += 6;
      pdf.text('• Droit applicable : Code civil français et conditions générales de vente', margin, yPosition);

      yPosition += 15;

      // Pied de page avec bande colorée amélioré
      pdf.setFillColor(...primaryColor);
      pdf.rect(0, pageHeight - 25, pageWidth, 25, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('GlobalNet Services - Nettoyage professionnel', pageWidth / 2, pageHeight - 15, { align: 'center' });
      pdf.text('www.globalnet-services.fr | contact@globalnet-services.fr', pageWidth / 2, pageHeight - 8, { align: 'center' });

      // Convertir le PDF en Blob
      const pdfBlob = pdf.output('blob');
      return pdfBlob;
      
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      // Fallback vers HTML si erreur
      const htmlContent = this.generateHtmlContent(devisData);
      return new Blob([htmlContent], { type: 'text/html' });
    }
  }

  private drawSectionHeader(pdf: jsPDF, title: string, x: number, y: number, color: [number, number, number]) {
    pdf.setFillColor(...color);
    pdf.roundedRect(x, y, 5, 8, 1, 1, 'F');
    pdf.setTextColor(...color);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, x + 10, y + 6);
  }

  private drawServiceTable(pdf: jsPDF, devisData: DevisData, x: number, y: number, primaryColor: [number, number, number], lightGray: [number, number, number]) {
    const tableWidth = pdf.internal.pageSize.getWidth() - 2 * x;
    const rowHeight = 8;
    const colWidth = tableWidth / 2;
    
    // En-tête du tableau
    pdf.setFillColor(...primaryColor);
    pdf.rect(x, y, tableWidth, rowHeight, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Détail', x + 5, y + 5);
    pdf.text('Valeur', x + colWidth + 5, y + 5);
    
    // Lignes du tableau
    const rows = [
      ['Type de nettoyage', devisData.serviceDetails.typeNettoyage],
      ['Surface', `${devisData.serviceDetails.superficie} m²`],
      ['Fréquence', devisData.serviceDetails.frequence],
      ['Date d\'intervention', devisData.serviceDetails.dateIntervention.toLocaleDateString('fr-FR')]
    ];
    
    rows.forEach((row, index) => {
      const rowY = y + rowHeight + (index * rowHeight);
      
      // Alternance de couleurs
      if (index % 2 === 0) {
        pdf.setFillColor(...lightGray);
        pdf.rect(x, rowY, tableWidth, rowHeight, 'F');
      }
      
      pdf.setTextColor(...[52, 73, 94] as [number, number, number]);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(row[0], x + 5, rowY + 5);
      pdf.text(row[1], x + colWidth + 5, rowY + 5);
    });
  }

  private generateHtmlContent(devisData: DevisData): string {
    const { companyInfo, devisNumber } = this.options;
    const dateCreation = new Date().toLocaleDateString('fr-FR');
    const dateValidite = new Date(Date.now() + this.options.validite * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR');
    const prixTotal = devisData.prixTotal || 0;

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Devis ${devisNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-info { margin-bottom: 20px; }
          .client-info { margin-bottom: 20px; }
          .service-details { margin-bottom: 20px; }
          .price-details { margin-bottom: 20px; }
          .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
          .footer { margin-top: 40px; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>DEVIS N° ${devisNumber}</h1>
        </div>
        
        <div class="company-info">
          <h3>${companyInfo.nom}</h3>
          <p>${companyInfo.adresse}</p>
          <p>Tél: ${companyInfo.telephone} | Email: ${companyInfo.email}</p>
          <p>SIRET: ${companyInfo.siret}</p>
        </div>
        
        <div class="client-info">
          <h3>Client</h3>
          <p><strong>${devisData.clientInfo.nom}</strong></p>
          <p>${devisData.clientInfo.adresse}</p>
          <p>${devisData.clientInfo.codePostal} ${devisData.clientInfo.ville}</p>
          <p>Email: ${devisData.clientInfo.email}</p>
          <p>Tél: ${devisData.clientInfo.telephone}</p>
        </div>
        
        <div class="service-details">
          <h3>Détails du service</h3>
          <table>
            <tr><td>Type de nettoyage:</td><td>${devisData.serviceDetails.typeNettoyage}</td></tr>
            <tr><td>Surface:</td><td>${devisData.serviceDetails.superficie} m²</td></tr>
            <tr><td>Fréquence:</td><td>${devisData.serviceDetails.frequence}</td></tr>
            <tr><td>Date d'intervention:</td><td>${devisData.serviceDetails.dateIntervention.toLocaleDateString('fr-FR')}</td></tr>
          </table>
        </div>
        
        <div class="price-details">
          <h3>Détail du prix</h3>
          <table>
            <tr><td>Prix de base:</td><td>${prixTotal.toFixed(2)} €</td></tr>
            ${this.getOptionsHtml(devisData)}
          </table>
        </div>
        
        <div class="total">
          <h3>TOTAL: ${prixTotal.toFixed(2)} €</h3>
        </div>
        
        <div class="footer">
          <p><strong>Conditions:</strong></p>
          <ul>
            <li>Devis gratuit et sans engagement</li>
            <li>Validité: ${this.options.validite} jours</li>
            <li>Réponse sous 24h</li>
          </ul>
          <p>Date de création: ${dateCreation}</p>
          <p>Validité jusqu'au: ${dateValidite}</p>
        </div>
      </body>
      </html>
    `;
  }

  private getOptionsList(devisData: DevisData): string {
    const options = [];
    if (devisData.optionsSupplementaires.nettoyageVitres) options.push('- Nettoyage des vitres');
    if (devisData.optionsSupplementaires.desinfection) options.push('- Désinfection');
    if (devisData.optionsSupplementaires.nettoyageFacades) options.push('- Nettoyage des façades');
    if (devisData.optionsSupplementaires.nettoyageParking) options.push('- Nettoyage du parking');
    if (devisData.optionsSupplementaires.nettoyageCarpettes) options.push('- Nettoyage des carpettes');
    if (devisData.optionsSupplementaires.traitementAntiCalcaire) options.push('- Traitement anti-calcaire');
    
    return options.length > 0 ? options.join('\n') : 'Aucune option supplémentaire';
  }

  private getOptionsWithPrices(devisData: DevisData): { name: string; price: number }[] {
    const optionsWithPrices = [];
    if (devisData.optionsSupplementaires.nettoyageVitres) optionsWithPrices.push({ name: 'Nettoyage des vitres', price: 50 });
    if (devisData.optionsSupplementaires.desinfection) optionsWithPrices.push({ name: 'Désinfection', price: 100 });
    if (devisData.optionsSupplementaires.nettoyageFacades) optionsWithPrices.push({ name: 'Nettoyage des façades', price: 150 });
    if (devisData.optionsSupplementaires.nettoyageParking) optionsWithPrices.push({ name: 'Nettoyage du parking', price: 200 });
    if (devisData.optionsSupplementaires.nettoyageCarpettes) optionsWithPrices.push({ name: 'Nettoyage des carpettes', price: 120 });
    if (devisData.optionsSupplementaires.traitementAntiCalcaire) optionsWithPrices.push({ name: 'Traitement anti-calcaire', price: 80 });
    
    return optionsWithPrices;
  }

  private calculateBasePrice(devisData: DevisData): number {
    let basePrice = 0;
    if (devisData.serviceDetails.typeNettoyage === 'bureaux') {
      basePrice = 150; // Prix de base pour un nettoyage de bureaux
    } else if (devisData.serviceDetails.typeNettoyage === 'industriel') {
      basePrice = 200; // Prix de base pour un nettoyage industriel
    } else if (devisData.serviceDetails.typeNettoyage === 'residentiel') {
      basePrice = 100; // Prix de base pour un nettoyage résidentiel
    } else if (devisData.serviceDetails.typeNettoyage === 'commercial') {
      basePrice = 180; // Prix de base pour un nettoyage commercial
    }
    return basePrice;
  }

  private calculateOptionsPrice(devisData: DevisData): number {
    let optionsPrice = 0;
    if (devisData.optionsSupplementaires.nettoyageVitres) optionsPrice += 50;
    if (devisData.optionsSupplementaires.desinfection) optionsPrice += 100;
    if (devisData.optionsSupplementaires.nettoyageFacades) optionsPrice += 150;
    if (devisData.optionsSupplementaires.nettoyageParking) optionsPrice += 200;
    if (devisData.optionsSupplementaires.nettoyageCarpettes) optionsPrice += 120;
    if (devisData.optionsSupplementaires.traitementAntiCalcaire) optionsPrice += 80;
    
    return optionsPrice;
  }

  private drawOptionsTable(pdf: jsPDF, optionsWithPrices: { name: string; price: number }[], x: number, y: number, primaryColor: [number, number, number], lightGray: [number, number, number]) {
    const tableWidth = pdf.internal.pageSize.getWidth() - 2 * x;
    const rowHeight = 8;
    const colWidth = tableWidth / 2;
    const secondaryColor: [number, number, number] = [52, 73, 94]; // Gris foncé

    // En-tête du tableau
    pdf.setFillColor(...primaryColor);
    pdf.rect(x, y, tableWidth, rowHeight, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Option', x + 5, y + 5);
    pdf.text('Prix', x + colWidth + 5, y + 5);

    // Lignes du tableau
    optionsWithPrices.forEach((option, index) => {
      const rowY = y + rowHeight + (index * rowHeight);
      
      // Alternance de couleurs
      if (index % 2 === 0) {
        pdf.setFillColor(...lightGray);
        pdf.rect(x, rowY, tableWidth, rowHeight, 'F');
      }
      
      pdf.setTextColor(...secondaryColor);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(option.name, x + 5, rowY + 5);
      pdf.text(`${option.price.toFixed(2)} €`, x + colWidth + 5, rowY + 5);
    });
  }

  private drawPriceTable(pdf: jsPDF, prixBase: number, prixOptions: number, prixTotal: number, x: number, y: number, accentColor: [number, number, number], lightGray: [number, number, number]) {
    const tableWidth = pdf.internal.pageSize.getWidth() - 2 * x;
    const rowHeight = 10;
    const colWidth = tableWidth / 2;
    const secondaryColor: [number, number, number] = [52, 73, 94]; // Gris foncé

    // En-tête du tableau
    pdf.setFillColor(...accentColor);
    pdf.rect(x, y, tableWidth, rowHeight, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Détail', x + 5, y + 7);
    pdf.text('Montant', x + colWidth + 5, y + 7);

    // Lignes du tableau
    const rows = [
      ['Prix de base', `${prixBase.toFixed(2)} €`],
      ['Options supplémentaires', `${prixOptions.toFixed(2)} €`],
      ['Sous-total', `${(prixBase + prixOptions).toFixed(2)} €`],
      ['TVA (20%)', `${((prixBase + prixOptions) * 0.2).toFixed(2)} €`],
      ['TOTAL TTC', `${prixTotal.toFixed(2)} €`]
    ];

    rows.forEach((row, index) => {
      const rowY = y + rowHeight + (index * rowHeight);
      
      // Alternance de couleurs
      if (index % 2 === 0) {
        pdf.setFillColor(...lightGray);
        pdf.rect(x, rowY, tableWidth, rowHeight, 'F');
      }
      
      pdf.setTextColor(...secondaryColor);
      pdf.setFont('helvetica', index === rows.length - 1 ? 'bold' : 'normal');
      pdf.setFontSize(index === rows.length - 1 ? 12 : 10);
      pdf.text(row[0], x + 5, rowY + 7);
      pdf.text(row[1], x + colWidth + 5, rowY + 7);
    });
  }

  private getOptionsHtml(devisData: DevisData): string {
    const options = [];
    if (devisData.optionsSupplementaires.nettoyageVitres) options.push('<tr><td>Nettoyage des vitres:</td><td>Inclus</td></tr>');
    if (devisData.optionsSupplementaires.desinfection) options.push('<tr><td>Désinfection:</td><td>Inclus</td></tr>');
    if (devisData.optionsSupplementaires.nettoyageFacades) options.push('<tr><td>Nettoyage des façades:</td><td>Inclus</td></tr>');
    if (devisData.optionsSupplementaires.nettoyageParking) options.push('<tr><td>Nettoyage du parking:</td><td>Inclus</td></tr>');
    if (devisData.optionsSupplementaires.nettoyageCarpettes) options.push('<tr><td>Nettoyage des carpettes:</td><td>Inclus</td></tr>');
    if (devisData.optionsSupplementaires.traitementAntiCalcaire) options.push('<tr><td>Traitement anti-calcaire:</td><td>Inclus</td></tr>');
    
    return options.join('');
  }
} 