import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import A11yProvider, { SkipLink } from '@/components/ui/A11yProvider';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import PerformanceMonitor from '@/components/ui/PerformanceMonitor';
import { MicroInteractionsProvider } from '@/components/ui/MicroInteractions';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'GlobalNet Services - Nettoyage Professionnel',
    template: '%s | GlobalNet Services'
  },
  description: 'GlobalNet Services, leader du nettoyage professionnel. Services de nettoyage pour bureaux, industrie, résidentiel et commercial. Devis gratuit et personnalisé.',
  keywords: [
    'nettoyage professionnel',
    'nettoyage bureaux',
    'nettoyage industriel',
    'nettoyage commercial',
    'nettoyage résidentiel',
    'services de nettoyage',
    'entreprise de nettoyage',
    'devis nettoyage',
    'GlobalNet Services'
  ],
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
    type: 'website',
    locale: 'fr_FR',
    url: 'https://globalnet-services.fr',
    title: 'GlobalNet Services - Nettoyage Professionnel',
    description: 'Services de nettoyage professionnel pour bureaux, industrie, résidentiel et commercial. Devis gratuit et personnalisé.',
    siteName: 'GlobalNet Services',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GlobalNet Services - Nettoyage Professionnel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GlobalNet Services - Nettoyage Professionnel',
    description: 'Services de nettoyage professionnel pour bureaux, industrie, résidentiel et commercial.',
    images: ['/images/og-image.jpg'],
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <A11yProvider>
          <ThemeProvider>
            <MicroInteractionsProvider>
              <AuthProvider>
                <SkipLink href="#main-content">Passer au contenu principal</SkipLink>
                <SkipLink href="#footer">Passer au pied de page</SkipLink>
                <Navigation />
                <main id="main-content">
                  {children}
                </main>
                <Footer id="footer" />
                <PerformanceMonitor showDetails={false} autoRefresh={true} />
              </AuthProvider>
            </MicroInteractionsProvider>
          </ThemeProvider>
        </A11yProvider>
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "GlobalNet Services",
              "description": "Services de nettoyage professionnel pour bureaux, industrie, résidentiel et commercial",
              "url": "https://globalnet-services.fr",
              "telephone": "+33123456789",
              "email": "contact@globalnet-services.fr",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Rue de la Propreté",
                "addressLocality": "Paris",
                "postalCode": "75001",
                "addressCountry": "FR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "48.8566",
                "longitude": "2.3522"
              },
              "openingHours": "Mo-Fr 08:00-18:00",
              "priceRange": "€€",
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": "48.8566",
                  "longitude": "2.3522"
                },
                "geoRadius": "50000"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Services de Nettoyage",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Nettoyage de Bureaux",
                      "description": "Nettoyage professionnel des espaces de travail"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Nettoyage Industriel",
                      "description": "Solutions de nettoyage spécialisées pour environnements industriels"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Nettoyage Résidentiel",
                      "description": "Services de nettoyage personnalisés pour particuliers"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Nettoyage Commercial",
                      "description": "Nettoyage professionnel pour commerces et espaces de vente"
                    }
                  }
                ]
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "127"
              }
            })
          }}
        />
      </body>
    </html>
  );
} 