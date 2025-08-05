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
import { Devis, DevisStatus } from '@/types/devis';

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

// Fonction d'adaptation pour convertir les données du formulaire en Devis
const adaptFormDataToDevis = (formData: any): Devis => {
  return {
    id: `devis_${Date.now()}`,
    client: formData.nom || '',
    email: formData.email || '',
    telephone: formData.telephone || '',
    service: formData.typeNettoyage || '',
    superficie: formData.surface || 0,
    prix: 0, // Sera calculé
    statut: 'draft' as DevisStatus,
    dateCreation: new Date().toISOString(),
    dateIntervention: formData.dateIntervention ? new Date(formData.dateIntervention).toISOString() : new Date().toISOString(),
    adresse: formData.adresse || '',
    notes: formData.commentaires || '',
    signature: formData.signature || '',
    dateSignature: formData.signature ? new Date().toISOString() : '',
    montantHT: 0, // Sera calculé
    montantTTC: 0, // Sera calculé
    tva: 0, // Sera calculé
    marge: 0,
    tauxMarge: 0,
    clientId: '',
    commercialId: '',
    workflowHistory: [],
    notifications: [],
    tags: [],
    priorite: 'normale',
    dureeValidite: 30,
    dateExpiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    conditions: [],
    documents: [],
    approbations: []
  };
};

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
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setAutoSaveStatus('error');
    }
  }, []);

  const loadFromLocalStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedData = JSON.parse(saved);
        reset(parsedData);
        setFormData(parsedData);
        return true;
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
    return false;
  }, [reset]);

  // Auto-save effect
  useEffect(() => {
    const subscription = watch((data) => {
      if (isDirty) {
        setAutoSaveStatus('saving');
        saveToLocalStorage(data);
        setShowAutoSaveMessage(true);
        
        setTimeout(() => {
          setShowAutoSaveMessage(false);
        }, 2000);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, isDirty, saveToLocalStorage]);

  // Load saved data on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  const getCurrentStepData = () => {
    const watched = watch();
    return {
      nom: watched.nom || '',
      email: watched.email || '',
      telephone: watched.telephone || '',
      adresse: watched.adresse || '',
      codePostal: watched.codePostal || '',
      ville: watched.ville || '',
      typeNettoyage: watched.typeNettoyage || '',
      surface: watched.surface || 0,
      frequence: watched.frequence || '',
      dateIntervention: watched.dateIntervention || '',
      optionsSupplementaires: watched.optionsSupplementaires || [],
      commentaires: watched.commentaires || '',
      signature: watched.signature || '',
      conditionsAcceptees: watched.conditionsAcceptees || false,
    };
  };

  const validateCurrentStep = (stepData: any): boolean => {
    switch (currentStep) {
      case 1:
        return !!(stepData.nom && stepData.email && stepData.telephone && stepData.adresse && stepData.codePostal && stepData.ville);
      case 2:
        return !!(stepData.typeNettoyage && stepData.surface && stepData.frequence && stepData.dateIntervention);
      case 3:
        return true; // Options supplémentaires sont optionnelles
      case 4:
        return !!stepData.signature;
      case 5:
        return stepData.conditionsAcceptees;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (validateCurrentStep(getCurrentStepData())) {
      setStepValid(currentStep, true);
      nextStep();
    }
  };

  const handlePrevStep = () => {
    prevStep();
  };

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    clearError();

    try {
      // Simulation d'envoi du devis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Créer un objet DevisData complet selon le type du système de devis
      const devisData: DevisData = {
        id: `devis_${Date.now()}`,
        clientInfo: {
          nom: data.nom,
          email: data.email,
          telephone: data.telephone,
          adresse: data.adresse,
          codePostal: data.codePostal,
          ville: data.ville
        },
        serviceDetails: {
          typeNettoyage: data.typeNettoyage as any,
          superficie: data.surface,
          frequence: data.frequence as any,
          dateIntervention: new Date(data.dateIntervention),
          horaires: ''
        },
        optionsSupplementaires: {
          nettoyageVitres: Array.isArray(data.optionsSupplementaires) ? data.optionsSupplementaires.includes('nettoyageVitres') : false,
          desinfection: Array.isArray(data.optionsSupplementaires) ? data.optionsSupplementaires.includes('desinfection') : false,
          nettoyageFacades: Array.isArray(data.optionsSupplementaires) ? data.optionsSupplementaires.includes('nettoyageFacades') : false,
          nettoyageParking: Array.isArray(data.optionsSupplementaires) ? data.optionsSupplementaires.includes('nettoyageParking') : false,
          nettoyageCarpettes: Array.isArray(data.optionsSupplementaires) ? data.optionsSupplementaires.includes('nettoyageCarpettes') : false,
          traitementAntiCalcaire: Array.isArray(data.optionsSupplementaires) ? data.optionsSupplementaires.includes('traitementAntiCalcaire') : false
        },
        prixTotal: currentPrice,
        statut: 'brouillon',
        dateCreation: new Date(),
        dateModification: new Date(),
        signature: data.signature,
        cgvAcceptees: data.conditionsAcceptees,
        commentaires: data.commentaires
      };

      setFormData(devisData);
      
      // Nettoyer le localStorage après envoi réussi
      localStorage.removeItem(STORAGE_KEY);
      
      // Afficher un message de succès
      alert('Devis envoyé avec succès !');
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de l\'envoi du devis');
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
        return <ConfirmationStep formData={getCurrentStepData()} currentPrice={currentPrice} register={register} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Demande de Devis</h1>
          <p className="text-gray-600">Remplissez le formulaire pour obtenir votre devis personnalisé</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index + 1 < currentStep 
                    ? 'bg-green-500 text-white' 
                    : index + 1 === currentStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1 < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>

        {/* Auto-save Status */}
        {showAutoSaveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
              autoSaveStatus === 'saved' ? 'bg-green-100 text-green-800' :
              autoSaveStatus === 'saving' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}
          >
            {autoSaveStatus === 'saved' ? (
              <>
                <Check className="w-4 h-4" />
                <span>Devis sauvegardé</span>
              </>
            ) : autoSaveStatus === 'saving' ? (
              <>
                <Save className="w-4 h-4 animate-spin" />
                <span>Sauvegarde en cours...</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Erreur de sauvegarde</span>
              </>
            )}
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-lg p-8">
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
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
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
                  onClick={() => downloadDevis(adaptFormDataToDevis(getCurrentStepData()))}
                  disabled={isDownloading}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? 'Téléchargement...' : 'Télécharger'}</span>
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const formData = getCurrentStepData();
                    sendDevisEmail(adaptFormDataToDevis(formData), formData.email);
                  }}
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
      
      <Input
        label="Adresse *"
        placeholder="123 Rue de la Paix"
        {...register('adresse')}
        error={errors.adresse?.message}
        required
      />
      
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
  </div>
);

