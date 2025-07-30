'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react';

import { APP_CONFIG } from '@/utils/constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: 'Nettoyage de Bureaux', href: '/services#bureaux' },
      { name: 'Nettoyage Industriel', href: '/services#industriel' },
      { name: 'Nettoyage Résidentiel', href: '/services#residentiel' },
      { name: 'Nettoyage Commercial', href: '/services#commercial' },
    ],
    company: [
      { name: 'À Propos', href: '/about' },
      { name: 'Notre Équipe', href: '/about#equipe' },
      { name: 'Nos Valeurs', href: '/about#valeurs' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Mentions Légales', href: '/legal' },
      { name: 'CGV', href: '/legal#cgv' },
      { name: 'Confidentialité', href: '/legal#privacy' },
      { name: 'Cookies', href: '/legal#cookies' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/globalnet-services' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/globalnet_services' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/globalnet-services' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/globalnet_services' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Informations de Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <h3 className="text-lg font-semibold mb-4">GlobalNet Services</h3>
            <p className="text-gray-300 mb-6">
              Leader du nettoyage professionnel depuis plus de 10 ans. 
              Qualité, fiabilité et satisfaction client garanties.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-primary" />
                <span className="text-gray-300">{APP_CONFIG.contact.telephone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-primary" />
                <span className="text-gray-300">{APP_CONFIG.contact.email}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-3 text-primary" />
                <span className="text-gray-300">{APP_CONFIG.contact.adresse}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-3 text-primary" />
                <span className="text-gray-300">Lun-Ven: 8h-18h</span>
              </div>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4">Nos Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Entreprise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Légal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Réseaux Sociaux et Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex space-x-4 mb-4 md:mb-0"
            >
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-gray-400 text-sm"
            >
              © {currentYear} GlobalNet Services. Tous droits réservés.
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 