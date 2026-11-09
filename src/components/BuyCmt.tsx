import React, { useState } from 'react';
import { User, MapPin, Sparkles, CreditCard, QrCode, Copy, CheckCircle, AlertTriangle, ArrowRight, ArrowLeft, Upload, Check } from 'lucide-react';
import { WebsiteSettings } from '../types';
import { createCmtRequest, createRazorpayOrder, verifyRazorpayPayment, submitManualPaymentProof } from '../lib/api';
import { openRazorpayCheckout } from '../lib/razorpay';

interface BuyCmtProps {
  settings: WebsiteSettings;
  onSuccess: (message: string) => void;
}

export default function BuyCmt({ settings, onSuccess }: BuyCmtProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [budgetOption, setBudgetOption] = useState('₹10,000');
  const [customBudget, setCustomBudget] = useState('');
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

  // Default editable budgets
  const budgetOptions = ['₹5,000', '₹10,000', '₹15,000', '₹20,000', '₹25,000+', 'Custom Budget'];

  const getNumericBudget = () => {
    if (budgetOption === 'Custom Budget') {
      return Number(customBudget) || 10000;
    }
    return Number(budgetOption.replace(/[^0-9]/g, '')) || 10000;
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !phone.trim()) return;
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (budgetOption === 'Custom Budget' && !customBudget.trim()) return;
    setStep(3);
  };

  const handleCreateRequest = async (method: 'razorpay' | 'manual_upi') => {
    setIsSubmitting(true);
    const amt = getNumericBudget();
    try {
      const data = await createCmtRequest({
        name,
        address,
        phoneNumber: phone,
        budgetType: budgetOption,
        budgetAmount: amt,
        paymentMethod: method
      });
      if (data.success) {
        setOrderInfo({ ...data.request, orderId: data.orderId });
        setStep(4);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger WhatsApp prefilled chat
  const triggerWhatsApp = (req: any, pMethod: string, isPaidManual = false) => {
    const baseMessage = `Hello Montu Baruah, I have submitted a Monetized CMT Page Request on your website.\n\n` +
      `*Request ID:* ${req.id}\n` +
      `*Name:* ${req.name}\n` +
      `*Address:* ${req.address}\n` +
      `*Phone:* ${req.phoneNumber}\n` +
      `*Budget Selected:* ${req.budgetType === 'Custom Budget' ? 'Custom' : req.budgetType}\n` +
      `*Exact Amount:* ₹${req.budgetAmount}\n\n`;

    let finalMessage = baseMessage;
    if (isPaidManual) {
      finalMessage += `*Payment Mode:* Manual UPI / QR Code\n` +
                     `*Status:* Payment Sent (Screenshot Attached Below)\n\n` +
                     `_Please verify my CMT request and allocate the page._`;
    } else {
      finalMessage += `*Payment Mode:* Razorpay Checkout\n` +
                     `*Status:* Paid (Transaction ID: ${req.transactionId || 'Verified'})\n\n` +
                     `_Please review my verified request and coordinate transfer details._`;
    }

    const encoded = encodeURIComponent(finalMessage);
    const destPhone = settings.whatsappNumber ? settings.whatsappNumber.replace(/[^0-9]/g, '') : '918136081232';
    const link = `https://wa.me/${destPhone}?text=${encoded}`;
         
    onSuccess('CMT page request submitted! Redirecting to WhatsApp to coordinate with Montu Baruah.');
    window.open(link, '_blank');
         
    // Reset state
    setName('');
    setAddress('');
    setPhone('');
    setCustomBudget('');
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
        description: 'CMT Page Request',
        prefill: { name, contact: phone },
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
    <section id="buy-cmt-section" className="py-16 bg-white border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
         
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Information & Explanation */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            <span className="text-xs font-black tracking-widest text-[#2563EB] uppercase">PRE-MONETIZED ACQUISITIONS</span>
            <h2 className="text-3xl font-black text-[#0B1120] sm:text-4xl leading-tight">
              Acquire Eligibility-Primed CMT Pages
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              Skip months of tedious subscriber grinds. CMT (Creator Monetization Tool) pages are premium, hand-reared Facebook pages tailored with perfect monetization eligibility stats, pristine policy logs, and organic reach anchors.
            </p>

            <div className="flex flex-col gap-3 font-semibold text-xs text-slate-500 bg-slate-50 border border-slate-200/80 p-5 rounded-2xl">
              <div className="flex gap-2.5 items-start">
                <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">✔</div>
                <p><strong className="text-slate-900 font-bold">Instantly eligible:</strong> Setup Ads on Reels, In-Stream video ads, or subscription stars immediately.</p>
              </div>
              <div className="flex gap-2.5 items-start">
                <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">✔</div>
                <p><strong className="text-slate-900 font-bold">Full Creator Transfer:</strong> Admin controls and secure payout coordinates transferred safely.</p>
              </div>
              <div className="flex gap-2.5 items-start">
                <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">✔</div>
                <p><strong className="text-slate-900 font-bold">Nagaon Support:</strong> Assisted setup directly by Montu Baruah to ensure your payout accounts integrate properly.</p>
              </div>
            </div>
          </div>

          {/* Core CMT flow form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl relative">
               
              {/* Progress bar */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-4">
                <span>CMT ORDER SYSTEM</span>
                <span>Step {step} of 4</span>
              </div>
              <div className="h-1 bg-slate-150 rounded-full mb-6 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />
              </div>

              {/* STEP 1: CONTACT DETAILS */}
              {step === 1 && (
                <form onSubmit={handleNextStep1} className="flex flex-col gap-5 text-left">
                  <h3 className="text-lg font-bold text-[#0B1120] mb-1 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    1. Contact Information
                  </h3>
                  
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-black mb-1.5">Your Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter legal name"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-black mb-1.5">Your Current Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="City, District, State"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-black mb-1.5">WhatsApp / Mobile Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone or WhatsApp No"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 transition"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3.5 text-xs tracking-wider uppercase transition active:scale-95 shadow-md shadow-blue-200 mt-2 cursor-pointer"
                  >
                    Continue to Budget Allocation
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}

              {/* STEP 2: SELECT BUDGET */}
              {step === 2 && (
                <form onSubmit={handleNextStep2} className="flex flex-col gap-5 text-left">
                  <h3 className="text-lg font-bold text-[#0B1120] mb-1 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    2. Select Your CMT Page Budget
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-1">Different budget ranges support varying subscriber numbers, watch-time thresholds, and payout configurations.</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {budgetOptions.map((opt) => (
                      <div 
                         key={opt}
                        onClick={() => {
                          setBudgetOption(opt);
                          if (opt !== 'Custom Budget') setCustomBudget('');
                        }}
                        className={`border rounded-xl p-3.5 flex flex-col justify-center items-center cursor-pointer transition text-xs font-black ${
                          budgetOption === opt 
                             ? 'border-blue-500 bg-blue-50/50 text-[#2563EB]'
                             : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>

                  {budgetOption === 'Custom Budget' && (
                    <div className="mt-2">
                      <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-black mb-1.5">Enter Custom Budget (₹)</label>
                      <input
                        type="number"
                        value={customBudget}
                        onChange={(e) => setCustomBudget(e.target.value)}
                        placeholder="Enter budget (minimum ₹5,000)"
                        className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 transition"
                        min="5000"
                        required
                      />
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 px-4 text-slate-500 font-bold hover:bg-slate-50 transition text-xs py-3.5 active:scale-95 cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3.5 text-xs tracking-wider uppercase transition active:scale-95 shadow-md shadow-blue-200 cursor-pointer"
                    >
                      Review Summary
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: SUMMARY */}
              {step === 3 && (
                <div className="flex flex-col gap-5 text-left">
                  <h3 className="text-lg font-bold text-[#0B1120] mb-1 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    3. Review CMT Purchase Request
                  </h3>

                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 flex flex-col gap-3 font-semibold text-xs text-slate-600">
                    <div className="flex justify-between pb-2 border-b border-slate-200/50">
                      <span className="text-slate-400">Full Name</span>
                      <span className="text-slate-900">{name}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-200/50">
                      <span className="text-slate-400">Address</span>
                      <span className="text-slate-900">{address}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-200/50">
                      <span className="text-slate-400">WhatsApp / Phone</span>
                      <span className="text-slate-900">{phone}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-200/50">
                      <span className="text-slate-400">Selected Bracket</span>
                      <span className="text-slate-900">{budgetOption}</span>
                    </div>
                    <div className="flex justify-between pt-1 font-black text-sm text-[#0B1120]">
                      <span>Acquisition Fee:</span>
                      <span className="text-[#2563EB]">₹{getNumericBudget()}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 px-4 text-slate-500 font-bold hover:bg-slate-50 transition text-xs py-3.5 active:scale-95 cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                    <button
                      onClick={() => handleCreateRequest('razorpay')}
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3.5 text-xs tracking-wider uppercase transition active:scale-95 shadow-md shadow-blue-200 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? 'Saving CMT Request...' : 'Proceed to Payment Options'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: PAYMENT PATHWAYS */}
              {step === 4 && orderInfo && (
                <div className="flex flex-col gap-5 text-left">
                  <h3 className="text-lg font-bold text-[#0B1120] mb-1 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-[#2563EB]" />
                    4. Complete Your CMT Order
                  </h3>

                  <div className="flex border-b border-slate-200 mb-2">
                    <button
                      onClick={() => setPaymentTab('razorpay')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                        paymentTab === 'razorpay'
                          ? 'border-[#2563EB] text-[#2563EB]'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <CreditCard className="h-4 w-4" />
                      Pay Online (Razorpay)
                    </button>
                    {settings.manualPaymentEnabled !== false && (
                      <button
                        onClick={() => setPaymentTab('manual_upi')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
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

                  {paymentTab === 'razorpay' ? (
                    <div className="flex flex-col gap-5">
                      <div className="rounded-xl border border-blue-55 bg-blue-50/20 p-4 text-xs font-bold text-slate-600 flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span>CMT Page Allocation:</span>
                          <span>₹{orderInfo.budgetAmount}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-[#2563EB]">
                          <span>Payable Online:</span>
                          <span>₹{orderInfo.budgetAmount}</span>
                        </div>
                      </div>

                      <button
                        onClick={handleRazorpayCheckout}
                        disabled={rzpLoading || isSubmitting}
                        className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-black py-3.5 rounded-xl text-xs tracking-wider uppercase transition active:scale-95 disabled:opacity-50 shadow-md cursor-pointer"
                      >
                        {rzpLoading ? 'Launching Checkout...' : 'PAY ONLINE SECURELY'}
                      </button>
                    </div>
                  ) : settings.manualPaymentEnabled !== false && (
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-50 p-4 border border-slate-200 rounded-xl">
                        {/* Visual/Real UPI QR */}
                        <div className="flex flex-col items-center gap-1.5 bg-white p-3 border border-slate-200 rounded-xl shadow-sm shrink-0 w-full sm:w-auto">
                          <div className="h-28 w-28 bg-slate-50 flex items-center justify-center border border-slate-200 relative rounded-lg overflow-hidden">
                            {settings.upiQrUrl ? (
                              <img src={settings.upiQrUrl} alt="UPI Payment QR" className="h-full w-full object-contain" />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-slate-400 p-2">
                                <QrCode className="h-8 w-8 text-slate-300 mb-1" />
                                <span className="text-[8px] font-bold text-center">No active QR</span>
                              </div>
                            )}
                          </div>
                          <span className="text-[8px] text-slate-500 font-black tracking-wider uppercase mt-1">Scan using any UPI App</span>
                        </div>

                        {/* Text copy IDs */}
                        <div className="flex-1 flex flex-col gap-2 w-full text-[11px] font-semibold text-left">
                          <div>
                            <span className="block text-[9px] uppercase tracking-wider text-slate-400 mb-0.5">UPI ID</span>
                            <div className="flex gap-1">
                              <span className="flex-1 rounded border border-slate-200 bg-white px-2 py-1 text-slate-800 font-mono truncate select-all">{settings.upiId || 'montubaruah@upi'}</span>
                              <button onClick={() => handleCopy(settings.upiId || 'montubaruah@upi', 'UPI ID')} className="p-1 border border-slate-200 rounded bg-white hover:bg-slate-50 active:scale-90 cursor-pointer" title="Copy UPI ID"><Copy className="h-3.5 w-3.5 text-slate-500" /></button>
                            </div>
                          </div>
                          <div>
                            <span className="block text-[9px] uppercase tracking-wider text-slate-400 mb-0.5">Merchant Name</span>
                            <div className="flex gap-1">
                              <span className="flex-1 rounded border border-slate-200 bg-white px-2 py-1 text-slate-800 truncate select-all">{settings.manualPaymentName || 'Montu Baruah'}</span>
                              <button onClick={() => handleCopy(settings.manualPaymentName || 'Montu Baruah', 'Merchant Name')} className="p-1 border border-slate-200 rounded bg-white hover:bg-slate-50 active:scale-90 cursor-pointer" title="Copy Merchant Name"><Copy className="h-3.5 w-3.5 text-slate-500" /></button>
                            </div>
                          </div>
                          {copiedText && <span className="text-[9px] text-emerald-600 font-bold">Copied {copiedText}!</span>}
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="flex gap-2 items-start bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-800 font-semibold leading-relaxed">
                        <AlertTriangle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-bold">Instructions:</p>
                          <p className="font-normal text-amber-700 mt-0.5 whitespace-pre-line">
                            {settings.manualPaymentInstructions || `Please transfer exactly ₹${orderInfo.budgetAmount} to complete scanning. Submit screenshot receipts via WhatsApp next.`}
                          </p>
                        </div>
                      </div>

                      {/* Screenshot Proof upload widget */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-3">
                        <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Submit Payment Verification Screenshot</h4>
                        
                        <div className="flex flex-col sm:flex-row gap-3 items-center">
                          <div className="flex-1 w-full">
                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg p-3 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition text-center">
                              <Upload className="h-5 w-5 text-slate-400 mb-1" />
                              <span className="text-[11px] font-bold text-slate-600">
                                {proofFile ? 'Change Screenshot' : 'Choose Receipt Image'}
                              </span>
                              <input 
                                 type="file" 
                                 accept="image/png, image/jpeg, image/jpg, image/webp" 
                                 className="hidden" 
                                 onChange={handleProofFileChange} 
                               />
                            </label>
                          </div>
                          {proofPreview && (
                            <div className="relative border border-slate-200 rounded-lg overflow-hidden shrink-0 h-16 w-16 bg-slate-50 p-1 flex items-center justify-center">
                              <img src={proofPreview} alt="Receipt preview" className="h-full w-full object-contain rounded" />
                              <button 
                                 onClick={handleCancelProof} 
                                 className="absolute top-0.5 right-0.5 bg-red-600 hover:bg-red-700 text-white rounded-full p-0.5 shadow-sm active:scale-95 transition animate-fade-in cursor-pointer"
                                title="Remove selection"
                              >
                                <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>

                        {proofFile && (
                          <div className="flex flex-col gap-2.5 animate-fade-in text-[11px] font-semibold">
                            <div className="flex justify-between items-center text-slate-500 bg-slate-50 border border-slate-100 p-2 rounded">
                              <span className="truncate max-w-[150px] text-slate-700 font-bold">{proofName}</span>
                              <span>{proofSize}</span>
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">UPI Ref / Transaction Number (Optional)</label>
                              <input 
                                 type="text" 
                                 placeholder="12-digit transaction ID" 
                                 value={txId} 
                                 onChange={(e) => setTxId(e.target.value)} 
                                 className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-slate-800 text-[10px] font-mono" 
                               />
                            </div>
                          </div>
                        )}

                        <button
                          onClick={handleSubmitProof}
                          disabled={!proofFile || proofLoading}
                          className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-xs uppercase tracking-wider shadow-md active:scale-95 disabled:opacity-50 transition cursor-pointer"
                        >
                          {proofLoading ? (
                            <span>Uploading screenshot...</span>
                          ) : (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>Submit Payment proof</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
