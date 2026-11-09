import { useState } from 'react';
import { Menu, X, ShieldAlert } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface HeaderProps {
  settings: WebsiteSettings;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ settings, currentPage, onNavigate }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Articles', id: 'articles' },
    { name: 'Free Courses', id: 'courses' },
    { name: 'Tools', id: 'tools' },
    { name: 'Contact', id: 'contact' }
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div 
           onClick={() => handleNav('home')} 
           className="flex cursor-pointer items-center gap-2.5 transition active:scale-95"
        >
          {/* Desktop Logo */}
          <div className="hidden md:flex">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} className="h-10 w-10 object-cover rounded-full shadow-md border border-slate-100" alt="" referrerPolicy="no-referrer" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#2563EB] to-[#22D3EE] text-white font-bold text-lg shadow-md shadow-blue-200">
                {settings.name ? settings.name.charAt(0) : 'M'}
              </div>
            )}
          </div>
          {/* Mobile Logo */}
          <div className="flex md:hidden">
            {settings.mobileLogoUrl || settings.logoUrl ? (
              <img src={settings.mobileLogoUrl || settings.logoUrl} className="h-10 w-10 object-cover rounded-full shadow-md border border-slate-100" alt="" referrerPolicy="no-referrer" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#2563EB] to-[#22D3EE] text-white font-bold text-lg shadow-md shadow-blue-200">
                {settings.name ? settings.name.charAt(0) : 'M'}
              </div>
            )}
          </div>
          <div className="text-left">
            <h1 className="text-lg font-bold text-[#0B1120] leading-none">{settings.name || 'Montu Baruah'}</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase mt-0.5">Assam's Digital Expert</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition cursor-pointer ${
                currentPage === item.id 
                   ? 'bg-slate-100 text-[#2563EB]'
                   : 'text-slate-600 hover:bg-slate-50 hover:text-[#0B1120]'
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => handleNav('get-help')}
            className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-blue-300 active:scale-95 cursor-pointer"
          >
            <ShieldAlert className="h-4 w-4" />
            Get Instant Help
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => handleNav('get-help')}
            className="flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white transition active:scale-95 cursor-pointer"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Help
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 active:scale-95 cursor-pointer"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 shadow-xl">
          <div className="flex flex-col gap-1.5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-bold transition cursor-pointer ${
                  currentPage === item.id 
                     ? 'bg-slate-50 text-[#2563EB]'
                     : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
