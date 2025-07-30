'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformance, useResourceTiming, useErrorMonitoring } from '@/hooks/usePerformance';
import { AlertTriangle, CheckCircle, Clock, Zap, Activity } from 'lucide-react';

interface PerformanceMonitorProps {
  showDetails?: boolean;
  className?: string;
  onMetricsChange?: (metrics: any) => void;
}

/**
 * Composant pour afficher les métriques de performance en temps réel
 * 
 * @example
 * ```tsx
 * <PerformanceMonitor 
 *   showDetails={true}
 *   onMetricsChange={(metrics) => console.log(metrics)}
 * />
 * ```
 */
const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  showDetails = false,
  className = '',
  onMetricsChange,
}) => {
  const { metrics, isSupported, evaluatePerformance } = usePerformance();
  const resourceMetrics = useResourceTiming();
  const errors = useErrorMonitoring();
  const [isExpanded, setIsExpanded] = useState(false);

  // Évaluer les performances
  const evaluation = evaluatePerformance();

  // Notifier les changements de métriques
  React.useEffect(() => {
    if (onMetricsChange) {
      onMetricsChange({
        metrics,
        evaluation,
        resourceMetrics,
        errors,
      });
    }
  }, [metrics, evaluation, resourceMetrics, errors, onMetricsChange]);

  if (!isSupported) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMetricStatus = (value: number | null, thresholds: { good: number; poor: number }) => {
    if (!value) return 'unknown';
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.poor) return 'needs-improvement';
    return 'poor';
  };

  const MetricCard: React.FC<{
    title: string;
    value: number | null;
    unit: string;
    thresholds: { good: number; poor: number };
    icon: React.ReactNode;
  }> = ({ title, value, unit, thresholds, icon }) => {
    const status = getMetricStatus(value, thresholds);
    const statusColors = {
      good: 'text-green-500 bg-green-50',
      'needs-improvement': 'text-yellow-500 bg-yellow-50',
      poor: 'text-red-500 bg-red-50',
      unknown: 'text-gray-500 bg-gray-50',
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg border ${statusColors[status]} ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <span className="font-medium text-sm">{title}</span>
          </div>
          <span className="text-lg font-bold">
            {value ? `${Math.round(value)}${unit}` : 'N/A'}
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-lg border p-4 w-80 max-h-96 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Performance Monitor</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {/* Score global */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Score Global</span>
                <span className={`text-2xl font-bold ${getScoreColor(evaluation.score)}`}>
                  {evaluation.score}/100
                </span>
              </div>
            </div>

            {/* Métriques Core Web Vitals */}
            <div className="space-y-3 mb-4">
              <MetricCard
                title="LCP"
                value={metrics.lcp}
                unit="ms"
                thresholds={{ good: 2500, poor: 4000 }}
                icon={<Clock className="w-4 h-4" />}
              />
              <MetricCard
                title="FID"
                value={metrics.fid}
                unit="ms"
                thresholds={{ good: 100, poor: 300 }}
                icon={<Zap className="w-4 h-4" />}
              />
              <MetricCard
                title="CLS"
                value={metrics.cls}
                unit=""
                thresholds={{ good: 0.1, poor: 0.25 }}
                icon={<Activity className="w-4 h-4" />}
              />
              <MetricCard
                title="TTFB"
                value={metrics.ttfb}
                unit="ms"
                thresholds={{ good: 600, poor: 1800 }}
                icon={<Clock className="w-4 h-4" />}
              />
            </div>

            {/* Détails des ressources */}
            {showDetails && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Ressources</h4>
                <div className="text-sm space-y-1">
                  <div>Total: {(resourceMetrics.totalSize / 1024 / 1024).toFixed(2)} MB</div>
                  <div>Nombre: {resourceMetrics.resourceCount}</div>
                  {resourceMetrics.slowResources.length > 0 && (
                    <div>
                      <div className="font-medium mt-2">Ressources lentes:</div>
                      {resourceMetrics.slowResources.slice(0, 3).map((resource, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          {resource.name.split('/').pop()} - {Math.round(resource.duration)}ms
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Erreurs */}
            {errors.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2 text-red-600">Erreurs ({errors.length})</h4>
                <div className="text-sm space-y-1">
                  {errors.slice(0, 3).map((error, index) => (
                    <div key={index} className="text-xs text-red-600">
                      {error.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommandations */}
            {evaluation.recommendations.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Recommandations</h4>
                <div className="text-sm space-y-1">
                  {evaluation.recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="text-xs text-blue-600">
                      • {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton flottant */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`p-3 rounded-full shadow-lg border ${
          evaluation.score >= 80
            ? 'bg-green-500 text-white'
            : evaluation.score >= 60
            ? 'bg-yellow-500 text-white'
            : 'bg-red-500 text-white'
        }`}
      >
        {evaluation.score >= 80 ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <AlertTriangle className="w-5 h-5" />
        )}
      </motion.button>
    </div>
  );
};

/**
 * Hook pour utiliser le monitor de performance
 */
export const usePerformanceMonitor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);

  const PerformanceMonitorComponent = React.useCallback(() => (
    <PerformanceMonitor
      showDetails={true}
      onMetricsChange={setMetrics}
    />
  ), []);

  return {
    isVisible,
    setIsVisible,
    metrics,
    PerformanceMonitorComponent,
  };
};

export default PerformanceMonitor; 