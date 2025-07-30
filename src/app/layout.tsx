import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/layout/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GlobalNet Services - Nettoyage Profession Product',
  description: 'Services de nettoyage professionnel pour bureaux, locaux industriels, résidentiels et commerciaux. Devis gratuit et personnalisé.',
  keywords: 'nettoyage, professionnel, bureaux, industriel, résidentiel, commercial, devis, services',
  authors: [{ name: 'GlobalNet Services' }],
  creator: 'GlobalNet Services',
  publisher: 'GlobalNet Services',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://globalnet-services.fr'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'GlobalNet Services - Nettoyage Professionnel',
    description: 'Services de nettoyage professionnel pour bureaux, locaux industriels, résidentiels et commerciaux.',
    url: 'https://globalnet-services.fr',
    siteName: 'GlobalNet Services',
          images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'GlobalNet Services - Nettoyage Professionnel',
        },
      ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GlobalNet Services - Nettoyage Professionnel',
    description: 'Services de nettoyage professionnel pour bureaux, locaux industriels, résidentiels et commerciaux.',
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Navigation />
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
} 