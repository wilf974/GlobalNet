'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Factory, 
  Home, 
  ShoppingBag, 
  Sparkles, 
  CheckCircle, 
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

import Button from '@/components/ui/Button';
import SEOHead from '@/components/ui/SEOHead';
import { TARIFS, APP_CONFIG } from '@/utils/constants';

const services = [
  {
    id: 'bureaux',
    icon: Building2,
    title: 'Nettoyage de Bureaux',
    description: 'Nettoyage professionnel des espaces de travail pour un environnement sain et productif.',
    longDescription: 'Notre service de nettoyage de bureaux comprend le nettoyage complet des espaces de travail, des sanitaires, des salles de réunion et des espaces communs. Nous utilisons des produits respectueux de l\'environnement et adaptons nos horaires à vos besoins.',
    features: [
      'Nettoyage des postes de travail',
      'Désinfection des surfaces',
      'Nettoyage des sanitaires',
      'Entretien des espaces communs',
      'Gestion des déchets',
      'Horaires flexibles'
    ],
    image: '/images/services/bureaux.jpg',
    price: 'À partir de 0,85€/m²',
    minPrice: 150
  },
  {
    id: 'industriel',
    icon: Factory,
    title: 'Nettoyage Industriel',
    description: 'Solutions de nettoyage spécialisées pour environnements industriels et logistiques.',
    longDescription: 'Notre expertise en nettoyage industriel couvre tous types d\'installations : entrepôts, ateliers, zones de production. Nous respectons les normes de sécurité et utilisons des équipements professionnels adaptés.',
    features: [
      'Nettoyage des zones de production',
      'Entretien des entrepôts',
      'Nettoyage des machines',
      'Gestion des déchets industriels',
      'Respect des normes de sécurité',
      'Équipements spécialisés'
    ],
    image: '/images/services/industriel.jpg',
    price: 'À partir de 1,20€/m²',
    minPrice: 300
  },
  {
    id: 'residentiel',
    icon: Home,
    title: 'Nettoyage Résidentiel',
    description: 'Services de nettoyage personnalisés pour particuliers et copropriétés.',
    longDescription: 'Nous proposons des services de nettoyage résidentiel adaptés aux besoins de chaque client : appartements, maisons, copropriétés. Notre équipe formée garantit un résultat impeccable.',
    features: [
      'Nettoyage complet des pièces',
      'Entretien des surfaces',
      'Nettoyage des vitres',
      'Désinfection',
      'Gestion des déchets',
      'Service personnalisé'
    ],
    image: '/images/services/residentiel.jpg',
    price: 'À partir de 0,65€/m²',
    minPrice: 100
  },
  {
    id: 'commercial',
    icon: ShoppingBag,
    title: 'Nettoyage Commercial',
    description: 'Nettoyage professionnel pour commerces, boutiques et espaces de vente.',
    longDescription: 'Notre service de nettoyage commercial est conçu pour maintenir un environnement accueillant et professionnel. Nous adaptons nos interventions aux horaires d\'ouverture et aux spécificités de chaque commerce.',
    features: [
      'Nettoyage des espaces de vente',
      'Entretien des vitrines',
      'Nettoyage des sanitaires',
      'Entretien des sols',
      'Gestion des déchets',
      'Horaires adaptés'
    ],
    image: '/images/services/commercial.jpg',
    price: 'À partir de 0,95€/m²',
    minPrice: 200
  }
];

const options = [
  {
    id: 'nettoyageVitres',
    title: 'Nettoyage des Vitres',
    description: 'Nettoyage intérieur et extérieur des vitres et baies vitrées',
    icon: Sparkles
  },
  {
    id: 'desinfection',
    title: 'Désinfection',
    description: 'Traitement désinfectant des surfaces et zones sensibles',
    icon: CheckCircle
  },
  {
    id: 'nettoyageFacades',
    title: 'Nettoyage des Façades',
    description: 'Nettoyage professionnel des façades extérieures',
    icon: Building2
  },
  {
    id: 'nettoyageParking',
    title: 'Nettoyage du Parking',
    description: 'Entretien des zones de stationnement et accès',
    icon: MapPin
  },
  {
    id: 'nettoyageCarpettes',
    title: 'Nettoyage des Carpettes',
    description: 'Nettoyage professionnel des moquettes et tapis',
    icon: Sparkles
  },
  {
    id: 'traitementAntiCalcaire',
    title: 'Traitement Anti-Calcaire',
    description: 'Traitement préventif anti-calcaire des surfaces',
    icon: CheckCircle
  }
];

export default function ServicesPage() {
  return (
    <>
      <SEOHead 
        title="Services de Nettoyage - GlobalNet Services"
        description="Services de nettoyage professionnel : bureaux, industriel, résidentiel et commercial. Devis gratuit, équipe qualifiée, produits écologiques. Contactez-nous pour un devis personnalisé."
        keywords="nettoyage bureaux, nettoyage industriel, nettoyage résidentiel, nettoyage commercial, services de nettoyage, entreprise de nettoyage, devis nettoyage, GlobalNet Services"
        url="https://globalnet-services.fr/services"
        image="/images/services/og-services.jpg"
        type="website"
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-primary text-white py-20">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Nos Services de Nettoyage
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
                Des solutions de nettoyage professionnel adaptées à tous types d'environnements
              </p>
              <Button 
                size="lg"
                onClick={() => window.location.href = '/devis'}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
              >
                Demander un Devis
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                        <service.icon className="w-8 h-8 text-primary-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {service.title}
                        </h2>
                        <p className="text-gray-600">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-gray-700 mb-4">
                        {service.longDescription}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary-600 mb-1">
                          {service.price}
                        </p>
                        <p className="text-sm text-gray-500">
                          Minimum {service.minPrice}€
                        </p>
                      </div>
                      <Button
                        onClick={() => window.location.href = '/devis'}
                        className="bg-primary-600 hover:bg-primary-700"
                      >
                        Devis Gratuit
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Options Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Options Complémentaires
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des services supplémentaires pour répondre à tous vos besoins
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {options.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {option.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-primary-600">
                      {option.price}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => window.location.href = '/devis'}
                    >
                      Ajouter
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">
                Prêt à commencer ?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Obtenez votre devis gratuit et personnalisé en quelques minutes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => window.location.href = '/devis'}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                >
                  Demander un Devis
                  <ArrowRight className="ml-2" size={20} />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.location.href = '/contact'}
                  className="border-white text-white hover:bg-white hover:text-gray-900"
                >
                  Nous Contacter
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 mb-4 text-primary-400" />
                <h3 className="text-xl font-semibold mb-2">Téléphone</h3>
                <p className="text-gray-300">{APP_CONFIG.contact.telephone}</p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="w-8 h-8 mb-4 text-primary-400" />
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-gray-300">{APP_CONFIG.contact.email}</p>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="w-8 h-8 mb-4 text-primary-400" />
                <h3 className="text-xl font-semibold mb-2">Adresse</h3>
                <p className="text-gray-300">{APP_CONFIG.contact.adresse}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 