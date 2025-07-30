import { DevisData } from '@/types';

interface EmailConfig {
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  from: string;
  companyName: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  async sendDevisEmail(devisData: DevisData, pdfBlob?: Blob): Promise<boolean> {
    try {
      const template = this.generateDevisEmailTemplate(devisData);
      
      // Simulation d'envoi d'email (en production, utiliser nodemailer ou SendGrid)
      console.log('Envoi email:', {
        to: devisData.clientInfo.email,
        subject: template.subject,
        from: this.config.from,
        smtp: this.config.smtp
      });

      // Simuler un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));

      return true;
    } catch (error) {
      console.error('Erreur envoi email:', error);
      return false;
    }
  }

  private generateDevisEmailTemplate(devisData: DevisData): EmailTemplate {
    const devisNumber = `DEV-${Date.now()}`;
    const dateCreation = new Date().toLocaleDateString('fr-FR');

    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Devis ${devisNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { margin-bottom: 20px; }
          .footer { background-color: #f8f9fa; padding: 20px; border-radius: 8px; font-size: 14px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; }
          .price { font-size: 18px; font-weight: bold; color: #28a745; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Devis ${devisNumber}</h1>
            <p><strong>${this.config.companyName}</strong></p>
            <p>Date de création: ${dateCreation}</p>
          </div>
          
          <div class="content">
            <h2>Bonjour ${devisData.clientInfo.nom},</h2>
            
            <p>Nous vous remercions pour votre demande de devis. Voici le détail de notre proposition :</p>
            
            <h3>Informations client</h3>
            <p>
              <strong>Nom:</strong> ${devisData.clientInfo.nom}<br>
              <strong>Adresse:</strong> ${devisData.clientInfo.adresse}<br>
              <strong>Code postal:</strong> ${devisData.clientInfo.codePostal}<br>
              <strong>Ville:</strong> ${devisData.clientInfo.ville}<br>
              <strong>Email:</strong> ${devisData.clientInfo.email}<br>
              <strong>Téléphone:</strong> ${devisData.clientInfo.telephone}
            </p>
            
            <h3>Détails du service</h3>
            <p>
              <strong>Type de nettoyage:</strong> ${devisData.serviceDetails.typeNettoyage}<br>
              <strong>Surface:</strong> ${devisData.serviceDetails.superficie} m²<br>
              <strong>Fréquence:</strong> ${devisData.serviceDetails.frequence}<br>
              <strong>Date d'intervention:</strong> ${devisData.serviceDetails.dateIntervention.toLocaleDateString('fr-FR')}
            </p>
            
            <h3>Options supplémentaires</h3>
            <ul>
              ${this.getOptionsList(devisData)}
            </ul>
            
            <h3>Prix</h3>
            <p class="price">Total: ${devisData.prixTotal.toFixed(2)} €</p>
            
            <p>Ce devis est gratuit et sans engagement. Vous recevrez une réponse détaillée sous 24h.</p>
            
            <p>
              <a href="mailto:${this.config.from}" class="button">Nous contacter</a>
            </p>
          </div>
          
          <div class="footer">
            <p><strong>${this.config.companyName}</strong></p>
            <p>Email: ${this.config.from}</p>
            <p>Ce devis est valable 30 jours à compter de sa date de création.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Devis ${devisNumber}
      
      ${this.config.companyName}
      Date de création: ${dateCreation}
      
      Bonjour ${devisData.clientInfo.nom},
      
      Nous vous remercions pour votre demande de devis. Voici le détail de notre proposition :
      
      INFORMATIONS CLIENT:
      Nom: ${devisData.clientInfo.nom}
      Adresse: ${devisData.clientInfo.adresse}
      Code postal: ${devisData.clientInfo.codePostal}
      Ville: ${devisData.clientInfo.ville}
      Email: ${devisData.clientInfo.email}
      Téléphone: ${devisData.clientInfo.telephone}
      
      DÉTAILS DU SERVICE:
      Type de nettoyage: ${devisData.serviceDetails.typeNettoyage}
      Surface: ${devisData.serviceDetails.superficie} m²
      Fréquence: ${devisData.serviceDetails.frequence}
      Date d'intervention: ${devisData.serviceDetails.dateIntervention.toLocaleDateString('fr-FR')}
      
      OPTIONS SUPPLÉMENTAIRES:
      ${this.getOptionsText(devisData)}
      
      PRIX:
      Total: ${devisData.prixTotal.toFixed(2)} €
      
      Ce devis est gratuit et sans engagement. Vous recevrez une réponse détaillée sous 24h.
      
      ${this.config.companyName}
      Email: ${this.config.from}
      Ce devis est valable 30 jours à compter de sa date de création.
    `;

    return {
      subject: `Devis ${devisNumber} - ${this.config.companyName}`,
      html,
      text
    };
  }

  private getOptionsList(devisData: DevisData): string {
    const options = [];
    if (devisData.optionsSupplementaires.nettoyageVitres) options.push('<li>Nettoyage des vitres</li>');
    if (devisData.optionsSupplementaires.desinfection) options.push('<li>Désinfection</li>');
    if (devisData.optionsSupplementaires.nettoyageFacades) options.push('<li>Nettoyage des façades</li>');
    if (devisData.optionsSupplementaires.nettoyageParking) options.push('<li>Nettoyage du parking</li>');
    if (devisData.optionsSupplementaires.nettoyageCarpettes) options.push('<li>Nettoyage des carpettes</li>');
    if (devisData.optionsSupplementaires.traitementAntiCalcaire) options.push('<li>Traitement anti-calcaire</li>');
    
    return options.length > 0 ? options.join('') : '<li>Aucune option supplémentaire</li>';
  }

  private getOptionsText(devisData: DevisData): string {
    const options = [];
    if (devisData.optionsSupplementaires.nettoyageVitres) options.push('- Nettoyage des vitres');
    if (devisData.optionsSupplementaires.desinfection) options.push('- Désinfection');
    if (devisData.optionsSupplementaires.nettoyageFacades) options.push('- Nettoyage des façades');
    if (devisData.optionsSupplementaires.nettoyageParking) options.push('- Nettoyage du parking');
    if (devisData.optionsSupplementaires.nettoyageCarpettes) options.push('- Nettoyage des carpettes');
    if (devisData.optionsSupplementaires.traitementAntiCalcaire) options.push('- Traitement anti-calcaire');
    
    return options.length > 0 ? options.join('\n') : '- Aucune option supplémentaire';
  }
} 