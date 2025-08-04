'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Eye, 
  Users, 
  Activity,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useDashboard } from '../../../hooks/useDashboard';

export const AnalyticsModule: React.FC = () => {
  const { analyticsData } = useDashboard();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const metrics = [
    {
      title: 'Vues Totales',
      value: formatNumber(analyticsData.overview.totalViews),
      change: 12.5,
      icon: <Eye className="w-6 h-6 text-white" />,
      color: 'bg-blue-500',
      trend: 'up' as const
    },
    {
      title: 'Visiteurs Uniques',
      value: formatNumber(analyticsData.overview.uniqueVisitors),
      change: 8.3,
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-green-500',
      trend: 'up' as const
    },
    {
      title: 'Pages Vues',
      value: formatNumber(analyticsData.overview.pageViews),
      change: 15.2,
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      color: 'bg-purple-500',
      trend: 'up' as const
    },
    {
      title: 'Taux de Rebond',
      value: formatPercentage(analyticsData.overview.bounceRate),
      change: -2.1,
      icon: <Activity className="w-6 h-6 text-white" />,
      color: 'bg-orange-500',
      trend: 'down' as const
    },
    {
      title: 'Durée Session',
      value: `${Math.floor(analyticsData.overview.averageSessionDuration / 60)}:${(analyticsData.overview.averageSessionDuration % 60).toString().padStart(2, '0')}`,
      change: 5.7,
      icon: <Calendar className="w-6 h-6 text-white" />,
      color: 'bg-indigo-500',
      trend: 'up' as const
    },
    {
      title: 'Taux Conversion',
      value: formatPercentage(analyticsData.overview.conversionRate),
      change: 3.2,
      icon: <Target className="w-6 h-6 text-white" />,
      color: 'bg-teal-500',
      trend: 'up' as const
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics & Performance</h2>
        <div className="flex items-center space-x-4">
          <select className="border border-gray-300 rounded-md px-3 py-2">
            <option>7 derniers jours</option>
            <option>30 derniers jours</option>
            <option>3 derniers mois</option>
            <option>Année en cours</option>
          </select>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <div className="flex items-center mt-2">
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${metric.color}`}>
                {metric.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Graphiques et analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Évolution du trafic */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Évolution du Trafic</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            <p className="text-gray-500">Graphique d'évolution du trafic</p>
          </div>
        </div>

        {/* Sources de trafic */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Sources de Trafic</h3>
            <PieChart className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Recherche organique</span>
              </div>
              <span className="text-sm font-medium text-gray-900">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Réseaux sociaux</span>
              </div>
              <span className="text-sm font-medium text-gray-900">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Trafic direct</span>
              </div>
              <span className="text-sm font-medium text-gray-900">15%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Autres</span>
              </div>
              <span className="text-sm font-medium text-gray-900">10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance et recommandations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Core Web Vitals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Core Web Vitals</h3>
            <Activity className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">LCP (Largest Contentful Paint)</span>
                <span className="text-sm font-medium text-green-600">1.2s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">FID (First Input Delay)</span>
                <span className="text-sm font-medium text-green-600">45ms</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">CLS (Cumulative Layout Shift)</span>
                <span className="text-sm font-medium text-green-600">0.05</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pages les plus populaires */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Pages les Plus Populaires</h3>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-4">
            {analyticsData.overview.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{page.url}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatNumber(page.views)} vues</p>
                  <p className="text-xs text-gray-500">{page.conversions} conversions</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Funnel de conversion */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Funnel de Conversion</h3>
          <Target className="w-5 h-5 text-purple-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Visiteurs</p>
            <p className="text-2xl font-bold text-blue-600">{formatNumber(analyticsData.overview.totalViews)}</p>
            <p className="text-xs text-gray-500">100%</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Engagés</p>
            <p className="text-2xl font-bold text-green-600">{formatNumber(analyticsData.overview.uniqueVisitors)}</p>
            <p className="text-xs text-gray-500">65%</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Pages Vues</p>
            <p className="text-2xl font-bold text-purple-600">{formatNumber(analyticsData.overview.pageViews)}</p>
            <p className="text-xs text-gray-500">45%</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Target className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Conversions</p>
            <p className="text-2xl font-bold text-orange-600">{formatNumber(analyticsData.conversions.totalConversions)}</p>
            <p className="text-xs text-gray-500">3.2%</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 