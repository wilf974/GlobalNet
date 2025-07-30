import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePerformance, useResourceTiming, useErrorMonitoring } from '../usePerformance';

// Mock PerformanceObserver
const mockPerformanceObserver = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  mockPerformanceObserver.mockImplementation((callback) => ({
    observe: vi.fn(),
    disconnect: mockDisconnect,
  }));
  
  global.PerformanceObserver = mockPerformanceObserver;
  
  // Mock performance.getEntriesByType
  global.performance = {
    getEntriesByType: vi.fn().mockReturnValue([]),
  } as any;
});

describe('usePerformance', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePerformance());

    expect(result.current.metrics).toEqual({
      fcp: null,
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null,
      fmp: null,
    });
    expect(result.current.isSupported).toBe(true);
  });

  it('should create PerformanceObserver for FCP', () => {
    renderHook(() => usePerformance());

    expect(mockPerformanceObserver).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should evaluate performance correctly', () => {
    const { result } = renderHook(() => usePerformance());

    const evaluation = result.current.evaluatePerformance();

    expect(evaluation).toHaveProperty('score');
    expect(evaluation).toHaveProperty('issues');
    expect(evaluation).toHaveProperty('recommendations');
    expect(typeof evaluation.score).toBe('number');
    expect(Array.isArray(evaluation.issues)).toBe(true);
    expect(Array.isArray(evaluation.recommendations)).toBe(true);
  });

  it('should evaluate LCP correctly', () => {
    const { result } = renderHook(() => usePerformance());

    // Simuler des métriques
    act(() => {
      result.current.metrics.lcp = 2000; // Bon
    });

    const evaluation = result.current.evaluatePerformance();
    expect(evaluation.score).toBeGreaterThan(0);
    expect(evaluation.issues).toHaveLength(0);

    // Simuler un LCP élevé
    act(() => {
      result.current.metrics.lcp = 5000; // Mauvais
    });

    const evaluation2 = result.current.evaluatePerformance();
    expect(evaluation2.issues).toContain('LCP très élevé');
  });

  it('should evaluate FID correctly', () => {
    const { result } = renderHook(() => usePerformance());

    // Simuler un FID bon
    act(() => {
      result.current.metrics.fid = 50; // Bon
    });

    const evaluation = result.current.evaluatePerformance();
    expect(evaluation.score).toBeGreaterThan(0);

    // Simuler un FID élevé
    act(() => {
      result.current.metrics.fid = 400; // Mauvais
    });

    const evaluation2 = result.current.evaluatePerformance();
    expect(evaluation2.issues).toContain('FID très élevé');
  });

  it('should evaluate CLS correctly', () => {
    const { result } = renderHook(() => usePerformance());

    // Simuler un CLS bon
    act(() => {
      result.current.metrics.cls = 0.05; // Bon
    });

    const evaluation = result.current.evaluatePerformance();
    expect(evaluation.score).toBeGreaterThan(0);

    // Simuler un CLS élevé
    act(() => {
      result.current.metrics.cls = 0.3; // Mauvais
    });

    const evaluation2 = result.current.evaluatePerformance();
    expect(evaluation2.issues).toContain('CLS très élevé');
  });

  it('should evaluate TTFB correctly', () => {
    const { result } = renderHook(() => usePerformance());

    // Simuler un TTFB bon
    act(() => {
      result.current.metrics.ttfb = 300; // Bon
    });

    const evaluation = result.current.evaluatePerformance();
    expect(evaluation.score).toBeGreaterThan(0);

    // Simuler un TTFB élevé
    act(() => {
      result.current.metrics.ttfb = 2000; // Mauvais
    });

    const evaluation2 = result.current.evaluatePerformance();
    expect(evaluation2.issues).toContain('TTFB très élevé');
  });

  it('should return current metrics', () => {
    const { result } = renderHook(() => usePerformance());

    const metrics = result.current.getCurrentMetrics();
    expect(metrics).toEqual(result.current.metrics);
  });
});

