export interface ResellerPlan {
  id: string;
  name: string;
  priceBDT: number;
  billingPeriod: string;
  badge?: string;
  description: string;
  features: string[];
  ctaText?: string;
}

export const RESELLER_PLANS: ResellerPlan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    priceBDT: 0,
    billingPeriod: 'Free Forever',
    description: 'Perfect for getting started with zero upfront inventory cost.',
    ctaText: 'Start Selling Free',
    features: [
      'Access to wholesale catalog',
      'Instant margin profits in BDT',
      'Automated COD Courier integration',
      'Shareable product links',
      'Standard customer support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Reseller',
    priceBDT: 999,
    billingPeriod: 'per month',
    badge: 'Most Popular',
    description: 'For growing entrepreneurs scaling their digital stores.',
    ctaText: 'Upgrade to Pro',
    features: [
      'Custom branded storefront',
      'High-converting landing page builder',
      'Priority next-day courier dispatch',
      'Instant bKash/Nagad wallet withdrawal',
      'VIP WhatsApp support & sales training'
    ]
  },
  {
    id: 'enterprise',
    name: 'Agency & Elite',
    priceBDT: 2499,
    billingPeriod: 'per month',
    description: 'For power sellers and marketing teams managing high volumes.',
    ctaText: 'Get Enterprise Access',
    features: [
      'Custom domain mapping (yourstore.com)',
      'Bulk catalog import & white-label packaging',
      'Exclusive Tier-1 supplier pricing discounts',
      'Dedicated account manager',
      'API webhook access for automated order sync'
    ]
  }
];
