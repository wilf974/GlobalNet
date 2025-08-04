import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  PieChart,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { usePushNotifications } from '../../hooks/usePushNotifications';

interface AnalyticsData {
  totalDevis: number;
  approvedDevis: number;
  rejectedDevis: number;
  pendingDevis: number;
  totalRevenue: number;
  averageDevisValue: number;
  conversionRate: number;
  monthlyGrowth: number;
  topServices: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
  workflowStats: {
    total: number;
    active: number;
    completed: number;
    averageTime: number;
  };
  notificationStats: {
    total: number;
    unread: number;
    byType: {
      info: number;
      success: number;
      warning: number;
      error: number;
    };
  };
}

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

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }>;
}

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalDevis: 0,
    approvedDevis: 0,
    rejectedDevis: 0,
    pendingDevis: 0,
    totalRevenue: 0,
    averageDevisValue: 0,
    conversionRate: 0,
    monthlyGrowth: 0,
    topServices: [],
    workflowStats: {
      total: 0,
      active: 0,
      completed: 0,
      averageTime: 0
    },
    notificationStats: {
      total: 0,
      unread: 0,
      byType: {
        info: 0,
        success: 0,
        warning: 0,
        error: 0
      }
    }
  });

  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(true);

  // Simuler le chargement des données
  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Données simulées
      const mockData: AnalyticsData = {
        totalDevis: 156,
        approvedDevis: 89,
        rejectedDevis: 23,
        pendingDevis: 44,
        totalRevenue: 125000,
        averageDevisValue: 801,
        conversionRate: 57.1,
        monthlyGrowth: 12.5,
        topServices: [
          { name: 'Nettoyage Bureaux', count: 45, revenue: 36000 },
          { name: 'Nettoyage Industriel', count: 32, revenue: 28000 },
          { name: 'Nettoyage Résidentiel', count: 28, revenue: 22000 },
          { name: 'Désinfection', count: 25, revenue: 20000 },
          { name: 'Nettoyage Vitres', count: 18, revenue: 15000 }
        ],
        workflowStats: {
          total: 156,
          active: 44,
          completed: 112,
          averageTime: 2.3
        },
        notificationStats: {
          total: 234,
          unread: 12,
          byType: {
            info: 89,
            success: 67,
            warning: 45,
            error: 33
          }
        }
      };

      setAnalyticsData(mockData);
      setLoading(false);
    };

    loadAnalyticsData();
  }, [selectedPeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatTime = (hours: number) => {
    return `${hours.toFixed(1)}h`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Vue d'ensemble de vos performances</p>
        </div>
        
        {/* Sélecteur de période */}
        <div className="flex space-x-2">
          {(['7d', '30d', '90d', '1y'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period === '7d' ? '7 jours' :
               period === '30d' ? '30 jours' :
               period === '90d' ? '90 jours' : '1 an'}
            </button>
          ))}
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Devis"
          value={analyticsData.totalDevis}
          change={analyticsData.monthlyGrowth}
          icon={<BarChart3 className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          trend="up"
        />
        
        <MetricCard
          title="Revenus Totaux"
          value={formatCurrency(analyticsData.totalRevenue)}
          change={8.2}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-green-500"
          trend="up"
        />
        
        <MetricCard
          title="Taux de Conversion"
          value={formatPercentage(analyticsData.conversionRate)}
          change={-2.1}
          icon={<Target className="w-6 h-6 text-white" />}
          color="bg-purple-500"
          trend="down"
        />
        
        <MetricCard
          title="Valeur Moyenne"
          value={formatCurrency(analyticsData.averageDevisValue)}
          change={5.7}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-orange-500"
          trend="up"
        />
      </div>

      {/* Graphiques et statistiques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services les plus populaires */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Services les Plus Populaires
          </h3>
          <div className="space-y-4">
            {analyticsData.topServices.map((service, index) => (
              <div key={service.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' :
                    index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-700">
                    {service.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {service.count} devis
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatCurrency(service.revenue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Statistiques des workflows */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Statistiques Workflow
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analyticsData.workflowStats.total}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {analyticsData.workflowStats.active}
              </div>
              <div className="text-sm text-gray-600">Actifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {analyticsData.workflowStats.completed}
              </div>
              <div className="text-sm text-gray-600">Terminés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatTime(analyticsData.workflowStats.averageTime)}
              </div>
              <div className="text-sm text-gray-600">Temps Moyen</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Graphique de répartition des devis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Répartition des Devis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray={`${(analyticsData.approvedDevis / analyticsData.totalDevis) * 100}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">
                  {formatPercentage(analyticsData.approvedDevis / analyticsData.totalDevis * 100)}
                </span>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">Approuvés</div>
            <div className="text-xs text-gray-500">{analyticsData.approvedDevis} devis</div>
          </div>

          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray={`${(analyticsData.pendingDevis / analyticsData.totalDevis) * 100}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">
                  {formatPercentage(analyticsData.pendingDevis / analyticsData.totalDevis * 100)}
                </span>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">En Attente</div>
            <div className="text-xs text-gray-500">{analyticsData.pendingDevis} devis</div>
          </div>

          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray={`${(analyticsData.rejectedDevis / analyticsData.totalDevis) * 100}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">
                  {formatPercentage(analyticsData.rejectedDevis / analyticsData.totalDevis * 100)}
                </span>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">Rejetés</div>
            <div className="text-xs text-gray-500">{analyticsData.rejectedDevis} devis</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard; 