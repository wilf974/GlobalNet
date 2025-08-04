'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface PerformanceMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  fcp: number | null;
  memory: number | null;
  cpu: number | null;
}

interface PerformanceMonitorProps {
  showDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  showDetails = true,
  autoRefresh = true,
  refreshInterval = 5000
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fcp: null,
    memory: null,
    cpu: null
  });
  const [isVisible, setIsVisible] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const getPerformanceScore = useCallback((metric: number, threshold: number): 'good' | 'needs-improvement' | 'poor' => {
    if (metric <= threshold) return 'good';
    if (metric <= threshold * 1.5) return 'needs-improvement';
    return 'poor';
  }, []);

  const getScoreColor = useCallback((score: 'good' | 'needs-improvement' | 'poor'): string => {
    switch (score) {
      case 'good': return 'text-green-500';
      case 'needs-improvement': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  }, []);

  const getScoreIcon = useCallback((score: 'good' | 'needs-improvement' | 'poor') => {
    switch (score) {
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'needs-improvement': return <AlertTriangle className="w-4 h-4" />;
      case 'poor': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  }, []);

  const measurePerformance = useCallback(() => {
    if (typeof window === 'undefined') return;

    const newMetrics: PerformanceMetrics = { ...metrics };

    // Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP (Largest Contentful Paint)
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            newMetrics.lcp = lastEntry.startTime;
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('LCP measurement not supported');
      }

      // FID (First Input Delay)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'first-input') {
              newMetrics.fid = entry.processingStart - entry.startTime;
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('FID measurement not supported');
      }

      // CLS (Cumulative Layout Shift)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          newMetrics.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('CLS measurement not supported');
      }
    }

    // TTFB (Time to First Byte)
    if (performance.getEntriesByType('navigation').length > 0) {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      newMetrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
    }

    // FCP (First Contentful Paint)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0];
        if (firstEntry) {
          newMetrics.fcp = firstEntry.startTime;
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
    } catch (error) {
      console.warn('FCP measurement not supported');
    }

    // Memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      newMetrics.memory = memory.usedJSHeapSize / 1024 / 1024; // MB
    }

    setMetrics(newMetrics);
    setLastUpdate(new Date());
  }, [metrics]);

  useEffect(() => {
    // Initial measurement
    measurePerformance();

    // Auto-refresh if enabled
    if (autoRefresh) {
      const interval = setInterval(measurePerformance, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [measurePerformance, autoRefresh, refreshInterval]);

  useEffect(() => {
    // Show monitor after initial load
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatMetric = (value: number | null, unit: string = ''): string => {
    if (value === null) return 'N/A';
    return `${value.toFixed(2)}${unit}`;
  };

  const getOverallScore = (): 'good' | 'needs-improvement' | 'poor' => {
    const scores = [];
    if (metrics.lcp !== null) scores.push(getPerformanceScore(metrics.lcp || 0, 2500));
    if (metrics.fid !== null) scores.push(getPerformanceScore(metrics.fid || 0, 100));
    if (metrics.cls !== null) scores.push(getPerformanceScore(metrics.cls || 0, 0.1));
    
    const goodCount = scores.filter(s => s === 'good').length;
    const poorCount = scores.filter(s => s === 'poor').length;
    
    if (poorCount > 0) return 'poor';
    if (goodCount >= scores.length * 0.8) return 'good';
    return 'needs-improvement';
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50 max-w-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Performance</h3>
        </div>
        <div className={`flex items-center space-x-1 ${getScoreColor(getOverallScore())}`}>
          {getScoreIcon(getOverallScore())}
        </div>
      </div>

      <div className="space-y-2">
        {/* Core Web Vitals */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">LCP:</span>
            <span className={`font-mono ${getScoreColor(getPerformanceScore(metrics.lcp || 0, 2500))}`}>
              {formatMetric(metrics.lcp, 'ms')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">FID:</span>
            <span className={`font-mono ${getScoreColor(getPerformanceScore(metrics.fid || 0, 100))}`}>
              {formatMetric(metrics.fid, 'ms')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">CLS:</span>
            <span className={`font-mono ${getScoreColor(getPerformanceScore(metrics.cls || 0, 0.1))}`}>
              {formatMetric(metrics.cls)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">TTFB:</span>
            <span className="font-mono text-gray-900 dark:text-white">
              {formatMetric(metrics.ttfb, 'ms')}
            </span>
          </div>
        </div>

        {showDetails && (
          <>
            {/* Additional metrics */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">FCP:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {formatMetric(metrics.fcp, 'ms')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Memory:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {formatMetric(metrics.memory, 'MB')}
                  </span>
                </div>
              </div>
            </div>

            {/* Last update */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Dernière mise à jour:</span>
                <span>{lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Refresh button */}
      <button
        onClick={measurePerformance}
        className="mt-3 w-full px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Actualiser
      </button>
    </motion.div>
  );
};

export default PerformanceMonitor; 