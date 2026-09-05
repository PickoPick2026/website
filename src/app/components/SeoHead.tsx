import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FAQS } from './NRI/data/mockData';

const SITE_URL = 'https://pickopick.com';
const DEFAULT_IMAGE = `${SITE_URL}/images/hero-global-delivery-v5.webp`;

const PAGE_DATA: Record<string, { title: string; description: string; keywords: string; noIndex?: boolean }> = {
  '/': { title: 'Shop from India & Ship Worldwide | Pick O Pick', description: 'Shop from India, arrange parcel pickup, consolidate purchases and ship internationally from India with Pick O Pick.', keywords: 'shop from India, international shipping from India, courier from India, parcel delivery from India, package forwarding India' },
  '/nri': { title: 'NRI Shipping, Personal Shopper & Parcel Consolidation from India | Pick O Pick', description: 'NRI concierge for shopping from India, personal items, gifts, groceries and parcel consolidation with international delivery from India.', keywords: 'NRI shipping service, personal shopper from India, parcel consolidation India, ship from India to USA, send parcel from India' },
  '/shop': { title: 'Shop from India Online with International Delivery | Pick O Pick', description: 'Browse Indian products and request personal shopping, sourcing and international delivery support from India to your doorstep.', keywords: 'shop from India online, buy Indian products online abroad, personal shopper India, India package forwarding, Indian shopping international delivery' },
  '/shipping-estimate': { title: 'Request an International Shipping Quote from India | Pick O Pick', description: 'Request a verified quote for an international parcel from India. Our team confirms shipment details and replies by WhatsApp or email.', keywords: 'international courier quote India, shipping estimate from India, courier from India to USA, international parcel quote India' },
  '/contact': { title: 'Contact Pick O Pick | India Shopping & International Shipping Support', description: 'Contact Pick O Pick for personal shopping from India, parcel pickup, package consolidation and international shipping support.', keywords: 'contact international courier India, India shopping support, package forwarding support India' },
  '/prohibited': { title: 'Prohibited & Restricted Items for International Shipping | Pick O Pick', description: 'Check prohibited and restricted items before sending an international parcel from India.', keywords: 'prohibited items international shipping India, restricted items courier India, customs shipping India' },
  '/terms': { title: 'Terms of Service | Pick O Pick', description: 'Read the Pick O Pick terms of service.', keywords: 'Pick O Pick terms of service' },
  '/privacy': { title: 'Privacy Policy | Pick O Pick', description: 'Read the Pick O Pick privacy policy.', keywords: 'Pick O Pick privacy policy' },
  '/refund': { title: 'Refund Policy | Pick O Pick', description: 'Read the Pick O Pick refund policy.', keywords: 'Pick O Pick refund policy' },
  '/cart': { title: 'Cart | Pick O Pick', description: 'Customer cart.', keywords: '', noIndex: true },
  '/orders': { title: 'Orders | Pick O Pick', description: 'Customer orders.', keywords: '', noIndex: true },
  '/addresses': { title: 'Addresses | Pick O Pick', description: 'Customer addresses.', keywords: '', noIndex: true },
  '/wallet': { title: 'Wallet | Pick O Pick', description: 'Customer wallet.', keywords: '', noIndex: true },
  '/profile': { title: 'Profile | Pick O Pick', description: 'Customer profile.', keywords: '', noIndex: true },
};

const setMeta = (selector: string, attribute: 'name' | 'property', value: string) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, selector.match(/="([^"]+)/)?.[1] || '');
    document.head.appendChild(element);
  }
  element.content = value;
};

export function SeoHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = PAGE_DATA[pathname] || PAGE_DATA['/'];
    const canonicalUrl = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;
    document.title = page.title;
    setMeta('meta[name="robots"]', 'name', page.noIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
    setMeta('meta[name="description"]', 'name', page.description);
    setMeta('meta[name="keywords"]', 'name', page.keywords);
    setMeta('meta[property="og:title"]', 'property', page.title);
    setMeta('meta[property="og:description"]', 'property', page.description);
    setMeta('meta[property="og:url"]', 'property', canonicalUrl);
    setMeta('meta[property="og:image"]', 'property', DEFAULT_IMAGE);
    setMeta('meta[name="twitter:title"]', 'name', page.title);
    setMeta('meta[name="twitter:description"]', 'name', page.description);
    setMeta('meta[name="twitter:image"]', 'name', DEFAULT_IMAGE);

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = canonicalUrl;

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebPage', '@id': `${canonicalUrl}#webpage`, url: canonicalUrl, name: page.title, description: page.description, keywords: page.keywords, isPartOf: { '@id': `${SITE_URL}/#website` }, about: { '@id': `${SITE_URL}/#organization` } },
        { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` }, ...(pathname === '/' ? [] : [{ '@type': 'ListItem', position: 2, name: page.title.split(' | ')[0], item: canonicalUrl }])] },
        ...(pathname === '/nri' ? [{ '@type': 'FAQPage', mainEntity: FAQS.map((faq) => ({ '@type': 'Question', name: faq.q, acceptedAnswer: { '@type': 'Answer', text: faq.a } })) }] : []),
        ...(pathname === '/nri' ? [{ '@type': 'ItemList', name: 'NRI shipping services', itemListElement: [
          'Shop from India', 'Send Personal Items', 'Food & Groceries', 'Gifts & Festive Parcels', 'Package Consolidation', 'Business & Bulk Shipping',
        ].map((name, position) => ({ '@type': 'ListItem', position: position + 1, name })) }] : []),
      ],
    };
    let schemaTag = document.getElementById('route-seo-schema') as HTMLScriptElement | null;
    if (!schemaTag) { schemaTag = document.createElement('script'); schemaTag.id = 'route-seo-schema'; schemaTag.type = 'application/ld+json'; document.head.appendChild(schemaTag); }
    schemaTag.text = JSON.stringify(schema);
  }, [pathname]);

  return null;
}
