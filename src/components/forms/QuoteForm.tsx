'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Calculator, FileText, User, MapPin, CreditCard, Save, AlertCircle, Download, Mail, Send } from 'lucide-react';
import { z } from 'zod';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useFormStepper } from '@/hooks/useFormStepper';
import { useDevisCalculator } from '@/hooks/useDevisCalculator';
import { useDevisActions } from '@/hooks/useDevisActions';
import { FORM_STEPS, TYPES_NETTOYAGE, FREQUENCES, OPTIONS_SUPPLEMENTAIRES, TARIFS } from '@/utils/constants';
import { DevisData } from '@/types';

// Validation schema for the quote form
const quoteFormSchema = z.object({
  // Step 1: Client Information
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(10, 'Numéro de téléphone invalide'),
  adresse: z.string().min(10, 'Adresse invalide'),
  codePostal: z.string().min(5, 'Code postal invalide'),
  ville: z.string().min(2, 'Ville invalide'),
  
  // Step 2: Service Details
  typeNettoyage: z.string().min(1, 'Veuillez sélectionner un type de nettoyage'),
  surface: z.number().min(1, 'Surface invalide'),
  frequence: z.string().min(1, 'Veuillez sélectionner une fréquence'),
  dateIntervention: z.string().min(1, 'Date d\'intervention requise'),
  
  // Step 3: Additional Options
  optionsSupplementaires: z.array(z.string()).optional(),
  commentaires: z.string().optional(),
  
  // Step 4: Signature
  signature: z.string().min(1, 'Signature requise'),
  
  // Step 5: Confirmation
  conditionsAcceptees: z.boolean().refine(val => val === true, 'Vous devez accepter les conditions'),
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;

const STORAGE_KEY = 'devis_draft';

const QuoteForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<DevisData>>({});
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  const [showAutoSaveMessage, setShowAutoSaveMessage] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    mode: 'onChange',
    defaultValues: {
      optionsSupplementaires: [],
      commentaires: '',
      conditionsAcceptees: false,
      dateIntervention: new Date().toISOString().split('T')[0], // Date d'aujourd'hui
    }
  });

  const { currentStep, steps, nextStep, prevStep, setStepValid, getProgress } = useFormStepper(5);
  const { calculatePrice, getPriceBreakdown } = useDevisCalculator();
  const { downloadDevis, sendDevisEmail, isDownloading, isSending, error, clearError } = useDevisActions();

  const watchedValues = watch();
  const currentPrice = calculatePrice({ 
    serviceDetails: {
      typeNettoyage: watchedValues.typeNettoyage as any,
      superficie: watchedValues.surface || 0,
      frequence: watchedValues.frequence as any,
      dateIntervention: watchedValues.dateIntervention ? new Date(watchedValues.dateIntervention) : new Date(),
      horaires: ''
    },
    optionsSupplementaires: {
      nettoyageVitres: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('nettoyageVitres') : false,
      desinfection: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('desinfection') : false,
      nettoyageFacades: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('nettoyageFacades') : false,
      nettoyageParking: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('nettoyageParking') : false,
      nettoyageCarpettes: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('nettoyageCarpettes') : false,
      traitementAntiCalcaire: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('traitementAntiCalcaire') : false
    }
  });

  // Auto-save functionality
  const saveToLocalStorage = useCallback((data: any) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setAutoSaveStatus('saved');
      setShowAutoSaveMessage(true);
      // Réduire le temps d'affichage du message
      setTimeout(() => {
        setShowAutoSaveMessage(false);
        setAutoSaveStatus(null);
      }, 2000);
    } catch (error) {
      setAutoSaveStatus('error');
      console.error('Erreur auto-sauvegarde:', error);
    }
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        // Restaurer les valeurs dans le formulaire
        Object.entries(parsedData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            setValue(key as any, value);
          }
        });
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
    }
  }, [setValue]);

  // Auto-save when form data changes - optimisé pour éviter les sauvegardes constantes
  useEffect(() => {
    if (isDirty) {
      setAutoSaveStatus('saving');
      const timeoutId = setTimeout(() => {
        const currentData = getCurrentStepData();
        // Vérifier si les données ont vraiment changé avant de sauvegarder
        const lastSavedData = localStorage.getItem(STORAGE_KEY);
        if (lastSavedData) {
          const parsedLastData = JSON.parse(lastSavedData);
          const currentDataString = JSON.stringify(currentData);
          const lastDataString = JSON.stringify(parsedLastData);
          
          // Ne sauvegarder que si les données ont vraiment changé
          if (currentDataString !== lastDataString) {
            saveToLocalStorage(currentData);
          } else {
            setAutoSaveStatus(null);
          }
        } else {
          // Première sauvegarde
          saveToLocalStorage(currentData);
        }
      }, 2000); // Augmenter le délai à 2 secondes

      return () => {
        clearTimeout(timeoutId);
        setAutoSaveStatus(null);
      };
    }
  }, [isDirty, saveToLocalStorage]); // Retirer watchedValues des dépendances

  const getCurrentStepData = () => {
    const currentData = { ...formData };
    
    switch (currentStep) {
      case 1:
        currentData.clientInfo = {
          nom: watchedValues.nom || '',
          email: watchedValues.email || '',
          telephone: watchedValues.telephone || '',
          adresse: watchedValues.adresse || '',
          codePostal: watchedValues.codePostal || '',
          ville: watchedValues.ville || ''
        };
        break;
      case 2:
        currentData.serviceDetails = {
          typeNettoyage: watchedValues.typeNettoyage as any,
          superficie: watchedValues.surface || 0,
          frequence: watchedValues.frequence as any,
          dateIntervention: watchedValues.dateIntervention ? new Date(watchedValues.dateIntervention) : new Date(),
          horaires: ''
        };
        break;
      case 3:
        currentData.optionsSupplementaires = {
          nettoyageVitres: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('nettoyageVitres') : false,
          desinfection: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('desinfection') : false,
          nettoyageFacades: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('nettoyageFacades') : false,
          nettoyageParking: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('nettoyageParking') : false,
          nettoyageCarpettes: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('nettoyageCarpettes') : false,
          traitementAntiCalcaire: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('traitementAntiCalcaire') : false
        };
        currentData.commentaires = watchedValues.commentaires || '';
        break;
      case 4:
        currentData.signature = watchedValues.signature || '';
        break;
    }
    
    return currentData;
  };

  const validateCurrentStep = (stepData: any): boolean => {
    switch (currentStep) {
      case 1:
        return stepData.clientInfo?.nom && stepData.clientInfo?.email && stepData.clientInfo?.telephone;
      case 2:
        return stepData.serviceDetails?.typeNettoyage && stepData.serviceDetails?.superficie;
      case 3:
        return true; // Les options sont optionnelles
      case 4:
        return stepData.signature;
      case 5:
        return watchedValues.conditionsAcceptees;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    const currentData = getCurrentStepData();
    const isValid = validateCurrentStep(currentData);
    
    if (isValid) {
      setStepValid(currentStep, true);
      setFormData(currentData);
      nextStep();
    }
  };

  const handlePrevStep = () => {
    prevStep();
  };

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simuler l'envoi du devis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Sauvegarder les données finales
      const finalData = {
        ...formData,
        prixTotal: currentPrice,
        statut: 'envoye' as const,
        dateCreation: new Date(),
        dateModification: new Date(),
        cgvAcceptees: data.conditionsAcceptees
      };
      
      setFormData(finalData);
      
      // Nettoyer le localStorage
      localStorage.removeItem(STORAGE_KEY);
      
      // Rediriger vers une page de confirmation
      alert('Devis envoyé avec succès ! Vous recevrez une réponse sous 24h.');
      
    } catch (error) {
      console.error('Erreur envoi devis:', error);
      alert('Erreur lors de l\'envoi du devis. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ClientInfoStep register={register} errors={errors} />;
      case 2:
        return <ServiceDetailsStep register={register} errors={errors} setValue={setValue} watchedValues={watchedValues} />;
      case 3:
        return <AdditionalOptionsStep register={register} errors={errors} setValue={setValue} watchedValues={watchedValues} />;
      case 4:
        return <SignatureStep register={register} errors={errors} setValue={setValue} />;
      case 5:
        return <ConfirmationStep formData={formData} currentPrice={currentPrice} register={register} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {steps[currentStep - 1]?.titre}
          </h2>
          <span className="text-sm text-gray-500">
            Étape {currentStep} sur {steps.length}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {steps.map((step, index) => (
            <span 
              key={step.id}
              className={`${index < currentStep ? 'text-primary font-medium' : ''}`}
            >
              {step.titre}
            </span>
          ))}
        </div>
      </div>

      {/* Auto-save message - optimisé pour être moins intrusif */}
      <AnimatePresence>
        {showAutoSaveMessage && autoSaveStatus && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-4 p-2 rounded-lg flex items-center space-x-2 text-xs ${
              autoSaveStatus === 'saved' ? 'bg-green-50 text-green-700 border border-green-200' :
              autoSaveStatus === 'saving' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
              'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            <Save className="w-3 h-3" />
            <span>
              {autoSaveStatus === 'saved' ? 'Sauvegardé' :
               autoSaveStatus === 'saving' ? 'Sauvegarde...' :
               'Erreur de sauvegarde'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-3 rounded-lg bg-red-100 text-red-800 flex items-center justify-between"
          >
            <span className="text-sm">{error}</span>
            <button onClick={clearError} className="text-red-600 hover:text-red-800">
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Précédent</span>
            </Button>

            {currentStep === steps.length ? (
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => downloadDevis(formData as DevisData)}
                  disabled={isDownloading}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? 'Téléchargement...' : 'Télécharger'}</span>
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => sendDevisEmail(formData as DevisData)}
                  disabled={isSending}
                  className="flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>{isSending ? 'Envoi...' : 'Envoyer par email'}</span>
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Envoi...' : 'Envoyer le Devis'}</span>
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={handleNextStep}
                disabled={!validateCurrentStep(getCurrentStepData())}
                className="flex items-center space-x-2"
              >
                <span>Suivant</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// Step Components
const ClientInfoStep: React.FC<{
  register: any;
  errors: any;
}> = ({ register, errors }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <User className="w-12 h-12 text-primary mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900">Informations client</h2>
      <p className="text-gray-600 mt-2">Veuillez remplir vos informations personnelles</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <Input
          label="Nom complet *"
          placeholder="Jean Dupont"
          {...register('nom')}
          error={errors.nom?.message}
          required
        />
      </div>
      
      <Input
        label="Email *"
        type="email"
        placeholder="jean.dupont@email.com"
        {...register('email')}
        error={errors.email?.message}
        required
      />
      
      <Input
        label="Téléphone *"
        type="tel"
        placeholder="01 23 45 67 89"
        {...register('telephone')}
        error={errors.telephone?.message}
        required
      />
      
      <div className="md:col-span-2">
        <Input
          label="Adresse complète *"
          placeholder="123 Rue de la Paix"
          {...register('adresse')}
          error={errors.adresse?.message}
          required
        />
      </div>
      
      <Input
        label="Code postal *"
        placeholder="75001"
        {...register('codePostal')}
        error={errors.codePostal?.message}
        required
      />
      
      <Input
        label="Ville *"
        placeholder="Paris"
        {...register('ville')}
        error={errors.ville?.message}
        required
      />
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-blue-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">
            Informations confidentielles
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>Vos informations sont protégées et ne seront utilisées que pour établir votre devis.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ServiceDetailsStep: React.FC<{
  register: any;
  errors: any;
  setValue: any;
  watchedValues: any;
}> = ({ register, errors, setValue, watchedValues }) => {
  const { calculatePrice, getPriceBreakdown } = useDevisCalculator();
  
  // Calculer le prix en temps réel
  const currentPrice = calculatePrice({
    serviceDetails: {
      typeNettoyage: watchedValues.typeNettoyage as any,
      superficie: watchedValues.surface || 0,
      frequence: watchedValues.frequence as any,
      dateIntervention: new Date(),
      horaires: ''
    },
    optionsSupplementaires: {
      nettoyageVitres: false,
      desinfection: false,
      nettoyageFacades: false,
      nettoyageParking: false,
      nettoyageCarpettes: false,
      traitementAntiCalcaire: false
    }
  });

  const priceBreakdown = getPriceBreakdown({
    serviceDetails: {
      typeNettoyage: watchedValues.typeNettoyage as any,
      superficie: watchedValues.surface || 0,
      frequence: watchedValues.frequence as any,
      dateIntervention: new Date(),
      horaires: ''
    },
    optionsSupplementaires: {
      nettoyageVitres: false,
      desinfection: false,
      nettoyageFacades: false,
      nettoyageParking: false,
      nettoyageCarpettes: false,
      traitementAntiCalcaire: false
    }
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Calculator className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Détails du service</h2>
        <p className="text-gray-600 mt-2">Sélectionnez le type de nettoyage et les paramètres</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de nettoyage *
            </label>
            <select
              {...register('typeNettoyage')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Sélectionnez un type</option>
              {TYPES_NETTOYAGE.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.typeNettoyage && (
              <p className="text-red-500 text-sm mt-1">{errors.typeNettoyage.message}</p>
            )}
          </div>

          <Input
            label="Surface à nettoyer (m²) *"
            type="number"
            placeholder="100"
            {...register('surface', { valueAsNumber: true })}
            error={errors.surface?.message}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fréquence *
            </label>
            <select
              {...register('frequence')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Sélectionnez une fréquence</option>
              {FREQUENCES.map((freq) => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
            {errors.frequence && (
              <p className="text-red-500 text-sm mt-1">{errors.frequence.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date d'intervention *
            </label>
            <input
              type="date"
              {...register('dateIntervention')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.dateIntervention && (
              <p className="text-red-500 text-sm mt-1">{errors.dateIntervention.message}</p>
            )}
          </div>
        </div>

        {/* Aperçu du prix */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu du prix</h3>
          
          {currentPrice > 0 ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Prix de base :</span>
                <span>{priceBreakdown.prixBase.toFixed(2)} €</span>
              </div>
              
              {priceBreakdown.reduction > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Réduction fréquence :</span>
                  <span>-{priceBreakdown.reduction.toFixed(2)} €</span>
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Prix estimé :</span>
                  <span className="text-primary">{currentPrice.toFixed(2)} €</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                * Prix indicatif, devis définitif après validation
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Calculator className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>Remplissez les informations pour voir le prix</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdditionalOptionsStep: React.FC<{
  register: any;
  errors: any;
  setValue: any;
  watchedValues: any;
}> = ({ register, errors, setValue, watchedValues }) => {
  const { calculatePrice, getPriceBreakdown } = useDevisCalculator();
  
  const handleOptionChange = (optionValue: string, checked: boolean) => {
    const currentOptions = Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires : [];
    if (checked) {
      setValue('optionsSupplementaires', [...currentOptions, optionValue]);
    } else {
      setValue('optionsSupplementaires', currentOptions.filter((opt: string) => opt !== optionValue));
    }
  };

  // Calculer le prix avec les options
  const currentPrice = calculatePrice({
    serviceDetails: {
      typeNettoyage: watchedValues.typeNettoyage as any,
      superficie: watchedValues.surface || 0,
      frequence: watchedValues.frequence as any,
      dateIntervention: watchedValues.dateIntervention ? new Date(watchedValues.dateIntervention) : new Date(),
      horaires: ''
    },
    optionsSupplementaires: {
      nettoyageVitres: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('nettoyageVitres') : false,
      desinfection: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('desinfection') : false,
      nettoyageFacades: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('nettoyageFacades') : false,
      nettoyageParking: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('nettoyageParking') : false,
      nettoyageCarpettes: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('nettoyageCarpettes') : false,
      traitementAntiCalcaire: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('traitementAntiCalcaire') : false
    }
  });

  const priceBreakdown = getPriceBreakdown({
    serviceDetails: {
      typeNettoyage: watchedValues.typeNettoyage as any,
      superficie: watchedValues.surface || 0,
      frequence: watchedValues.frequence as any,
      dateIntervention: watchedValues.dateIntervention ? new Date(watchedValues.dateIntervention) : new Date(),
      horaires: ''
    },
    optionsSupplementaires: {
      nettoyageVitres: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('nettoyageVitres') : false,
      desinfection: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('desinfection') : false,
      nettoyageFacades: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('nettoyageFacades') : false,
      nettoyageParking: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('nettoyageParking') : false,
      nettoyageCarpettes: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('nettoyageCarpettes') : false,
      traitementAntiCalcaire: Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes('traitementAntiCalcaire') : false
    }
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Options supplémentaires</h2>
        <p className="text-gray-600 mt-2">Sélectionnez les options supplémentaires (optionnel)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Options disponibles
            </label>
            <div className="space-y-3">
              {OPTIONS_SUPPLEMENTAIRES.map((option) => (
                <label key={option.key} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={Array.isArray(watchedValues.optionsSupplementaires) ? watchedValues.optionsSupplementaires.includes(option.key) : false}
                    onChange={(e) => handleOptionChange(option.key, e.target.checked)}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                  />
                                     <div className="flex-1">
                     <div className="flex items-center justify-between">
                       <span className="text-sm font-medium text-gray-900">{option.label}</span>
                       <span className="text-xs text-gray-500">
                         +{TARIFS[watchedValues.typeNettoyage as keyof typeof TARIFS]?.options[option.key as keyof typeof TARIFS.bureaux.options] || 0}€/m²
                       </span>
                     </div>
                     <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                   </div>
                </label>
              ))}
            </div>
          </div>

          <Input
            label="Commentaires (optionnel)"
            type="textarea"
            placeholder="Précisions particulières, horaires préférés, etc."
            {...register('commentaires')}
            error={errors.commentaires?.message}
          />
        </div>

        {/* Aperçu du prix avec options */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu du prix</h3>
          
          {currentPrice > 0 ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Prix de base :</span>
                <span>{priceBreakdown.prixBase.toFixed(2)} €</span>
              </div>
              
              {priceBreakdown.reduction > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Réduction fréquence :</span>
                  <span>-{priceBreakdown.reduction.toFixed(2)} €</span>
                </div>
              )}
              
              {priceBreakdown.options > 0 && (
                <div className="flex justify-between text-sm text-blue-600">
                  <span>Options supplémentaires :</span>
                  <span>+{priceBreakdown.options.toFixed(2)} €</span>
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Prix total :</span>
                  <span className="text-primary">{currentPrice.toFixed(2)} €</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                * Prix indicatif, devis définitif après validation
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Calculator className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>Remplissez les informations pour voir le prix</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SignatureStep: React.FC<{
  register: any;
  errors: any;
  setValue: any;
}> = ({ register, errors, setValue }) => {
  const [signature, setSignature] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const handleSignatureChange = (value: string) => {
    setSignature(value);
    setValue('signature', value);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const signatureData = canvas.toDataURL();
      setSignature(signatureData);
      setValue('signature', signatureData);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignature('');
        setValue('signature', '');
      }
    }
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Signature électronique</h2>
        <p className="text-gray-600 mt-2">Signez pour valider votre demande de devis</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Signature *
          </label>
          
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="mb-4">
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="border border-gray-300 rounded-md cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={clearSignature}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Effacer la signature
              </button>
              
              <div className="text-xs text-gray-500">
                Cliquez et dessinez votre signature
              </div>
            </div>
          </div>
          
          {errors.signature && (
            <p className="text-red-500 text-sm mt-1">{errors.signature.message}</p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Signature électronique
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>En signant ce formulaire, vous acceptez que vos données soient traitées dans le cadre de votre demande de devis.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfirmationStep: React.FC<{
  formData: any;
  currentPrice: number;
  register: any;
  errors: any;
}> = ({ formData, currentPrice, register, errors }) => {
  const { getPriceBreakdown } = useDevisCalculator();
  
  const priceBreakdown = React.useMemo(() => {
    const breakdown = getPriceBreakdown({
      serviceDetails: {
        typeNettoyage: formData.serviceDetails?.typeNettoyage || 'bureaux',
        superficie: formData.serviceDetails?.superficie || 0,
        frequence: formData.serviceDetails?.frequence || 'ponctuel',
        dateIntervention: new Date(),
        horaires: ''
      },
      optionsSupplementaires: formData.optionsSupplementaires || {
        nettoyageVitres: false,
        desinfection: false,
        nettoyageFacades: false,
        nettoyageParking: false,
        nettoyageCarpettes: false,
        traitementAntiCalcaire: false
      }
    });
    
    return breakdown;
  }, [formData, getPriceBreakdown]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Check className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Confirmation</h2>
        <p className="text-gray-600 mt-2">Vérifiez vos informations avant l'envoi</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Informations client
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nom :</span>
                <span className="font-medium">{formData.clientInfo?.nom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email :</span>
                <span className="font-medium">{formData.clientInfo?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Téléphone :</span>
                <span className="font-medium">{formData.clientInfo?.telephone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Adresse :</span>
                <span className="font-medium">{formData.clientInfo?.adresse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Code postal :</span>
                <span className="font-medium">{formData.clientInfo?.codePostal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ville :</span>
                <span className="font-medium">{formData.clientInfo?.ville}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-primary" />
              Détails du service
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Type :</span>
                <span className="font-medium">{TYPES_NETTOYAGE.find(t => t.value === formData.serviceDetails?.typeNettoyage)?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Surface :</span>
                <span className="font-medium">{formData.serviceDetails?.superficie} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fréquence :</span>
                <span className="font-medium">{FREQUENCES.find(f => f.value === formData.serviceDetails?.frequence)?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date d'intervention :</span>
                <span className="font-medium">{formData.serviceDetails?.dateIntervention?.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Détail du prix
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Prix de base :</span>
                <span>{priceBreakdown.prixBase.toFixed(2)} €</span>
              </div>
              
              {priceBreakdown.reduction > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Réduction fréquence :</span>
                  <span>-{priceBreakdown.reduction.toFixed(2)} €</span>
                </div>
              )}
              
              {priceBreakdown.options > 0 && (
                <div className="flex justify-between text-sm text-blue-600">
                  <span>Options supplémentaires :</span>
                  <span>+{priceBreakdown.options.toFixed(2)} €</span>
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{currentPrice.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Devis gratuit
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Ce devis est gratuit et sans engagement. Vous recevrez une réponse sous 24h.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            {...register('conditionsAcceptees')}
            className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
          />
          <div className="text-sm">
            <span className="text-gray-900">
              J'accepte les{' '}
              <a href="#" className="text-primary hover:underline">
                conditions générales de vente
              </a>
              {' '}et la{' '}
              <a href="#" className="text-primary hover:underline">
                politique de confidentialité
              </a>
            </span>
            {errors.conditionsAcceptees && (
              <p className="text-red-500 text-sm mt-1">{errors.conditionsAcceptees.message}</p>
            )}
          </div>
        </label>
      </div>
    </div>
  );
};

export default QuoteForm; 