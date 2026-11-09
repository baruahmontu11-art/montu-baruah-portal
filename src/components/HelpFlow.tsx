import React, { useState } from 'react';
import { User, MapPin, Phone, ShieldAlert, Sparkles, CreditCard, QrCode, Copy, CheckCircle, AlertTriangle, ArrowRight, ArrowLeft, Upload, Check } from 'lucide-react';
import { WebsiteSettings } from '../types';
import { createHelpRequest, createRazorpayOrder, verifyRazorpayPayment, submitManualPaymentProof } from '../lib/api';
import { openRazorpayCheckout } from '../lib/razorpay';

interface HelpFlowProps {
  settings: WebsiteSettings;
  onSuccess: (message: string) => void;
  onNavigate: (page: string) => void;
}

export default function HelpFlow({ settings, onSuccess, onNavigate }: HelpFlowProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [service, setService] = useState<string>(settings.payoutServices?.[0]?.key || 'OTHER');
  const [problemDesc, setProblemDesc] = useState('');
  const [paymentTab, setPaymentTab] = useState<'razorpay' | 'manual_upi'>('razorpay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [rzpLoading, setRzpLoading] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  // Manual payment proof state variables
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [proofName, setProofName] = useState('');
  const [proofSize, setProofSize] = useState('');
  const [proofLoading, setProofLoading] = useState(false);
  const [txId, setTxId] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Service list prices (sourced from admin-managed settings.payoutServices)
  const getPrice = (type: string) => {
    if (type === 'OTHER') return 0; // FREE / custom estimate, discussed on WhatsApp
    const svc = (settings.payoutServices || []).find((s) => s.key === type);
    return svc ? svc.price : 0;
  };

  const currentPrice = getPrice(service);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !whatsapp.trim()) return;
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (service === 'OTHER' && !problemDesc.trim()) return;
    setStep(3);
  };

  const handleCreateRequest = async (method: 'razorpay' | 'manual_upi' | 'none') => {
    setIsSubmitting(true);
    try {
      const data = await createHelpRequest({
        name,
        address,
        whatsappNumber: whatsapp,
        serviceType: service,
        problemDescription: problemDesc,
        paymentMethod: method
      });
      if (data.success) {
        setOrderInfo({ ...data.request, orderId: data.orderId });
        if (currentPrice === 0) {
          // Free flow directly generates WhatsApp link
          triggerWhatsApp(data.request, 'none');
        } else {
          // Paid flow moves to Step 4 (Payment Interface)
          setStep(4);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Triggers the prefilled WhatsApp link generator
  const triggerWhatsApp = (req: any, pMethod: string, isPaidManual = false) => {
    const sName = req.serviceType === 'OTHER'
      ? 'Other Problem Help'
      : (settings.payoutServices || []).find((s) => s.key === req.serviceType)?.name || 'Digital Assistance Service';
         
    const baseMessage = `Hello Montu Baruah, I have submitted a Digital Service Request on your website.\n\n` +
      `*Request ID:* ${req.id}\n` +
      `*Name:* ${req.name}\n` +
      `*Address:* ${req.address}\n` +
      `*WhatsApp:* ${req.whatsappNumber}\n` +
      `*Service:* ${sName}\n` +
      `*Amount:* ₹${req.servicePrice || 'FREE/Discuss'}\n` +
      `*Problem Description:* ${req.problemDescription || 'N/A'}\n\n`;

    let finalMessage = baseMessage;
    if (isPaidManual) {
      finalMessage += `*Payment Mode:* Manual UPI / QR Code\n` +
                     `*Status:* Payment Sent (Screenshot Attached Below)\n\n` +
                     `_Please verify my transaction screenshot and activate my request._`;
    } else if (pMethod === 'none') {
      finalMessage += `*Payment Mode:* N/A (FREE Service)\n` +
                     `_Please assist me with setting up my payouts._`;
    } else {
      finalMessage += `*Payment Mode:* Razorpay Checkout\n` +
                     `*Status:* Paid (Transaction ID: ${req.transactionId || 'Verified'})\n\n` +
                     `_Please review my request details and initiate resolution._`;
    }

    const encoded = encodeURIComponent(finalMessage);
    const destPhone = settings.whatsappNumber ? settings.whatsappNumber.replace(/[^0-9]/g, '') : '918136081232';
    const link = `https://wa.me/${destPhone}?text=${encoded}`;
         
    // Notify app of success and open WhatsApp
    onSuccess('Request logged! Redirecting to WhatsApp to coordinate with Montu Baruah.');
    window.open(link, '_blank');
         
    // Reset flow
    setName('');
    setAddress('');
    setWhatsapp('');
    setProblemDesc('');
    setStep(1);
    setOrderInfo(null);
  };

  const handleProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate size (5MB maximum)
    if (file.size > 5 * 1024 * 1024) {
      alert("Screenshot must be smaller than 5 MB.");
      e.target.value = '';
      return;
    }
    // Validate extension
    const allowed = ['.png', '.jpg', '.jpeg', '.webp'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowed.includes(ext)) {
      alert("Invalid format. Please upload PNG, JPG, JPEG, or WEBP.");
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProofFile(file);
      setProofPreview(reader.result as string);
      setProofName(file.name);
      setProofSize((file.size / 1024 / 1024).toFixed(2) + ' MB');
    };
    reader.readAsDataURL(file);
  };

  const handleCancelProof = () => {
    setProofFile(null);
    setProofPreview(null);
    setProofName('');
    setProofSize('');
  };

  const handleSubmitProof = async () => {
    if (!orderInfo) return;
    setProofLoading(true);
    try {
      const res = await submitManualPaymentProof(orderInfo.orderId || orderInfo.id, {
        screenshotBase64: proofPreview || undefined,
        screenshotName: proofName || undefined,
        transactionId: txId || undefined
      });
      if (res && res.success) {
        setSubmitSuccess(true);
        onSuccess('Payment screenshot submitted successfully! Admin will verify soon.');
        triggerWhatsApp(orderInfo, 'manual_upi', true);
      } else {
        alert('Failed to submit proof. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to submit payment proof.');
    } finally {
      setProofLoading(false);
    }
  };

  // Opens the real Razorpay Checkout widget and verifies the payment server-side
  const handleRazorpayCheckout = async () => {
    if (!orderInfo?.orderId) {
      alert('No payment order found for this request. Please go back and try again.');
      return;
    }
    setRzpLoading(true);
    try {
      const rzpOrder = await createRazorpayOrder(orderInfo.orderId);
      const result = await openRazorpayCheckout({
        keyId: rzpOrder.keyId,
        razorpayOrderId: rzpOrder.razorpayOrderId,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: 'Montu Baruah',
        description: 'Digital Assistance Service Fee',
        prefill: { name, contact: whatsapp },
      });
      setIsSubmitting(true);
      const verifyData = await verifyRazorpayPayment(
        orderInfo.orderId,
        result.razorpay_order_id,
        result.razorpay_payment_id,
        result.razorpay_signature
      );
      if (verifyData.success) {
        triggerWhatsApp({ ...orderInfo, transactionId: verifyData.order.transactionId }, 'razorpay');
      }
    } catch (err: any) {
      console.error(err);
      if (err?.message !== 'Payment cancelled') {
        alert(err?.message || 'Payment failed. Please try again or use manual UPI.');
      }
    } finally {
      setRzpLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div id="help-flow-section" className="mx-auto max-w-2xl rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-xl relative text-left">
      {/* Progress eyebrow */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-xs font-black tracking-widest text-[#2563EB] uppercase">GET DIGITAL ASSISTANCE</span>
        <span className="text-xs font-bold text-slate-400">Step {step} of 4</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-slate-100 rounded-full mb-8 overflow-hidden">
        <div 
           className="h-full bg-gradient-to-r from-[#2563EB] to-[#22D3EE] transition-all duration-300"
           style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      {/* STEP 1: PERSONAL INFORMATION */}
      {step === 1 && (
        <form onSubmit={handleNextStep1} className="flex flex-col gap-6">
          <div className="text-left">
            <h3 className="text-xl font-bold text-[#0B1120] mb-2 flex items-center gap-2">
              <User className="h-5 w-5 text-[#2563EB]" />
              Personal Information
            </h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">Provide your contact details so Montu Baruah can trace your account and securely correspond with you.</p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full legal name"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3.5 pl-11 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 transition"
                  required
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Full Address</label>
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Village/City, District, State"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3.5 pl-11 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 transition"
                  required
                />
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">WhatsApp Mobile Number</label>
              <div className="relative">
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="E.g., +91 81360-xxxxx"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3.5 pl-11 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 transition"
                  required
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-4 text-sm tracking-wider uppercase transition-all duration-200 active:scale-95 shadow-lg shadow-blue-200 mt-2 cursor-pointer"
          >
            Continue to Service Selection
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}

      {/* STEP 2: SELECT SERVICE */}
      {step === 2 && (
        <form onSubmit={handleNextStep2} className="flex flex-col gap-6">
          <div className="text-left">
            <h3 className="text-xl font-bold text-[#0B1120] mb-2 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-[#2563EB]" />
              Select Required Digital Solution
            </h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">Choose the specific issue you are experiencing. Select paid solutions or free profile setups.</p>
          </div>

          {/* Cards select */}
          <div className="flex flex-col gap-3">
            {[...(settings.payoutServices || [])]
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((svc) => (
                <div
                  key={svc.id}
                  onClick={() => setService(svc.key)}
                  className={`rounded-2xl border p-4 flex items-center justify-between cursor-pointer transition-all duration-200 ${
                    service === svc.key
                      ? 'border-blue-500 bg-blue-50/50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-left font-semibold">
                    {svc.badge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[9px] font-bold text-amber-700 uppercase mb-1.5">{svc.badge}</span>
                    )}
                    <h4 className="text-sm font-bold text-[#0B1120]">{svc.name}</h4>
                    {svc.description && <p className="text-xs text-slate-400 font-medium">{svc.description}</p>}
                  </div>
                  {svc.price > 0 ? (
                    <div className="text-right shrink-0">
                      {!!svc.originalPrice && svc.originalPrice > svc.price && (
                        <p className="text-[10px] text-slate-400 line-through font-bold">₹{svc.originalPrice.toLocaleString('en-IN')}</p>
                      )}
                      <p className="text-base font-black text-[#2563EB]">₹{svc.price.toLocaleString('en-IN')}</p>
                    </div>
                  ) : (
                    <p className="text-base font-black text-emerald-500 uppercase tracking-widest text-xs bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg shrink-0">FREE</p>
                  )}
                </div>
              ))}

            <div 
               onClick={() => setService('OTHER')}
               className={`rounded-2xl border p-4 flex items-center justify-between cursor-pointer transition-all duration-200 ${
                 service === 'OTHER' 
                    ? 'border-blue-500 bg-blue-50/50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
               }`}
            >
              <div className="text-left flex-1 font-semibold">
                <h4 className="text-sm font-bold text-[#0B1120]">Other Account Restrictions</h4>
                <p className="text-xs text-slate-400 font-medium mb-2">Copyright issues, Originality limits, or direct account problems.</p>
                {service === 'OTHER' && (
                  <textarea
                    value={problemDesc}
                    onChange={(e) => setProblemDesc(e.target.value)}
                    placeholder="Briefly explain the problem you are experiencing (e.g. copyright lock, monetization error)..."
                    className="w-full mt-2 rounded-xl bg-white border border-slate-200 p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition"
                    rows={3}
                    required
                  />
                )}
              </div>
              {service !== 'OTHER' && (
                <p className="text-xs font-bold text-slate-500 uppercase">Describe Problems</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 px-5 text-slate-500 font-bold hover:bg-slate-50 transition text-sm py-4 active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-4 text-sm tracking-wider uppercase transition-all duration-200 active:scale-95 shadow-lg shadow-blue-200 cursor-pointer"
            >
              Review Details
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: REVIEW DETAILS */}
      {step === 3 && (
        <div className="flex flex-col gap-6 text-left">
          <div>
            <h3 className="text-xl font-bold text-[#0B1120] mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#2563EB]" />
              Review Your Requirements
            </h3>
            <p className="text-sm text-slate-500 font-medium">Verify your profile summary and service selection before submitting your ticket.</p>
          </div>

          {/* Details list */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 flex flex-col gap-4 font-semibold text-sm">
            <div className="grid grid-cols-3 border-b border-slate-200/60 pb-3">
              <span className="text-slate-400 uppercase text-[10px] tracking-wider">Full Name</span>
              <span className="col-span-2 text-slate-850">{name}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-slate-200/60 pb-3">
              <span className="text-slate-400 uppercase text-[10px] tracking-wider">Address</span>
              <span className="col-span-2 text-slate-850">{address}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-slate-200/60 pb-3">
              <span className="text-slate-400 uppercase text-[10px] tracking-wider">WhatsApp</span>
              <span className="col-span-2 text-slate-850">{whatsapp}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-slate-200/60 pb-3">
              <span className="text-slate-400 uppercase text-[10px] tracking-wider">Selected Solution</span>
              <span className="col-span-2 text-slate-850 uppercase text-[#2563EB]">
                {service === 'OTHER'
                  ? 'Other restricted issue'
                  : (settings.payoutServices || []).find((s) => s.key === service)?.name || service}
              </span>
            </div>
            {service === 'OTHER' && (
              <div className="grid grid-cols-3 border-b border-slate-200/60 pb-3">
                <span className="text-slate-400 uppercase text-[10px] tracking-wider">Restriction Detail</span>
                <span className="col-span-2 text-slate-650 font-normal">{problemDesc}</span>
              </div>
            )}
            <div className="grid grid-cols-3 pt-1">
              <span className="text-slate-400 uppercase text-[10px] tracking-wider">Final Price</span>
              <span className={`col-span-2 text-lg font-black ${currentPrice > 0 ? 'text-[#2563EB]' : 'text-emerald-500'}`}>
                {currentPrice > 0 ? `₹${currentPrice}` : 'FREE'}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 px-5 text-slate-500 font-bold hover:bg-slate-50 transition text-sm py-4 active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => handleCreateRequest(currentPrice > 0 ? 'razorpay' : 'none')}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-4 text-sm tracking-wider uppercase transition-all duration-200 active:scale-95 shadow-lg shadow-blue-200 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Logging Request...' : currentPrice > 0 ? 'Proceed to Payment Options' : 'Submit Free Request & Chat'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PAYMENT SELECTION (FOR PAID SERVICES ONLY) */}
      {step === 4 && orderInfo && (
        <div className="flex flex-col gap-6 text-left">
          <div>
            <h3 className="text-xl font-bold text-[#0B1120] mb-2 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#2563EB]" />
              Secure Payment Options
            </h3>
            <p className="text-sm text-slate-500 font-medium">Choose between automated online payment verification (Razorpay) or manual UPI/QR code payment channels.</p>
          </div>

          {/* Payment Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setPaymentTab('razorpay')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold border-b-2 transition cursor-pointer ${
                paymentTab === 'razorpay'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <CreditCard className="h-4 w-4" />
              Pay Now Online (Razorpay)
            </button>
            {settings.manualPaymentEnabled !== false && (
              <button
                onClick={() => setPaymentTab('manual_upi')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold border-b-2 transition cursor-pointer ${
                  paymentTab === 'manual_upi'
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <QrCode className="h-4 w-4" />
                Manual UPI / QR Code
              </button>
            )}
          </div>

          {/* Payment Tab Content: Razorpay */}
          {paymentTab === 'razorpay' && (
            <div className="flex flex-col gap-6 pt-2">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5 flex flex-col gap-3 font-semibold">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Service Fee:</span>
                  <span className="text-slate-900">₹{orderInfo.servicePrice}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-slate-200/50 pt-3">
                  <span className="text-slate-500">Gateway Processing:</span>
                  <span className="text-emerald-500 font-bold uppercase tracking-wider text-xs">Secure & Instant</span>
                </div>
                <div className="flex justify-between text-base font-black border-t border-slate-200 pt-3">
                  <span className="text-slate-900">Total Payable:</span>
                  <span className="text-[#2563EB]">₹{orderInfo.servicePrice}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleRazorpayCheckout}
                  disabled={rzpLoading || isSubmitting}
                  className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-sm tracking-wider uppercase transition active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-200 cursor-pointer"
                >
                  {rzpLoading ? 'Launching Razorpay Checkout...' : 'PAY ONLINE SECURELY'}
                </button>
                <p className="text-center text-[10px] text-slate-400 font-medium">Verified Merchant Gateways | Support UPI, cards, netbanking, and Wallets</p>
              </div>
            </div>
          )}

          {/* Payment Tab Content: Manual UPI / QR */}
          {paymentTab === 'manual_upi' && settings.manualPaymentEnabled !== false && (
            <div className="flex flex-col gap-6 pt-2">
              
              {/* QR Code and Credentials */}
              <div className="flex flex-col md:flex-row gap-6 items-center bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                {/* Visual/Real UPI QR */}
                <div className="flex flex-col items-center gap-2 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm w-full md:w-auto shrink-0">
                  <div className="h-40 w-40 bg-slate-50 flex items-center justify-center border border-slate-200 relative rounded-xl overflow-hidden">
                    {settings.upiQrUrl ? (
                      <img src={settings.upiQrUrl} alt="UPI Payment QR" className="h-full w-full object-contain" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 p-4">
                        <QrCode className="h-12 w-12 text-slate-300 mb-2" />
                        <span className="text-[10px] font-bold text-center">QR Code placeholder</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-black tracking-wider uppercase mt-1">Scan using any UPI App</span>
                </div>

                {/* Details list */}
                <div className="flex-1 flex flex-col gap-3.5 w-full text-xs font-semibold">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-bold">UPI ID</span>
                    <div className="flex gap-2">
                      <span className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 font-mono text-[11px] truncate select-all">{settings.upiId || 'montubaruah@upi'}</span>
                      <button 
                         onClick={() => handleCopy(settings.upiId || 'montubaruah@upi', 'UPI ID')} 
                         className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition active:scale-90 cursor-pointer"
                        title="Copy UPI ID"
                      >
                        <Copy className="h-4 w-4 text-slate-500" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-bold">Merchant Name</span>
                    <div className="flex gap-2">
                      <span className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 text-[11px] truncate select-all">{settings.manualPaymentName || 'Montu Baruah'}</span>
                      <button 
                         onClick={() => handleCopy(settings.manualPaymentName || 'Montu Baruah', 'Merchant Name')} 
                         className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition active:scale-90 cursor-pointer"
                        title="Copy Merchant Name"
                      >
                        <Copy className="h-4 w-4 text-slate-500" />
                      </button>
                    </div>
                  </div>

                  {settings.manualPaymentPhone && (
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-bold">Contact/Payee Phone</span>
                      <div className="flex gap-2">
                        <span className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 text-[11px] truncate select-all">{settings.manualPaymentPhone}</span>
                        <button 
                           onClick={() => handleCopy(settings.manualPaymentPhone || '', 'Contact Number')} 
                           className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition active:scale-90 cursor-pointer"
                          title="Copy Contact Number"
                        >
                          <Copy className="h-4 w-4 text-slate-500" />
                        </button>
                      </div>
                    </div>
                  )}

                  {copiedText && (
                    <span className="text-[10px] text-emerald-600 font-bold tracking-wider">Copied {copiedText} successfully!</span>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="flex gap-3 items-start bg-amber-50 border border-amber-200/80 p-4.5 rounded-xl text-xs text-amber-800 font-semibold leading-relaxed">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Important Instructions:</p>
                  <p className="font-normal text-amber-700 mt-1 whitespace-pre-line">
                    {settings.manualPaymentInstructions || `Please transfer exactly ₹${orderInfo.servicePrice} using the QR code or UPI details above. Once done, upload the transaction receipt screenshot below along with the transaction ID.`}
                  </p>
                </div>
              </div>

              {/* Screenshot Upload Widget */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col gap-4">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Submit Payment Verification Proof</h4>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="flex-1 w-full">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition min-h-[110px] text-center">
                      <Upload className="h-6 w-6 text-slate-400 mb-1.5" />
                      <span className="text-xs font-bold text-slate-600">
                        {proofFile ? 'Change Screenshot File' : 'Choose Receipt Image'}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, JPEG, WEBP up to 5 MB</span>
                      <input 
                         type="file" 
                         accept="image/png, image/jpeg, image/jpg, image/webp" 
                         className="hidden" 
                         onChange={handleProofFileChange} 
                       />
                    </label>
                  </div>
                  {proofPreview && (
                    <div className="relative border border-slate-200 rounded-xl overflow-hidden shrink-0 h-24 w-24 bg-slate-50 p-1 flex items-center justify-center">
                      <img src={proofPreview} alt="Receipt preview" className="h-full w-full object-contain rounded-lg" />
                      <button 
                         onClick={handleCancelProof} 
                         className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-sm active:scale-95 transition cursor-pointer"
                        title="Remove selection"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {proofFile && (
                  <div className="flex flex-col gap-3 animate-fade-in text-xs font-semibold">
                    <div className="flex justify-between items-center text-slate-500 bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                      <span className="truncate max-w-[200px] text-slate-700 font-bold">{proofName}</span>
                      <span>{proofSize}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Transaction Ref ID / UPI Ref No (Optional)</label>
                      <input 
                         type="text" 
                         placeholder="e.g. 12-digit UPI Ref Number" 
                         value={txId} 
                         onChange={(e) => setTxId(e.target.value)} 
                         className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800 text-[11px] font-mono" 
                       />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSubmitProof}
                  disabled={!proofFile || proofLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black py-4 text-xs uppercase tracking-wider shadow-lg active:scale-95 disabled:opacity-50 transition cursor-pointer"
                >
                  {proofLoading ? (
                    <span>Uploading Screenshot proof...</span>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Submit Payment Proof screenshot</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
