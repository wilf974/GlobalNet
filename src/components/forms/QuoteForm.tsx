'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Calculator, FileText, User, MapPin, CreditCard } from 'lucide-react';
import { z } from 'zod';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useFormStepper } from '@/hooks/useFormStepper';
import { useDevisCalculator } from '@/hooks/useDevisCalculator';
import { FORM_STEPS, TYPES_NETTOYAGE, FREQUENCES, OPTIONS_SUPPLEMENTAIRES } from '@/utils/constants';
import { DevisData } from '@/types';

// Validation schema for the quote form
const quoteFormSchema = z.object({
  // Step 1: Client Information
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(10, 'Numéro de téléphone invalide'),
  adresse: z.string().min(10, 'Adresse invalide'),
  
  // Step 2: Service Details
  typeNettoyage: z.string().min(1, 'Veuillez sélectionner un type de nettoyage'),
  surface: z.number().min(1, 'Surface invalide'),
  frequence: z.string().min(1, 'Veuillez sélectionner une fréquence'),
  
  // Step 3: Additional Options
  optionsSupplementaires: z.array(z.string()).optional(),
  commentaires: z.string().optional(),
  
  // Step 4: Signature
  signature: z.string().min(1, 'Signature requise'),
  
  // Step 5: Confirmation
  conditionsAcceptees: z.boolean().refine(val => val === true, 'Vous devez accepter les conditions'),
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;

export const QuoteForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<DevisData>>({});
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    mode: 'onChange',
  });

  const { currentStep, steps, nextStep, prevStep, setStepValid, getProgress } = useFormStepper();
  const { calculatePrice, getPriceBreakdown } = useDevisCalculator();

  const watchedValues = watch();
  const currentPrice = calculatePrice({ 
    serviceDetails: {
      typeNettoyage: watchedValues.typeNettoyage as any,
      superficie: watchedValues.surface || 0,
      frequence: watchedValues.frequence as any,
      dateIntervention: new Date(),
      horaires: ''
    },
    optionsSupplementaires: {
      nettoyageVitres: (watchedValues.optionsSupplementaires || []).includes('nettoyageVitres'),
      desinfection: (watchedValues.optionsSupplementaires || []).includes('desinfection'),
      nettoyageFacades: (watchedValues.optionsSupplementaires || []).includes('nettoyageFacades'),
      nettoyageParking: (watchedValues.optionsSupplementaires || []).includes('nettoyageParking'),
      nettoyageCarpettes: (watchedValues.optionsSupplementaires || []).includes('nettoyageCarpettes'),
      traitementAntiCalcaire: (watchedValues.optionsSupplementaires || []).includes('traitementAntiCalcaire')
    }
  });

  // Update form data when values change
  React.useEffect(() => {
    const subscription = watch((value) => {
      // Store form data in a simpler format
      setFormData(prev => ({ 
        ...prev, 
        clientInfo: {
          nom: value.nom || '',
          email: value.email || '',
          telephone: value.telephone || '',
          adresse: value.adresse || '',
          codePostal: '',
          ville: ''
        }
      }));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Update step validity based on form state
  React.useEffect(() => {
    const currentStepData = getCurrentStepData();
    const isStepValid = validateCurrentStep(currentStepData);
    setStepValid(currentStep, isStepValid);
  }, [currentStep, watchedValues, setStepValid]);

  const getCurrentStepData = () => {
    switch (currentStep) {
      case 1:
        return { nom: watchedValues.nom, email: watchedValues.email, telephone: watchedValues.telephone, adresse: watchedValues.adresse };
      case 2:
        return { typeNettoyage: watchedValues.typeNettoyage, surface: watchedValues.surface, frequence: watchedValues.frequence };
      case 3:
        return { optionsSupplementaires: watchedValues.optionsSupplementaires, commentaires: watchedValues.commentaires };
      case 4:
        return { signature: watchedValues.signature };
      case 5:
        return { conditionsAcceptees: watchedValues.conditionsAcceptees };
      default:
        return {};
    }
  };

  const validateCurrentStep = (stepData: any): boolean => {
    switch (currentStep) {
      case 1:
        return !!(stepData.nom && stepData.email && stepData.telephone && stepData.adresse);
      case 2:
        return !!(stepData.typeNettoyage && stepData.surface && stepData.frequence);
      case 3:
        return true; // Optional step
      case 4:
        return !!stepData.signature;
      case 5:
        return stepData.conditionsAcceptees === true;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (currentStep < FORM_STEPS.length) {
      nextStep();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      prevStep();
    }
  };

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the data to your API
      console.log('Quote form data:', data);
      console.log('Calculated price:', currentPrice);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle success (redirect, show success message, etc.)
      console.log('Quote submitted successfully!');
    } catch (error) {
      console.error('Error submitting quote:', error);
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
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {FORM_STEPS.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep > index + 1 
                  ? 'bg-primary border-primary text-white' 
                  : currentStep === index + 1 
                    ? 'border-primary text-primary' 
                    : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > index + 1 ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
                             <span className={`ml-2 text-sm font-medium ${
                 currentStep >= index + 1 ? 'text-gray-900' : 'text-gray-400'
               }`}>
                 {step.titre}
               </span>
              {index < FORM_STEPS.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > index + 1 ? 'bg-primary' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getProgress()}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
        <div className="flex justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>

          {currentStep < FORM_STEPS.length ? (
            <Button
              type="button"
              onClick={handleNextStep}
                             disabled={!steps[currentStep - 1]?.valide}
              className="flex items-center"
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
              className="flex items-center"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le devis'}
            </Button>
          )}
        </div>
      </form>

      {/* Price Preview */}
      {currentPrice > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-900">Prix estimé :</span>
            <span className="text-2xl font-bold text-primary">
              {currentPrice.toFixed(2)} €
            </span>
          </div>
        </motion.div>
      )}
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
      <Input
        label="Nom complet"
        placeholder="Votre nom complet"
        {...register('nom')}
        error={errors.nom?.message}
        required
      />
      <Input
        label="Email"
        type="email"
        placeholder="votre@email.com"
        {...register('email')}
        error={errors.email?.message}
        required
      />
      <Input
        label="Téléphone"
        type="tel"
        placeholder="06 12 34 56 78"
        {...register('telephone')}
        error={errors.telephone?.message}
        required
      />
      <Input
        label="Adresse"
        placeholder="123 Rue de la Paix, 75001 Paris"
        {...register('adresse')}
        error={errors.adresse?.message}
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
}> = ({ register, errors, setValue, watchedValues }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <Calculator className="w-12 h-12 text-primary mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900">Détails du service</h2>
      <p className="text-gray-600 mt-2">Sélectionnez le type de nettoyage et les paramètres</p>
    </div>

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
        label="Surface à nettoyer (m²)"
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
    </div>
  </div>
);

const AdditionalOptionsStep: React.FC<{
  register: any;
  errors: any;
  setValue: any;
  watchedValues: any;
}> = ({ register, errors, setValue, watchedValues }) => {
  const handleOptionChange = (optionValue: string, checked: boolean) => {
    const currentOptions = watchedValues.optionsSupplementaires || [];
    if (checked) {
      setValue('optionsSupplementaires', [...currentOptions, optionValue]);
    } else {
      setValue('optionsSupplementaires', currentOptions.filter((opt: string) => opt !== optionValue));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Options supplémentaires</h2>
        <p className="text-gray-600 mt-2">Sélectionnez les options supplémentaires (optionnel)</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Options disponibles
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OPTIONS_SUPPLEMENTAIRES.map((option) => (
                             <label key={option.key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                 <input
                   type="checkbox"
                   checked={(watchedValues.optionsSupplementaires || []).includes(option.key)}
                   onChange={(e) => handleOptionChange(option.key, e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">{option.label}</span>
                  <p className="text-xs text-gray-500">{option.description}</p>
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
    </div>
  );
};

const SignatureStep: React.FC<{
  register: any;
  errors: any;
  setValue: any;
}> = ({ register, errors, setValue }) => {
  const [signature, setSignature] = useState('');

  const handleSignatureChange = (value: string) => {
    setSignature(value);
    setValue('signature', value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Signature électronique</h2>
        <p className="text-gray-600 mt-2">Signez pour valider votre demande de devis</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Signature *
          </label>
          <div className="border border-gray-300 rounded-lg p-4">
            <textarea
              placeholder="Tapez votre nom pour signer électroniquement..."
              value={signature}
              onChange={(e) => handleSignatureChange(e.target.value)}
              className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
          {errors.signature && (
            <p className="text-red-500 text-sm mt-1">{errors.signature.message}</p>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            En signant ce formulaire, vous acceptez que vos données soient traitées dans le cadre de votre demande de devis.
          </p>
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
  const priceBreakdown = React.useMemo(() => {
    // This would come from the useDevisCalculator hook
    return [
      { label: 'Nettoyage de base', amount: currentPrice * 0.8 },
      { label: 'Options supplémentaires', amount: currentPrice * 0.2 },
    ];
  }, [currentPrice]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Check className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Confirmation</h2>
        <p className="text-gray-600 mt-2">Vérifiez vos informations avant l'envoi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Informations client</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Nom :</span> {formData.nom}</p>
            <p><span className="font-medium">Email :</span> {formData.email}</p>
            <p><span className="font-medium">Téléphone :</span> {formData.telephone}</p>
            <p><span className="font-medium">Adresse :</span> {formData.adresse}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Détails du service</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Type :</span> {formData.typeNettoyage}</p>
            <p><span className="font-medium">Surface :</span> {formData.surface} m²</p>
            <p><span className="font-medium">Fréquence :</span> {formData.frequence}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Détail du prix</h3>
        <div className="space-y-2">
          {priceBreakdown.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.label}</span>
              <span>{item.amount.toFixed(2)} €</span>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{currentPrice.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
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