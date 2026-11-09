// Thin wrapper around the Razorpay Checkout.js widget, loaded globally via
// the <script src="https://checkout.razorpay.com/v1/checkout.js"> tag in
// index.html. This replaces the old simulated/fake payment modal.

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayCheckoutResult {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface OpenRazorpayCheckoutArgs {
  keyId: string;
  razorpayOrderId: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description: string;
  prefill?: { name?: string; contact?: string; email?: string };
}

export function openRazorpayCheckout(args: OpenRazorpayCheckoutArgs): Promise<RazorpayCheckoutResult> {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error('Razorpay Checkout script did not load. Check your internet connection and try again.'));
      return;
    }
    const rzp = new window.Razorpay({
      key: args.keyId,
      amount: args.amount,
      currency: args.currency,
      name: args.name,
      description: args.description,
      order_id: args.razorpayOrderId,
      prefill: args.prefill || {},
      theme: { color: '#2563EB' },
      handler: (response: RazorpayCheckoutResult) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled')),
      },
    });
    rzp.on('payment.failed', (response: any) => {
      reject(new Error(response?.error?.description || 'Payment failed'));
    });
    rzp.open();
  });
}
