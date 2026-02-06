import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { EMIRATES_AND_CITIES, AI_TOOLS_LINKS } from '../../utils/seoConstants';

interface SEOHeadProps {
  title?: string;
  description?: string;
  type?: 'website' | 'article' | 'service';
}

export const SEOHead = ({ title, description, type = 'website' }: SEOHeadProps) => {
  const location = useLocation();

  useEffect(() => {
    // 0. Security viewport meta — disable zoom
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover');

    // Block PWA: remove manifest, add meta to prevent install banner
    const manifests = document.querySelectorAll('link[rel="manifest"]');
    manifests.forEach(m => m.remove());

    // Ensure no apple-mobile-web-app-capable (prevents "Add to Home Screen" behavior)
    let appleMeta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (appleMeta) appleMeta.remove();

    // 1. تحديد العنوان الافتراضي
    let pageTitle = title || 'بيت الريف | منصة الخدمات الشاملة في الإمارات';
    let pageDesc = description || 'اكتشف أفضل الحرفيين، شركات المقاولات، ومحلات مواد البناء في الإمارات. استخدم أدوات الذكاء الاصطناعي لحساب التكاليف وتصميم الديكور.';

    // 2. منطق ذكي لتوليد العناوين بناءً على الرابط (Dynamic Route Matching)
    const path = location.pathname;

    // حالة: صفحات المناطق والخدمات
    if (path.includes('/ae/')) {
      const parts = path.split('/');
      const citySlug = parts[2];
      const serviceSlug = parts[3];
      
      const city = EMIRATES_AND_CITIES.find(c => c.slug === citySlug);
      
      if (city) {
         if (serviceSlug) {
            // مثال: /ae/al-ain/plumbing
            pageTitle = `أفضل خدمات ${serviceSlug} في ${city.nameAr} | بيت الريف`;
            pageDesc = `ابحث عن أفضل مقدمي خدمات ${serviceSlug} في ${city.nameAr}. قارن الأسعار والتقييمات واحصل على عروض فورية.`;
         } else {
            // مثال: /ae/al-ain
            pageTitle = `خدمات الصيانة والبناء في ${city.nameAr} | بيت الريف`;
            pageDesc = `دليلك الشامل لخدمات البناء، الصيانة، ومواد البناء في ${city.nameAr}. تصفح العروض الحصرية.`;
         }
      }
    }

    // حالة: صفحات الأدوات
    if (path.includes('/tools/')) {
      const toolSlug = path.split('/')[2];
      const tool = AI_TOOLS_LINKS.find(t => t.slug === toolSlug);
      if (tool) {
        pageTitle = `${tool.nameAr} | أدوات بيت الريف الذكية`;
        pageDesc = tool.description;
      }
    }

    // 3. تطبيق التغييرات
    document.title = pageTitle;
    
    // تغيير Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageDesc);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = pageDesc;
      document.head.appendChild(meta);
    }

    // إضافة Canonical URL
    const canonicalUrl = `https://bietalreef.com${location.pathname}`;
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) {
      linkCanonical.setAttribute('href', canonicalUrl);
    } else {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      linkCanonical.setAttribute('href', canonicalUrl);
      document.head.appendChild(linkCanonical);
    }

  }, [location, title, description]);

  return null; // هذا المكون لا يعرض شيئاً بصرياً
};