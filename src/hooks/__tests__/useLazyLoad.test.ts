import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLazyLoad, useLazyImage, useLazyComponent, useLazyData } from '../useLazyLoad';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  mockIntersectionObserver.mockImplementation((callback) => ({
    observe: vi.fn(),
    disconnect: mockDisconnect,
  }));
  
  global.IntersectionObserver = mockIntersectionObserver;
});

describe('useLazyLoad', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLazyLoad());

    expect(result.current.isVisible).toBe(false);
    expect(result.current.hasLoaded).toBe(false);
    expect(result.current.ref.current).toBe(null);
  });

  it('should create IntersectionObserver with default options', () => {
    renderHook(() => useLazyLoad());

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );
  });

  it('should create IntersectionObserver with custom options', () => {
    const options = {
      threshold: 0.5,
      rootMargin: '100px',
      once: false,
    };

    renderHook(() => useLazyLoad(options));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      options
    );
  });

  it('should handle intersection callback', () => {
    let observerCallback: (entries: any[]) => void;
    
    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback = callback;
      return {
        observe: vi.fn(),
        disconnect: mockDisconnect,
      };
    });

    const { result } = renderHook(() => useLazyLoad());

    // Simuler une intersection
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    expect(result.current.isVisible).toBe(true);
    expect(result.current.hasLoaded).toBe(true);
  });

  it('should handle non-intersection when once is false', () => {
    let observerCallback: (entries: any[]) => void;
    
    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback = callback;
      return {
        observe: vi.fn(),
        disconnect: mockDisconnect,
      };
    });

    const { result } = renderHook(() => useLazyLoad({ once: false }));

    // Simuler une intersection
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    expect(result.current.isVisible).toBe(true);

    // Simuler une non-intersection
    act(() => {
      observerCallback([{ isIntersecting: false }]);
    });

    expect(result.current.isVisible).toBe(false);
  });
});

describe('useLazyImage', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLazyImage('test.jpg'));

    expect(result.current.imageSrc).toBe('');
    expect(result.current.isLoaded).toBe(false);
    expect(result.current.isVisible).toBe(false);
  });

  it('should set imageSrc when visible', () => {
    let observerCallback: (entries: any[]) => void;
    
    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback = callback;
      return {
        observe: vi.fn(),
        disconnect: mockDisconnect,
      };
    });

    const { result } = renderHook(() => useLazyImage('test.jpg'));

    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    expect(result.current.imageSrc).toBe('test.jpg');
  });

  it('should handle image load', () => {
    const { result } = renderHook(() => useLazyImage('test.jpg'));

    act(() => {
      result.current.onLoad();
    });

    expect(result.current.isLoaded).toBe(true);
  });
});

describe('useLazyComponent', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLazyComponent());

    expect(result.current.shouldRender).toBe(false);
    expect(result.current.isVisible).toBe(false);
  });

  it('should set shouldRender when visible', () => {
    let observerCallback: (entries: any[]) => void;
    
    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback = callback;
      return {
        observe: vi.fn(),
        disconnect: mockDisconnect,
      };
    });

    const { result } = renderHook(() => useLazyComponent());

    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    expect(result.current.shouldRender).toBe(true);
  });
});

describe('useLazyData', () => {
  it('should initialize with default values', () => {
    const mockFetcher = vi.fn().mockResolvedValue({ data: 'test' });
    const { result } = renderHook(() => useLazyData(mockFetcher));

    expect(result.current.data).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.isVisible).toBe(false);
  });

  it('should fetch data when visible', async () => {
    const mockData = { data: 'test' };
    const mockFetcher = vi.fn().mockResolvedValue(mockData);
    let observerCallback: (entries: any[]) => void;
    
    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback = callback;
      return {
        observe: vi.fn(),
        disconnect: mockDisconnect,
      };
    });

    const { result } = renderHook(() => useLazyData(mockFetcher));

    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    // Attendre que la promesse se résolve
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockFetcher).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle fetch error', async () => {
    const mockError = new Error('Fetch failed');
    const mockFetcher = vi.fn().mockRejectedValue(mockError);
    let observerCallback: (entries: any[]) => void;
    
    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback = callback;
      return {
        observe: vi.fn(),
        disconnect: mockDisconnect,
      };
    });

    const { result } = renderHook(() => useLazyData(mockFetcher));

    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    // Attendre que la promesse se résolve
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toEqual(mockError);
    expect(result.current.isLoading).toBe(false);
  });

  it('should not fetch data multiple times', async () => {
    const mockFetcher = vi.fn().mockResolvedValue({ data: 'test' });
    let observerCallback: (entries: any[]) => void;
    
    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback = callback;
      return {
        observe: vi.fn(),
        disconnect: mockDisconnect,
      };
    });

    const { result } = renderHook(() => useLazyData(mockFetcher));

    // Première intersection
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const firstCallCount = mockFetcher.mock.calls.length;

    // Deuxième intersection (ne devrait pas déclencher un nouveau fetch)
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockFetcher).toHaveBeenCalledTimes(firstCallCount);
  });
}); 