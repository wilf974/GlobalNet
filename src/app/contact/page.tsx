import React from 'react';
import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';
import Button from '@/components/ui/Button';
import { APP_CONFIG } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'Contact - GlobalNet Services',
  description: 'Contactez GlobalNet pour vos services de nettoyage professionnel. Devis gratuit et personnalisé.',
  keywords: 'contact, nettoyage, professionnel, devis, GlobalNet',
};

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      value: APP_CONFIG.contact.telephone,
      description: "Appelez-nous pour un devis rapide"
    },
    {
      icon: Mail,
      title: "Email",
      value: APP_CONFIG.contact.email,
      description: "Envoyez-nous un message"
    },
    {
      icon: MapPin,
      title: "Adresse",
      value: APP_CONFIG.contact.adresse,
      description: "Notre siège social"
    },
    {
      icon: Clock,
      title: "Horaires",
      value: "Lun-Ven: 8h-18h",
      description: "Disponible en urgence 24h/24"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Contactez GlobalNet
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
          >
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/devis'}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
            >
              Demander un Devis
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Coordonnées
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Plusieurs façons de nous contacter pour vos besoins de nettoyage
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 group hover:-translate-y-2">
                  <info.icon className="mx-auto mb-4 text-primary-600" size={48} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-lg font-medium text-primary-600 mb-2">
                    {info.value}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {info.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Envoyez-nous un Message
              </h2>
              <p className="text-xl text-gray-600">
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl p-8"
            >
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Votre nom complet"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sujet *
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="">Sélectionnez un sujet</option>
                      <option value="devis">Demande de devis</option>
                      <option value="information">Demande d'information</option>
                      <option value="reclamation">Réclamation</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Décrivez votre projet ou posez votre question..."
                    required
                  />
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="newsletter"
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="newsletter" className="text-sm text-gray-600">
                    J'accepte de recevoir la newsletter de GlobalNet (optionnel)
                  </label>
                </div>

                <div className="text-center">
                  <Button 
                    size="lg"
                    className="bg-primary hover:bg-primary-600 text-white px-8 py-3"
                  >
                    <MessageSquare className="mr-2" size={20} />
                    Envoyer le Message
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Zone d'Intervention
            </h2>
            <p className="text-xl text-gray-600">
              GlobalNet intervient dans toute la région parisienne et ses environs
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-8 shadow-soft"
          >
            <div className="text-center">
              <MapPin className="mx-auto mb-4 text-primary-600" size={48} />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Zones d'intervention
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Paris</h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Tous les arrondissements</li>
                    <li>• Bureaux et locaux commerciaux</li>
                    <li>• Résidences privées</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Petite Couronne</h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Hauts-de-Seine (92)</li>
                    <li>• Seine-Saint-Denis (93)</li>
                    <li>• Val-de-Marne (94)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Grande Couronne</h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Yvelines (78)</li>
                    <li>• Essonne (91)</li>
                    <li>• Seine-et-Marne (77)</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à Commencer ?
            </h2>
            <p className="text-xl mb-8 text-gray-100">
              Obtenez votre devis gratuit et personnalisé en quelques clics
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/devis'}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
              >
                Demander un Devis
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                Appeler Maintenant
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 