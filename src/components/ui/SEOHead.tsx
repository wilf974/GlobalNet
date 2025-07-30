import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  noindex?: boolean
  nofollow?: boolean
  canonical?: string
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'GlobalNet Services - Nettoyage Professionnel',
  description = 'Services de nettoyage professionnel pour entreprises et particuliers. Nettoyage de bureaux, industriels, résidentiels et commerciaux.',
  keywords = 'nettoyage, professionnel, bureaux, industriel, résidentiel, commercial, services',
  image = '/images/og-image.jpg',
  url = 'https://globalnet-services.fr',
  type = 'website',
  author = 'GlobalNet Services',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noindex = false,
  nofollow = false,
  canonical,
}) => {
  const fullTitle = title.includes('GlobalNet') ? title : `${title} | GlobalNet Services`
  const fullUrl = canonical || url

  return (
    <Head>
      {/* Métadonnées de base */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Robots */}
      <meta name="robots" content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="GlobalNet Services" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Article spécifique */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': type === 'article' ? 'Article' : 'Organization',
            name: 'GlobalNet Services',
            description: description,
            url: fullUrl,
            logo: 'https://globalnet-services.fr/images/logo.png',
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+33-1-23-45-67-89',
              contactType: 'customer service',
              areaServed: 'FR',
              availableLanguage: 'French',
            },
            address: {
              '@type': 'PostalAddress',
              streetAddress: '123 Rue de la Paix',
              addressLocality: 'Paris',
              postalCode: '75001',
              addressCountry: 'FR',
            },
            sameAs: [
              'https://www.facebook.com/globalnetservices',
              'https://www.linkedin.com/company/globalnet-services',
            ],
            ...(type === 'article' && {
              headline: title,
              author: {
                '@type': 'Person',
                name: author,
              },
              publisher: {
                '@type': 'Organization',
                name: 'GlobalNet Services',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://globalnet-services.fr/images/logo.png',
                },
              },
              ...(publishedTime && { datePublished: publishedTime }),
              ...(modifiedTime && { dateModified: modifiedTime }),
            }),
          }),
        }}
      />

      {/* Preconnect pour les ressources externes */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://res.cloudinary.com" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//res.cloudinary.com" />

      {/* Manifest */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#f59e0b" />
      <meta name="msapplication-TileColor" content="#f59e0b" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="GlobalNet Services" />
    </Head>
  )
}

export default SEOHead 