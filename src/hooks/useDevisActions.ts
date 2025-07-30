import { useState, useCallback } from 'react';
import { DevisData } from '@/types';
import { PdfGenerator } from '@/utils/pdfGenerator';
import { EmailService } from '@/utils/emailService';
import { DEFAULT_EMAIL_CONFIG } from '@/utils/emailConfig';

interface DevisActionsConfig {
  companyInfo: {
    nom: string;
    adresse: string;
    telephone: string;
    email: string;
    siret: string;
  };
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}

export const useDevisActions = (config?: DevisActionsConfig) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Utiliser la configuration par défaut si aucune n'est fournie
  const finalConfig = config || {
    companyInfo: {
      nom: DEFAULT_EMAIL_CONFIG.companyName,
      adresse: "123 Rue de la Propreté, 75001 Paris",
      telephone: "01 23 45 67 89",
      email: DEFAULT_EMAIL_CONFIG.from,
      siret: "123 456 789 00012"
    },
    smtp: DEFAULT_EMAIL_CONFIG.smtp
  };

  const pdfGenerator = new PdfGenerator({
    companyInfo: finalConfig.companyInfo,
    devisNumber: `DEV-${Date.now()}`,
    validite: 30
  });

  const emailService = new EmailService({
    smtp: finalConfig.smtp,
    from: finalConfig.companyInfo.email,
    companyName: finalConfig.companyInfo.nom
  });

  const downloadDevis = useCallback(async (devisData: DevisData) => {
    setIsDownloading(true);
    setError(null);

    try {
      // S'assurer que prixTotal est défini
      const completeDevisData = {
        ...devisData,
        prixTotal: devisData.prixTotal || 0
      };
      
      const pdfBlob = await pdfGenerator.generateDevisPdf(completeDevisData);
      
      // Créer un lien de téléchargement
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `devis-${Date.now()}.pdf`; // Maintenant en PDF
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      setError('Erreur lors du téléchargement du devis');
      console.error('Erreur téléchargement:', err);
      return false;
    } finally {
      setIsDownloading(false);
    }
  }, [pdfGenerator]);

  const sendDevisEmail = useCallback(async (devisData: DevisData) => {
    setIsSending(true);
    setError(null);

    try {
      // S'assurer que prixTotal est défini
      const completeDevisData = {
        ...devisData,
        prixTotal: devisData.prixTotal || 0
      };
      
      const pdfBlob = await pdfGenerator.generateDevisPdf(completeDevisData);
      const success = await emailService.sendDevisEmail(completeDevisData, pdfBlob);
      
      if (success) {
        return true;
      } else {
        setError('Erreur lors de l\'envoi de l\'email');
        return false;
      }
    } catch (err) {
      setError('Erreur lors de l\'envoi de l\'email');
      console.error('Erreur envoi email:', err);
      return false;
    } finally {
      setIsSending(false);
    }
  }, [pdfGenerator, emailService]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    downloadDevis,
    sendDevisEmail,
    isDownloading,
    isSending,
    error,
    clearError
  };
}; 