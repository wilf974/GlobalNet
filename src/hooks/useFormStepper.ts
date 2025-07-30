import { useState, useCallback } from 'react';
import { FormStep } from '@/types';
import { FORM_STEPS } from '@/utils/constants';

export const useFormStepper = (totalSteps: number = FORM_STEPS.length) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<FormStep[]>(
    FORM_STEPS.slice(0, totalSteps).map(step => ({
      ...step,
      valide: false
    }))
  );

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  const setStepValid = useCallback((stepNumber: number, isValid: boolean) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepNumber 
          ? { ...step, valide: isValid }
          : step
      )
    );
  }, []);

  const isStepValid = useCallback((stepNumber: number) => {
    const step = steps.find(s => s.id === stepNumber);
    return step?.valide || false;
  }, [steps]);

  const canGoToNextStep = useCallback(() => {
    return isStepValid(currentStep);
  }, [currentStep, isStepValid]);

  const canGoToPrevStep = useCallback(() => {
    return currentStep > 1;
  }, [currentStep]);

  const getProgress = useCallback(() => {
    return (currentStep / totalSteps) * 100;
  }, [currentStep, totalSteps]);

  const getCompletedSteps = useCallback(() => {
    return steps.filter(step => step.valide).length;
  }, [steps]);

  const resetSteps = useCallback(() => {
    setCurrentStep(1);
    setSteps(prevSteps => 
      prevSteps.map(step => ({ ...step, valide: false }))
    );
  }, []);

  return {
    currentStep,
    steps,
    nextStep,
    prevStep,
    goToStep,
    setStepValid,
    isStepValid,
    canGoToNextStep,
    canGoToPrevStep,
    getProgress,
    getCompletedSteps,
    resetSteps
  };
}; 