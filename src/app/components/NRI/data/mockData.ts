import { ServiceOption } from '../types';

export const NRI_SERVICES: ServiceOption[] = [
  {
    id: 'shop_from_india',
    title: 'Shop From India',
    shortDesc: 'Tell us what you want. We’ll help source it from any local or online Indian market.',
    tagline: 'Personal Sourcing & Shopping Assistance',
    badge: 'Popular for NRIs',
    iconName: 'ShoppingBag',
    imagePath: '/images/nri-services/shop-from-india.webp',
    popularItems: ['Clothing & Ethnic Wear', 'Ayurvedic Products', 'Regional Books & Stationery', 'Handcrafted Utensils'],
  },
  {
    id: 'personal_items',
    title: 'Send Personal Items',
    shortDesc: 'Send clothes, personal belongings, essential documents, and family heirlooms safely.',
    tagline: 'Doorstep Courier & Relocation',
    badge: 'Express Doorstep',
    iconName: 'Package',
    imagePath: '/images/nri-services/personal-items.webp',
    popularItems: ['Wardrobe Excess', 'Academic Certificates', 'Family Keepsakes', 'Custom Tailored Outfits'],
  },
  {
    id: 'food_groceries',
    title: 'Food & Groceries',
    shortDesc: 'Bring your favourite authentic Indian snacks, homemade savouries, spices and essentials.',
    tagline: 'FSSAI Verified & Sealed Packing',
    badge: 'Specialized Food Packing',
    iconName: 'Utensils',
    imagePath: '/images/nri-services/food-groceries.webp',
    popularItems: ['Homemade Sweets & Pickles', 'Regional Spices & Masalas', 'Dry Snacks & Namkeens', 'Organic Herbal Teas'],
  },
  {
    id: 'gifts_festive',
    title: 'Gifts & Festive Parcels',
    shortDesc: 'Send thoughtful gifts, Diwali faral, Rakhi sets, and wedding return gifts to loved ones abroad.',
    tagline: 'Curated Packaging & Greetings',
    badge: 'Festive Ready',
    iconName: 'Gift',
    imagePath: '/images/nri-services/gifts-festive.webp',
    popularItems: ['Festival Sweets & Diyas', 'Wedding Favors & Hampers', 'Pooja Essentials', 'Customized NRI Gift Boxes'],
  },
  {
    id: 'consolidation',
    title: 'Consolidate My Purchases',
    shortDesc: 'Buy from multiple Indian sellers (Amazon India, Flipkart, Myntra, local shops) & ship together.',
    tagline: 'Zero Locker Fees for 30 Days',
    badge: 'Save up to 70% Shipping',
    iconName: 'Layers',
    imagePath: '/images/nri-services/consolidation.webp',
    popularItems: ['E-Commerce Multi-Cart', 'Designer Saree Parcels', 'Tech Accessories & Books', 'Combined Family Boxes'],
  },
  {
    id: 'business_bulk',
    title: 'Business / Bulk Shipping',
    shortDesc: 'Commercial sourcing and reliable international cargo for overseas businesses and traders.',
    tagline: 'Commercial Invoice & Export Customs',
    badge: 'B2B & Commercial',
    iconName: 'Truck',
    imagePath: '/images/nri-services/business-bulk.webp',
    popularItems: ['Export Apparel & Fabrics', 'Handicrafts & Decor Inventory', 'Corporate Merchandise', 'Event Supplies'],
  },
];

export const POPULAR_NRI_COUNTRIES = [
  'USA',
  'UK',
  'UAE',
  'Canada',
  'Australia',
  'Singapore',
  'Germany',
  'Europe',
  'Other',
];

export const ALL_SUPPORTED_COUNTRIES = [
  'United States',
  'United Kingdom',
  'United Arab Emirates',
  'Canada',
  'Australia',
  'Singapore',
  'Germany',
  'France',
  'Netherlands',
  'New Zealand',
  'Ireland',
  'Malaysia',
  'Saudi Arabia',
  'Qatar',
  'Kuwait',
  'Oman',
  'Bahrain',
  'Switzerland',
  'Sweden',
  'Japan',
  'South Africa',
  'Other Country',
];

