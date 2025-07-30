import React from 'react';
import { Metadata } from 'next';
import ServicesPage from '@/components/pages/ServicesPage';

export const metadata: Metadata = {
  title: 'Nos Services - Nettoyage Professionnel',
  description: 'Découvrez nos services de nettoyage professionnel : bureaux, locaux industriels, résidentiels et commerciaux.',
  keywords: 'services, nettoyage, bureaux, industriel, commercial, résidentiel',
};

export default function ServicesPageWrapper() {
  return <ServicesPage />;
} 