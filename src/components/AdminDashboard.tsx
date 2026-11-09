import React, { useState, useEffect } from 'react';
import { 
  Lock, Settings, BarChart3, Newspaper, BookOpen, ShieldAlert, ShoppingCart, 
  Check, LogOut, Loader2, Sparkles, AlertTriangle, RefreshCw, Upload, FileText, Image, Clipboard,
  Plus, Minus, Trash2, Tag, Wrench
} from 'lucide-react';
import { 
  WebsiteSettings, Statistics, Article, Course, Tool, HelpRequest, CmtRequest, Order, AdminActivityLog, Notification, PayoutService 
} from '../types';
import { 
  loginAdmin, fetchSettings, updateSettings, fetchStatistics, updateStatistics, 
  fetchArticles, createArticle, updateArticle, deleteArticle, 
  fetchCourses, createCourse, updateCourse, deleteCourse, 
  fetchTools, createTool, updateTool, deleteTool, 
  fetchHelpRequests, fetchCmtRequests, fetchOrders, approveManualPayment, 
  fetchActivityLogs, fetchNotifications, readAllNotifications, uploadBrandingAsset, changeAdminPassword 
} from '../lib/api';
import GalleryPicker from './GalleryPicker';

interface AdminDashboardProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function AdminDashboard({ onSuccess, onError }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'stats' | 'settings' | 'articles' | 'courses' | 'tools' | 'help' | 'cmt' | 'orders' | 'logs'>('stats');

  // Loading States
  const [loading, setLoading] = useState(false);

  // Data States
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [cmtRequests, setCmtRequests] = useState<CmtRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activityLogs, setActivityLogs] = useState<AdminActivityLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Editing States
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [editingTool, setEditingTool] = useState<Partial<Tool> | null>(null);

  // Payout Services (Resolve Payout & Page Issues form) management
  const [editingServices, setEditingServices] = useState<PayoutService[]>([]);
  const [savingServices, setSavingServices] = useState(false);

  // Check Auth
  useEffect(() => {
    const token = localStorage.getItem('mb_admin_token');
    if (token) {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim() || !passwordInput.trim()) return;
    setAuthLoading(true);
    try {
      const res = await loginAdmin(usernameInput, passwordInput);
      if (res.success && res.token) {
        localStorage.setItem('mb_admin_token', res.token);
        setIsAuthenticated(true);
        onSuccess(`Welcome, ${res.username || 'Administrator'}`);
        loadAllData();
      } else {
        onError(res.error || 'Invalid credentials');
      }
    } catch (err) {
      onError('Unable to authenticate with server');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mb_admin_token');
    setIsAuthenticated(false);
    onSuccess('Logged out successfully');
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        sData, stData, artData, cData, toolsData, helpData, cmtData, ordData, logData, notifData
      ] = await Promise.all([
        fetchSettings(),
        fetchStatistics(true),
        fetchArticles(),
        fetchCourses(),
        fetchTools().catch(() => []),
        fetchHelpRequests().catch(() => []),
        fetchCmtRequests().catch(() => []),
        fetchOrders().catch(() => []),
        fetchActivityLogs().catch(() => []),
        fetchNotifications().catch(() => [])
      ]);

      setSettings(sData);
      setEditingServices(sData.payoutServices || []);
      setStats(stData);
      setArticles(artData);
      setCourses(cData);
      setTools(toolsData);
      setHelpRequests(helpData);
      setCmtRequests(cmtData);
      setOrders(ordData);
      setActivityLogs(logData);
      setNotifications(notifData);
    } catch (err) {
      console.error(err);
      onError('Error loading admin control parameters.');
    } finally {
      setLoading(false);
    }
  };

  // Updaters
  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const ok = await updateSettings(settings);
      if (ok) {
        onSuccess('Website parameters saved successfully!');
        loadAllData();
      } else {
        onError('Failed to save parameters.');
      }
    } catch (err) {
      onError('Error reaching servers.');
    }
  };

  const handleUpdateStats = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stats) return;
    try {
      const ok = await updateStatistics(stats);
      if (ok) {
        onSuccess('Business statistics updated successfully!');
        loadAllData();
      } else {
        onError('Failed to update stats.');
      }
    } catch (err) {
      onError('Error updating statistics.');
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    try {
      let ok = false;
      if (editingArticle.id) {
        ok = await updateArticle(editingArticle.id, editingArticle);
      } else {
        ok = await createArticle(editingArticle as any);
      }
      if (ok) {
        onSuccess('Article saved!');
        setEditingArticle(null);
        loadAllData();
      } else {
        onError('Could not save article.');
      }
    } catch (err) {
      onError('Failed to write article.');
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    try {
      let ok = false;
      if (editingCourse.id) {
        ok = await updateCourse(editingCourse.id, editingCourse);
      } else {
        ok = await createCourse(editingCourse as any);
      }
      if (ok) {
        onSuccess('Course updated successfully!');
        setEditingCourse(null);
        loadAllData();
      } else {
        onError('Could not update course guide.');
      }
    } catch (err) {
      onError('Failed to save course.');
    }
  };

  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTool) return;
    try {
      let ok = false;
      if (editingTool.id) {
        ok = await updateTool(editingTool.id, editingTool);
      } else {
        ok = await createTool(editingTool as any);
      }
      if (ok) {
        onSuccess('Tool saved successfully!');
        setEditingTool(null);
        loadAllData();
      } else {
        onError('Could not save tool.');
      }
    } catch (err) {
      onError('Failed to save tool.');
    }
  };

  // Payout Services (Resolve Payout & Page Issues) management
  const handleAddService = () => {
    const newSvc: PayoutService = {
      id: `svc-${Date.now()}`,
      key: `SVC_${Date.now()}`,
      name: 'New Service',
      description: '',
      badge: '',
      price: 0,
      originalPrice: 0,
      order: editingServices.length + 1
    };
    setEditingServices([...editingServices, newSvc]);
  };

  const handleServiceFieldChange = (id: string, field: keyof PayoutService, value: any) => {
    setEditingServices(editingServices.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleServicePriceStep = (id: string, delta: number) => {
    setEditingServices(
      editingServices.map((s) => (s.id === id ? { ...s, price: Math.max(0, (Number(s.price) || 0) + delta) } : s))
    );
  };

  const handleRemoveService = (id: string) => {
    if (!confirm('Remove this service from the Resolve Payout & Page Issues form?')) return;
    setEditingServices(editingServices.filter((s) => s.id !== id));
  };

  const handleSaveServices = async () => {
    if (!settings) return;
    setSavingServices(true);
    try {
      const ok = await updateSettings({ ...settings, payoutServices: editingServices });
      if (ok) {
        onSuccess('Payout & Page Issues services updated successfully!');
        loadAllData();
      } else {
        onError('Failed to save services.');
      }
    } catch (err) {
      onError('Error saving services.');
    } finally {
      setSavingServices(false);
    }
  };

  const handleApprovePayment = async (orderId: string) => {
    try {
      const ok = await approveManualPayment(orderId);
      if (ok) {
        onSuccess('Manual transaction approved successfully!');
        loadAllData();
      } else {
        onError('Failed to approve transaction.');
      }
    } catch (err) {
      onError('Error verifying transaction.');
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'upiQrUrl') => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        if (type === 'logo') {
          const res = await uploadBrandingAsset(file.name, base64, 'logo');
          if (res.success) {
            setSettings({ ...settings, logoUrl: res.url });
            onSuccess('Logo branding uploaded!');
          }
        } else {
          // General media uploads
          const res = await uploadBrandingAsset(file.name, base64, 'favicon');
          if (res.success) {
            setSettings({ ...settings, upiQrUrl: res.url });
            onSuccess('Payment scanner QR updated!');
          }
        }
      } catch (err: any) {
        onError(err.message || 'Asset upload failed.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;
    setChangingPass(true);
    try {
      const res = await changeAdminPassword(oldPassword, newPassword);
      if (res.success) {
        onSuccess('Password updated securely! Use new credential next time.');
        setOldPassword('');
        setNewPassword('');
      } else {
        onError('Password update failed.');
      }
    } catch (err: any) {
      onError(err.message || 'Incorrect old password.');
    } finally {
      setChangingPass(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl text-left my-16 animate-fade-in">
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#2563EB]">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0B1120]">Montu Baruah Admin Access</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">Provide secure credentials to manipulate system parameters.</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-700 font-bold mb-1.5">Username</label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="e.g. admin"
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-semibold focus:outline-none focus:border-blue-500 transition text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-700 font-bold mb-1.5">Password</label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-semibold focus:outline-none focus:border-blue-500 transition text-slate-900"
              required
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#0B1120] hover:bg-slate-900 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-widest transition active:scale-95 disabled:opacity-50 mt-2 cursor-pointer"
          >
            {authLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              'SECURE LOGIN'
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-left animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="w-full md:w-64 shrink-0 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm h-fit flex flex-col gap-1.5 font-bold text-xs text-slate-600">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
            <div className="h-10 w-10 rounded-full bg-[#0B1120] text-[#22D3EE] flex items-center justify-center text-sm font-black">
              AD
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900 leading-none">Super Admin</p>
              <p className="text-[10px] text-emerald-500 font-bold mt-1 uppercase tracking-wider">Systems Active</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2.5 py-3 px-4 rounded-xl text-left cursor-pointer transition ${
              activeTab === 'stats' ? 'bg-blue-50 text-[#2563EB]' : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="h-4.5 w-4.5" />
            Dashboard & Statistics
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 py-3 px-4 rounded-xl text-left cursor-pointer transition ${
              activeTab === 'settings' ? 'bg-blue-50 text-[#2563EB]' : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings className="h-4.5 w-4.5" />
            Website Setup
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2.5 py-3 px-4 rounded-xl text-left cursor-pointer transition ${
              activeTab === 'articles' ? 'bg-blue-50 text-[#2563EB]' : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Newspaper className="h-4.5 w-4.5" />
            Manage Articles
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2.5 py-3 px-4 rounded-xl text-left cursor-pointer transition ${
              activeTab === 'courses' ? 'bg-blue-50 text-[#2563EB]' : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BookOpen className="h-4.5 w-4.5" />
            PDF Creator Guides
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`flex items-center gap-2.5 py-3 px-4 rounded-xl text-left cursor-pointer transition ${
              activeTab === 'tools' ? 'bg-blue-50 text-[#2563EB]' : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Wrench className="h-4.5 w-4.5" />
            Tools & App Downloads
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`flex items-center gap-2.5 py-3 px-4 rounded-xl text-left cursor-pointer transition ${
              activeTab === 'help' ? 'bg-blue-50 text-[#2563EB]' : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="h-4.5 w-4.5" />
            Help Solutions Tickets ({helpRequests.length})
          </button>

          <button
            onClick={() => setActiveTab('cmt')}
            className={`flex items-center gap-2.5 py-3 px-4 rounded-xl text-left cursor-pointer transition ${
              activeTab === 'cmt' ? 'bg-blue-50 text-[#2563EB]' : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            CMT Page Orders ({cmtRequests.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2.5 py-3 px-4 rounded-xl text-left cursor-pointer transition ${
              activeTab === 'orders' ? 'bg-blue-50 text-[#2563EB]' : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <FileText className="h-4.5 w-4.5" />
            Manual Receipts Verify
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2.5 py-3 px-4 rounded-xl text-left cursor-pointer transition ${
              activeTab === 'logs' ? 'bg-blue-50 text-[#2563EB]' : 'hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Clipboard className="h-4.5 w-4.5" />
            Admin Activity Logs
          </button>

          <div className="border-t border-slate-100 mt-4 pt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 py-3 px-4 rounded-xl text-left text-red-500 hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="h-4.5 w-4.5" />
              Sign Out Securely
            </button>
          </div>
        </div>

        {/* MAIN PANEL */}
        <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm min-h-[500px]">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-24 text-slate-400 font-bold text-sm">
              <Loader2 className="h-10 w-10 text-[#2563EB] animate-spin mb-4" />
              Synchronizing with Database...
            </div>
          ) : (
            <>
              {/* TAB 1: DASHBOARD & STATISTICS */}
              {activeTab === 'stats' && stats && (
                <div className="flex flex-col gap-8 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-xl font-black text-[#0B1120]">System Diagnostics</h2>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">Edit real-time metrics displayed across the portal.</p>
                    </div>
                    <button 
                       onClick={loadAllData} 
                       className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition cursor-pointer"
                       title="Refresh Data"
                    >
                      <RefreshCw className="h-4 w-4 text-slate-500" />
                    </button>
                  </div>

                  <form onSubmit={handleUpdateStats} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-700 font-bold mb-1.5">Total Page views</label>
                      <input
                        type="number"
                        value={stats.totalViews}
                        onChange={(e) => setStats({ ...stats, totalViews: Number(e.target.value) })}
                        className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-700 font-bold mb-1.5">Problems Solved</label>
                      <input
                        type="number"
                        value={stats.problemsSolved}
                        onChange={(e) => setStats({ ...stats, problemsSolved: Number(e.target.value) })}
                        className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-700 font-bold mb-1.5">Reviews Approved</label>
                      <input
                        type="number"
                        value={stats.reviewsCount}
                        onChange={(e) => setStats({ ...stats, reviewsCount: Number(e.target.value) })}
                        className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-700 font-bold mb-1.5">Free PDF Downloads Count</label>
                      <input
                        type="number"
                        value={stats.freeResources}
                        onChange={(e) => setStats({ ...stats, freeResources: Number(e.target.value) })}
                        className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-900"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="md:col-span-2 bg-[#2563EB] hover:bg-blue-700 text-white font-black py-4 rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-95 transition cursor-pointer"
                    >
                      Update Statistics Summary
                    </button>
                  </form>

                  {/* Password Change Sub-section */}
                  <div className="border-t border-slate-100 pt-8 mt-4 text-left">
                    <h3 className="text-base font-black text-[#0B1120] mb-2 flex items-center gap-1.5">
                      <Lock className="h-5 w-5 text-[#2563EB]" />
                      Update Administrator Credentials
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mb-6">Modify the password used to authenticate into this panel.</p>

                    <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-700 font-bold mb-1.5">Current Password</label>
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="Old Password"
                          className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-700 font-bold mb-1.5">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimum 6 characters"
                          className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-900"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={changingPass}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl transition cursor-pointer"
                      >
                        {changingPass ? 'Updating...' : 'Update Password'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 2: WEBSITE SETUP */}
              {activeTab === 'settings' && settings && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-4 mb-2">
                    <h2 className="text-xl font-black text-[#0B1120]">Branding & Configurations Setup</h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Verify and update layout variables, Paytm merchant markers, and social coordinates.</p>
                  </div>

                  <form onSubmit={handleUpdateSettings} className="flex flex-col gap-6 text-xs font-semibold">
                    
                    {/* Header Logos and Branding */}
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-16 w-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2 overflow-hidden shadow-inner shrink-0">
                          {settings.logoUrl ? (
                            <img src={settings.logoUrl} alt="Website logo" className="h-full w-full object-contain" />
                          ) : (
                            <Image className="h-8 w-8 text-slate-350" />
                          )}
                        </div>
                        <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3 py-1 rounded-lg transition text-center">
                          Upload logo
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(e, 'logo')} />
                        </label>
                      </div>

                      <div className="flex-1 flex flex-col gap-4 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Owner Display Name</label>
                            <input
                              type="text"
                              value={settings.name || ''}
                              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                              className="w-full rounded-xl bg-white border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Branding Tagline</label>
                            <input
                              type="text"
                              value={settings.tagline || ''}
                              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                              className="w-full rounded-xl bg-white border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Paytm Merchant & UPI Parameters */}
                    <div className="border border-slate-200 p-5 rounded-2xl flex flex-col gap-4">
                      <h3 className="text-sm font-black text-[#0B1120] mb-1">Paytm & Manual QR Payments Configuration</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Paytm Verified Merchant ID</label>
                          <input
                            type="text"
                            value={settings.paytmMerchantId || ''}
                            onChange={(e) => setSettings({ ...settings, paytmMerchantId: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Merchant UPI ID (Target Scanner)</label>
                          <input
                            type="text"
                            value={settings.upiId || ''}
                            onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Manual Payments Display Name</label>
                          <input
                            type="text"
                            value={settings.manualPaymentName || ''}
                            onChange={(e) => setSettings({ ...settings, manualPaymentName: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Manual Payment Verification Phone</label>
                          <input
                            type="text"
                            value={settings.manualPaymentPhone || ''}
                            onChange={(e) => setSettings({ ...settings, manualPaymentPhone: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      {/* UPI QR Code upload block */}
                      <div className="flex items-center gap-4 border-t border-slate-100 pt-4 mt-2">
                        <div className="h-16 w-16 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1 overflow-hidden shadow-inner shrink-0">
                          {settings.upiQrUrl ? (
                            <img src={settings.upiQrUrl} alt="UPI Payment QR" className="h-full w-full object-contain" />
                          ) : (
                            <Image className="h-6 w-6 text-slate-300" />
                          )}
                        </div>
                        <div className="text-left">
                          <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] px-3.5 py-2 rounded-lg transition inline-block">
                            Upload Payment QR Image
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(e, 'upiQrUrl')} />
                          </label>
                          <p className="text-[9px] text-slate-400 mt-1">Recommended size 400x400 PNG or JPG. Displays directly on manual checkout steps.</p>
                        </div>
                      </div>

                      <div className="mt-2">
                        <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Manual Payment Instructions text</label>
                        <textarea
                          value={settings.manualPaymentInstructions || ''}
                          onChange={(e) => setSettings({ ...settings, manualPaymentInstructions: e.target.value })}
                          className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                          rows={2}
                        />
                      </div>
                    </div>

                    {/* Contact details and Social URLs */}
                    <div className="border border-slate-200 p-5 rounded-2xl flex flex-col gap-4">
                      <h3 className="text-sm font-black text-[#0B1120] mb-1">Contacts & Social Coordinates</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Official Support Email</label>
                          <input
                            type="email"
                            value={settings.email || ''}
                            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Official WhatsApp Number</label>
                          <input
                            type="text"
                            value={settings.whatsappNumber || ''}
                            onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Facebook Primary URL</label>
                          <input
                            type="text"
                            value={settings.facebookPrimaryUrl || ''}
                            onChange={(e) => setSettings({ ...settings, facebookPrimaryUrl: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Facebook Tech Group URL</label>
                          <input
                            type="text"
                            value={settings.facebookSecondaryUrl || ''}
                            onChange={(e) => setSettings({ ...settings, facebookSecondaryUrl: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Instagram Handle URL</label>
                          <input
                            type="text"
                            value={settings.instagramUrl || ''}
                            onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">YouTube Channel URL</label>
                          <input
                            type="text"
                            value={settings.youtubeUrl || ''}
                            onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Telegram Group URL</label>
                          <input
                            type="text"
                            value={settings.telegramUrl || ''}
                            onChange={(e) => setSettings({ ...settings, telegramUrl: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Nagaon, Assam Location text</label>
                          <input
                            type="text"
                            value={settings.contactInfo || ''}
                            onChange={(e) => setSettings({ ...settings, contactInfo: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-[#2563EB] hover:bg-blue-700 text-white font-black py-4 rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-95 transition cursor-pointer"
                    >
                      Save Branding Parameters
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: MANAGE ARTICLES */}
              {activeTab === 'articles' && (
                <div className="flex flex-col gap-6 animate-fade-in text-left">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-xl font-black text-[#0B1120]">Digital Articles & Case Studies</h2>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">Publish policy guidelines, Reels optimization techniques, and platform commentary.</p>
                    </div>
                    {!editingArticle && (
                      <button
                        onClick={() => setEditingArticle({ title: '', category: 'Security', content: '', excerpt: '', author: 'Montu Baruah' })}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                      >
                        Publish New Article
                      </button>
                    )}
                  </div>

                  {editingArticle ? (
                    <form onSubmit={handleSaveArticle} className="flex flex-col gap-4 text-xs font-semibold">
                      <h3 className="text-sm font-bold text-slate-800">{editingArticle.id ? 'Edit Article' : 'Create New Article'}</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Title</label>
                          <input
                            type="text"
                            value={editingArticle.title || ''}
                            onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Category</label>
                          <select
                            value={editingArticle.category || 'Security'}
                            onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs text-slate-900 font-bold"
                          >
                            <option value="Security">Security</option>
                            <option value="Monetization">Monetization</option>
                            <option value="Policy">Facebook Policy</option>
                            <option value="Creator Growth">Creator Growth</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Excerpt (Short description)</label>
                        <input
                          type="text"
                          value={editingArticle.excerpt || ''}
                          onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                          className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Content (Supports paragraph linebreaks)</label>
                        <textarea
                          value={editingArticle.content || ''}
                          onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                          className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs"
                          rows={10}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Cover Image</label>
                        <div className="flex flex-col gap-2">
                          <GalleryPicker
                            label="Select Article Cover Image"
                            value={editingArticle.coverImageUrl || ''}
                            onChange={(url) => setEditingArticle({ ...editingArticle, coverImageUrl: url })}
                          />
                          <input
                            type="text"
                            value={editingArticle.coverImageUrl || ''}
                            onChange={(e) => setEditingArticle({ ...editingArticle, coverImageUrl: e.target.value })}
                            placeholder="Or paste an image URL directly"
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-semibold"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 mt-2">
                        <button
                          type="button"
                          onClick={() => setEditingArticle(null)}
                          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer"
                        >
                          Save Publication
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {articles.length === 0 ? (
                        <p className="text-slate-400 italic">No articles published. Click 'Publish New Article' to write your first guide.</p>
                      ) : (
                        articles.map((art) => (
                          <div key={art.id} className="border border-slate-150 rounded-2xl p-4.5 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1 text-left">
                              <span className="inline-flex rounded bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-600 uppercase mb-1">{art.category}</span>
                              <h4 className="text-sm font-bold text-[#0B1120]">{art.title}</h4>
                              <p className="text-xs text-slate-400 font-medium mt-0.5">Published on {art.publishDate}</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => setEditingArticle(art)}
                                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm('Delete this article completely?')) {
                                    await deleteArticle(art.id);
                                    loadAllData();
                                  }
                                }}
                                className="px-3 py-1.5 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 font-bold text-xs cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CREATOR COURSES */}
              {activeTab === 'courses' && (
                <div className="flex flex-col gap-6 animate-fade-in text-left">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-xl font-black text-[#0B1120]">Manage PDF Creator Resources</h2>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">Edit free actionable guidelines and course worksheets compiled for the audience.</p>
                    </div>
                    {!editingCourse && (
                      <button
                        onClick={() => setEditingCourse({ title: '', category: 'Monetization', description: '', fileSize: '3.5 MB', fileUrl: '#' })}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                      >
                        Publish New PDF Course
                      </button>
                    )}
                  </div>

                  {editingCourse ? (
                    <form onSubmit={handleSaveCourse} className="flex flex-col gap-4 text-xs font-semibold">
                      <h3 className="text-sm font-bold text-slate-800">{editingCourse.id ? 'Edit Resource' : 'Add New Resource'}</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Title</label>
                          <input
                            type="text"
                            value={editingCourse.title || ''}
                            onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Category</label>
                          <input
                            type="text"
                            value={editingCourse.category || 'Monetization'}
                            onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Description</label>
                        <textarea
                          value={editingCourse.description || ''}
                          onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                          className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs"
                          rows={3}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">File Size</label>
                          <input
                            type="text"
                            value={editingCourse.fileSize || '3.5 MB'}
                            onChange={(e) => setEditingCourse({ ...editingCourse, fileSize: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">PDF File URL</label>
                          <input
                            type="text"
                            value={editingCourse.fileUrl || '#'}
                            onChange={(e) => setEditingCourse({ ...editingCourse, fileUrl: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Thumbnail Cover</label>
                        <div className="flex flex-col gap-2">
                          <GalleryPicker
                            label="Select PDF Thumbnail Cover"
                            value={editingCourse.thumbnailUrl || ''}
                            onChange={(url) => setEditingCourse({ ...editingCourse, thumbnailUrl: url })}
                          />
                          <input
                            type="text"
                            value={editingCourse.thumbnailUrl || ''}
                            onChange={(e) => setEditingCourse({ ...editingCourse, thumbnailUrl: e.target.value })}
                            placeholder="Or paste an image URL directly"
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-semibold"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="checkbox"
                          id="isComingSoonCheck"
                          checked={!!editingCourse.isComingSoon}
                          onChange={(e) => setEditingCourse({ ...editingCourse, isComingSoon: e.target.checked })}
                          className="h-4 w-4 text-blue-600"
                        />
                        <label htmlFor="isComingSoonCheck" className="text-slate-700">Mark as Coming Soon (Placeholder only)</label>
                      </div>

                      <div className="flex gap-3 mt-2">
                        <button
                          type="button"
                          onClick={() => setEditingCourse(null)}
                          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer"
                        >
                          Save PDF Guide
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {courses.length === 0 ? (
                        <p className="text-slate-400 italic">No resources added yet. Click 'Publish New PDF Course' to upload guidelines.</p>
                      ) : (
                        courses.map((course) => (
                          <div key={course.id} className="border border-slate-150 rounded-2xl p-4.5 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex rounded bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 uppercase">{course.category}</span>
                                {course.isComingSoon && <span className="inline-flex rounded bg-cyan-50 px-2 py-0.5 text-[9px] font-bold text-cyan-600 uppercase">Coming Soon</span>}
                              </div>
                              <h4 className="text-sm font-bold text-[#0B1120] mt-1">{course.title}</h4>
                              <p className="text-xs text-slate-400 font-medium mt-0.5">Size: {course.fileSize || 'TBD'} | URL: <span className="font-mono text-[10px] text-slate-500">{course.fileUrl}</span></p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => setEditingCourse(course)}
                                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm('Delete this resource guide?')) {
                                    await deleteCourse(course.id);
                                    loadAllData();
                                  }
                                }}
                                className="px-3 py-1.5 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 font-bold text-xs cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4B: TOOLS & APP DOWNLOADS */}
              {activeTab === 'tools' && (
                <div className="flex flex-col gap-6 animate-fade-in text-left">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-xl font-black text-[#0B1120]">Manage Tools & App Downloads</h2>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">Add app/APK image, description and what the app does. This powers the "Tools" button on the website.</p>
                    </div>
                    {!editingTool && (
                      <button
                        onClick={() => setEditingTool({ name: '', description: '', workDescription: '', imageUrl: '', downloadUrl: '', fileSize: '' })}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                      >
                        Add New Tool
                      </button>
                    )}
                  </div>

                  {editingTool ? (
                    <form onSubmit={handleSaveTool} className="flex flex-col gap-4 text-xs font-semibold">
                      <h3 className="text-sm font-bold text-slate-800">{editingTool.id ? 'Edit Tool' : 'Add New Tool'}</h3>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">App / Tool Name</label>
                        <input
                          type="text"
                          value={editingTool.name || ''}
                          onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                          className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">APK Description</label>
                        <textarea
                          value={editingTool.description || ''}
                          onChange={(e) => setEditingTool({ ...editingTool, description: e.target.value })}
                          className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs"
                          rows={2}
                          placeholder="Short description of the app/APK"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">What This App Does</label>
                        <textarea
                          value={editingTool.workDescription || ''}
                          onChange={(e) => setEditingTool({ ...editingTool, workDescription: e.target.value })}
                          className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs"
                          rows={3}
                          placeholder="Explain what work/function the app performs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">File Size</label>
                          <input
                            type="text"
                            value={editingTool.fileSize || ''}
                            onChange={(e) => setEditingTool({ ...editingTool, fileSize: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs"
                            placeholder="e.g. 12 MB"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">APK Download URL</label>
                          <input
                            type="text"
                            value={editingTool.downloadUrl || ''}
                            onChange={(e) => setEditingTool({ ...editingTool, downloadUrl: e.target.value })}
                            className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs"
                            placeholder="Direct link to the .apk file"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-600 font-bold mb-1">Tool Image (1:1 Square Ratio)</label>
                        <div className="flex flex-col gap-2">
                          <GalleryPicker
                            label="Select Tool Image (1:1 Square)"
                            value={editingTool.imageUrl || ''}
                            onChange={(url) => setEditingTool({ ...editingTool, imageUrl: url })}
                          />
                          <p className="text-[10px] text-slate-400 font-semibold">Tip: upload a square (1:1) image from the gallery for the best look on the Tools page.</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="checkbox"
                          id="isToolComingSoonCheck"
                          checked={!!editingTool.isComingSoon}
                          onChange={(e) => setEditingTool({ ...editingTool, isComingSoon: e.target.checked })}
                          className="h-4 w-4 text-blue-600"
                        />
                        <label htmlFor="isToolComingSoonCheck" className="text-slate-700">Mark as Coming Soon (hide download button)</label>
                      </div>

                      <div className="flex gap-3 mt-2">
                        <button
                          type="button"
                          onClick={() => setEditingTool(null)}
                          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer"
                        >
                          Save Tool
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {tools.length === 0 ? (
                        <p className="text-slate-400 italic">No tools added yet. Click 'Add New Tool' to publish your first app.</p>
                      ) : (
                        tools.map((tool) => (
                          <div key={tool.id} className="border border-slate-150 rounded-2xl p-4.5 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1 text-left">
                              {tool.imageUrl ? (
                                <img src={tool.imageUrl} alt={tool.name} className="h-12 w-12 rounded-lg object-cover border border-slate-200 shrink-0" />
                              ) : (
                                <div className="h-12 w-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                  <Wrench className="h-5 w-5 text-slate-300" />
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  {tool.isComingSoon && <span className="inline-flex rounded bg-cyan-50 px-2 py-0.5 text-[9px] font-bold text-cyan-600 uppercase">Coming Soon</span>}
                                </div>
                                <h4 className="text-sm font-bold text-[#0B1120] mt-0.5">{tool.name}</h4>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">Size: {tool.fileSize || 'N/A'} | URL: <span className="font-mono text-[10px] text-slate-500">{tool.downloadUrl || 'Not set'}</span></p>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => setEditingTool(tool)}
                                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm('Delete this tool?')) {
                                    await deleteTool(tool.id);
                                    loadAllData();
                                  }
                                }}
                                className="px-3 py-1.5 border border-red-200 rounded-lg text-red-500 hover:bg-red-50 font-bold text-xs cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: SOLUTIONS TICKETS */}
              {activeTab === 'help' && (
                <div className="flex flex-col gap-6 animate-fade-in text-left">
                  {/* SERVICES & PRICING MANAGER for "Resolve Payout & Page Issues" form */}
                  <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h2 className="text-lg font-black text-[#0B1120] flex items-center gap-2">
                          <Tag className="h-4.5 w-4.5 text-[#2563EB]" />
                          Manage Services & Pricing
                        </h2>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">These services appear as options on the "Resolve Payout &amp; Page Issues" form on your homepage.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddService}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shrink-0"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add New Service
                      </button>
                    </div>

                    <div className="flex flex-col gap-3">
                      {editingServices.length === 0 ? (
                        <p className="text-slate-400 italic text-xs">No services added yet. Click "Add New Service" to create your first paid or free option.</p>
                      ) : (
                        editingServices.map((svc) => (
                          <div key={svc.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Service Name</label>
                                <input
                                  type="text"
                                  value={svc.name}
                                  onChange={(e) => handleServiceFieldChange(svc.id, 'name', e.target.value)}
                                  className="w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Badge Label (Optional)</label>
                                <input
                                  type="text"
                                  value={svc.badge || ''}
                                  onChange={(e) => handleServiceFieldChange(svc.id, 'badge', e.target.value)}
                                  placeholder="e.g. Special Promotion"
                                  className="w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-semibold"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Short Description</label>
                              <input
                                type="text"
                                value={svc.description || ''}
                                onChange={(e) => handleServiceFieldChange(svc.id, 'description', e.target.value)}
                                className="w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-semibold"
                              />
                            </div>

                            <div className="flex flex-wrap items-end gap-4 pt-1 border-t border-slate-100">
                              <div>
                                <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Price (₹) — 0 = Free</label>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleServicePriceStep(svc.id, -100)}
                                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                                    title="Decrease price by ₹100"
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>
                                  <input
                                    type="number"
                                    min={0}
                                    value={svc.price}
                                    onChange={(e) => handleServiceFieldChange(svc.id, 'price', Math.max(0, Number(e.target.value) || 0))}
                                    className="w-24 rounded-lg bg-slate-50 border border-slate-200 px-2 py-1.5 text-xs font-black text-center text-[#2563EB]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleServicePriceStep(svc.id, 100)}
                                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                                    title="Increase price by ₹100"
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Strikethrough MRP (₹, optional)</label>
                                <input
                                  type="number"
                                  min={0}
                                  value={svc.originalPrice || 0}
                                  onChange={(e) => handleServiceFieldChange(svc.id, 'originalPrice', Math.max(0, Number(e.target.value) || 0))}
                                  className="w-24 rounded-lg bg-slate-50 border border-slate-200 px-2 py-1.5 text-xs font-bold text-center"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveService(svc.id)}
                                className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 font-bold text-[11px] uppercase tracking-wider cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Remove
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveServices}
                      disabled={savingServices}
                      className="mt-4 flex items-center gap-2 bg-[#0B1120] hover:bg-slate-800 text-white font-black py-3 px-6 rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-95 transition cursor-pointer disabled:opacity-60"
                    >
                      {savingServices ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Save Service Changes
                    </button>
                  </div>

                  <div className="border-b border-slate-100 pb-4 mb-2">
                    <h2 className="text-xl font-black text-[#0B1120]">Digital Solutions Assistance Tickets</h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Active requests for Source Transfer, Name Change corrections, and profile setup.</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {helpRequests.length === 0 ? (
                      <p className="text-slate-400 italic">No logged help request tickets found in database state.</p>
                    ) : (
                      helpRequests.map((req) => (
                        <div key={req.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 flex flex-col gap-4 font-semibold text-xs text-slate-600">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">TICKET ID: {req.id}</span>
                              <h4 className="text-sm font-black text-[#0B1120] mt-1">{req.name}</h4>
                            </div>
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              req.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {req.paymentStatus === 'paid' ? 'Paid & Active' : req.paymentStatus === 'pending_manual_verification' ? 'Pending Receipt Verify' : 'Payment Pending'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-y border-slate-200/50 py-3.5 my-1 font-semibold">
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">WhatsApp No</span>
                              <span className="text-slate-800 font-bold">{req.whatsappNumber}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Address</span>
                              <span className="text-slate-800 font-bold truncate block">{req.address}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Required Solution</span>
                              <span className="text-[#2563EB] font-bold uppercase tracking-wider text-[10px]">
                                {req.serviceType === 'OTHER'
                                  ? 'Other problem'
                                  : (settings?.payoutServices || []).find((s) => s.key === req.serviceType)?.name || req.serviceType}
                              </span>
                            </div>
                          </div>

                          <div>
                            <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Problem Description Details</span>
                            <p className="text-slate-700 font-normal leading-relaxed whitespace-pre-wrap bg-white p-3 border border-slate-200 rounded-xl">{req.problemDescription || 'No details provided.'}</p>
                          </div>

                          {req.manualPaymentScreenshotUrl && (
                            <div className="flex items-center gap-3">
                              <span className="text-slate-400">Uploaded screenshot:</span>
                              <a href={req.manualPaymentScreenshotUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline font-extrabold hover:text-blue-800">
                                View Image Screenshot receipt
                              </a>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: CMT ORDERS */}
              {activeTab === 'cmt' && (
                <div className="flex flex-col gap-6 animate-fade-in text-left">
                  <div className="border-b border-slate-100 pb-4 mb-2">
                    <h2 className="text-xl font-black text-[#0B1120]">Monetized CMT Page Purchase Orders</h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Allocate eligibility-primed Creator Monetization Tool (CMT) pages suited for budget levels.</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {cmtRequests.length === 0 ? (
                      <p className="text-slate-400 italic">No cmt page requests submitted.</p>
                    ) : (
                      cmtRequests.map((req) => (
                        <div key={req.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 flex flex-col gap-3 font-semibold text-xs text-slate-600">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-[10px] text-slate-400 font-mono">REQUEST ID: {req.id}</span>
                              <h4 className="text-sm font-black text-[#0B1120] mt-1">{req.name}</h4>
                            </div>
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              req.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {req.paymentStatus === 'paid' ? 'Paid & Verified' : req.paymentStatus === 'pending_manual_verification' ? 'Receipt uploaded' : 'Pending'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 border-y border-slate-200/50 py-3 mt-1 text-[11px] font-bold">
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Phone No</span>
                              <span className="text-slate-800">{req.phoneNumber}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Current Address</span>
                              <span className="text-slate-800 truncate block">{req.address}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Budget Bracket</span>
                              <span className="text-slate-800">{req.budgetType}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Exact Amount</span>
                              <span className="text-blue-600 font-black">₹{req.budgetAmount}</span>
                            </div>
                          </div>

                          {req.manualPaymentScreenshotUrl && (
                            <div className="flex items-center gap-3">
                              <span className="text-slate-400">Uploaded screenshot:</span>
                              <a href={req.manualPaymentScreenshotUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline font-extrabold hover:text-blue-800">
                                View screenshot receipt
                              </a>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 7: MANUAL RECEIPTS VERIFICATION (REAL WORKFLOW INTEGRATION) */}
              {activeTab === 'orders' && (
                <div className="flex flex-col gap-6 animate-fade-in text-left">
                  <div className="border-b border-slate-100 pb-4 mb-2">
                    <h2 className="text-xl font-black text-[#0B1120]">Manual UPI QR Receipts Verification</h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Review and approve transaction screenshots uploaded by users for digital offerings.</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {orders.filter(o => o.paymentMethod === 'manual_upi').length === 0 ? (
                      <p className="text-slate-400 italic">No manual QR code payment orders recorded.</p>
                    ) : (
                      orders.filter(o => o.paymentMethod === 'manual_upi').map((ord) => (
                        <div key={ord.id} className="border border-slate-200 rounded-2xl p-5 bg-white flex flex-col sm:flex-row gap-6 items-start font-semibold text-xs text-slate-600 shadow-sm relative overflow-hidden">
                          {/* Screenshot preview */}
                          <div className="h-32 w-32 shrink-0 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-1 flex items-center justify-center relative group">
                            {ord.manualPaymentScreenshotUrl ? (
                              <img src={ord.manualPaymentScreenshotUrl} alt="Receipt proof" className="h-full w-full object-contain rounded" />
                            ) : (
                              <div className="text-slate-350 text-center text-[10px] p-2">No receipt image attached</div>
                            )}
                          </div>

                          <div className="flex-1 flex flex-col gap-2 w-full text-left">
                            <div className="flex flex-wrap justify-between items-start gap-2">
                              <div>
                                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">ORDER ID: {ord.id}</span>
                                <h4 className="text-sm font-black text-[#0B1120] mt-0.5">{ord.customerName || 'Direct Customer'}</h4>
                              </div>
                              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                                ord.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {ord.paymentStatus === 'paid' ? 'Approved & Paid' : 'Pending Verification'}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[11px] font-bold border-t border-slate-100 pt-2.5 mt-1.5">
                              <div>
                                <span className="text-slate-400 uppercase text-[8px] tracking-wider font-bold">Product Item</span>
                                <p className="text-slate-800 truncate uppercase tracking-wide text-[10px]">{ord.productName || 'Solutions Support'}</p>
                              </div>
                              <div>
                                <span className="text-slate-400 uppercase text-[8px] tracking-wider font-bold">Transaction Sum</span>
                                <p className="text-blue-600 font-extrabold">₹{ord.amount}</p>
                              </div>
                            </div>

                            {ord.transactionId && (
                              <div className="text-[10px]">
                                <span className="text-slate-400 uppercase tracking-wider text-[8px] font-bold block">Submitted TX ID</span>
                                <span className="font-mono bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold block w-fit mt-0.5">{ord.transactionId}</span>
                              </div>
                            )}

                            {ord.paymentStatus !== 'paid' && (
                              <div className="pt-3 mt-1.5 border-t border-slate-100/60 flex gap-2">
                                <button
                                  onClick={() => handleApprovePayment(ord.id)}
                                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4.5 py-2 text-[10px] uppercase tracking-wider transition active:scale-95 shadow-sm shadow-emerald-100 cursor-pointer"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  Approve Payment
                                </button>
                                {ord.manualPaymentScreenshotUrl && (
                                  <a
                                    href={ord.manualPaymentScreenshotUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition text-[10px] font-bold"
                                  >
                                    View Full Receipt
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 8: ACTIVITY LOGS */}
              {activeTab === 'logs' && (
                <div className="flex flex-col gap-6 animate-fade-in text-left">
                  <div className="border-b border-slate-100 pb-4 mb-2">
                    <h2 className="text-xl font-black text-[#0B1120]">System Security & Activity Logs</h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Review administrative modifications, successful logins, and ticket generation times.</p>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto border border-slate-200 rounded-2xl bg-slate-50 p-4 font-mono text-[10px] leading-relaxed text-slate-500 flex flex-col gap-2">
                    {activityLogs.length === 0 ? (
                      <p className="italic text-slate-400">No logs found.</p>
                    ) : (
                      activityLogs.map((log) => (
                        <div key={log.id} className="border-b border-slate-250/20 pb-2 last:border-b-0">
                          <span className="text-slate-400 font-bold">[{new Date(log.timestamp).toLocaleString()}]</span>{' '}
                          <span className="text-slate-700 font-extrabold">{log.action}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </>
          )}

        </div>

      </div>
    </div>
  );
}