export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'You Tell Us',
    desc: 'Share your shopping list or schedule a pickup for items already in India.',
    icon: 'MessageSquare',
  },
  {
    step: '02',
    title: 'We Source / Collect',
    desc: 'Our team shops on your behalf or collects items from your Indian doorstep.',
    icon: 'Store',
  },
  {
    step: '03',
    title: 'We Consolidate',
    desc: 'Receive goods at our hub, discard excess packaging, and combine into one box.',
    icon: 'Boxes',
  },
  {
    step: '04',
    title: 'We Pack',
    desc: 'Heavy-duty 5-ply waterproof packaging with vacuum sealing for food and delicates.',
    icon: 'ShieldCheck',
  },
  {
    step: '05',
    title: 'We Ship',
    desc: 'Dispatched via premium express air carriers with real-time tracking.',
    icon: 'Plane',
  },
  {
    step: '06',
    title: 'You Receive',
    desc: 'Delivered directly to your overseas doorstep with complete customs clearance.',
    icon: 'Home',
  },
];

export const TRUST_PILLARS = [
  {
    title: 'Shop From India',
    desc: 'Order from any Indian store, Instagram boutique, or local bazaar with our dedicated shopper concierge.',
    icon: 'ShoppingBag',
  },
  {
    title: 'Source With Confidence',
    desc: 'Quality inspection photos sent on WhatsApp before final packing so you only pay for what you approved.',
    icon: 'CheckCircle2',
  },
  {
    title: 'Consolidate Multiple Purchases',
    desc: 'Combine orders from 10 different sellers into a single volumetric-optimized box to save up to 70% on freight.',
    icon: 'Layers',
  },
  {
    title: 'Professional Packing',
    desc: 'FSSAI-grade vacuum sealing for snacks, bubble-wrap armor for breakables, and tamper-evident strapping.',
    icon: 'Shield',
  },
  {
    title: 'International Shipping',
    desc: 'Direct air cargo lanes with established global logistics partners reaching 180+ countries in 3–6 business days.',
    icon: 'Globe2',
  },
  {
    title: 'Personal Support',
    desc: 'Dedicated WhatsApp relationship manager who speaks your regional language and coordinates every detail.',
    icon: 'Headphones',
  },
];

export const NRI_USE_CASES = [
  {
    question: 'Need something from your hometown?',
    desc: 'From traditional sweets in Surat to handwoven silk in Kanchipuram, our shoppers procure authentic local specialties.',
    serviceId: 'shop_from_india',
    tag: 'Regional Sourcing',
  },
  {
    question: 'Sending a festival package to family?',
    desc: 'Diwali hampers, Rakhi packages, and festive apparel delivered reliably before the auspicious date arrives.',
    serviceId: 'gifts_festive',
    tag: 'Festive Express',
  },
  {
    question: 'Buying from multiple Indian sellers?',
    desc: 'Ship your orders from Amazon, Flipkart, Ajio, and local vendors to our warehouse. We combine them for one international flight.',
    serviceId: 'consolidation',
    tag: 'Smart Consolidation',
  },
  {
    question: 'Moving personal belongings abroad?',
    desc: 'Relocating or sending winter wear, books, kitchen appliances, and study materials with safe doorstep collection across India.',
    serviceId: 'personal_items',
    tag: 'Luggage & Personal Items',
  },
  {
    question: 'Sending Indian groceries & essentials?',
    desc: 'Homemade pickles, roasted spices, papads, and organic Ayurvedic herbs sealed securely to comply with international customs.',
    serviceId: 'food_groceries',
    tag: 'Food & Groceries',
  },
  {
    question: 'Running a business overseas?',
    desc: 'Commercial sample shipments, boutique inventory restocking, and wholesale merchandise with export paperwork support.',
    serviceId: 'business_bulk',
    tag: 'Commercial Cargo',
  },
];

