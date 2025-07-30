import React from 'react';
import { Metadata } from 'next';
import { QuoteForm } from '@/components/forms/QuoteForm';

export const metadata: Metadata = {
  title: 'Demande de devis - Nettoyage professionnel',
  description: 'Demandez un devis personnalisé pour vos services de nettoyage professionnel. Formulaire simple et rapide.',
  keywords: 'devis, nettoyage, professionnel, demande, prix, estimation',
};

export default function DevisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Demande de devis
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Remplissez le formulaire ci-dessous pour recevoir un devis personnalisé 
            pour vos services de nettoyage professionnel.
          </p>
        </div>
        
        <QuoteForm />
      </div>
    </div>
  );
} 