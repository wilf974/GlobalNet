'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface LazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  fallback?: React.ReactNode;
  cache?: boolean;
  preload?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

interface LazyLoadState {
  isVisible: boolean;
  isLoaded: boolean;
  isError: boolean;
  retryCount: number;
}

export const useLazyLoad = (options: LazyLoadOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    fallback = null,
    cache = true,
    preload = false,
    retryCount: maxRetryCount = 3,
    retryDelay = 1000
  } = options;

  const [state, setState] = useState<LazyLoadState>({
    isVisible: false,
    isLoaded: false,
    isError: false,
    retryCount: 0
  });

  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Cache pour les éléments déjà chargés
  const loadedCache = useMemo(() => new Set<string>(), []);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setState(prev => ({ ...prev, isVisible: true }));
        
        // Déconnecter l'observer une fois visible
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      }
    });
  }, []);

  const loadElement = useCallback(async () => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const elementId = element.dataset.lazyId || element.id || 'unknown';

    // Vérifier le cache
    if (cache && loadedCache.has(elementId)) {
      setState(prev => ({ ...prev, isLoaded: true }));
      return;
    }

    try {
      // Simuler un chargement asynchrone
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Marquer comme chargé dans le cache
      if (cache) {
        loadedCache.add(elementId);
      }

      setState(prev => ({ ...prev, isLoaded: true }));
    } catch (error) {
      console.error('Erreur lors du chargement lazy:', error);
      
      if (state.retryCount < maxRetryCount) {
        setState(prev => ({ 
          ...prev, 
          retryCount: prev.retryCount + 1 
        }));
        
        // Retry après délai
        setTimeout(() => {
          loadElement();
        }, retryDelay);
      } else {
        setState(prev => ({ ...prev, isError: true }));
      }
    }
  }, [cache, loadedCache, state.retryCount, maxRetryCount, retryDelay]);

  // Initialiser l'Intersection Observer
  useEffect(() => {
    if (!elementRef.current) return;

    // Créer l'observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    });

    // Observer l'élément
    observerRef.current.observe(elementRef.current);

    // Preload si activé
    if (preload) {
      loadElement();
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold, rootMargin, preload, loadElement]);

  // Charger l'élément quand il devient visible
  useEffect(() => {
    if (state.isVisible && !state.isLoaded && !state.isError) {
      loadElement();
    }
  }, [state.isVisible, state.isLoaded, state.isError, loadElement]);

  // Nettoyer le cache périodiquement
  useEffect(() => {
    if (!cache) return;

    const cleanupCache = () => {
      if (loadedCache.size > 100) {
        loadedCache.clear();
      }
    };

    const interval = setInterval(cleanupCache, 60000); // Nettoyer toutes les minutes
    return () => clearInterval(interval);
  }, [cache, loadedCache]);

  const retry = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isError: false, 
      retryCount: 0 
    }));
    loadElement();
  }, [loadElement]);

  const reset = useCallback(() => {
    setState({
      isVisible: false,
      isLoaded: false,
      isError: false,
      retryCount: 0
    });
  }, []);

  return {
    ref: elementRef,
    isVisible: state.isVisible,
    isLoaded: state.isLoaded,
    isError: state.isError,
    retryCount: state.retryCount,
    retry,
    reset,
    fallback: state.isError ? (
      <div className="p-4 text-center text-red-600">
        <p>Erreur de chargement</p>
        <button 
          onClick={retry}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Réessayer
        </button>
      </div>
    ) : !state.isLoaded ? fallback : null
  };
};

// Hook spécialisé pour les images
export const useLazyImage = (src: string, options: LazyLoadOptions = {}) => {
  const [imageState, setImageState] = useState({
    src: '',
    isLoaded: false,
    isError: false
  });

  const { ref, isVisible, isLoaded, isError, retry } = useLazyLoad({
    ...options,
    fallback: (
      <div className="animate-pulse bg-gray-200 rounded">
        <div className="w-full h-32 bg-gray-300 rounded"></div>
      </div>
    )
  });

  useEffect(() => {
    if (isVisible && src && !imageState.isLoaded) {
      const img = new Image();
      
      img.onload = () => {
        setImageState({
          src,
          isLoaded: true,
          isError: false
        });
      };

      img.onerror = () => {
        setImageState({
          src: '',
          isLoaded: false,
          isError: true
        });
      };

      img.src = src;
    }
  }, [isVisible, src, imageState.isLoaded]);

  return {
    ref,
    src: imageState.src,
    isLoaded: imageState.isLoaded,
    isError: imageState.isError,
    retry
  };
};

// Hook spécialisé pour les composants React
export const useLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
) => {
  const [Component, setComponent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { ref, isVisible, isLoaded, retry } = useLazyLoad({
    ...options,
    fallback: isLoading ? (
      <div className="animate-pulse bg-gray-200 rounded p-4">
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>
    ) : null
  });

  useEffect(() => {
    if (isVisible && !Component && !isLoading && !error) {
      setIsLoading(true);
      setError(null);

      importFn()
        .then((module) => {
          setComponent(() => module.default);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
    }
  }, [isVisible, Component, isLoading, error, importFn]);

  const reset = useCallback(() => {
    setComponent(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    ref,
    Component,
    isLoading,
    error,
    retry,
    reset
  };
}; 