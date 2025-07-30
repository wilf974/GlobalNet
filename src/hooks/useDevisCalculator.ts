import { useCallback } from 'react';
import { DevisData } from '@/types';
import { TARIFS } from '@/utils/constants';

export const useDevisCalculator = () => {
  const getTarifByType = useCallback((type: string) => {
    const tarif = TARIFS[type as keyof typeof TARIFS];
    return tarif?.prixParM2 || 0;
  }, []);

  const getReductionFrequence = useCallback((frequence: string) => {
    const reductions = {
      ponctuel: 0,
      hebdomadaire: 0.15,
      mensuel: 0.20,
      trimestriel: 0.25
    };
    return reductions[frequence as keyof typeof reductions] || 0;
  }, []);

  const calculatePrice = useCallback((data: Partial<DevisData>): number => {
    if (!data.serviceDetails?.typeNettoyage || !data.serviceDetails?.superficie) {
      return 0;
    }

    const { typeNettoyage, superficie, frequence } = data.serviceDetails;
    const tarif = TARIFS[typeNettoyage as keyof typeof TARIFS];
    
    if (!tarif) {
      return 0;
    }

    // Prix de base
    let prixBase = superficie * tarif.prixParM2;
    
    // Prix minimum
    if (prixBase < tarif.prixMinimum) {
      prixBase = tarif.prixMinimum;
    }

    // Réduction selon la fréquence
    const reduction = getReductionFrequence(frequence || 'ponctuel');
    let prixFinal = prixBase * (1 - reduction);

    // Ajout des options supplémentaires
    if (data.optionsSupplementaires) {
      Object.entries(data.optionsSupplementaires).forEach(([option, active]) => {
        if (active && tarif.options[option as keyof typeof tarif.options]) {
          prixFinal += superficie * tarif.options[option as keyof typeof tarif.options];
        }
      });
    }

    return Math.round(prixFinal * 100) / 100; // Arrondi à 2 décimales
  }, [getReductionFrequence]);

  const calculateOptionsPrice = useCallback((data: Partial<DevisData>): number => {
    if (!data.serviceDetails?.superficie || !data.optionsSupplementaires) {
      return 0;
    }

    const { superficie } = data.serviceDetails;
    const { typeNettoyage } = data.serviceDetails;
    const tarif = TARIFS[typeNettoyage as keyof typeof TARIFS];
    
    if (!tarif) {
      return 0;
    }

    let optionsPrice = 0;
    Object.entries(data.optionsSupplementaires).forEach(([option, active]) => {
      if (active && tarif.options[option as keyof typeof tarif.options]) {
        optionsPrice += superficie * tarif.options[option as keyof typeof tarif.options];
      }
    });

    return Math.round(optionsPrice * 100) / 100;
  }, []);

  const getPriceBreakdown = useCallback((data: Partial<DevisData>) => {
    if (!data.serviceDetails?.typeNettoyage || !data.serviceDetails?.superficie) {
      return {
        prixBase: 0,
        reduction: 0,
        options: 0,
        total: 0
      };
    }

    const { typeNettoyage, superficie, frequence } = data.serviceDetails;
    const tarif = TARIFS[typeNettoyage as keyof typeof TARIFS];
    
    if (!tarif) {
      return {
        prixBase: 0,
        reduction: 0,
        options: 0,
        total: 0
      };
    }

    // Prix de base
    let prixBase = superficie * tarif.prixParM2;
    
    // Prix minimum
    if (prixBase < tarif.prixMinimum) {
      prixBase = tarif.prixMinimum;
    }

    // Réduction selon la fréquence
    const reductionRate = getReductionFrequence(frequence || 'ponctuel');
    const reduction = prixBase * reductionRate;
    const prixApresReduction = prixBase - reduction;

    // Options
    const optionsPrice = calculateOptionsPrice(data);

    return {
      prixBase: Math.round(prixBase * 100) / 100,
      reduction: Math.round(reduction * 100) / 100,
      options: optionsPrice,
      total: Math.round((prixApresReduction + optionsPrice) * 100) / 100
    };
  }, [getReductionFrequence, calculateOptionsPrice]);

  return {
    calculatePrice,
    calculateOptionsPrice,
    getPriceBreakdown,
    getTarifByType,
    getReductionFrequence
  };
}; 