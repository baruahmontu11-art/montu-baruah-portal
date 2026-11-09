import { Facebook, Award, BadgeCheck, Users, ShieldCheck, HeartHandshake, Film } from 'lucide-react';

export default function AboutJourney() {
  const milestones = [
    {
      year: '2020',
      title: 'The Spark',
      desc: 'Started creating tech content in local Assamese language on Facebook to educate regional creators on policy standards.'
    },
    {
      year: '2022',
      title: '100K Community milestone',
      desc: 'Achieved over 100,000 organic followers on Facebook and initiated direct consulting workshops across Assam.'
    },
    {
      year: '2024',
      title: 'CMT Program Launch',
      desc: 'Established eligibility-primed Creator Monetization Tool (CMT) networks to allow creators to launch pre-monetized pages directly.'
    },
    {
      year: '2026',
      title: '140K+ Followers & Full Solutions Portal',
      desc: 'Now hosting a complete portal supporting hundreds of creators monthly with payout settings transfers, bank integration, and digital assets.'
    }
  ];

  return (
    <section id="about-journey-section" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Upper Title block */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
          <span className="text-xs font-black tracking-widest text-[#2563EB] uppercase">MEET THE EDUCATOR</span>
          <h2 className="text-3xl font-black text-[#0B1120] sm:text-4xl leading-tight">
            About Montu Baruah
          </h2>
          <p className="text-slate-600 font-medium">
            Discover the narrative behind Assam's premier social creator, policy mentor, and secure payout configurations consultant.
          </p>
        </div>

        {/* Narrative & Photo grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Text narrative */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h3 className="text-2xl font-black text-[#0B1120] leading-tight">
              Empowering Regional Creators Across Northeast India Since 2020
            </h3>
            
            <p className="text-slate-600 font-semibold text-sm leading-relaxed">
              Based in the historic city of <strong className="text-slate-900">Nagaon, Assam</strong>, I noticed a widespread digital divide: talented local filmmakers, creators, and editors were producing incredible regional content but losing their hard-earned monetization due to complex payout locks, metadata errors, or original content guidelines violations.
            </p>

            <p className="text-slate-600 font-semibold text-sm leading-relaxed">
              I resolved to change this. Over the past six years, I have published hundreds of free tutorial guides, broken down intricate policy standards in plain language, and directly resolved over 1,200 payout lock and name alignment cases. My goal is to build a safe, sustainable ecosystem for creators to grow and receive their revenue securely.
            </p>

            <div className="grid grid-cols-2 gap-6 border-t border-slate-200 pt-6 mt-2">
              <div className="flex gap-3 items-start">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-[#0B1120]">140K+ Community</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Connected regional creators and digital practitioners.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-105 bg-cyan-100 text-cyan-600 shrink-0">
                  <Film className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-[#0B1120]">Vertical Video Coach</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Optimizing Reels algorithms and content policies.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual representations box */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative h-80 w-80 sm:h-96 sm:w-96 rounded-3xl bg-slate-900 text-white p-8 flex flex-col justify-between border border-slate-800 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />
              <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-2xl" />

              <div className="flex justify-between items-start relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white font-extrabold text-xl shadow-lg">
                  MB
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 px-3 py-1 text-[10px] font-bold text-[#22D3EE] uppercase tracking-wider">
                  <BadgeCheck className="h-3.5 w-3.5 fill-blue-500 text-slate-950" />
                  Verified Consultant
                </span>
              </div>

              <div className="flex flex-col gap-2 relative z-10">
                <h4 className="text-2xl font-black tracking-tight text-white">Montu Baruah</h4>
                <p className="text-xs font-black tracking-widest text-[#22D3EE] uppercase">Digital Solutions Architect</p>
                <div className="h-0.5 w-12 bg-blue-500 my-2" />
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  "Authentic education, secure bank configuration transfers, and structured CMT pages suit regional budget levels perfectly."
                </p>
              </div>

              <div className="flex gap-4 border-t border-slate-800/80 pt-4 mt-2 relative z-10 text-xs font-bold text-slate-400">
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span>1,200+ Cases solved</span>
                </div>
                <div className="flex items-center gap-1">
                  <Facebook className="h-4 w-4 text-blue-500" />
                  <span>140K Follow base</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Timeline section */}
        <div className="border-t border-slate-200 pt-16">
          <h3 className="text-xl font-black text-[#0B1120] text-center mb-12">Our Creator Journey & Evolution</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative flex flex-col gap-4 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition">
                <div className="absolute top-4 right-4 text-3xl font-black text-slate-100">{idx + 1}</div>
                <span className="inline-flex self-start rounded-lg bg-blue-50 border border-blue-150 px-2.5 py-1 text-xs font-black text-[#2563EB] tracking-wider">
                  {m.year}
                </span>
                <h4 className="text-base font-extrabold text-[#0B1120] mt-1 pr-6">{m.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Pillars Grid */}
        <div className="mt-20 rounded-3xl bg-gradient-to-tr from-[#0F172A] to-[#1E293B] text-white p-8 sm:p-12 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[600px] rounded-full bg-blue-500/10 blur-3xl" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 text-left">
            <div className="flex flex-col gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-[#22D3EE] border border-blue-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-white">Primacy of Safety</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Every ticket resolved employs strict policy compliance workflows, protecting creator details and credentials safely.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-[#22D3EE] border border-blue-500/20">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-white">Genuine Guidance</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                No false promises or black-hat shortcuts. We provide honest technical assessments and verified step-by-step instructions.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-[#22D3EE] border border-blue-500/20">
                <Users className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-white">Regional Commitment</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Nurturing localized creators in Assamese and regional languages with dedicated support and responsive chat mechanisms.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
