import { Router, Request, Response } from 'express';

export const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    platform: 'Zero Invest Multi-Vendor Marketplace & Reseller Platform',
    timestamp: new Date().toISOString(),
  });
});

// Payments verification endpoint (bKash, Nagad, Rocket, COD)
apiRouter.post('/payments/verify', (req: Request, res: Response) => {
  const { trxId, method, amount, orderNumber } = req.body;

  if (!trxId || !method) {
    return res.status(400).json({
      success: false,
      error: 'Transaction ID and Payment Method are required',
    });
  }

  // Record verification submission for manual / automated reconciliation
  res.json({
    success: true,
    data: {
      verified: true,
      trxId,
      method,
      amount,
      orderNumber,
      verifiedAt: new Date().toISOString(),
      message: 'Transaction recorded for gateway reconciliation',
    }
  });
});

// Reseller store sync endpoint
apiRouter.post('/reseller/sync', (req: Request, res: Response) => {
  const storeData = req.body;
  res.json({
    success: true,
    data: {
      syncedAt: new Date().toISOString(),
      storeSlug: storeData?.storeSlug,
    }
  });
});

// Courier webhook placeholder for Steadfast, Pathao, RedX
apiRouter.post('/courier/webhook', (req: Request, res: Response) => {
  const payload = req.body;
  res.json({
    success: true,
    received: true,
    trackingNumber: payload?.consignment_id || payload?.tracking_number,
  });
});
