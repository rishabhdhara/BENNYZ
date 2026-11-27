interface ApiRequest {
  method?: string;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
}

/**
 * Safely exposes public Razorpay Checkout readiness and public Key ID
 * so deployments work even if only server env vars (RAZORPAY_KEY_ID / SECRET) are set.
 */
export default function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const keyId =
    process.env.RAZORPAY_KEY_ID?.trim() ||
    process.env.VITE_RAZORPAY_KEY_ID?.trim() ||
    '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim() || '';

  const razorpayEnabled = Boolean(keyId && keySecret);
  const mode = !razorpayEnabled
    ? 'demo'
    : keyId.startsWith('rzp_test_')
    ? 'test'
    : 'live';

  return res.status(200).json({
    razorpayEnabled,
    keyId: razorpayEnabled ? keyId : null,
    mode,
  });
}
