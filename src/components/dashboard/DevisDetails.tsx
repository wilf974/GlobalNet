'use client';

import React from 'react';
import { Calendar, Phone, Mail, MapPin, FileText, Euro } from 'lucide-react';
import { Devis } from '@/types/devis';

interface DevisDetailsProps {
  devis: Devis;
}

const DevisDetails: React.FC<DevisDetailsProps> = ({ devis }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Validé':
        return 'bg-green-100 text-green-800';
      case 'Terminé':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{devis.client}</h2>
            <p className="text-gray-600 mt-1">{devis.service}</p>
          </div>
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(devis.statut)}`}>
            {devis.statut}
          </span>
        </div>
      </div>

      {/* Informations client */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Informations Client</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{devis.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Téléphone</p>
                <p className="text-sm text-gray-600">{devis.telephone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Détails du Service</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Superficie</p>
                <p className="text-sm text-gray-600">{devis.superficie} m²</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Euro className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Prix</p>
                <p className="text-sm text-gray-600">{devis.prix.toLocaleString()}€</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Date de création</p>
              <p className="text-sm text-gray-600">{formatDate(devis.dateCreation)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Date d'intervention</p>
              <p className="text-sm text-gray-600">{formatDate(devis.dateIntervention)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-end space-x-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Modifier
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-600 transition-colors">
            Télécharger PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevisDetails; 