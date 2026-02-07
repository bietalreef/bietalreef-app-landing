import { useEffect } from 'react';
import { useLocation } from 'react-router';
import {
  SITE_DOMAIN,
  SITE_NAME_AR,
  SITE_NAME_EN,
  SITE_TAGLINE_AR,
  SITE_TAGLINE_EN,
  SITE_PHONE,
  SITE_EMAIL,
  EMIRATES_AND_CITIES,
  SERVICES_SEO,
  ALL_SERVICES_SEO,
} from '../../utils/seoConstants';

interface SEOHeadProps {
  title?: string;
  description?: string;
  type?: 'website' | 'article' | 'service';
}

// ──────────────────────────────────────────────────
// SEO Meta Tag Helper
// ──────────────────────────────────────────────────
function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string, extra?: Record<string, string>) {
  const selector = extra
    ? `link[rel="${rel}"][hreflang="${extra.hreflang}"]`
    : `link[rel="${rel}"]`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (extra) Object.entries(extra).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function injectJsonLd(id: string, data: object) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.setAttribute('type', 'application/ld+json');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

// ──────────────────────────────────────────────────
// Route → SEO mapping
// ──────────────────────────────────────────────────
interface PageSEO {
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  keywordsAr?: string;
  keywordsEn?: string;
  ogType?: string;
  ogImage?: string;
}

function getRouteSEO(pathname: string): PageSEO {

  // ─── /services/:slug ───
  const serviceMatch = pathname.match(/^\/services\/([^/]+)$/);
  if (serviceMatch) {
    const slug = serviceMatch[1];
    const svc = ALL_SERVICES_SEO.find(s => s.slug === slug);
    if (svc) {
      return {
        titleAr: `${svc.nameAr} في الإمارات | ${SITE_NAME_AR}`,
        titleEn: `${svc.nameEn} in UAE | ${SITE_NAME_EN}`,
        descAr: svc.descAr,
        descEn: svc.descEn,
        keywordsAr: svc.keywordsAr.join(', '),
        keywordsEn: svc.keywordsEn.join(', '),
        ogType: 'website',
      };
    }
    // camelCase fallback (constructionContracting → construction-contracting)
    const kebab = slug.replace(/([A-Z])/g, '-$1').toLowerCase();
    const svc2 = ALL_SERVICES_SEO.find(s => s.slug === kebab);
    if (svc2) {
      return {
        titleAr: `${svc2.nameAr} في الإمارات | ${SITE_NAME_AR}`,
        titleEn: `${svc2.nameEn} in UAE | ${SITE_NAME_EN}`,
        descAr: svc2.descAr,
        descEn: svc2.descEn,
        keywordsAr: svc2.keywordsAr.join(', '),
        keywordsEn: svc2.keywordsEn.join(', '),
        ogType: 'website',
      };
    }
  }

  // ─── /services/:slug/:city ───
  const cityServiceMatch = pathname.match(/^\/services\/([^/]+)\/([^/]+)$/);
  if (cityServiceMatch) {
    const slug = cityServiceMatch[1];
    const citySlug = cityServiceMatch[2];
    const svc = ALL_SERVICES_SEO.find(s => s.slug === slug);
    const city = EMIRATES_AND_CITIES.find(c => c.slug === citySlug);
    if (svc && city) {
      return {
        titleAr: `${svc.nameAr} في ${city.nameAr} | أفضل مزودي الخدمة | ${SITE_NAME_AR}`,
        titleEn: `${svc.nameEn} in ${city.nameEn} | Best Providers | ${SITE_NAME_EN}`,
        descAr: `ابحث عن أفضل ${svc.nameAr} في ${city.nameAr}. قارن الأسعار والتقييمات واحصل على عروض فورية من مزودين معتمدين.`,
        descEn: `Find the best ${svc.nameEn} in ${city.nameEn}. Compare prices, ratings and get instant quotes from verified providers.`,
        keywordsAr: [...svc.keywordsAr, city.nameAr, `${svc.nameAr} ${city.nameAr}`].join(', '),
        keywordsEn: [...svc.keywordsEn, city.nameEn, `${svc.nameEn} ${city.nameEn}`].join(', '),
        ogType: 'website',
      };
    }
  }

  // ─── /services (main) ───
  if (pathname === '/services') {
    return {
      titleAr: `جميع الخدمات | ${SITE_NAME_AR} - ${SITE_TAGLINE_AR}`,
      titleEn: `All Services | ${SITE_NAME_EN} - ${SITE_TAGLINE_EN}`,
      descAr: 'تصفح جميع خدمات البناء والصيانة في الإمارات: مقاولات، استشارات هندسية، صيانة، حرفيين، ورش، معدات، مواد بناء، أثاث ونظافة.',
      descEn: 'Browse all construction and maintenance services in UAE: contracting, engineering, maintenance, craftsmen, workshops, equipment, materials, furniture and cleaning.',
      keywordsAr: 'خدمات بناء, صيانة, مقاولات, حرفيين, الإمارات',
      keywordsEn: 'construction services, maintenance, contracting, craftsmen, UAE',
      ogType: 'website',
    };
  }

  // ─── /shop ───
  if (pathname.startsWith('/shop') || pathname.startsWith('/store')) {
    return {
      titleAr: `متجر مواد البناء والصيانة | ${SITE_NAME_AR}`,
      titleEn: `Building Materials Store | ${SITE_NAME_EN}`,
      descAr: 'تسوق مواد بناء، أدوات صيانة، أدوات صحية وكهربائية بأسعار تنافسية مع التوصيل لجميع الإمارات.',
      descEn: 'Shop building materials, maintenance tools, sanitary and electrical supplies at competitive prices with delivery across UAE.',
      keywordsAr: 'متجر مواد بناء, أدوات, شراء اونلاين, مواد بناء الإمارات',
      keywordsEn: 'building materials store, tools, online shopping, construction supplies UAE',
    };
  }

  // ─── /tools ───
  if (pathname.startsWith('/tools')) {
    return {
      titleAr: `أدوات ذكية للبناء والتصميم | ${SITE_NAME_AR}`,
      titleEn: `Smart Construction & Design Tools | ${SITE_NAME_EN}`,
      descAr: 'أدوات ذكية مجانية: حاسبة تكاليف البناء، مصمم ديكور AI، محلل عروض أسعار، مخطط غرف ثلاثي الأبعاد.',
      descEn: 'Free smart tools: building cost calculator, AI interior designer, quote analyzer, 3D room planner.',
      keywordsAr: 'حاسبة بناء, تصميم داخلي AI, أدوات مقاولات, حاسبة تكاليف',
      keywordsEn: 'building calculator, AI interior design, construction tools, cost calculator',
    };
  }

  // ─── /maps ───
  if (pathname === '/maps') {
    return {
      titleAr: `خريطة مزودي الخدمات في الإمارات | ${SITE_NAME_AR}`,
      titleEn: `Service Providers Map in UAE | ${SITE_NAME_EN}`,
      descAr: 'اعثر على أقرب مزود خدمة على الخريطة: مقاولين، حرفيين، ورش، محلات مواد بناء في الإمارات.',
      descEn: 'Find the nearest service provider on the map: contractors, craftsmen, workshops, building material stores in UAE.',
      keywordsAr: 'خريطة مقاولين, خريطة حرفيين, مزود خدمة قريب',
      keywordsEn: 'contractor map, craftsmen map, nearby provider',
    };
  }

  // ─── /wallet ───
  if (pathname === '/wallet') {
    return {
      titleAr: `محفظة الدار | نظام الدفع الآمن | ${SITE_NAME_AR}`,
      titleEn: `Dar Wallet | Secure Payment System | ${SITE_NAME_EN}`,
      descAr: 'محفظة الدار الرقمية لإدارة المدفوعات والضمانات المالية لمشاريع البناء والصيانة.',
      descEn: 'Dar digital wallet to manage payments and financial guarantees for construction and maintenance projects.',
      keywordsAr: 'محفظة رقمية, دفع آمن, ضمان مالي',
      keywordsEn: 'digital wallet, secure payment, financial guarantee',
    };
  }

  // ─── /projects ───
  if (pathname.startsWith('/projects')) {
    return {
      titleAr: `إدارة المشاريع | ${SITE_NAME_AR}`,
      titleEn: `Project Management | ${SITE_NAME_EN}`,
      descAr: 'تتبع مشاريع البناء والصيانة، مراحل التنفيذ، الجداول الزمنية والميزانيات.',
      descEn: 'Track construction and maintenance projects, execution phases, timelines and budgets.',
      keywordsAr: 'إدارة مشاريع, تتبع مشروع, بناء',
      keywordsEn: 'project management, project tracking, construction',
    };
  }

  // ─── /yak ───
  if (pathname === '/yak') {
    return {
      titleAr: `وياك - مساعد البناء الذكي بالذكاء الاصطناعي | ${SITE_NAME_AR}`,
      titleEn: `Weyaak - AI Construction Assistant | ${SITE_NAME_EN}`,
      descAr: 'مساعدك الشخصي الذكي لإدارة مشاريع البناء. استشارات فورية، حساب تكاليف، اقتراحات مواد.',
      descEn: 'Your personal AI assistant for construction projects. Instant consultation, cost calculation, material suggestions.',
      keywordsAr: 'مساعد ذكي, AI بناء, استشارة بناء فورية',
      keywordsEn: 'AI assistant, construction AI, instant consultation',
    };
  }

  // ─── /platform ───
  if (pathname === '/platform') {
    return {
      titleAr: `اكتشف مميزات المنصة | ${SITE_NAME_AR}`,
      titleEn: `Discover Platform Features | ${SITE_NAME_EN}`,
      descAr: 'اكتشف أكثر من 50 أداة ومميزة في بيت الريف: ذكاء اصطناعي، إدارة مشاريع، محفظة رقمية، نظام توثيق.',
      descEn: 'Discover 50+ tools and features on Bait Al Reef: AI, project management, digital wallet, verification system.',
      keywordsAr: 'مميزات بيت الريف, منصة بناء, أدوات ذكية',
      keywordsEn: 'Bait Al Reef features, construction platform, smart tools',
    };
  }

  // ─── /profile ───
  if (pathname === '/profile') {
    return {
      titleAr: `الملف الشخصي | ${SITE_NAME_AR}`,
      titleEn: `Profile | ${SITE_NAME_EN}`,
      descAr: 'إدارة حسابك في بيت الريف.',
      descEn: 'Manage your Bait Al Reef account.',
    };
  }

  // ─── /rfq ───
  if (pathname === '/rfq') {
    return {
      titleAr: `طلب عرض سعر مجاني | ${SITE_NAME_AR}`,
      titleEn: `Free Quote Request | ${SITE_NAME_EN}`,
      descAr: 'احصل على عروض أسعار مجانية من أفضل المقاولين والحرفيين في الإمارات خلال 24 ساعة.',
      descEn: 'Get free quotes from the best contractors and craftsmen in UAE within 24 hours.',
      keywordsAr: 'عرض سعر, طلب عرض, مقاولين, مقارنة أسعار',
      keywordsEn: 'quote request, RFQ, contractors, price comparison',
    };
  }

  // ─── Default: Home ───
  return {
    titleAr: `${SITE_NAME_AR} | ${SITE_TAGLINE_AR}`,
    titleEn: `${SITE_NAME_EN} | ${SITE_TAGLINE_EN}`,
    descAr: 'اكتشف أفضل المقاولين، الحرفيين، شركات الصيانة، ومحلات مواد البناء في الإمارات. أدوات ذكاء اصطناعي مجانية لحساب التكاليف وتصميم الديكور. عروض أسعار فورية.',
    descEn: 'Find the best contractors, craftsmen, maintenance companies, and building material stores in UAE. Free AI tools for cost calculation and interior design. Instant quotes.',
    keywordsAr: 'بيت الريف, مقاولات, صيانة, بناء, حرفيين, مواد بناء, الإمارات, دبي, أبوظبي',
    keywordsEn: 'Bait Al Reef, contracting, maintenance, construction, craftsmen, building materials, UAE, Dubai, Abu Dhabi',
    ogType: 'website',
  };
}

// ──────────────────────────────────────────────────
// Main SEOHead Component
// ──────────────────────────────────────────────────
export const SEOHead = ({ title, description, type = 'website' }: SEOHeadProps) => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const routeSEO = getRouteSEO(path);

    // ─── Page Title ───
    const pageTitle = title || routeSEO.titleAr;
    document.title = pageTitle;

    // ─── Viewport (Security: no zoom) ───
    setMeta('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover');

    // ─── Robots ───
    // Allow indexing for all public pages
    const noIndex = ['/profile', '/wallet'].includes(path);
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // ─── Meta Description ───
    const pageDesc = description || routeSEO.descAr;
    setMeta('description', pageDesc);

    // ─── Meta Keywords ───
    if (routeSEO.keywordsAr) {
      setMeta('keywords', routeSEO.keywordsAr);
    }

    // ─── Canonical URL ───
    const canonicalUrl = `${SITE_DOMAIN}${path}`;
    setLink('canonical', canonicalUrl);

    // ─── hreflang tags for bilingual ───
    setLink('alternate', `${SITE_DOMAIN}${path}`, { hreflang: 'ar-AE' });
    setLink('alternate', `${SITE_DOMAIN}${path}`, { hreflang: 'en-AE' });
    setLink('alternate', `${SITE_DOMAIN}${path}`, { hreflang: 'x-default' });

    // ─── Open Graph ───
    setMeta('og:title', pageTitle, 'property');
    setMeta('og:description', pageDesc, 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('og:type', routeSEO.ogType || type, 'property');
    setMeta('og:site_name', SITE_NAME_AR, 'property');
    setMeta('og:locale', 'ar_AE', 'property');
    setMeta('og:locale:alternate', 'en_AE', 'property');
    if (routeSEO.ogImage) {
      setMeta('og:image', routeSEO.ogImage, 'property');
    }

    // ─── Twitter Card ───
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', pageDesc);
    setMeta('twitter:site', '@baitalreef');

    // ─── Geo tags (UAE) ───
    setMeta('geo.region', 'AE');
    setMeta('geo.placename', 'United Arab Emirates');
    setMeta('geo.position', '25.2048;55.2708');
    setMeta('ICBM', '25.2048, 55.2708');

    // ─── Content language ───
    setMeta('content-language', 'ar, en');
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';

    // ─── Block PWA ───
    document.querySelectorAll('link[rel="manifest"]').forEach(m => m.remove());
    const appleMeta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (appleMeta) appleMeta.remove();

    // ──────────────────────────────────────────
    // Structured Data (JSON-LD)
    // ──────────────────────────────────────────

    // 1. Organization Schema (always present)
    injectJsonLd('ld-organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME_AR,
      alternateName: [SITE_NAME_EN, 'بيت الريف', 'Bait Al Reef', 'Biet Alreef'],
      url: SITE_DOMAIN,
      logo: `${SITE_DOMAIN}/logo.png`,
      description: routeSEO.descAr,
      email: SITE_EMAIL,
      telephone: SITE_PHONE,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'AE',
        addressRegion: 'Dubai',
      },
      areaServed: EMIRATES_AND_CITIES.map(c => ({
        '@type': 'City',
        name: c.nameAr,
        alternateName: c.nameEn,
      })),
      sameAs: [
        // TODO: add real social links
        'https://twitter.com/baitalreef',
        'https://instagram.com/baitalreef',
        'https://facebook.com/baitalreef',
        'https://linkedin.com/company/baitalreef',
        'https://youtube.com/@baitalreef',
      ],
    });

    // 2. WebSite Schema with SearchAction (enables Google Search Box)
    injectJsonLd('ld-website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME_AR,
      alternateName: SITE_NAME_EN,
      url: SITE_DOMAIN,
      description: routeSEO.descAr,
      inLanguage: ['ar', 'en'],
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_DOMAIN}/services?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    });

    // 3. Dynamic page-specific schemas
    if (path === '/home' || path === '/') {
      // ─── Home: LocalBusiness + ItemList of services ───
      injectJsonLd('ld-localbusiness', {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${SITE_DOMAIN}/#business`,
        name: SITE_NAME_AR,
        alternateName: SITE_NAME_EN,
        description: routeSEO.descAr,
        url: SITE_DOMAIN,
        telephone: SITE_PHONE,
        email: SITE_EMAIL,
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'AE',
        },
        geo: { '@type': 'GeoCoordinates', latitude: '25.2048', longitude: '55.2708' },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '12500',
          bestRating: '5',
          worstRating: '1',
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'خدمات بيت الريف',
          itemListElement: SERVICES_SEO.map((s, i) => ({
            '@type': 'OfferCatalog',
            name: s.nameAr,
            description: s.descAr,
            position: i + 1,
          })),
        },
      });

      // Service ItemList for rich search results
      injectJsonLd('ld-servicelist', {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `خدمات ${SITE_NAME_AR}`,
        description: 'جميع خدمات البناء والصيانة في الإمارات',
        numberOfItems: SERVICES_SEO.length,
        itemListElement: SERVICES_SEO.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: s.nameAr,
          description: s.descAr,
          url: `${SITE_DOMAIN}/services/${s.slug}`,
        })),
      });
    }

    if (path === '/services') {
      // Services Index: ItemList
      injectJsonLd('ld-servicelist', {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'جميع الخدمات في الإمارات',
        numberOfItems: SERVICES_SEO.length,
        itemListElement: SERVICES_SEO.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: s.nameAr,
          description: s.descAr,
          url: `${SITE_DOMAIN}/services/${s.slug}`,
        })),
      });
    }

    // SiteNavigationElement (helps Google understand nav structure)
    injectJsonLd('ld-sitenav', {
      '@context': 'https://schema.org',
      '@type': 'SiteNavigationElement',
      name: 'القائمة الرئيسية',
      hasPart: [
        { '@type': 'SiteNavigationElement', name: 'الرئيسية', url: `${SITE_DOMAIN}/home` },
        { '@type': 'SiteNavigationElement', name: 'الخدمات', url: `${SITE_DOMAIN}/services` },
        { '@type': 'SiteNavigationElement', name: 'المتجر', url: `${SITE_DOMAIN}/shop` },
        { '@type': 'SiteNavigationElement', name: 'الأدوات الذكية', url: `${SITE_DOMAIN}/tools` },
        { '@type': 'SiteNavigationElement', name: 'الخرائط', url: `${SITE_DOMAIN}/maps` },
        { '@type': 'SiteNavigationElement', name: 'المشاريع', url: `${SITE_DOMAIN}/projects` },
        { '@type': 'SiteNavigationElement', name: 'وياك AI', url: `${SITE_DOMAIN}/yak` },
      ],
    });

    // Breadcrumb for all pages
    const breadcrumbs = generateBreadcrumbs(path);
    if (breadcrumbs.length > 0) {
      injectJsonLd('ld-breadcrumb', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs,
      });
    }

  }, [location, title, description, type]);

  return null;
};

