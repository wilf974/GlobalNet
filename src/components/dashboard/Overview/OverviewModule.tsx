'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  FileText,
  Eye,
  Calendar,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useDashboard } from '../../../hooks/useDashboard';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  trend 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change !== undefined && (
          <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            ) : trend === 'down' ? (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            ) : null}
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

export const OverviewModule: React.FC = () => {
  const { stats } = useDashboard();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const metrics = [
    {
      title: 'Devis Total',
      value: formatNumber(stats.totalDevis),
      change: 12,
      icon: <FileText className="w-6 h-6 text-white" />,
      color: 'bg-blue-500',
      trend: 'up' as const
    },
    {
      title: 'Chiffre d\'Affaires',
      value: formatCurrency(stats.totalRevenue),
      change: 8.5,
      icon: <DollarSign className="w-6 h-6 text-white" />,
      color: 'bg-green-500',
      trend: 'up' as const
    },
    {
      title: 'Taux de Conversion',
      value: `${stats.conversionRate}%`,
      change: 2.1,
      icon: <Target className="w-6 h-6 text-white" />,
      color: 'bg-purple-500',
      trend: 'up' as const
    },
    {
      title: 'Clients Actifs',
      value: formatNumber(stats.activeClients),
      change: 5.3,
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-orange-500',
      trend: 'up' as const
    },
    {
      title: 'Vues Mensuelles',
      value: formatNumber(stats.monthlyViews),
      change: -1.2,
      icon: <Eye className="w-6 h-6 text-white" />,
      color: 'bg-indigo-500',
      trend: 'down' as const
    },
    {
      title: 'Performance',
      value: `${stats.performanceScore}/100`,
      change: 3.7,
      icon: <Activity className="w-6 h-6 text-white" />,
      color: 'bg-teal-500',
      trend: 'up' as const
    },
    {
      title: 'Devis Moyen',
      value: formatCurrency(stats.averageDevisValue),
      change: 4.2,
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      color: 'bg-pink-500',
      trend: 'up' as const
    },
    {
      title: 'Contenu Publié',
      value: formatNumber(stats.publishedContent),
      change: 15.8,
      icon: <Calendar className="w-6 h-6 text-white" />,
      color: 'bg-yellow-500',
      trend: 'up' as const
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'devis',
      title: 'Nouveau devis créé',
      description: 'Devis pour nettoyage bureaux - 2 500€',
      time: 'Il y a 2 heures',
      status: 'pending'
    },
    {
      id: 2,
      type: 'client',
      title: 'Nouveau client ajouté',
      description: 'Entreprise ABC - Contact: contact@abc.com',
      time: 'Il y a 4 heures',
      status: 'active'
    },
    {
      id: 3,
      type: 'devis',
      title: 'Devis approuvé',
      description: 'Nettoyage résidentiel - 1 800€',
      time: 'Il y a 6 heures',
      status: 'approved'
    },
    {
      id: 4,
      type: 'content',
      title: 'Page mise à jour',
      description: 'Page Services - Ajout nouveau service',
      time: 'Il y a 1 jour',
      status: 'published'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'devis':
        return <FileText className="w-4 h-4" />;
      case 'client':
        return <Users className="w-4 h-4" />;
      case 'content':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'active':
        return 'text-blue-600 bg-blue-100';
      case 'published':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Métriques principales */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Vue d'ensemble</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              icon={metric.icon}
              color={metric.color}
              trend={metric.trend}
            />
          ))}
        </div>
      </div>

      {/* Graphiques et statistiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Évolution du CA */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Évolution du CA</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            <p className="text-gray-500">Graphique d'évolution du CA</p>
          </div>
        </div>

        {/* Répartition des devis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Statut des Devis</h3>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Approuvés</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {stats.approvedDevis} ({((stats.approvedDevis / stats.totalDevis) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">En attente</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {stats.pendingDevis} ({((stats.pendingDevis / stats.totalDevis) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Rejetés</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {stats.rejectedDevis} ({((stats.rejectedDevis / stats.totalDevis) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Activité Récente</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Voir tout
          </button>
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
            >
              <div className={`p-2 rounded-full ${getActivityColor(activity.status)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Objectifs et KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">Objectif CA Mensuel</h4>
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Objectif</span>
              <span className="text-sm font-medium text-gray-900">25 000€</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Atteint</span>
              <span className="text-sm font-medium text-green-600">
                {formatCurrency(stats.monthlyRevenue)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${Math.min((stats.monthlyRevenue / 25000) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              {((stats.monthlyRevenue / 25000) * 100).toFixed(1)}% de l'objectif
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">Performance Site</h4>
            <Activity className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Score</span>
              <span className="text-sm font-medium text-gray-900">{stats.performanceScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${stats.performanceScore}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              {stats.performanceScore >= 90 ? 'Excellent' : 
               stats.performanceScore >= 70 ? 'Bon' : 
               stats.performanceScore >= 50 ? 'Moyen' : 'À améliorer'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">Engagement</h4>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Vues</span>
              <span className="text-sm font-medium text-gray-900">{formatNumber(stats.monthlyViews)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conversion</span>
              <span className="text-sm font-medium text-green-600">{stats.conversionRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Clients actifs</span>
              <span className="text-sm font-medium text-blue-600">{stats.activeClients}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 