const ServiceDetailsStep: React.FC<{
  register: any;
  errors: any;
  setValue: any;
  watchedValues: any;
}> = ({ register, errors, setValue, watchedValues }) => {
  const [selectedType, setSelectedType] = useState('');

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setValue('typeNettoyage', value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Détails du service</h2>
        <p className="text-gray-600 mt-2">Sélectionnez le type de nettoyage et les détails</p>
      </div>

      <div className="space-y-6">
        {/* Type de nettoyage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Type de nettoyage *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TYPES_NETTOYAGE.map((type) => (
              <div
                key={type.value}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedType === type.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTypeChange(type.value)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedType === type.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedType === type.value && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{type.label}</h3>
                    <p className="text-sm text-gray-600">Service de nettoyage {type.label.toLowerCase()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.typeNettoyage && (
            <p className="text-red-600 text-sm mt-1">{errors.typeNettoyage.message}</p>
          )}
        </div>

        {/* Surface */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Surface (m²) *"
            type="number"
            placeholder="100"
            {...register('surface', { valueAsNumber: true })}
            error={errors.surface?.message}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Fréquence *
            </label>
            <select
              {...register('frequence')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sélectionnez une fréquence</option>
              {FREQUENCES.map((freq) => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
            {errors.frequence && (
              <p className="text-red-600 text-sm mt-1">{errors.frequence.message}</p>
            )}
          </div>
        </div>

        {/* Date d'intervention */}
        <Input
          label="Date d'intervention *"
          type="date"
          {...register('dateIntervention')}
          error={errors.dateIntervention?.message}
          required
        />
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
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionChange = (optionValue: string, checked: boolean) => {
    let newOptions = [...selectedOptions];
    if (checked) {
      newOptions.push(optionValue);
    } else {
      newOptions = newOptions.filter(opt => opt !== optionValue);
    }
    setSelectedOptions(newOptions);
    setValue('optionsSupplementaires', newOptions);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Calculator className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Options supplémentaires</h2>
        <p className="text-gray-600 mt-2">Sélectionnez les services additionnels</p>
      </div>

      <div className="space-y-4">
        {OPTIONS_SUPPLEMENTAIRES.map((option) => (
          <div
            key={option.key}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <input
              type="checkbox"
              id={option.key}
              checked={selectedOptions.includes(option.key)}
              onChange={(e) => handleOptionChange(option.key, e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={option.key} className="flex-1 cursor-pointer">
              <div className="font-medium text-gray-900">{option.label}</div>
              <div className="text-sm text-gray-600">{option.description}</div>
              <div className="text-sm text-blue-600 font-medium">Prix selon devis</div>
            </label>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Commentaires additionnels
        </label>
        <textarea
          {...register('commentaires')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Précisions particulières, horaires spécifiques, etc."
        />
      </div>
    </div>
  );
};

const SignatureStep: React.FC<{
  register: any;
  errors: any;
  setValue: any;
}> = ({ register, errors, setValue }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const contextRef = React.useRef<CanvasRenderingContext2D | null>(null);

  const handleSignatureChange = (value: string) => {
    setValue('signature', value);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    contextRef.current = context;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    context.beginPath();
    context.moveTo(x, y);
    context.lineWidth = 2;
    context.strokeStyle = '#1f2937';
    context.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = contextRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (contextRef.current) {
      const canvas = canvasRef.current;
      if (canvas) {
        const signatureData = canvas.toDataURL();
        handleSignatureChange(signatureData);
      }
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    handleSignatureChange('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Signature</h2>
        <p className="text-gray-600 mt-2">Signez pour valider votre demande</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Signature *
          </label>
          <div className="border-2 border-gray-300 rounded-lg p-4">
            <canvas
              ref={canvasRef}
              width={400}
              height={200}
              className="border border-gray-200 rounded cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            <div className="mt-2 flex space-x-2">
              <button
                type="button"
                onClick={clearSignature}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
              >
                Effacer
              </button>
            </div>
          </div>
          {errors.signature && (
            <p className="text-red-600 text-sm mt-1">{errors.signature.message}</p>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Informations importantes</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Votre signature confirme votre accord avec les conditions</li>
            <li>• Le devis sera généré et envoyé dans les 24h</li>
            <li>• Vous recevrez une confirmation par email</li>
          </ul>
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
  const priceBreakdown = [
    { label: 'Service de base', amount: currentPrice * 0.8 },
    { label: 'Options supplémentaires', amount: currentPrice * 0.1 },
    { label: 'TVA (20%)', amount: currentPrice * 0.2 },
    { label: 'Total TTC', amount: currentPrice * 1.2, isTotal: true }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Confirmation</h2>
        <p className="text-gray-600 mt-2">Vérifiez les informations avant envoi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations client */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Informations client</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Nom:</span> {formData.nom}</p>
            <p><span className="font-medium">Email:</span> {formData.email}</p>
            <p><span className="font-medium">Téléphone:</span> {formData.telephone}</p>
            <p><span className="font-medium">Adresse:</span> {formData.adresse}</p>
            <p><span className="font-medium">Ville:</span> {formData.ville} {formData.codePostal}</p>
          </div>
        </div>

        {/* Détails du service */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Détails du service</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Type:</span> {TYPES_NETTOYAGE.find(t => t.value === formData.typeNettoyage)?.label}</p>
            <p><span className="font-medium">Surface:</span> {formData.surface} m²</p>
            <p><span className="font-medium">Fréquence:</span> {FREQUENCES.find(f => f.value === formData.frequence)?.label}</p>
            <p><span className="font-medium">Date:</span> {formData.dateIntervention}</p>
          </div>
        </div>
      </div>

      {/* Détail du prix */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Détail du prix</h3>
        <div className="space-y-2">
          {priceBreakdown.map((item, index) => (
            <div key={index} className={`flex justify-between py-2 ${
              item.isTotal ? 'border-t border-gray-200 pt-4 font-semibold text-lg' : ''
            }`}>
              <span>{item.label}</span>
              <span>{item.amount.toFixed(2)}€</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conditions */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            {...register('conditionsAcceptees')}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div>
            <label className="text-sm text-gray-900">
              J'accepte les conditions générales et la politique de confidentialité *
            </label>
            {errors.conditionsAcceptees && (
              <p className="text-red-600 text-sm mt-1">{errors.conditionsAcceptees.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteForm; 