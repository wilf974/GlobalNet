import React from 'react';
import { Metadata } from 'next';
import ContactPage from '@/components/pages/ContactPage';

export const metadata: Metadata = {
  title: 'Contact - GlobalNet Services',
  description: 'Contactez GlobalNet pour vos services de nettoyage professionnel. Devis gratuit et personnalisé.',
  keywords: 'contact, nettoyage, professionnel, devis, GlobalNet',
};

export default function ContactPageWrapper() {
  return <ContactPage />;
} 