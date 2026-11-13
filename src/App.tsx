import { useState, useEffect } from 'react';
import { WebsiteSettings, Statistics, Review, Article, Course, AppPromo, Tool } from './types';
import { fetchSettings, fetchStatistics, fetchPlatformReviews, fetchArticles, fetchCourses, fetchApps, fetchTools, preRegisterApp } from './lib/api';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ActionGrid from './components/ActionGrid';
import UpcomingApp from './components/UpcomingApp';
import HelpFlow from './components/HelpFlow';
import Courses from './components/Courses';
import Tools from './components/Tools';
import Articles from './components/Articles';
import BuyCmt from './components/BuyCmt';
import AboutJourney from './components/AboutJourney';
import RefundPolicy from './components/RefundPolicy';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import AdminDashboard from './components/AdminDashboard';
import Toast from './components/Toast';

// Icons
import { Star, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>(() => {
    // Admin panel has no public nav link anymore — it's reachable only by
    // typing /admin directly in the address bar.
    return window.location.pathname.replace(/\/+$/, '') === '/admin' ? 'admin' : 'home';
  });
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [testimonials, setTestimonials] = useState<Review[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [apps, setApps] = useState<AppPromo[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadBaseData();
    const onPopState = () => {
      setCurrentPage(window.location.pathname.replace(/\/+$/, '') === '/admin' ? 'admin' : 'home');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const loadBaseData = async () => {
    try {
      const [sData, stData, rData, artData, cData, appsData, toolsData] = await Promise.all([
        fetchSettings(),
        fetchStatistics(true), // do not double increment view stat inside loop
        fetchPlatformReviews(true).catch(() => []),
        fetchArticles().catch(() => []),
        fetchCourses().catch(() => []),
        fetchApps().catch(() => []),
        fetchTools().catch(() => [])
      ]);
      setSettings(sData);
      setStats(stData);
      setTestimonials(rData);
      setArticles(artData);
      setCourses(cData);
      setApps(appsData);
      setTools(toolsData);
      // Keep the browser tab favicon in sync with the uploaded logo, if any
      if (sData.logoUrl) {
        let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = sData.logoUrl;
      }
    } catch (err) {
      console.error('Failed to boot initial platform dataset.', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (pageId: string) => {
    setCurrentPage(pageId);
    const newPath = pageId === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handlePreRegister = async (appId: string, emailOrPhone: string): Promise<boolean> => {
    try {
      const success = await preRegisterApp(appId, emailOrPhone);
      if (success) {
        triggerToast('Thank you for pre-registering!', 'success');
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleDownloadCourse = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (course && course.fileUrl) {
      triggerToast(`Downloading "${course.title}"...`, 'success');
      window.open(course.fileUrl, '_blank');
    } else {
      triggerToast('Course file not available.', 'error');
    }
  };

  const handleDownloadTool = (toolId: string) => {
    const tool = tools.find((t) => t.id === toolId);
    if (tool && tool.downloadUrl) {
      triggerToast(`Downloading "${tool.name}"...`, 'success');
      window.open(tool.downloadUrl, '_blank');
    } else {
      triggerToast('App file not available.', 'error');
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-400 font-bold text-sm">
        <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="uppercase tracking-widest text-xs font-black text-slate-500">Loading Montu Baruah Portal...</p>
      </div>
    );
  }

  const activeApp = apps.length > 0 ? apps[0] : null;

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-[#2563EB]">
      {/* Platform header */}
      <Header settings={settings} currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main page router with responsive containers */}
      <main className="flex-grow">
        
        {/* VIEW 1: HOME PAGE */}
        {currentPage === 'home' && (
          <div className="animate-fade-in">
            {/* Hero module */}
            <Hero settings={settings} onNavigate={handleNavigate} />

            {/* Quick Metrics Panel */}
            {stats && (
              <section className="bg-white py-12 border-b border-slate-100 text-left">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                    <div className="flex flex-col border-l-2 border-blue-500 pl-4">
                      <span className="text-3xl sm:text-4xl font-black text-[#0B1120] tracking-tight">{(stats.totalViews + 14000).toLocaleString()}+</span>
                      <span className="text-[10px] text-slate-500 font-black tracking-wider uppercase mt-1">Platform Visitors</span>
                    </div>
                    <div className="flex flex-col border-l-2 border-emerald-500 pl-4">
                      <span className="text-3xl sm:text-4xl font-black text-[#0B1120] tracking-tight">{stats.problemsSolved || 984}+</span>
                      <span className="text-[10px] text-slate-500 font-black tracking-wider uppercase mt-1">Problems Solved</span>
                    </div>
                    <div className="flex flex-col border-l-2 border-cyan-500 pl-4">
                      <span className="text-3xl sm:text-4xl font-black text-[#0B1120] tracking-tight">{stats.freeResources || 5}</span>
                      <span className="text-[10px] text-slate-500 font-black tracking-wider uppercase mt-1">Free Guides Ready</span>
                    </div>
                    <div className="flex flex-col border-l-2 border-amber-500 pl-4">
                      <span className="text-3xl sm:text-4xl font-black text-[#0B1120] tracking-tight">140,000+</span>
                      <span className="text-[10px] text-slate-500 font-black tracking-wider uppercase mt-1">Community Members</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Main actions grid */}
            <ActionGrid onNavigate={handleNavigate} />

            {/* Testimonials block */}
            <section className="py-20 bg-white border-b border-slate-100 text-left">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-16">
                  <div>
                    <span className="text-xs font-black tracking-widest text-[#2563EB] uppercase">COMMUNITY TRUST METRIC</span>
                    <h2 className="text-3xl font-black text-[#0B1120] mt-1 tracking-tight">Voices of Regional Creators</h2>
                  </div>
                  <button
                    onClick={() => handleNavigate('get-help')}
                    className="flex items-center gap-1 bg-[#0B1120] hover:bg-slate-900 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl transition cursor-pointer"
                  >
                    Share Your Experience
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {testimonials.length === 0 ? (
                    // Fallback gorgeous static reviews if DB is empty
                    <>
                      <div className="flex flex-col rounded-2xl bg-slate-50 border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => <Star key={i} className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />)}
                        </div>
                        <p className="text-sm font-semibold text-slate-600 leading-relaxed italic mb-6">
                          "Montu da helped me correct my legal name match mismatch and securely trigger the pending bank transfer from my Reels bonus. Genuinely grateful!"
                        </p>
                        <div className="border-t border-slate-200/60 pt-4 flex items-center gap-3 mt-auto">
                          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black">JS</div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-none">Jitu Saikia</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Guwahati, Assam</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col rounded-2xl bg-slate-50 border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => <Star key={i} className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />)}
                        </div>
                        <p className="text-sm font-semibold text-slate-600 leading-relaxed italic mb-6">
                          "Excellent guidance on Originality of Content policy. His downloaded free PDF secrets boosted my retention metrics by 30% in weeks!"
                        </p>
                        <div className="border-t border-slate-200/60 pt-4 flex items-center gap-3 mt-auto">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">DB</div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-none">Devajit Borah</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Tezpur, Assam</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col rounded-2xl bg-slate-50 border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => <Star key={i} className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />)}
                        </div>
                        <p className="text-sm font-semibold text-slate-600 leading-relaxed italic mb-6">
                          "I requested the ₹10,000 CMT bracket page. The transfer process took less than 48 hours, fully verified with correct monetization guidelines."
                        </p>
                        <div className="border-t border-slate-200/60 pt-4 flex items-center gap-3 mt-auto">
                          <div className="h-10 w-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-black">PN</div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-none">Pranjal Nath</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Nagaon, Assam</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    testimonials.map((test) => (
                      <div key={test.id} className="flex flex-col rounded-2xl bg-slate-50 border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-0.5 mb-4">
                          {[...Array(test.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                          ))}
                        </div>
                        <p className="text-sm font-semibold text-slate-600 leading-relaxed italic mb-6">
                          "{test.comment}"
                        </p>
                        <div className="border-t border-slate-200/60 pt-4 flex items-center gap-3 mt-auto">
                          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black uppercase">
                            {test.name.slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-none">{test.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Verified User</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </section>

            {/* Mobile pre-registration */}
            {activeApp && (
              <UpcomingApp appData={activeApp} onPreRegister={handlePreRegister} posterOverride={settings.toolkitImageUrl} />
            )}
          </div>
        )}

        {/* VIEW 2: ABOUT */}
        {currentPage === 'about' && (
          <AboutJourney />
        )}

        {/* VIEW 3: SERVICES */}
        {currentPage === 'services' && (
          <div className="animate-fade-in bg-white py-12">
            <ActionGrid onNavigate={handleNavigate} />
          </div>
        )}

        {/* VIEW 4: ARTICLES */}
        {currentPage === 'articles' && (
          <Articles 
            articles={articles} 
            onSuccess={(msg) => triggerToast(msg, 'success')} 
          />
        )}

        {/* VIEW 5: COURSES */}
        {currentPage === 'courses' && (
          <Courses 
            courses={courses} 
            onDownload={handleDownloadCourse} 
          />
        )}

        {/* VIEW 5B: TOOLS / APP DOWNLOADS */}
        {currentPage === 'tools' && (
          <Tools
            tools={tools}
            onDownload={handleDownloadTool}
          />
        )}

        {/* VIEW 6: CONTACT INFORMATION */}
        {currentPage === 'contact' && (
          <div className="mx-auto max-w-4xl bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-lg text-left my-12 animate-fade-in">
            <h1 className="text-3xl font-black text-[#0B1120] mb-2">Connect Directly</h1>
            <p className="text-sm text-slate-500 font-semibold mb-8">Ready to address your technical creator concerns safely.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-semibold text-sm">
              <div className="flex flex-col gap-5">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
                  <h3 className="text-base font-extrabold text-[#0B1120] mb-2">Primary Consultation Point</h3>
                  <p className="text-slate-600">You can directly click 'Get Immediate Assistance' to generate a verified support ticket. It will instantly connect you with Montu Baruah via automated coordination chats.</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
                  <h3 className="text-base font-extrabold text-[#0B1120] mb-2">Official Email Coordinate</h3>
                  <p className="text-[#2563EB] font-bold"><a href={`mailto:${settings.email}`}>{settings.email}</a></p>
                </div>
              </div>

              <div className="flex flex-col gap-4 bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />
                <h3 className="text-lg font-black tracking-tight mb-2">Office Headquarters</h3>
                <p className="text-slate-400 leading-relaxed text-xs">
                  Nagaon, Assam, India<br />
                  Pin Code: 782001
                </p>
                <div className="h-px bg-slate-800 my-4" />
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  Support ticket resolutions, manual verified approvals, and custom CMT orders operate between 9:00 AM to 9:00 PM IST daily.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 7: SOLUTIONS HELP TICKETS FLOW */}
        {currentPage === 'get-help' && (
          <HelpFlow 
            settings={settings} 
            onNavigate={handleNavigate} 
            onSuccess={(msg) => triggerToast(msg, 'success')} 
          />
        )}

        {/* VIEW 8: CMT PAGE ACQUISITION */}
        {currentPage === 'buy-cmt' && (
          <BuyCmt 
            settings={settings} 
            onSuccess={(msg) => triggerToast(msg, 'success')} 
          />
        )}

        {/* VIEW 9: POLICY PAGES */}
        {currentPage === 'refund' && (
          <RefundPolicy onNavigate={handleNavigate} />
        )}

        {currentPage === 'privacy' && (
          <PrivacyPolicy onNavigate={handleNavigate} />
        )}

        {currentPage === 'terms' && (
          <TermsOfUse onNavigate={handleNavigate} />
        )}

        {/* VIEW 10: ADMINISTRATIVE DASHBOARD CONTROL PANEL */}
        {currentPage === 'admin' && (
          <AdminDashboard 
            onSuccess={(msg) => triggerToast(msg, 'success')} 
            onError={(msg) => triggerToast(msg, 'error')} 
          />
        )}

      </main>

      {/* Footer Branding section */}
      <Footer settings={settings} onNavigate={handleNavigate} />

      {/* Global Toast Alerts */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
