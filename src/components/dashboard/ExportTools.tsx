'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, BarChart3, Calendar, Filter, Settings } from 'lucide-react';
import { Devis } from '@/types/devis';

interface ExportToolsProps {
  devis: Devis[];
  onExport: (type: 'pdf' | 'excel' | 'csv', filters?: any) => void;
}

const ExportTools: React.FC<ExportToolsProps> = ({ devis, onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [statusFilter, setStatusFilter] = useState('all');

  const handleExport = () => {
    const filters = {
      dateRange,
      status: statusFilter !== 'all' ? statusFilter : undefined
    };
    onExport(selectedFormat, filters);
    setIsOpen(false);
  };

  const getExportStats = () => {
    const total = devis.length;
    const pending = devis.filter(d => d.statut === 'En attente').length;
    const validated = devis.filter(d => d.statut === 'Validé').length;
    const completed = devis.filter(d => d.statut === 'Terminé').length;
    const totalRevenue = devis.reduce((sum, d) => sum + d.prix, 0);

    return { total, pending, validated, completed, totalRevenue };
  };

  const stats = getExportStats();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Download className="w-4 h-4" />
        <span>Exporter</span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Outils d'Export</h3>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Total</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">CA Total</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{stats.totalRevenue.toLocaleString()}€</p>
              </div>
            </div>

            {/* Format d'export */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format d'export
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'pdf', label: 'PDF', icon: FileText },
                  { value: 'excel', label: 'Excel', icon: BarChart3 },
                  { value: 'csv', label: 'CSV', icon: Settings }
                ].map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setSelectedFormat(format.value as any)}
                    className={`p-3 rounded-lg border transition-colors ${
                      selectedFormat === format.value
                        ? 'border-primary bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <format.icon className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs font-medium">{format.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filtres */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Période
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="En attente">En attente</option>
                  <option value="Validé">Validé</option>
                  <option value="Terminé">Terminé</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={handleExport}
                className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Exporter</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ExportTools; 