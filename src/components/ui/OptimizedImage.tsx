'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLazyImage } from '@/hooks/useLazyLoad';
import { Eye, EyeOff, Download, RefreshCw } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty' | 'data:image/...';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  lazy?: boolean;
  fallback?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  showControls?: boolean;
  enableWebP?: boolean;
  enableAVIF?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  lazy = true,
  fallback,
  onLoad,
  onError,
  showControls = false,
  enableWebP = true,
  enableAVIF = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  // Lazy loading avec hook personnalisé
  const { ref, src: lazySrc, isLoaded: lazyLoaded, isError: lazyError, retry } = useLazyImage(src, {
    threshold: 0.1,
    rootMargin: '50px',
    cache: true,
    retryCount: 3
  });

  // Détecter le support des formats modernes
  const supportsWebP = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }, []);

  const supportsAVIF = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  }, []);

  // Optimiser l'URL de l'image selon le support
  const getOptimizedSrc = useCallback((originalSrc: string) => {
    if (!originalSrc) return originalSrc;

    // Si c'est une image externe, on ne peut pas l'optimiser
    if (originalSrc.startsWith('http') && !originalSrc.includes('vercel.app')) {
      return originalSrc;
    }

    // Ajouter les paramètres d'optimisation Next.js
    const url = new URL(originalSrc, window.location.origin);
    
    if (enableWebP && supportsWebP()) {
      url.searchParams.set('format', 'webp');
    } else if (enableAVIF && supportsAVIF()) {
      url.searchParams.set('format', 'avif');
    }
    
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('w', width.toString());
    
    if (height && !fill) {
      url.searchParams.set('h', height.toString());
    }

    return url.toString();
  }, [width, height, quality, enableWebP, enableAVIF, supportsWebP, supportsAVIF, fill]);

  // Gérer le chargement de l'image
  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    setIsError(false);
    onLoad?.();
  }, [onLoad]);

  const handleImageError = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const error = new Error('Erreur de chargement image');
    console.error(error);
    setIsError(true);
    setIsLoaded(false);
    
    // Essayer le fallback
    if (fallback && imageSrc !== fallback) {
      setImageSrc(fallback);
      setShowFallback(true);
    }
    
    onError?.(error);
  }, [fallback, imageSrc, onError]);

  // Gérer la visibilité
  useEffect(() => {
    if (lazy) {
      setIsVisible(lazyLoaded);
    } else {
      setIsVisible(true);
    }
  }, [lazy, lazyLoaded]);

  // Optimiser l'URL quand l'image devient visible
  useEffect(() => {
    if (isVisible && !isLoaded && !isError) {
      const optimizedSrc = getOptimizedSrc(src);
      setImageSrc(optimizedSrc);
    }
  }, [isVisible, isLoaded, isError, src, getOptimizedSrc]);

  // Retry en cas d'erreur
  const handleRetry = useCallback(() => {
    setIsError(false);
    setIsLoaded(false);
    setShowFallback(false);
    setImageSrc(src);
    retry();
  }, [src, retry]);

  // Composant de placeholder animé
  const Placeholder = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`bg-gray-200 animate-pulse rounded ${className}`}
      style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
    >
      <div className="w-full h-full bg-gray-300 rounded"></div>
    </motion.div>
  );

  // Composant d'erreur
  const ErrorComponent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-red-50 border border-red-200 rounded flex items-center justify-center ${className}`}
      style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
    >
      <div className="text-center p-4">
        <EyeOff className="w-8 h-8 text-red-400 mx-auto mb-2" />
        <p className="text-red-600 text-sm">Erreur de chargement</p>
        <button
          onClick={handleRetry}
          className="mt-2 px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </motion.div>
  );

  // Contrôles d'image
  const ImageControls = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-2 right-2 flex space-x-1"
    >
      <button
        onClick={() => window.open(imageSrc, '_blank')}
        className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-colors"
        title="Voir l'image"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          const link = document.createElement('a');
          link.href = imageSrc;
          link.download = alt || 'image';
          link.click();
        }}
        className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-colors"
        title="Télécharger"
      >
        <Download className="w-4 h-4" />
      </button>
      {isError && (
        <button
          onClick={handleRetry}
          className="p-1 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-colors"
          title="Réessayer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );

  return (
    <div ref={ref} className="relative">
      <AnimatePresence mode="wait">
        {!isVisible && lazy && (
          <Placeholder key="placeholder" />
        )}
        
        {isVisible && isError && (
          <ErrorComponent key="error" />
        )}
        
        {isVisible && !isError && (
          <motion.div
            key="image"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Image
              src={imageSrc}
              alt={alt}
              width={fill ? undefined : width}
              height={fill ? undefined : height}
              className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              priority={priority}
              quality={quality}
              placeholder={placeholder}
              blurDataURL={blurDataURL}
              sizes={sizes}
              fill={fill}
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{
                objectFit: fill ? 'cover' : 'contain',
                transition: 'opacity 0.3s ease-in-out'
              }}
            />
            
            {showControls && (
              <ImageControls />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OptimizedImage; 