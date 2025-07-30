'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Users, 
  Target, 
  Heart, 
  Shield, 
  Sparkles,
  Building2,
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

import Button from '@/components/ui/Button';
import { APP_CONFIG } from '@/utils/constants';

const values = [
  {
    icon: Shield,
    title: 'Qualité',
    description: 'Nous garantissons des résultats impeccables avec des produits respectueux de l\'environnement.'
  },
  {
    icon: Heart,
    title: 'Satisfaction Client',
    description: 'Votre satisfaction est notre priorité. Nous nous engageons à dépasser vos attentes.'
  },
  {
    icon: Target,
    title: 'Excellence',
    description: 'Notre équipe formée utilise les meilleures techniques et équipements du marché.'
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    description: 'Nous adoptons les dernières technologies pour un nettoyage optimal et durable.'
  }
];

const team = [
  {
    name: 'Jean Dupont',
    role: 'Directeur Général',
    experience: '15 ans d\'expérience',
    description: 'Expert en gestion d\'entreprise et développement commercial.'
  },
  {
    name: 'Marie Martin',
    role: 'Responsable Qualité',
    experience: '12 ans d\'expérience',
    description: 'Spécialiste en normes de qualité et formation des équipes.'
  },
  {
    name: 'Pierre Durand',
    role: 'Responsable Technique',
    experience: '10 ans d\'expérience',
    description: 'Expert en techniques de nettoyage et équipements professionnels.'
  },
  {
    name: 'Sophie Bernard',
    role: 'Responsable Client',
    experience: '8 ans d\'expérience',
    description: 'Dédiée à la satisfaction client et au suivi des projets.'
  }
];

const milestones = [
  {
    year: '2013',
    title: 'Création de GlobalNet Services',
    description: 'Lancement de l\'entreprise avec une vision claire : proposer des services de nettoyage professionnel de qualité.'
  },
  {
    year: '2015',
    title: 'Première Certification',
    description: 'Obtention de la certification ISO 9001 pour la qualité de nos services.'
  },
  {
    year: '2018',
    title: 'Expansion Régionale',
    description: 'Développement de nos services sur toute la région avec 50 nouveaux clients.'
  },
  {
    year: '2020',
    title: 'Innovation Technologique',
    description: 'Investissement dans des équipements de pointe et formation des équipes.'
  },
  {
    year: '2023',
    title: 'Leader du Secteur',
    description: 'Reconnaissance comme leader du nettoyage professionnel avec 500+ clients satisfaits.'
  }
];

export default function AboutPage() {
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
              À Propos de GlobalNet Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Plus de 10 ans d'expertise au service de votre satisfaction
            </p>
          </motion.div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Notre Histoire
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Fondée en 2013, GlobalNet Services est née de la vision d'offrir des services de nettoyage professionnel 
                de qualité supérieure. Notre mission est de créer des environnements sains et agréables pour nos clients 
                tout en respectant l'environnement.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Depuis plus de 10 ans, nous avons développé une expertise reconnue dans tous les secteurs : bureaux, 
                industrie, résidentiel et commercial. Notre équipe formée et expérimentée utilise les meilleures 
                techniques et équipements pour garantir des résultats impeccables.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-2" />
                  <span className="text-gray-700">500+ clients satisfaits</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-primary mr-2" />
                  <span className="text-gray-700">5 certifications</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Nos Chiffres Clés
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Années d\'expérience', value: '10+' },
                  { label: 'Clients satisfaits', value: '500+' },
                  { label: 'Employés qualifiés', value: '25+' },
                  { label: 'Note moyenne', value: '4.8/5' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Les principes qui guident nos actions au quotidien
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Équipe */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Notre Équipe
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des professionnels expérimentés dédiés à votre satisfaction
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 text-center"
              >
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-600 mb-3">{member.experience}</p>
                <p className="text-sm text-gray-600">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Parcours */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Notre Parcours
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Les étapes importantes de notre développement
            </p>
          </motion.div>

          <div className="relative">
            {/* Ligne de temps */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-primary-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="text-2xl font-bold text-primary mb-2">{milestone.year}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
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
              Faites Confiance à Notre Expertise
            </h2>
            <p className="text-xl mb-8">
              Rejoignez nos 500+ clients satisfaits et découvrez la différence GlobalNet Services
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