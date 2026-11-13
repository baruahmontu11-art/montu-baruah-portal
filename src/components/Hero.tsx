import { ShieldAlert, BookOpen, Facebook, BadgeCheck } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface HeroProps {
  settings: WebsiteSettings;
  onNavigate: (page: string) => void;
}

export default function Hero({ settings, onNavigate }: HeroProps) {
  return (
    <section id="hero" className="relative overflow-hidden bg-white py-16 lg:py-24 border-b border-slate-100 text-left">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -z-10 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-100/30 to-cyan-100/30 blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 self-center lg:self-start rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-[#2563EB]">
              <BadgeCheck className="h-4 w-4 fill-blue-500 text-white" />
              Assam's Trusted Facebook Creator & Consultant
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-[#0B1120] sm:text-5xl lg:text-6xl leading-[1.1]">
              Unlock Your <span className="bg-gradient-to-r from-[#2563EB] to-[#22D3EE] bg-clip-text text-transparent">Digital Future</span> with Expert Guidance
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              I am <strong className="text-slate-900 font-bold">{settings.name || 'Montu Baruah'}</strong>. I share practical digital solutions, Facebook optimization workflows, and comprehensive growth frameworks to help creators and businesses thrive online.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onNavigate('get-help')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-200 transition hover:bg-blue-700 hover:shadow-blue-300 active:scale-95 cursor-pointer"
              >
                <ShieldAlert className="h-5 w-5" />
                Resolve Payout & Page Issues
              </button>
              <button
                onClick={() => onNavigate('articles')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-8 py-4 text-base font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95 cursor-pointer"
              >
                <BookOpen className="h-5 w-5 text-slate-500" />
                Read Practical Guides
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="flex items-center justify-center lg:justify-start gap-6 border-t border-slate-100 pt-6 mt-4">
              <div>
                <p className="text-2xl font-black text-slate-900">140K+</p>
                <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">Facebook Followers</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-black text-slate-900">1,200+</p>
                <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">Resolved Cases</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-black text-slate-900">100%</p>
                <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">Genuine Service</p>
              </div>
            </div>
          </div>

          {/* Visual Showcase (Owner Photo Placeholder/Logo Grid) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative flex h-80 w-80 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#2563EB]/10 to-[#22D3EE]/10 p-6 border border-slate-100 shadow-inner sm:h-96 sm:w-96">
              {/* Decorative floating components */}
              <div className="absolute -top-4 -right-4 flex items-center gap-2 rounded-2xl bg-white border border-slate-100 p-3 shadow-lg animate-bounce duration-3000">
                <Facebook className="h-6 w-6 text-blue-600 fill-blue-600" />
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900">Facebook Page</p>
                  <p className="text-[10px] text-emerald-500 font-bold">140K+ Base</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-2xl bg-white border border-slate-100 p-3 shadow-lg">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <BadgeCheck className="h-4 w-4 fill-emerald-500 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900">Payout Issues</p>
                  <p className="text-[10px] text-slate-500 font-bold">Solved Safely</p>
                </div>
              </div>

              {/* Central Premium Branded Character Card — or the owner's own photo,
                  uploaded from the Admin Panel (Settings → Homepage Images). */}
              {settings.heroImageUrl ? (
                <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-800 shadow-2xl">
                  <img
                    src={settings.heroImageUrl}
                    alt={settings.name || 'Montu Baruah'}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/70 to-transparent px-5 pb-5 pt-16 text-center">
                    <h3 className="text-xl font-bold tracking-tight text-white">{settings.name || 'Montu Baruah'}</h3>
                    <p className="text-xs text-[#22D3EE] font-bold tracking-widest uppercase">Assam, India</p>
                  </div>
                </div>
              ) : (
              <div className="flex flex-col items-center justify-center h-full w-full rounded-2xl bg-[#0B1120] text-white p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
                {/* Visual accent background circles */}
                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-[#2563EB]/10 blur-xl" />
                <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-[#22D3EE]/10 blur-xl" />
                
                <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#22D3EE] p-1 shadow-lg shadow-blue-500/20 mb-4 flex items-center justify-center">
                  <div className="h-full w-full rounded-full bg-[#0B1120] flex items-center justify-center font-black text-3xl text-white tracking-tighter">
                    MB
                  </div>
                </div>
                
                <h3 className="text-xl font-bold tracking-tight text-white mb-1">Montu Baruah</h3>
                <p className="text-xs text-[#22D3EE] font-bold tracking-widest uppercase mb-4">Assam, India</p>
                
                <p className="text-xs text-slate-400 leading-relaxed text-center font-medium">
                  "Helping creators protect their payouts, secure their accounts, and master vertical video distribution policies."
                </p>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
