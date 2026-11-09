import { FileText, Mail, ArrowRight } from 'lucide-react';

interface TermsOfUseProps {
  onNavigate: (page: string) => void;
}

export default function TermsOfUse({ onNavigate }: TermsOfUseProps) {
  return (
    <div id="terms-of-use-section" className="mx-auto max-w-4xl bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-lg text-left animate-fade-in my-12">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-6 w-6 text-blue-600" />
        <span className="text-xs font-black tracking-widest text-blue-600 uppercase">CREATOR COMPLIANCE RULES</span>
      </div>

      <h1 className="text-3xl font-black text-[#0B1120] mb-3">Terms of Use</h1>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-8">Last Updated: August 31, 2026</p>

      <div className="prose prose-slate max-w-none text-slate-600 font-semibold text-sm leading-relaxed flex flex-col gap-6">
        <p>
          Welcome to <strong>Montu Baruah Solutions</strong>. By accessing our website, logging support tickets, or acquiring CMT pages, you agree to comply with and be bound by the following terms and conditions. Please read them thoroughly.
        </p>

        <div className="h-px bg-slate-150 bg-slate-100" />

        <div>
          <h3 className="text-base font-extrabold text-[#0B1120] mb-2">1. Use of Digital Services & Free Resources</h3>
          <p className="font-semibold text-slate-600 leading-relaxed">
            All free PDF files, guidelines, blog tutorials, and case studies are published purely for educational and self-help purposes.
          </p>
          <ul className="list-disc pl-5 mt-2 flex flex-col gap-1 text-xs text-slate-500 font-medium">
            <li>You may download and review PDF courses for personal growth.</li>
            <li>You may not repackage, re-license, or sell our educational materials under your own name or brand.</li>
            <li>We do not guarantee platform algorithmic results, as Facebook updates policy criteria independently.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-[#0B1120] mb-2">2. Accuracy of Submitted Tickets</h3>
          <p className="font-semibold text-slate-600 leading-relaxed">
            When you request Source Transfer or Name Change assistance, you agree to provide 100% accurate information. Providing fake transaction screenshots, dummy WhatsApp numbers, or fraudulent references will result in immediate termination of service and blacklisting from future CMT page allocations.
          </p>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-[#0B1120] mb-2">3. Limitation of Platform Liability</h3>
          <p className="font-semibold text-slate-600 leading-relaxed">
            Montu Baruah is an independent consultant and is not directly affiliated with, sponsored by, or endorsed by Meta Platforms, Inc. or Facebook. All actions are carried out in complete compliance with public monetization and safety policies. We are not responsible for subsequent policy changes or platform updates implemented by Meta after our service has been completed successfully.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6 mt-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-700">Have questions about our terms?</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Email: terms@montubaruah.com</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('get-help')}
            className="flex items-center gap-1 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl transition cursor-pointer"
          >
            Resolution Center
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
