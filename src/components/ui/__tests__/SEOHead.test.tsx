import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SEOHead from '../SEOHead';

// Mock Next.js Head component
vi.mock('next/head', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="head">{children}</div>,
}));

describe('SEOHead Component', () => {
  it('renders with default props', () => {
    const { getByTestId } = render(<SEOHead />);
    expect(getByTestId('head')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    const customTitle = 'Test Title';
    const { getByTestId } = render(<SEOHead title={customTitle} />);
    expect(getByTestId('head')).toBeInTheDocument();
  });

  it('renders with custom description', () => {
    const customDescription = 'Test description';
    const { getByTestId } = render(<SEOHead description={customDescription} />);
    expect(getByTestId('head')).toBeInTheDocument();
  });

  it('renders with custom keywords', () => {
    const customKeywords = 'test, keywords';
    const { getByTestId } = render(<SEOHead keywords={customKeywords} />);
    expect(getByTestId('head')).toBeInTheDocument();
  });

  it('renders with custom URL', () => {
    const customUrl = 'https://example.com';
    const { getByTestId } = render(<SEOHead url={customUrl} />);
    expect(getByTestId('head')).toBeInTheDocument();
  });

  it('renders with custom image', () => {
    const customImage = '/images/test.jpg';
    const { getByTestId } = render(<SEOHead image={customImage} />);
    expect(getByTestId('head')).toBeInTheDocument();
  });

  it('renders with article type', () => {
    const { getByTestId } = render(<SEOHead type="article" />);
    expect(getByTestId('head')).toBeInTheDocument();
  });

  it('renders with noindex and nofollow', () => {
    const { getByTestId } = render(<SEOHead noindex nofollow />);
    expect(getByTestId('head')).toBeInTheDocument();
  });

  it('renders with canonical URL', () => {
    const canonicalUrl = 'https://example.com/canonical';
    const { getByTestId } = render(<SEOHead canonical={canonicalUrl} />);
    expect(getByTestId('head')).toBeInTheDocument();
  });

  it('renders with article metadata', () => {
    const articleProps = {
      type: 'article' as const,
      author: 'Test Author',
      publishedTime: '2024-01-01T00:00:00Z',
      modifiedTime: '2024-01-02T00:00:00Z',
      section: 'Test Section',
      tags: ['tag1', 'tag2'],
    };
    const { getByTestId } = render(<SEOHead {...articleProps} />);
    expect(getByTestId('head')).toBeInTheDocument();
  });
}); 