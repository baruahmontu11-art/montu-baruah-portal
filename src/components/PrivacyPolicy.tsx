import { ShieldCheck, Mail, ArrowRight } from 'lucide-react';

interface PrivacyPolicyProps {
  onNavigate: (page: string) => void;
}

export default function PrivacyPolicy({ onNavigate }: PrivacyPolicyProps) {
  return (
    <div id="privacy-policy-section" className="mx-auto max-w-4xl bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-lg text-left animate-fade-in my-12">
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck className="h-6 w-6 text-blue-600" />
        <span className="text-xs font-black tracking-widest text-blue-600 uppercase">CREATOR PRIVACY SECURITY</span>
      </div>

      <h1 className="text-3xl font-black text-[#0B1120] mb-3">Privacy Policy</h1>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-8">Last Updated: August 31, 2026</p>

      <div className="prose prose-slate max-w-none text-slate-600 font-semibold text-sm leading-relaxed flex flex-col gap-6">
        <p>
          At <strong>Montu Baruah Solutions</strong>, accessible from this digital platform, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that are collected and recorded by our system and how we use it securely.
        </p>

        <div className="h-px bg-slate-100" />

        <div>
          <h3 className="text-base font-extrabold text-[#0B1120] mb-2">1. Information We Collect</h3>
          <p className="font-semibold text-slate-600 leading-relaxed">
            When you submit a digital service assistance request, order a CMT page, or pre-register for our mobile companion application, we collect:
          </p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1 text-xs text-slate-500 font-medium">
            <li><strong>Personal details:</strong> Your legal name, contact email, and mailing address.</li>
            <li><strong>Communication handles:</strong> Your active WhatsApp mobile number (crucial for coordinate calls).</li>
            <li><strong>Problem metadata:</strong> Your Facebook page URL, problem descriptions, and any optional payment verification screenshots.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-[#0B1120] mb-2">2. How We Use Your Information</h3>
          <p className="font-semibold text-slate-600 leading-relaxed">
            We use the collected details to:
          </p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1 text-xs text-slate-500 font-medium">
            <li>Verify transactions and link them to your logged support ticket.</li>
            <li>Trigger automated WhatsApp chat templates to connect you directly with Montu Baruah.</li>
            <li>Deliver relevant PDF resources or pre-register you for our mobile platform updates.</li>
            <li>Maintain security parameters and prevent fraudulent transaction submissions.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-[#0B1120] mb-2">3. Third-Party Payment Gateways</h3>
          <p className="font-semibold text-slate-600 leading-relaxed">
            All transaction routing (Razorpay, Paytm Verified Merchant scanner) conforms to PCI-DSS standards. We do not store or see credit card passwords or direct UPI PIN details. Our platform only receives verification callback tokens indicating whether payment was successful.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6 mt-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-700">Need clarification on privacy protocols?</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Email: privacy@montubaruah.com</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('get-help')}
            className="flex items-center gap-1 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl transition cursor-pointer"
          >
            Support Center
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
