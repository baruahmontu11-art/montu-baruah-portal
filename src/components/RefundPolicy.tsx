import { BadgePercent, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

interface RefundPolicyProps {
  onNavigate: (page: string) => void;
}

export default function RefundPolicy({ onNavigate }: RefundPolicyProps) {
  return (
    <div id="refund-policy-section" className="mx-auto max-w-4xl bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-lg text-left animate-fade-in my-12">
      <div className="flex items-center gap-2 mb-6">
        <BadgePercent className="h-6 w-6 text-blue-600" />
        <span className="text-xs font-black tracking-widest text-blue-600 uppercase">TRANSACTION SECURING</span>
      </div>

      <h1 className="text-3xl font-black text-[#0B1120] mb-3">Refund & Cancellation Policy</h1>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-8">Last Updated: August 31, 2026</p>

      <div className="prose prose-slate max-w-none text-slate-600 font-semibold text-sm leading-relaxed flex flex-col gap-6">
        <p>
          At <strong>Montu Baruah Solutions</strong> (represented under the domain coordinates and registered Paytm/Razorpay merchant credentials), we strive to deliver pristine digital consultations, tutorial packages, and eligibility-primed Creator Monetization Tool (CMT) pages. Because our offerings consist of direct digital services, intellectual downloads, and immediate page transfers, we have established the following guidelines regarding refunds and order cancellations:
        </p>

        <div className="h-px bg-slate-100" />

        <div>
          <h3 className="text-base font-extrabold text-[#0B1120] mb-2">1. Paid Solutions Assistance Tickets</h3>
          <p className="font-semibold text-slate-600 leading-relaxed">
            Our paid assistance solutions (Source Transfer Assistance, Name Change Setup) are custom-scoped based on your submitted WhatsApp details.
          </p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1 text-xs text-slate-500 font-medium">
            <li><strong>Before Service Initiation:</strong> If you change your mind before our team reviews your account details and initiates work, we will issue a 100% refund, minus any payment gateway processing fees.</li>
            <li><strong>After Service Initiation:</strong> Once we begin troubleshooting your Facebook Page, analyzing restrictions, or coordinating transfers, refunds are issued on a pro-rata basis depending on labor hours elapsed.</li>
            <li><strong>Service Delivery Unsuccessful:</strong> If we determine that your restriction or payout lock is completely unfixable due to permanent Facebook platform restrictions, we will refund 100% of your service ticket price.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-[#0B1120] mb-2">2. Free PDF Resource Downloads</h3>
          <p className="font-semibold text-slate-600 leading-relaxed">
            All PDF courses, worksheets, and policy guidelines published on our site are 100% free of charge. No payment details are captured, and no financial obligations apply to these educational materials.
          </p>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-[#0B1120] mb-2">3. Monetized CMT Page Acquisitions</h3>
          <p className="font-semibold text-slate-600 leading-relaxed">
            CMT page purchases are high-value digital asset acquisitions.
          </p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1 text-xs text-slate-500 font-medium">
            <li><strong>Pre-Transfer Cancellation:</strong> You may cancel your CMT page order for a full refund at any point before administrative credentials or Page admin rights are transferred to you.</li>
            <li><strong>Post-Transfer Policy:</strong> Once admin rights are successfully transferred to your Facebook Profile and verified on your end, we cannot accept returns or offer refunds, as the asset has been permanently delegated.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-[#0B1120] mb-2">4. Dispute & Verification Timeline</h3>
          <p className="font-semibold text-slate-600 leading-relaxed">
            Any refund requests must be submitted within seven (7) days of your initial transaction. To submit a claim, please prepare your transaction screenshot, request ID, and WhatsApp mobile coordinates. Approved refunds are processed back to your original payment method (Bank account, UPI, or Wallet) within 5 to 7 working days.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 mt-4">
          <h4 className="text-sm font-bold text-[#0B1120] mb-2 flex items-center gap-1.5">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
            Verified Paytm & Razorpay Merchant Security
          </h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            All manual scanner and checkout transactions are fully insured under verified merchant parameters. We do not store credit card credentials or bank passwords. All payments comply with PCI-DSS security standards.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6 mt-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-700">Have questions regarding refunds?</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Email: help@montubaruah.com</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('get-help')}
            className="flex items-center gap-1 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl transition shadow-md shadow-blue-200 cursor-pointer"
          >
            File Support Ticket
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