describe('useResourceTiming', () => {
  beforeEach(() => {
    // Mock performance.getEntriesByType pour les ressources
    global.performance = {
      getEntriesByType: vi.fn().mockReturnValue([
        {
          name: 'https://example.com/slow.js',
          duration: 1500,
          transferSize: 1024 * 1024, // 1MB
        },
        {
          name: 'https://example.com/fast.js',
          duration: 200,
          transferSize: 512 * 1024, // 512KB
        },
      ]),
    } as any;

    // Mock document.readyState
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: true,
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useResourceTiming());

    expect(result.current.slowResources).toEqual([]);
    expect(result.current.totalSize).toBe(0);
    expect(result.current.resourceCount).toBe(0);
  });

  it('should analyze resources after load', () => {
    const { result } = renderHook(() => useResourceTiming());

    // Simuler le chargement complet
    act(() => {
      // Le hook devrait automatiquement analyser les ressources
      // car document.readyState est 'complete'
    });

    // Les métriques devraient être mises à jour
    expect(result.current.resourceCount).toBe(2);
    expect(result.current.totalSize).toBeGreaterThan(0);
  });

  it('should identify slow resources', () => {
    const { result } = renderHook(() => useResourceTiming());

    act(() => {
      // Simuler l'analyse des ressources
    });

    // Vérifier que les ressources lentes sont identifiées
    const slowResources = result.current.slowResources;
    expect(slowResources.length).toBeGreaterThan(0);
    expect(slowResources[0].duration).toBeGreaterThan(1000);
  });
});

describe('useErrorMonitoring', () => {
  beforeEach(() => {
    // Mock window.addEventListener
    global.addEventListener = vi.fn();
    global.removeEventListener = vi.fn();
  });

  it('should initialize with empty errors array', () => {
    const { result } = renderHook(() => useErrorMonitoring());

    expect(result.current).toEqual([]);
  });

  it('should add error event listeners', () => {
    renderHook(() => useErrorMonitoring());

    expect(global.addEventListener).toHaveBeenCalledWith('error', expect.any(Function));
    expect(global.addEventListener).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
  });

  it('should handle JavaScript errors', () => {
    let errorHandler: (event: ErrorEvent) => void;
    global.addEventListener = vi.fn().mockImplementation((event, handler) => {
      if (event === 'error') {
        errorHandler = handler;
      }
    });

    const { result } = renderHook(() => useErrorMonitoring());

    // Simuler une erreur JavaScript
    act(() => {
      const mockErrorEvent = {
        message: 'Test error',
        error: new Error('Test error'),
      } as ErrorEvent;

      errorHandler(mockErrorEvent);
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].message).toBe('Test error');
  });

  it('should handle unhandled promise rejections', () => {
    let rejectionHandler: (event: PromiseRejectionEvent) => void;
    global.addEventListener = vi.fn().mockImplementation((event, handler) => {
      if (event === 'unhandledrejection') {
        rejectionHandler = handler;
      }
    });

    const { result } = renderHook(() => useErrorMonitoring());

    // Simuler une rejection de promesse
    act(() => {
      const mockRejectionEvent = {
        reason: new Error('Promise rejection'),
      } as PromiseRejectionEvent;

      rejectionHandler(mockRejectionEvent);
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].message).toBe('Promise rejection');
  });

  it('should include timestamp in errors', () => {
    let errorHandler: (event: ErrorEvent) => void;
    global.addEventListener = vi.fn().mockImplementation((event, handler) => {
      if (event === 'error') {
        errorHandler = handler;
      }
    });

    const { result } = renderHook(() => useErrorMonitoring());

    const beforeTime = Date.now();

    act(() => {
      const mockErrorEvent = {
        message: 'Test error',
        error: new Error('Test error'),
      } as ErrorEvent;

      errorHandler(mockErrorEvent);
    });

    const afterTime = Date.now();

    expect(result.current[0].timestamp).toBeGreaterThanOrEqual(beforeTime);
    expect(result.current[0].timestamp).toBeLessThanOrEqual(afterTime);
  });
}); 