// ──────────────────────────────────────────────────
// Breadcrumb generator
// ──────────────────────────────────────────────────
function generateBreadcrumbs(path: string) {
  const items: any[] = [
    { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_DOMAIN}/home` },
  ];

  if (path === '/home' || path === '/') return items;

  const pageMap: Record<string, string> = {
    '/services': 'الخدمات',
    '/shop': 'المتجر',
    '/store': 'المتجر',
    '/tools': 'الأدوات الذكية',
    '/maps': 'الخرائط',
    '/yak': 'وياك AI',
    '/projects': 'المشاريع',
    '/wallet': 'محفظة الدار',
    '/profile': 'الملف الشخصي',
    '/platform': 'مميزات المنصة',
    '/rfq': 'طلب عرض سعر',
    '/offers': 'العروض',
    '/recommendations': 'التوصيات',
    '/marketplace': 'السوق',
  };

  // Check if it's a service detail page
  const serviceMatch = path.match(/^\/services\/([^/]+)/);
  if (serviceMatch) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: 'الخدمات',
      item: `${SITE_DOMAIN}/services`,
    });

    const slug = serviceMatch[1];
    const svc = ALL_SERVICES_SEO.find(s => s.slug === slug);
    if (svc) {
      items.push({
        '@type': 'ListItem',
        position: 3,
        name: svc.nameAr,
        item: `${SITE_DOMAIN}/services/${slug}`,
      });
    }

    // City sub-path
    const cityMatch = path.match(/^\/services\/[^/]+\/([^/]+)$/);
    if (cityMatch) {
      const city = EMIRATES_AND_CITIES.find(c => c.slug === cityMatch[1]);
      if (city && svc) {
        items.push({
          '@type': 'ListItem',
          position: 4,
          name: `${svc.nameAr} في ${city.nameAr}`,
          item: `${SITE_DOMAIN}${path}`,
        });
      }
    }

    return items;
  }

  // Other pages
  const pageName = pageMap[path];
  if (pageName) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: pageName,
      item: `${SITE_DOMAIN}${path}`,
    });
  }

  return items;
}