export const AUTHENTIC_TESTIMONIALS = [
  {
    id: 't-1',
    name: 'Siddharth & Priya Menon',
    cityDestination: 'Dallas, TX',
    country: 'USA',
    serviceUsed: 'Food & Festive Consolidation',
    quote: 'Getting homemade pickles and snacks from India used to mean coordinating with multiple relatives and dealing with couriers. Pick O Pick collected from my parents in Bengaluru, vacuum-packed everything, and delivered to Texas in 5 days with zero leakage.',
    date: 'Verified Shipment #POP-US-8921',
  },
  {
    id: 't-2',
    name: 'Ananya Sharma',
    cityDestination: 'London',
    country: 'UK',
    serviceUsed: 'Wedding Outfits & Jewelry Sourcing',
    quote: 'I purchased my bridal lehenga from Chandni Chowk and jewelry from Jaipur. Pick O Pick received both, inspected the stitching on video call, repacked it in waterproof double boxes, and sent it to London. Truly exceptional concierge service!',
    date: 'Verified Shipment #POP-UK-4129',
  },
  {
    id: 't-3',
    name: 'Karthik Ramanathan',
    cityDestination: 'Dubai Marina',
    country: 'UAE',
    serviceUsed: 'Consolidation & Books',
    quote: 'Ordered from 4 different Indian websites. Pick O Pick stored all my packages for 2 weeks until the last order arrived, consolidated them into a single light box, and saved me over AED 450 compared to shipping individually.',
    date: 'Verified Shipment #POP-AE-6310',
  },
  {
    id: 't-4',
    name: 'Harpreet Singh',
    cityDestination: 'Toronto, ON',
    country: 'Canada',
    serviceUsed: 'Personal Items & Documents',
    quote: 'Urgent university documents and winter apparel needed to reach Toronto. The doorstep pickup in Chandigarh was prompt, and the end-to-end live tracking gave our family complete peace of mind.',
    date: 'Verified Shipment #POP-CA-7704',
  },
];

export const FAQS = [
  {
    q: 'Can I ask Pick O Pick to shop for me in India?',
    a: 'Yes! Our personal shopping concierge can purchase items from any online platform (Amazon.in, Flipkart, Myntra, Nykaa, etc.) or offline store in India (local markets, specialty sweet shops, boutiques). Simply share the product link or description in the booking form or on WhatsApp.',
  },
  {
    q: 'Can I combine products from different Indian sellers?',
    a: 'Absolutely. With our Smart Consolidation service, you can have packages from multiple sellers delivered to our consolidation hub. We offer up to 30 days of free locker storage. Once all items arrive, we discard bulky excess packaging and consolidate everything into one compact box to minimize volumetric weight.',
  },
  {
    q: 'Can I send food and homemade groceries?',
    a: 'Yes, we specialize in international food courier services. We accept commercially packaged branded foods as well as homemade sweets, dry snacks, and spices. Homemade food items are vacuum-sealed with FSSAI-grade packaging to comply with international quarantine regulations.',
  },
  {
    q: 'Can I send personal belongings and documents?',
    a: 'Yes. We handle personal effects, clothes, footwear, academic transcripts, books, kitchenware, and household items. We provide secure door-to-door pickup across all Indian cities and villages.',
  },
  {
    q: 'How does consolidation save me money?',
    a: 'International courier carriers charge on either gross weight or volumetric weight (dimensions). Sending 5 separate small packages incurs 5 base charges. Combining them into one optimized box eliminates duplicate base fees and reduces dimensional air space, typically saving between 50% to 70% in international shipping costs.',
  },
  {
    q: 'How do I schedule a pickup in India?',
    a: 'Use our interactive booking form on this page. Select your service, enter package details, choose your destination, and pick a preferred date and live time slot. Our team in India will coordinate the exact pickup time with your family or sender.',
  },
  {
    q: 'Can I change or reschedule my pickup slot?',
    a: 'Yes. You can contact our dedicated WhatsApp concierge team anytime with your Booking ID (e.g., POP-2026-XXXX) to adjust the pickup date, time window, or contact person details free of charge.',
  },
  {
    q: 'How is the shipping cost calculated?',
    a: 'Shipping rates are calculated based on the chargeable weight (the higher of actual weight vs volumetric weight calculated as L x W x H / 5000) and the destination country zone. You can use our interactive Shipping Estimate tool above for immediate rate guidelines.',
  },
  {
    q: 'What international destinations do you support?',
    a: 'We ship to over 180 countries worldwide, including the United States, United Kingdom, Canada, Australia, UAE, Singapore, New Zealand, Germany, France, Ireland, Netherlands, Saudi Arabia, Qatar, and across Europe and Asia.',
  },
  {
    q: 'Can I speak to someone before booking?',
    a: 'Certainly! Click "Book Free Consultation" or the "Chat on WhatsApp" button at any time. Our NRI concierge specialists are available to guide you through customs rules, item restrictions, and rate quotes with no commitment.',
  },
];
