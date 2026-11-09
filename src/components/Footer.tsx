import { WebsiteSettings } from '../types';
import { Facebook, Instagram, Youtube, Send, Mail, MapPin, ShieldCheck, FileText, BadgePercent } from 'lucide-react';

interface FooterProps {
  settings: WebsiteSettings;
  onNavigate: (page: string) => void;
}

export default function Footer({ settings, onNavigate }: FooterProps) {
  const socialLinks = [
    { icon: Facebook, url: settings.facebookPrimaryUrl, label: 'Facebook Page' },
    { icon: Facebook, url: settings.facebookSecondaryUrl, label: 'Tech Group' },
    { icon: Instagram, url: settings.instagramUrl, label: 'Instagram' },
    { icon: Youtube, url: settings.youtubeUrl, label: 'YouTube' },
    { icon: Send, url: settings.telegramUrl, label: 'Telegram' }
  ];

  return (
    <footer className="bg-[#0B1120] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Col */}
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2.5">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} className="h-10 w-10 object-cover rounded-full border border-slate-800" alt="" referrerPolicy="no-referrer" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#2563EB] to-[#22D3EE] text-white font-bold text-lg">
                  {settings.name ? settings.name.charAt(0) : 'M'}
                </div>
              )}
              <span className="text-xl font-bold text-white tracking-tight">{settings.name || 'Montu Baruah'}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              {settings.tagline || 'Social Media Educator & Digital Solutions Provider from Nagaon, Assam.'}
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 mt-2">
              {socialLinks.map((social, index) => {
                if (!social.url) return null;
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:bg-[#2563EB] hover:text-white hover:border-blue-500 transition-all duration-300"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4 text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Solutions & Access</h3>
            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              <button onClick={() => onNavigate('home')} className="text-left hover:text-white transition cursor-pointer">Home</button>
              <button onClick={() => onNavigate('about')} className="text-left hover:text-white transition cursor-pointer">About Journey</button>
              <button onClick={() => onNavigate('services')} className="text-left hover:text-white transition cursor-pointer">Help Services</button>
              <button onClick={() => onNavigate('articles')} className="text-left hover:text-white transition cursor-pointer">Guides & Articles</button>
              <button onClick={() => onNavigate('courses')} className="text-left hover:text-white transition cursor-pointer">Free PDF Downloads</button>
              <button onClick={() => onNavigate('get-help')} className="text-left text-[#22D3EE] font-bold hover:text-[#2563EB] transition cursor-pointer">Get Help Flow</button>
            </div>
          </div>

          {/* Contact Details & Policies */}
          <div className="flex flex-col gap-4 text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Legal & Support</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-[#22D3EE]" />
                <span>{settings.contactInfo || 'Nagaon, Assam, India'}</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-[#22D3EE]" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition">{settings.email}</a>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-800 pt-4 mt-2 text-xs text-slate-500 font-semibold uppercase">
              <button onClick={() => onNavigate('privacy')} className="hover:text-slate-300 flex items-center gap-1 cursor-pointer">
                <ShieldCheck className="h-3.5 w-3.5" />
                Privacy Policy
              </button>
              <button onClick={() => onNavigate('terms')} className="hover:text-slate-300 flex items-center gap-1 cursor-pointer">
                <FileText className="h-3.5 w-3.5" />
                Terms of Use
              </button>
              <button onClick={() => onNavigate('refund')} className="hover:text-slate-300 flex items-center gap-1 text-[#22D3EE] cursor-pointer">
                <BadgePercent className="h-3.5 w-3.5" />
                Refunds & Cancels
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{settings.footerText || `© 2026 Montu Baruah. All Rights Reserved. Empowering digital growth across Assam & India.`}</p>
          <div className="flex items-center gap-2 font-medium bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-[10px] text-slate-400">
            <span>Paytm Merchant Verified:</span>
            <span className="text-emerald-400 font-mono font-bold tracking-wider">{settings.paytmMerchantId}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
