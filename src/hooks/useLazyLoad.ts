import { useState, useEffect, useRef, useCallback } from 'react';

interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

interface UseLazyLoadReturn {
  ref: React.RefObject<HTMLElement>;
  isVisible: boolean;
  hasLoaded: boolean;
}

/**
 * Hook personnalisé pour le lazy loading avec Intersection Observer
 * 
 * @param options - Options de configuration
 * @returns Objet contenant la ref, l'état de visibilité et de chargement
 * 
 * @example
 * ```tsx
 * const { ref, isVisible, hasLoaded } = useLazyLoad();
 * 
 * return (
 *   <div ref={ref}>
 *     {isVisible && <HeavyComponent />}
 *   </div>
 * );
 * ```
 */
export const useLazyLoad = (options: UseLazyLoadOptions = {}): UseLazyLoadReturn => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    once = true,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    
    if (entry.isIntersecting) {
      setIsVisible(true);
      setHasLoaded(true);
      
      // Si once est true, on arrête d'observer après la première intersection
      if (once && ref.current) {
        observer.current?.unobserve(ref.current);
      }
    } else if (!once) {
      setIsVisible(false);
    }
  }, [once]);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = ref.current;
    
    if (!element) return;

    // Créer l'observer
    observer.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    // Commencer l'observation
    observer.current.observe(element);

    // Cleanup
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  return {
    ref,
    isVisible,
    hasLoaded,
  };
};

/**
 * Hook pour le lazy loading des images avec placeholder
 */
export const useLazyImage = (src: string, options: UseLazyLoadOptions = {}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, isVisible } = useLazyLoad(options);

  useEffect(() => {
    if (isVisible && !imageSrc) {
      setImageSrc(src);
    }
  }, [isVisible, src, imageSrc]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return {
    ref,
    imageSrc,
    isLoaded,
    isVisible,
    onLoad: handleImageLoad,
  };
};

/**
 * Hook pour le lazy loading des composants React
 */
export const useLazyComponent = <T extends HTMLElement>(
  options: UseLazyLoadOptions = {}
) => {
  const [shouldRender, setShouldRender] = useState(false);
  const { ref, isVisible } = useLazyLoad(options);

  useEffect(() => {
    if (isVisible && !shouldRender) {
      setShouldRender(true);
    }
  }, [isVisible, shouldRender]);

  return {
    ref: ref as React.RefObject<T>,
    shouldRender,
    isVisible,
  };
};

/**
 * Hook pour le lazy loading des données avec cache
 */
export const useLazyData = <T>(
  fetcher: () => Promise<T>,
  options: UseLazyLoadOptions = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { ref, isVisible } = useLazyLoad(options);

  useEffect(() => {
    if (isVisible && !data && !isLoading) {
      setIsLoading(true);
      setError(null);

      fetcher()
        .then((result) => {
          setData(result);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isVisible, data, isLoading, fetcher]);

  return {
    ref,
    data,
    isLoading,
    error,
    isVisible,
  };
}; 