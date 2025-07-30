import { useEffect, useState, useCallback } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  fmp: number | null;
}

interface PerformanceObserver {
  observe: (entry: any) => void;
  disconnect: () => void;
}

/**
 * Hook pour le monitoring des performances et Core Web Vitals
 * 
 * @example
 * ```tsx
 * const { metrics, isSupported } = usePerformance();
 * 
 * useEffect(() => {
 *   if (metrics.lcp && metrics.lcp > 2500) {
 *     console.warn('LCP trop élevé:', metrics.lcp);
 *   }
 * }, [metrics]);
 * ```
 */
export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fmp: null,
  });
  const [isSupported, setIsSupported] = useState(false);

  // Vérifier si Performance Observer est supporté
  useEffect(() => {
    setIsSupported(
      typeof window !== 'undefined' &&
      'PerformanceObserver' in window &&
      'PerformanceEntry' in window
    );
  }, []);

  // Observer pour First Contentful Paint (FCP)
  const observeFCP = useCallback(() => {
    if (!isSupported) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
        observer.disconnect();
      }
    });

    observer.observe({ entryTypes: ['paint'] });
  }, [isSupported]);

  // Observer pour Largest Contentful Paint (LCP)
  const observeLCP = useCallback(() => {
    if (!isSupported) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (lastEntry) {
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }, [isSupported]);

  // Observer pour First Input Delay (FID)
  const observeFID = useCallback(() => {
    if (!isSupported) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fidEntry = entries[0] as PerformanceEventTiming;
      
      if (fidEntry && 'processingStart' in fidEntry) {
        setMetrics(prev => ({ ...prev, fid: fidEntry.processingStart - fidEntry.startTime }));
        observer.disconnect();
      }
    });

    observer.observe({ entryTypes: ['first-input'] });
  }, [isSupported]);

  // Observer pour Cumulative Layout Shift (CLS)
  const observeCLS = useCallback(() => {
    if (!isSupported) return;

    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      for (const entry of entries) {
        const layoutShiftEntry = entry as LayoutShift;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
        }
      }
      
      setMetrics(prev => ({ ...prev, cls: clsValue }));
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  }, [isSupported]);

  // Observer pour Time to First Byte (TTFB)
  const observeTTFB = useCallback(() => {
    if (!isSupported) return;

    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigationEntry) {
      setMetrics(prev => ({ ...prev, ttfb: navigationEntry.responseStart - navigationEntry.requestStart }));
    }
  }, [isSupported]);

  // Observer pour First Meaningful Paint (FMP)
  const observeFMP = useCallback(() => {
    if (!isSupported) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fmpEntry = entries.find((entry) => entry.name === 'first-meaningful-paint');
      
      if (fmpEntry) {
        setMetrics(prev => ({ ...prev, fmp: fmpEntry.startTime }));
        observer.disconnect();
      }
    });

    observer.observe({ entryTypes: ['paint'] });
  }, [isSupported]);

  // Démarrer tous les observers
  useEffect(() => {
    if (!isSupported) return;

    observeFCP();
    observeLCP();
    observeFID();
    observeCLS();
    observeTTFB();
    observeFMP();

    // Cleanup
    return () => {
      // Les observers se déconnectent automatiquement après la première entrée
    };
  }, [isSupported, observeFCP, observeLCP, observeFID, observeCLS, observeTTFB, observeFMP]);

  // Fonction pour obtenir les métriques actuelles
  const getCurrentMetrics = useCallback(() => {
    return metrics;
  }, [metrics]);

  // Fonction pour évaluer les performances
  const evaluatePerformance = useCallback(() => {
    const evaluation = {
      score: 0,
      issues: [] as string[],
      recommendations: [] as string[],
    };

    // Évaluation LCP
    if (metrics.lcp) {
      if (metrics.lcp <= 2500) {
        evaluation.score += 25;
      } else if (metrics.lcp <= 4000) {
        evaluation.score += 15;
        evaluation.issues.push('LCP trop élevé');
        evaluation.recommendations.push('Optimiser le chargement des images principales');
      } else {
        evaluation.issues.push('LCP très élevé');
        evaluation.recommendations.push('Réduire drastiquement le temps de chargement');
      }
    }

    // Évaluation FID
    if (metrics.fid) {
      if (metrics.fid <= 100) {
        evaluation.score += 25;
      } else if (metrics.fid <= 300) {
        evaluation.score += 15;
        evaluation.issues.push('FID trop élevé');
        evaluation.recommendations.push('Réduire le JavaScript bloquant');
      } else {
        evaluation.issues.push('FID très élevé');
        evaluation.recommendations.push('Optimiser l\'exécution JavaScript');
      }
    }

    // Évaluation CLS
    if (metrics.cls) {
      if (metrics.cls <= 0.1) {
        evaluation.score += 25;
      } else if (metrics.cls <= 0.25) {
        evaluation.score += 15;
        evaluation.issues.push('CLS trop élevé');
        evaluation.recommendations.push('Éviter les décalages de mise en page');
      } else {
        evaluation.issues.push('CLS très élevé');
        evaluation.recommendations.push('Stabiliser la mise en page');
      }
    }

    // Évaluation TTFB
    if (metrics.ttfb) {
      if (metrics.ttfb <= 600) {
        evaluation.score += 25;
      } else if (metrics.ttfb <= 1800) {
        evaluation.score += 15;
        evaluation.issues.push('TTFB trop élevé');
        evaluation.recommendations.push('Optimiser le serveur et le réseau');
      } else {
        evaluation.issues.push('TTFB très élevé');
        evaluation.recommendations.push('Améliorer les performances du serveur');
      }
    }

    return evaluation;
  }, [metrics]);

  return {
    metrics,
    isSupported,
    getCurrentMetrics,
    evaluatePerformance,
  };
};

/**
 * Hook pour le monitoring des ressources
 */
export const useResourceTiming = () => {
  const [resourceMetrics, setResourceMetrics] = useState<{
    slowResources: Array<{ name: string; duration: number }>;
    totalSize: number;
    resourceCount: number;
  }>({
    slowResources: [],
    totalSize: 0,
    resourceCount: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const analyzeResources = () => {
      const resources = performance.getEntriesByType('resource');
      const slowResources = resources
        .filter((resource) => resource.duration > 1000)
        .map((resource) => ({
          name: resource.name,
          duration: resource.duration,
        }))
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 10);

      const totalSize = resources.reduce((sum, resource) => {
        const transferSize = (resource as any).transferSize || 0;
        return sum + transferSize;
      }, 0);

      setResourceMetrics({
        slowResources,
        totalSize,
        resourceCount: resources.length,
      });
    };

    // Analyser après le chargement complet
    if (document.readyState === 'complete') {
      analyzeResources();
    } else {
      window.addEventListener('load', analyzeResources);
      return () => window.removeEventListener('load', analyzeResources);
    }
  }, []);

  return resourceMetrics;
};

/**
 * Hook pour le monitoring des erreurs JavaScript
 */
export const useErrorMonitoring = () => {
  const [errors, setErrors] = useState<Array<{ message: string; stack?: string; timestamp: number }>>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleError = (event: ErrorEvent) => {
      setErrors(prev => [...prev, {
        message: event.message,
        stack: event.error?.stack,
        timestamp: Date.now(),
      }]);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setErrors(prev => [...prev, {
        message: event.reason?.message || 'Promise rejection',
        stack: event.reason?.stack,
        timestamp: Date.now(),
      }]);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return errors;
}; 