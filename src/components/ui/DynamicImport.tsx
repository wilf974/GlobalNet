'use client';

import React, { Suspense, lazy, ComponentType } from 'react';
import { motion } from 'framer-motion';

interface DynamicImportProps {
  importFn: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: Record<string, any>;
  animation?: 'fadeIn' | 'slideUp' | 'scaleIn';
  delay?: number;
}

/**
 * Composant pour le chargement dynamique avec Suspense
 * 
 * @example
 * ```tsx
 * <DynamicImport
 *   importFn={() => import('@/components/HeavyComponent')}
 *   fallback={<div>Chargement...</div>}
 *   props={{ title: 'Mon titre' }}
 * />
 * ```
 */
const DynamicImport: React.FC<DynamicImportProps> = ({
  importFn,
  fallback = (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
  props = {},
  animation = 'fadeIn',
  delay = 0,
}) => {
  const LazyComponent = lazy(importFn);

  const animations = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3, delay }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3, delay }
    }
  };

  return (
    <Suspense fallback={fallback}>
      <motion.div
        initial={animations[animation].initial}
        animate={animations[animation].animate}
        transition={animations[animation].transition}
      >
        <LazyComponent {...props} />
      </motion.div>
    </Suspense>
  );
};

/**
 * Hook pour créer des composants dynamiques avec cache
 */
export const useDynamicImport = <T extends Record<string, any>>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: {
    cacheKey?: string;
    preload?: boolean;
  } = {}
) => {
  const { cacheKey, preload = false } = options;
  const [Component, setComponent] = React.useState<ComponentType<T> | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const loadComponent = React.useCallback(async () => {
    if (Component) return Component;

    setIsLoading(true);
    try {
      const module = await importFn();
      setComponent(() => module.default);
      return module.default;
    } catch (error) {
      console.error('Erreur lors du chargement du composant:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [importFn, Component]);

  // Préchargement optionnel
  React.useEffect(() => {
    if (preload) {
      loadComponent();
    }
  }, [preload, loadComponent]);

  return {
    Component,
    isLoading,
    loadComponent,
  };
};

/**
 * Composant pour le chargement conditionnel avec cache
 */
export const ConditionalImport: React.FC<DynamicImportProps & {
  condition: boolean;
  cacheKey?: string;
}> = ({
  importFn,
  condition,
  cacheKey,
  fallback,
  props,
  animation,
  delay,
}) => {
  const { Component, isLoading, loadComponent } = useDynamicImport(importFn, {
    cacheKey,
    preload: condition,
  });

  React.useEffect(() => {
    if (condition && !Component) {
      loadComponent();
    }
  }, [condition, Component, loadComponent]);

  if (!condition) {
    return null;
  }

  if (isLoading || !Component) {
    return <>{fallback}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      <Component {...props} />
    </motion.div>
  );
};

export default DynamicImport; 