import { Product } from '@/types/marketplace';

export interface ResellerPricing {
  wholesalePrice: number;
  supplierPrice: number;
  suggestedPrice: number;
  potentialProfit: number;
  profitMargin: number;
  profitMarginPercent: number;
}

export function getProductResellerPricing(
  product: Product,
  isAuthenticated: boolean = false
): ResellerPricing {
  const wholesalePrice = product.supplierPrice ?? Math.round(product.price * 0.75);
  const suggestedPrice = product.suggestedPrice ?? product.price;
  const potentialProfit = product.resellerProfit ?? Math.max(0, suggestedPrice - wholesalePrice);
  const profitMargin = suggestedPrice > 0 ? Math.round((potentialProfit / suggestedPrice) * 100) : 0;

  return {
    wholesalePrice,
    supplierPrice: wholesalePrice,
    suggestedPrice,
    potentialProfit,
    profitMargin,
    profitMarginPercent: profitMargin,
  };
}
