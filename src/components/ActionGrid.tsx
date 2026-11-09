import { ShieldAlert, BookOpen, BookOpenText, ShoppingCart } from 'lucide-react';

interface ActionGridProps {
  onNavigate: (page: string) => void;
}

export default function ActionGrid({ onNavigate }: ActionGridProps) {
  const actions = [
    {
      id: 'get-help',
      title: 'Get Immediate Assistance',
      description: 'Encountering payout locks, originality of content blocks, copyright issues, or setup restrictions? Get professional, verified assistance.',
      badge: 'Highly Requested',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: ShieldAlert,
      iconColor: 'bg-blue-100 text-[#2563EB]',
      btnText: 'GET SOLUTIONS NOW',
      btnColor: 'bg-[#2563EB] text-white hover:bg-blue-700 shadow-blue-100 shadow-lg'
    },
    {
      id: 'courses',
      title: 'Free PDF Resources',
      description: 'Acquire practical, completely free guides covering Facebook page growth, payout settings optimization, and advanced video curation policies.',
      badge: 'Free Download',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: BookOpen,
      iconColor: 'bg-emerald-100 text-emerald-600',
      btnText: 'EXPLORE FREE RESOURCES',
      btnColor: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100 shadow-lg'
    },
    {
      id: 'articles',
      title: 'Guides & Case Studies',
      description: 'Read detailed tutorials, creator tips, algorithm updates, policy deep dives, and expert commentary to protect and grow your profiles.',
      badge: 'Weekly Articles',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: BookOpenText,
      iconColor: 'bg-slate-100 text-slate-600',
      btnText: 'READ DIGITAL ARTICLES',
      btnColor: 'bg-[#0B1120] text-white hover:bg-slate-900 shadow-slate-100 shadow-lg'
    },
    {
      id: 'buy-cmt',
      title: 'Acquire Monetized CMT Pages',
      description: 'Acquire pre-monetized or eligibility-primed CMT (Creator Monetization Tool) pages suited for instant creator workflows across multiple budget levels.',
      badge: 'Launch Fast',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      icon: ShoppingCart,
      iconColor: 'bg-cyan-100 text-cyan-600',
      btnText: 'REQUEST CMT PAGE',
      btnColor: 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-cyan-100 shadow-lg'
    }
  ];

  return (
    <section id="action-grid" className="py-16 bg-slate-50 border-b border-slate-200 relative text-left">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
         
        <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col gap-3">
          <h2 className="text-3xl font-black text-[#0B1120] sm:text-4xl leading-tight">
            How Can We Assist You Today?
          </h2>
          <p className="text-slate-600 font-medium">
            Explore our specialized digital offerings, educational downloads, educational blogs, and premium CMT page acquisition models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <div 
                 key={act.id} 
                 className="flex flex-col h-full rounded-2xl bg-white border border-slate-200/80 p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden group"
              >
                {/* Visual Highlight block */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${act.iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${act.badgeColor}`}>
                    {act.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#0B1120] mb-3 group-hover:text-[#2563EB] transition-colors">
                  {act.title}
                </h3>
                 
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 flex-grow">
                  {act.description}
                </p>

                <button
                  onClick={() => onNavigate(act.id)}
                  className={`w-full py-3 px-5 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-200 active:scale-95 cursor-pointer ${act.btnColor}`}
                >
                  {act.btnText}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
