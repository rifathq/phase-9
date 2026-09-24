/**
 * Client-Side API communication layer for Zero Invest Express backend
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const backendApi = {
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    try {
      const res = await fetch('/api/health');
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error' };
    }
  },

  async verifyPayment(params: {
    trxId: string;
    method: string;
    amount: number;
    orderNumber?: string;
  }): Promise<ApiResponse<{ verified: boolean; message: string }>> {
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err?.message || 'Payment verification request failed' };
    }
  },

  async syncResellerStore(storeData: any): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/reseller/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeData),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err?.message || 'Store sync failed' };
    }
  }
};
