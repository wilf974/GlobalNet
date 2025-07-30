'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Shield, 
  Clock, 
  Users, 
  CheckCircle, 
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import Button from '@/components/ui/Button';
import LazyLoad from '@/components/ui/LazyLoad';
import OptimizedImage from '@/components/ui/OptimizedImage';
import SEOHead from '@/components/ui/SEOHead';
import { APP_CONFIG, SERVICES } from '@/utils/constants';

const HomePage = () => {
  const features = [
    {
      icon: Shield,
      title: "Qualité Garantie",
      description: "Services de nettoyage professionnel avec garantie de satisfaction"
    },
    {
      icon: Clock,
      title: "Flexibilité Totale",
      description: "Interventions ponctuelles ou régulières selon vos besoins"
    },
    {
      icon: Users,
      title: "Équipe Qualifiée",
      description: "Personnel formé et expérimenté pour tous types de locaux"
    },
    {
      icon: CheckCircle,
      title: "Écologique",
      description: "Produits respectueux de l'environnement et de la santé"
    }
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      company: "Cabinet d'avocats Dubois & Associés",
      text: "Service impeccable depuis 2 ans. Notre équipe est ravie de la qualité du nettoyage.",
      rating: 5
    },
    {
      name: "Jean Martin",
      company: "Restaurant Le Gourmet",
      text: "Nettoyage professionnel et ponctuel. Je recommande vivement leurs services.",
      rating: 5
    },
    {
      name: "Sophie Bernard",
      company: "Clinique Saint-Joseph",
      text: "Excellente prestation dans un environnement médical exigeant.",
      rating: 5
    }
  ];

  return (
    <>
      <SEOHead 
        title="GlobalNet Services - Nettoyage Professionnel"
        description="Services de nettoyage professionnel pour bureaux, industrie, résidentiel et commercial. Devis gratuit et personnalisé. Équipe qualifiée, produits écologiques."
        keywords="nettoyage professionnel, nettoyage bureaux, nettoyage industriel, nettoyage commercial, nettoyage résidentiel, services de nettoyage, entreprise de nettoyage, devis nettoyage, GlobalNet Services"
        url="https://globalnet-services.fr"
        image="/images/og-image.jpg"
        type="website"
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-primary text-white overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  GlobalNet{' '}
                  <span className="text-yellow-300">Services</span>
                  <br />
                  Nettoyage Professionnel
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-100">
                  Services de nettoyage sur mesure pour bureaux, locaux industriels, 
                  résidentiels et commerciaux. Devis gratuit et personnalisé.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
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
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
                    <h3 className="text-2xl font-bold mb-4">Pourquoi nous choisir ?</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                        <span>Équipe qualifiée</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                        <span>Produits écologiques</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                        <span>Devis gratuit</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                        <span>Service 24/7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
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
                Nos Services de Nettoyage
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des solutions de nettoyage professionnel adaptées à tous types d'environnements
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {SERVICES.map((service, index) => (
                <LazyLoad key={service.id} delay={index * 100}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {service.nom}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">
                        À partir de {service.prixBase}€/{service.unite}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => window.location.href = '/devis'}
                      >
                        Devis
                      </Button>
                    </div>
                  </motion.div>
                </LazyLoad>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Pourquoi Choisir GlobalNet Services ?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Notre expertise et notre engagement pour votre satisfaction
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <LazyLoad key={index} delay={index * 100}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="text-center p-6"
                  >
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </motion.div>
                </LazyLoad>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
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
                Ce que disent nos clients
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                La satisfaction de nos clients est notre priorité
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <LazyLoad key={index} delay={index * 100}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">
                      "{testimonial.text}"
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonial.company}
                      </p>
                    </div>
                  </motion.div>
                </LazyLoad>
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
};

export default HomePage; 