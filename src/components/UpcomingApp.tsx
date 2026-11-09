import React, { useState } from 'react';
import { Smartphone, Download, CheckCircle, Sparkles } from 'lucide-react';
import { AppPromo } from '../types';

interface UpcomingAppProps {
  appData: AppPromo | null;
  onPreRegister: (appId: string, emailOrPhone: string) => Promise<boolean>;
}

export default function UpcomingApp({ appData, onPreRegister }: UpcomingAppProps) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');

  if (!appData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;
    setIsSubmitting(true);
    setError('');
    try {
      const success = await onPreRegister(appData.id, emailOrPhone);
      if (success) {
        setIsRegistered(true);
        setEmailOrPhone('');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="upcoming-app" className="bg-[#0F172A] py-16 text-white border-y border-slate-800 relative overflow-hidden text-left">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 h-64 w-64 rounded-full bg-[#2563EB]/10 -translate-y-1/2 blur-3xl" />
      <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-[#22D3EE]/5 blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Visual Poster */}
          <div className="lg:col-span-5 flex justify-center order-last lg:order-first">
            <div className="relative group overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl max-w-xs sm:max-w-sm">
              <img 
                 src={appData.posterUrl || 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60'} 
                 alt={`${appData.name} Poster`} 
                 className="h-96 w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-extrabold text-xs shadow-md">
                    {appData.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-black tracking-wider uppercase text-blue-400">{appData.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{appData.tagline}</p>
                  </div>
                </div>
                <div className="inline-flex self-start items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-[#22D3EE]">
                  <Sparkles className="h-3 w-3" />
                  {appData.isReleased ? 'Released & Active' : 'Exclusive Creator Tool | Coming Soon'}
                </div>
              </div>
            </div>
          </div>

          {/* Description & Interactive Pre-Register section */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex self-center lg:self-start items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-bold text-[#22D3EE]">
              <Smartphone className="h-4 w-4" />
              Creator Mobile Companion App
            </div>

            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl leading-tight">
              {appData.name}
            </h2>

            <p className="text-slate-400 text-base leading-relaxed font-medium">
              {appData.description}
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {appData.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm font-bold text-slate-300">{feature}</p>
                </div>
              ))}
            </div>

            {/* Launch CTA */}
            <div className="border-t border-slate-800 pt-6 mt-4">
              {appData.isReleased ? (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <p className="text-sm font-semibold text-slate-400">The app is now live! Download directly:</p>
                  <div className="flex flex-wrap gap-3">
                    {appData.downloadUrl && (
                      <a 
                         href={appData.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 px-6 py-3 rounded-xl text-sm font-bold text-white transition active:scale-95 shadow-lg shadow-blue-500/20 cursor-pointer"
                      >
                        <Download className="h-4 w-4" />
                        Download Android APK
                      </a>
                    )}
                    {appData.playStoreUrl && (
                      <a 
                         href={appData.playStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl text-sm font-bold text-white transition active:scale-95 cursor-pointer"
                      >
                        Google Play Store
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="max-w-md text-left">
                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-300 mb-2">Pre-Register for Exclusive Early Access</h4>
                  <p className="text-xs text-slate-500 font-medium mb-4">Be the first to know when the toolkit goes live and gain early tester rewards.</p>
                  
                  {isRegistered ? (
                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-400 flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 shrink-0" />
                      <div>
                        <p className="font-bold text-sm">Pre-Registration Confirmed!</p>
                        <p className="text-xs text-emerald-400/80">Thank you for registering. We will notify you once beta access begins.</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <input
                        type="text"
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        placeholder="Enter WhatsApp No or Email"
                        className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-blue-500 placeholder-slate-500 transition"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="submit"
                        className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition disabled:opacity-50 active:scale-95 whitespace-nowrap shadow-lg shadow-blue-500/10 cursor-pointer"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Registering...' : 'PRE-REGISTER'}
                      </button>
                    </form>
                  )}
                  {error && <p className="text-xs text-red-400 font-semibold mt-2">{error}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
