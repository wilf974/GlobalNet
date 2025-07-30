'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';

interface A11yContextType {
  announceToScreenReader: (message: string) => void;
  setFocusTrap: (element: HTMLElement | null) => void;
  clearFocusTrap: () => void;
}

const A11yContext = createContext<A11yContextType | undefined>(undefined);

interface A11yProviderProps {
  children: React.ReactNode;
}

export const A11yProvider: React.FC<A11yProviderProps> = ({ children }) => {
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const focusTrapRef = useRef<HTMLElement | null>(null);
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  const announceToScreenReader = (message: string) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = message;
      // Clear the message after a short delay
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = '';
        }
      }, 1000);
    }
  };

  const setFocusTrap = (element: HTMLElement | null) => {
    focusTrapRef.current = element;
    if (element) {
      // Get all focusable elements within the trap
      const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'textarea:not([disabled])',
        'select:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
      ];
      
      focusableElementsRef.current = Array.from(
        element.querySelectorAll(focusableSelectors.join(','))
      ) as HTMLElement[];
    }
  };

  const clearFocusTrap = () => {
    focusTrapRef.current = null;
    focusableElementsRef.current = [];
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!focusTrapRef.current || focusableElementsRef.current.length === 0) {
        return;
      }

      const { key } = event;
      const currentElement = document.activeElement as HTMLElement;
      const currentIndex = focusableElementsRef.current.indexOf(currentElement);

      if (key === 'Tab') {
        event.preventDefault();
        
        if (event.shiftKey) {
          // Move backwards
          const previousIndex = currentIndex > 0 ? currentIndex - 1 : focusableElementsRef.current.length - 1;
          focusableElementsRef.current[previousIndex]?.focus();
        } else {
          // Move forwards
          const nextIndex = currentIndex < focusableElementsRef.current.length - 1 ? currentIndex + 1 : 0;
          focusableElementsRef.current[nextIndex]?.focus();
        }
      } else if (key === 'Escape') {
        // Close modal or clear focus trap
        clearFocusTrap();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle focus management
  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      
      if (focusTrapRef.current && !focusTrapRef.current.contains(target)) {
        // Focus is outside the trap, bring it back to the first focusable element
        if (focusableElementsRef.current.length > 0) {
          focusableElementsRef.current[0].focus();
        }
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, []);

  const contextValue: A11yContextType = {
    announceToScreenReader,
    setFocusTrap,
    clearFocusTrap,
  };

  return (
    <A11yContext.Provider value={contextValue}>
      {children}
      {/* Live region for screen reader announcements */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      />
    </A11yContext.Provider>
  );
};

export const useA11y = (): A11yContextType => {
  const context = useContext(A11yContext);
  if (!context) {
    throw new Error('useA11y must be used within an A11yProvider');
  }
  return context;
};

// Hook for managing focus
export const useFocusManagement = () => {
  const { setFocusTrap, clearFocusTrap } = useA11y();
  const elementRef = useRef<HTMLElement>(null);

  const trapFocus = () => {
    if (elementRef.current) {
      setFocusTrap(elementRef.current);
    }
  };

  const releaseFocus = () => {
    clearFocusTrap();
  };

  return {
    elementRef,
    trapFocus,
    releaseFocus,
  };
};

// Hook for screen reader announcements
export const useScreenReader = () => {
  const { announceToScreenReader } = useA11y();

  const announce = (message: string) => {
    announceToScreenReader(message);
  };

  return { announce };
};

// Component for skip links
export const SkipLink: React.FC<{ href: string; children: React.ReactNode }> = ({ 
  href, 
  children 
}) => (
  <a
    href={href}
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
  >
    {children}
  </a>
);

// Component for focus indicators
export const FocusIndicator: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2">
    {children}
  </div>
);

export default A11yProvider; 