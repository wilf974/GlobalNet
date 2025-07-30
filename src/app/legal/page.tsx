'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Shield, 
  Eye, 
  Lock, 
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

import Button from '@/components/ui/Button';
import { APP_CONFIG, CGV_TEXT } from '@/utils/constants';

const legalSections = [
  {
    id: 'cgv',
    title: 'Conditions Générales de Vente',
    icon: FileText,
    content: CGV_TEXT
  },
  {
    id: 'privacy',
    title: 'Politique de Confidentialité',
    icon: Shield,
    content: `
POLITIQUE DE CONFIDENTIALITÉ

Article 1 - Collecte des Données
GlobalNet Services collecte uniquement les données nécessaires à l'exécution de nos services :
- Informations de contact (nom, email, téléphone, adresse)
- Informations relatives aux prestations demandées
- Données techniques nécessaires au bon fonctionnement du site

Article 2 - Utilisation des Données
Les données collectées sont utilisées pour :
- Établir des devis personnalisés
- Exécuter les prestations de nettoyage
- Améliorer nos services
- Respecter nos obligations légales

Article 3 - Protection des Données
Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.

Article 4 - Conservation des Données
Vos données sont conservées pendant la durée nécessaire à l'exécution de nos services et au respect de nos obligations légales.

Article 5 - Vos Droits
Vous disposez des droits suivants :
- Droit d'accès à vos données
- Droit de rectification
- Droit d'effacement
- Droit à la portabilité
- Droit d'opposition au traitement

Article 6 - Cookies
Notre site utilise des cookies techniques nécessaires à son bon fonctionnement. Aucun cookie de suivi n'est utilisé.

Article 7 - Contact
Pour toute question relative à vos données, contactez-nous à : ${APP_CONFIG.contact.email}
    `
  },
  {
    id: 'mentions',
    title: 'Mentions Légales',
    icon: Lock,
    content: `
MENTIONS LÉGALES

Éditeur du Site
GlobalNet Services
${APP_CONFIG.company.adresse}
Téléphone : ${APP_CONFIG.company.telephone}
Email : ${APP_CONFIG.company.email}
SIRET : ${APP_CONFIG.company.siret}

Directeur de Publication
Jean Dupont - Directeur Général

Hébergement
Ce site est hébergé par Vercel Inc.
340 S Lemon Ave #4133
Walnut, CA 91789
États-Unis

Propriété Intellectuelle
L'ensemble du contenu de ce site (textes, images, logos) est la propriété exclusive de GlobalNet Services. Toute reproduction, représentation, modification, publication, adaptation totale ou partielle des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.

Liens Hypertextes
Le site peut contenir des liens vers d'autres sites. GlobalNet Services n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.

Loi Applicable
Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
    `
  }
];

export default function LegalPage() {
  const [activeSection, setActiveSection] = useState('cgv');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Mentions Légales
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Informations légales et conditions d'utilisation de nos services
            </p>
          </motion.div>
        </div>
      </section>

      {/* Navigation des Sections */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {legalSections.map((section) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  activeSection === section.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <section.icon className="w-5 h-5 mr-2" />
                {section.title}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Contenu des Sections */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {legalSections.map((section) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: activeSection === section.id ? 1 : 0,
                y: activeSection === section.id ? 0 : 20
              }}
              transition={{ duration: 0.6 }}
              className={`${activeSection === section.id ? 'block' : 'hidden'}`}
            >
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <section.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>

                <div className="prose prose-lg max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                    {section.content}
                  </pre>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Informations de Contact */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questions Légales ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Téléphone</h3>
              <p className="text-primary font-medium">{APP_CONFIG.contact.telephone}</p>
              <p className="text-sm text-gray-600 mt-2">Lun-Ven: 8h-18h</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-primary font-medium">{APP_CONFIG.contact.email}</p>
              <p className="text-sm text-gray-600 mt-2">Réponse sous 24h</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 text-center"
            >
              <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Adresse</h3>
              <p className="text-primary font-medium">{APP_CONFIG.contact.adresse}</p>
              <p className="text-sm text-gray-600 mt-2">Sur rendez-vous</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Prêt à Travailler Ensemble ?
            </h2>
            <p className="text-xl mb-8">
              Découvrez nos services et obtenez un devis gratuit
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                className="text-primary bg-white hover:bg-gray-100"
                onClick={() => window.location.href = '/devis'}
              >
                Demander un Devis Gratuit
                <ArrowRight size={16} className="ml-2" />
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary"
                onClick={() => window.location.href = '/contact'}
              >
                Nous Contacter
                <Phone size={16} className="ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 