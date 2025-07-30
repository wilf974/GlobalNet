import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demande de devis - Nettoyage professionnel',
  description: 'Demandez un devis personnalisé pour vos services de nettoyage professionnel. Formulaire simple et rapide.',
  keywords: 'devis, nettoyage, professionnel, demande, prix, estimation',
};

export default function DevisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 