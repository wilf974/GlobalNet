'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

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
    cache = true,
    preload = false,
    retryCount: maxRetryCount = 3,
    retryDelay = 1000
  } = options;

  const elementRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<LazyLoadState>({
    isVisible: false,
    isLoaded: false,
    isError: false,
    retryCount: 0
  });

  const observer = useRef<IntersectionObserver | null>(null);
  const cacheRef = useRef<Set<string>>(new Set());

  const setVisible = useCallback((isVisible: boolean) => {
    setState(prev => ({
      ...prev,
      isVisible
    }));
  }, []);

  const setLoaded = useCallback((isLoaded: boolean) => {
    setState(prev => ({
      ...prev,
      isLoaded
    }));
  }, []);

  const setError = useCallback((isError: boolean) => {
    setState(prev => ({
      ...prev,
      isError
    }));
  }, []);

  const incrementRetryCount = useCallback(() => {
    setState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1
    }));
  }, []);

  const retry = useCallback(() => {
    if (state.retryCount < maxRetryCount) {
      setError(false);
      setLoaded(false);
      incrementRetryCount();
      
      setTimeout(() => {
        setVisible(true);
      }, retryDelay);
    }
  }, [state.retryCount, maxRetryCount, retryDelay, setError, setLoaded, incrementRetryCount, setVisible]);

  const reset = useCallback(() => {
    setState({
      isVisible: false,
      isLoaded: false,
      isError: false,
      retryCount: 0
    });
  }, []);

  // Setup Intersection Observer
  useEffect(() => {
    if (!elementRef.current) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          
          if (observer.current) {
            observer.current.disconnect();
          }
        }
      });
    };

    observer.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    });

    observer.current.observe(elementRef.current);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [threshold, rootMargin, setVisible]);

  // Cache management
  useEffect(() => {
    if (cache && elementRef.current) {
      const elementId = elementRef.current.id || elementRef.current.className;
      if (elementId && cacheRef.current.has(elementId)) {
        setLoaded(true);
        setVisible(true);
      }
    }
  }, [cache, setLoaded, setVisible]);

  const addToCache = useCallback((id: string) => {
    if (cache) {
      cacheRef.current.add(id);
    }
  }, [cache]);

  const removeFromCache = useCallback((id: string) => {
    if (cache) {
      cacheRef.current.delete(id);
    }
  }, [cache]);

  const cleanupCache = () => {
    cacheRef.current.clear();
  };

  // Preload option
  useEffect(() => {
    if (preload && elementRef.current) {
      setVisible(true);
    }
  }, [preload, setVisible]);

  return {
    ref: elementRef,
    isVisible: state.isVisible,
    isLoaded: state.isLoaded,
    isError: state.isError,
    retryCount: state.retryCount,
    retry,
    reset,
    addToCache,
    removeFromCache,
    cleanupCache
  };
};

// Hook spécialisé pour les images
export const useLazyImage = (src: string, options: LazyLoadOptions = {}) => {
  const [imageState, setImageState] = useState({
    src: '',
    isLoaded: false,
    isError: false
  });

  const { ref, isVisible, isLoaded, isError, retry } = useLazyLoad(options);

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

  const { ref, isVisible, isLoaded, retry } = useLazyLoad(options);

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

  return {
    ref,
    Component,
    isLoading,
    error,
    retry
  };
}; 