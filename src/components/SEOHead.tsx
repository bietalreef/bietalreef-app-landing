import { useEffect } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface ServiceSEOProps {
  title: string;
  description: string;
  serviceId: string;
  serviceName: string;
  serviceType: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  keywords?: string[];
  faqs: FAQItem[];
  providerCount?: number;
  projectCount?: number;
}

export function ServiceSEOHead({
  title,
  description,
  serviceId,
  serviceName,
  serviceType,
  priceRange,
  rating,
  reviewCount,
  imageUrl,
  keywords = [],
  faqs,
  providerCount = 0,
  projectCount = 0
}: ServiceSEOProps) {
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
    
    // Update meta keywords
    if (keywords && keywords.length > 0 && Array.isArray(keywords)) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords.join(', '));
    }
    
    // Add Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: imageUrl },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'ar_AE' }
    ];
    
    ogTags.forEach(tag => {
      let ogTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', tag.property);
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute('content', tag.content);
    });
    
    // Add Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl }
    ];
    
    twitterTags.forEach(tag => {
      let twitterTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!twitterTag) {
        twitterTag = document.createElement('meta');
        twitterTag.setAttribute('name', tag.name);
        document.head.appendChild(twitterTag);
      }
      twitterTag.setAttribute('content', tag.content);
    });
    
  }, [title, description, imageUrl, keywords]);
  
  // Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": serviceType,
    "name": serviceName,
    "description": description,
    "provider": {
      "@type": "LocalBusiness",
      "name": "بيت الريف - منصة البناء الذكي",
      "description": "منصة رائدة لربط العملاء بمزودي خدمات البناء والصيانة في الإمارات",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "AE",
        "addressRegion": "Dubai",
        "addressLocality": "الإمارات العربية المتحدة"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "25.2048",
        "longitude": "55.2708"
      },
      "url": "https://baitalreef.ae",
      "telephone": "+971-50-XXX-XXXX",
      "priceRange": priceRange,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating.toString(),
        "reviewCount": reviewCount.toString(),
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "دبي"
      },
      {
        "@type": "City",
        "name": "أبوظبي"
      },
      {
        "@type": "City",
        "name": "الشارقة"
      },
      {
        "@type": "City",
        "name": "عجمان"
      },
      {
        "@type": "City",
        "name": "رأس الخيمة"
      },
      {
        "@type": "City",
        "name": "الفجيرة"
      },
      {
        "@type": "City",
        "name": "أم القيوين"
      }
    ],
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "AED",
      "lowPrice": priceRange.split(' - ')[0],
      "highPrice": priceRange.split(' - ')[1]?.replace(' د.إ', '') || priceRange.split(' - ')[0],
      "offerCount": providerCount.toString()
    }
  };
  
  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
  
  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": "https://baitalreef.ae"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "الخدمات",
        "item": "https://baitalreef.ae/services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": serviceName,
        "item": `https://baitalreef.ae/services/${serviceId}`
      }
    ]
  };
  
  // LocalBusiness Schema with all providers
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": `${serviceName} - بيت الريف`,
    "image": imageUrl,
    "description": `أفضل مزودي ${serviceName} في الإمارات. ${providerCount} مزود معتمد، ${projectCount} مشروع منجز بنجاح. ${description}`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating.toString(),
      "reviewCount": reviewCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "priceRange": priceRange,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "AE",
      "addressLocality": "دبي، أبوظبي، الشارقة، عجمان، رأس الخيمة، الفجيرة، أم القيوين"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `كتالوج ${serviceName}`,
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": serviceName,
            "description": description
          }
        }
      ]
    }
  };
  
  return (
    <>
      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      
      {/* FAQ Schema */}
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </>
  );
}