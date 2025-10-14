/**
 * SEO Component for dynamic meta tags and structured data
 * 
 * Usage:
 *   import { SEO } from '@/components/SEO';
 *   <SEO title="Page Title" description="..." />
 */

import { Helmet } from "react-helmet-async";

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  noindex?: boolean;
  nofollow?: boolean;
  keywords?: string;
  author?: string;
  jsonLd?: object;
}

const DEFAULT_SEO = {
  title: "Event Hub - All Your Calendars in One Place",
  description:
    "Connect your Google and Outlook calendars and view everything in one clean, unified feed. Event Hub simplifies your schedule with a single scrollable timeline.",
  canonical: "https://eventhub.buzz/",
  ogImage: "https://eventhub.buzz/og-image.png",
  ogType: "website",
  twitterCard: "summary_large_image" as const,
  author: "Chimdumebi Mitchell Nebolisa",
  keywords: "calendar app, unified calendar, Google calendar, Outlook calendar, event management, schedule organizer",
};

const SITE_NAME = "Event Hub";
const TWITTER_HANDLE = "@eventhub"; // Update with your actual Twitter handle

export function SEO({
  title,
  description,
  canonical,
  ogImage,
  ogType,
  twitterCard,
  noindex,
  nofollow,
  keywords,
  author,
  jsonLd,
}: SEOProps) {
  const seo = {
    title: title ? `${title} | ${SITE_NAME}` : DEFAULT_SEO.title,
    description: description || DEFAULT_SEO.description,
    canonical: canonical || DEFAULT_SEO.canonical,
    ogImage: ogImage || DEFAULT_SEO.ogImage,
    ogType: ogType || DEFAULT_SEO.ogType,
    twitterCard: twitterCard || DEFAULT_SEO.twitterCard,
    author: author || DEFAULT_SEO.author,
    keywords: keywords || DEFAULT_SEO.keywords,
  };

  const robotsContent = [
    noindex ? "noindex" : "index",
    nofollow ? "nofollow" : "follow",
  ].join(",");

  // Default JSON-LD structured data for WebApplication
  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    description: DEFAULT_SEO.description,
    url: DEFAULT_SEO.canonical,
    applicationCategory: "ProductivityApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: DEFAULT_SEO.author,
    },
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="author" content={seo.author} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={seo.canonical} />
      
      {/* Robots */}
      <meta name="robots" content={robotsContent} />
      
      {/* Open Graph */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content={seo.ogType} />
      <meta property="og:url" content={seo.canonical} />
      <meta property="og:image" content={seo.ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={seo.twitterCard} />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.ogImage} />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd)}
      </script>
    </Helmet>
  );
}

export default SEO;

