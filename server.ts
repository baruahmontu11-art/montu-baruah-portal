import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import Razorpay from 'razorpay';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.warn('[WARNING] RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not set. Razorpay online payments will fail until these are configured in your .env file.');
}
const razorpay = RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET
  ? new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
  : null;

// Enable JSON parser with large limit for Base64 image uploads
app.use(express.json({ limit: '20mb' }));

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Default initial DB state
const DEFAULT_SETTINGS = {
  name: 'Montu Baruah',
  tagline: 'Social Media Educator | Facebook Creator | Digital Solutions Provider',
  logoUrl: '',
  email: 'officialmontubaruah@gmail.com',
  whatsappNumber: '+918136081232',
  facebookPrimaryUrl: 'https://www.facebook.com/MontuBaruahOfficial',
  facebookSecondaryUrl: 'https://www.facebook.com/MontuTech',
  instagramUrl: 'https://www.instagram.com/themontubaruah',
  youtubeUrl: 'https://youtube.com/@montubaruahofficial',
  telegramUrl: 'https://t.me/montubaruahofficial',
  upiId: 'montubaruah@upi',
  upiQrUrl: '', // generated placeholder or uploaded later
  paytmMerchantId: 'AJrXmZ03694980164704',
  razorpayKeyId: 'rzp_test_placeholder',
  footerText: '© 2026 Montu Baruah. All Rights Reserved. Empowering digital growth across Assam & India.',
  contactInfo: 'Nagaon, Assam, India',
  manualPaymentEnabled: true,
  manualPaymentName: 'Montu Baruah',
  manualPaymentInstructions: 'Make the payment using the QR code or UPI ID. After payment, upload your payment screenshot.',
  manualPaymentPhone: '+918136081232',
  payoutServices: [
    {
      id: 'svc-source-transfer',
      key: 'SOURCE_TRANSFER',
      name: 'Source Transfer Solution',
      description: 'Coordinate secure monetization page/source transfer rights.',
      badge: 'Special Promotion',
      price: 3500,
      originalPrice: 5499,
      order: 1
    },
    {
      id: 'svc-name-change',
      key: 'NAME_CHANGE',
      name: 'Name Change Setup',
      description: 'Bypass limits to correct or align payout creator names.',
      badge: 'Page Fixes',
      price: 3500,
      originalPrice: 4999,
      order: 2
    },
    {
      id: 'svc-create-payout',
      key: 'CREATE_NEW_PAYOUT',
      name: 'Create New Payout Profile',
      description: 'Step-by-step guidance on establishing new bank configurations.',
      badge: '',
      price: 0,
      originalPrice: 0,
      order: 3
    }
  ]
};

// No hardcoded default password. The admin account is bootstrapped from
// ADMIN_USERNAME / ADMIN_BOOTSTRAP_PASSWORD in your .env file the first
// time the server starts (see readDb() below). Passwords are hashed with
// bcrypt, not plain SHA-256.
function buildBootstrapAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (!bootstrapPassword) {
    console.warn('[WARNING] ADMIN_BOOTSTRAP_PASSWORD not set in .env. No admin account will be created — set it and restart the server once to create your admin login.');
    return [];
  }
  return [
    {
      username,
      passwordHash: bcrypt.hashSync(bootstrapPassword, 10)
    }
  ];
}

const DEFAULT_STATISTICS = {
  totalViews: 24750,
  totalHelpRequests: 1240,
  problemsSolved: 984,
  articlesPublished: 8,
  freeResources: 5,
  reviewsCount: 32
};

const DEFAULT_ARTICLES = [
  {
    id: 'art-1',
    title: 'How to Secure Your Facebook Account from Hackers and Impersonators',
    category: 'Security',
    coverImageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60',
    excerpt: 'Learn the vital security settings and two-factor authentication practices to protect your professional Facebook pages and personal accounts.',
    content: 'Security is paramount for any digital creator. Having a high number of followers means you are a constant target for hackers and impersonators. Here is a step-by-step guide on keeping your professional accounts secure:\n\n### 1. Enable Two-Factor Authentication (2FA)\nNever rely solely on your password. Use an authenticator app (like Google Authenticator or Duo) to generate login codes. Avoid SMS-based authentication as it is vulnerable to SIM-swapping.\n\n### 2. Verify Your Contact Details\nEnsure the email addresses and phone numbers connected to your Facebook accounts are active and strictly accessible only by you. Remove old or inactive credentials.\n\n### 3. Setup Trusted Contacts and Payout Locks\nProtect your financial settings and payout options with severe security limits. If your business page is managed by multiple partners, use Facebook Business Manager to explicitly manage and audit user access levels.\n\n### 4. Watch Out for Phishing Scams\nHackers often send fake copyright warnings or partnership offers via Messenger or email. Always check the official Support Inbox on your Facebook dashboard. Facebook will never ask for your password or verification codes via direct messages.',
    publishDate: '2026-08-20',
    readTime: '5 min read',
    author: 'Montu Baruah',
    featured: true
  },
  {
    id: 'art-2',
    title: 'Facebook Page Monetization: Eligibility Guidelines and Setup Tips',
    category: 'Monetization',
    coverImageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=60',
    excerpt: 'A comprehensive walkthrough of Facebook Ads on Reels, In-Stream Ads, and Payout configuration for Indian creators.',
    content: 'Monetizing your content is a major milestone. Facebook offers various tools for creators in India to earn from their video and reel uploads. Here are the eligibility requirements and payout steps you need to know:\n\n### 1. In-Stream Ads\nTo qualify for In-Stream Ads for On-Demand videos, your page must satisfy:\n- At least 5,000 followers.\n- 60,000 total eligible minutes viewed in the last 60 days.\n- At least 5 active videos published on your page.\n\n### 2. Ads on Reels\nThis is an invite-only program but you can increase your chances by consistently publishing original, high-quality Reels. Avoid uploading recycled content or using copyrighted music without proper licensing, as this triggers Partner Monetization Policies violations.\n\n### 3. Stars and Subscriptions\n- **Stars:** Allows fans to buy and send stars to support you. Requires 500 followers for 30 consecutive days.\n- **Subscriptions:** Allows fans to pay a monthly fee. Requires 10,000 followers or 250+ return viewers, and either 50,000 post engagements or 180,000 watch minutes.\n\n### 4. Setting Up Your Payout Account\nWhen your page becomes eligible, you must connect a bank account or PayPal. Ensure the Name on your Payout profile exactly matches your Bank PAN Card to avoid payment holds. If you experience errors during payout setup, seek professional digital solutions.',
    publishDate: '2026-08-28',
    readTime: '7 min read',
    author: 'Montu Baruah',
    featured: true
  }
];

const DEFAULT_COURSES = [
  {
    id: 'course-1',
    title: 'Facebook Page Growth Secrets (PDF)',
    description: 'Learn the exact strategies used to grow multiple pages to 140K+ followers, optimize content distribution, and understand the Facebook algorithm.',
    category: 'Marketing',
    fileSize: '4.2 MB',
    fileUrl: '#download_growth_guide',
    thumbnailUrl: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800&auto=format&fit=crop&q=60',
    isComingSoon: false
  },
  {
    id: 'course-2',
    title: 'Complete Creator Payout Guide',
    description: 'Step-by-step documentation on setting up tax forms, linking bank accounts, resolving payout holds, and correcting transaction issues in India.',
    category: 'Monetization',
    fileSize: '2.8 MB',
    fileUrl: '#download_payout_guide',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60',
    isComingSoon: false
  },
  {
    id: 'course-3',
    title: 'Advanced Video Editing for Reels & Shorts',
    description: 'Master the art of creating high-retention vertical videos, pacing, audio hooks, and graphic overlays using free mobile tools.',
    category: 'Creative',
    fileSize: '0 MB',
    fileUrl: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=60',
    isComingSoon: true
  }
];

const DEFAULT_TOOLS = [
  {
    id: 'tool-1',
    name: 'Montu Baruah Creator Toolkit',
    description: 'Official Android app to manage your creator tools on the go.',
    workDescription: 'Helps Indian creators calculate payouts, evaluate monetization eligibility, generate support requests, and track Facebook page growth — all from one mobile app.',
    imageUrl: '',
    downloadUrl: '',
    fileSize: '0 MB',
    isComingSoon: true
  }
];

const DEFAULT_APPS = [
  {
    id: 'app-1',
    name: 'Montu Baruah Creator Toolkit',
    tagline: 'Your Companion for Social Media Management & Analytics',
    description: 'A mobile utility designed to help Indian creators calculate payouts, evaluate reel monetization rates, generate legal policies, and track Facebook growth with real-time analytics.',
    logoUrl: '',
    posterUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60',
    features: [
      'Payout Tax Rate Calculator for Indian Creators',
      'Originality of Content Policy Checker',
      'Instantly generate WhatsApp Support Requests',
      'Real-time Facebook Monetization updates & tools'
    ],
    playStoreUrl: '',
    appStoreUrl: '',
    downloadUrl: '',
    isReleased: false
  }
];

const DEFAULT_FAQS = [
  {
    id: 'faq-1',
    question: 'How do I resolve a Payout hold or Payout setup issue on Facebook?',
    answer: 'Payout holds usually happen due to mismatching legal details (like PAN Name and Bank Account Name) or tax form (W-8BEN) submission issues. If you are stuck, you can apply through our "Get Help" panel for Source Transfer or Payout Setup assistance.',
    order: 1
  },
  {
    id: 'faq-2',
    question: 'What is a CMT page and why would I purchase one?',
    answer: 'CMT (Creator Monetization Tool/Page) are pre-configured or high-monetization-eligible pages prepared for creators who want to jumpstart their income journey immediately. You can select budgets ranging from ₹5,000 to ₹25,000+ to request one.',
    order: 2
  },
  {
    id: 'faq-3',
    question: 'Are payments made on this website safe?',
    answer: 'Yes, absolutely. We support fully verified Razorpay transactions for automated online payments, which protect your money. Alternatively, you can select manual payment via UPI/QR or continue the conversation directly on WhatsApp to coordinate offline.',
    order: 3
  }
];

const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Rohan Saikia',
    rating: 5,
    comment: 'Montu da helped me recover my restricted payout account. His name change and source transfer solutions are 100% genuine. Highly recommended!',
    date: '2026-08-25',
    approved: true,
    featured: true
  },
  {
    id: 'rev-2',
    name: 'Ananya Borah',
    rating: 5,
    comment: 'The Free PDF Growth Secrets course is simple and filled with practical insights. My page saw a 40% engagement boost in just two weeks.',
    date: '2026-08-29',
    approved: true,
    featured: true
  }
];

// Read/Write DB helper functions
function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    const initialState = {
      settings: DEFAULT_SETTINGS,
      admins: buildBootstrapAdmin(),
      statistics: DEFAULT_STATISTICS,
      articles: DEFAULT_ARTICLES,
      articleReviews: [],
      courses: DEFAULT_COURSES,
      tools: DEFAULT_TOOLS,
      apps: DEFAULT_APPS,
      faqs: DEFAULT_FAQS,
      reviews: DEFAULT_REVIEWS,
      helpRequests: [],
      cmtRequests: [],
      websiteProjects: [],
      orders: [],
      notifications: [],
      sessions: [],
      preRegistrations: [],
      activityLogs: [
        {
          id: 'log-1',
          action: 'Database initialized with seed data',
          timestamp: new Date().toISOString()
        }
      ]
    };
    writeDb(initialState);
    return initialState;
  }
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB, returning defaults', err);
    return {};
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB', err);
  }
}

function addLog(action: string) {
  const db = readDb();
  const log = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    action,
    timestamp: new Date().toISOString()
  };
  db.activityLogs = [log, ...(db.activityLogs || [])].slice(0, 200); // Keep last 200 logs
  writeDb(db);
}

function addNotification(type: any, title: string, message: string) {
  const db = readDb();
  const notif = {
    id: `notif-${Date.now()}`,
    type,
    title,
    message,
    date: new Date().toISOString(),
    read: false
  };
  db.notifications = [notif, ...(db.notifications || [])];
  writeDb(db);
}

// Ensure database is initialized
readDb();

// STATIC FILES & UPLOADS MAPPING
app.use('/uploads', express.static(UPLOADS_DIR));

// AUTHENTICATION MIDDLEWARE
function authenticateAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or malformed token' });
  }
  const token = authHeader.split(' ')[1];
  const db = readDb();
  const session = (db.sessions || []).find((s: any) => s.token === token && new Date(s.expiresAt) > new Date());
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
  }
  // Extend session expiry
  session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
  writeDb(db);
  (req as any).adminUsername = session.username;
  next();
}

// API ENDPOINTS

// 1. AUTH
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const db = readDb();

  // Primary path: check against the stored (bcrypt-hashed) admin list.
  let matchedUsername: string | null = null;
  const admin = (db.admins || []).find((a: any) => a.username.toLowerCase() === username.toLowerCase());
  if (admin && bcrypt.compareSync(password, admin.passwordHash)) {
    matchedUsername = admin.username;
  }

  // Fallback path: also accept the credentials directly from ADMIN_USERNAME /
  // ADMIN_BOOTSTRAP_PASSWORD env vars. This makes login independent of
  // whether data/db.json ever got successfully bootstrapped with an admin
  // record on this hosting platform (some platforms don't guarantee the
  // data directory persists the same way across every deploy/restart).
  const envUsername = process.env.ADMIN_USERNAME;
  const envPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (!matchedUsername && envUsername && envPassword &&
      username.toLowerCase() === envUsername.toLowerCase() && password === envPassword) {
    matchedUsername = envUsername;
    // Make sure this account also exists in the stored admin list going
    // forward, hashed properly, so future password changes work normally.
    db.admins = db.admins || [];
    if (!db.admins.find((a: any) => a.username.toLowerCase() === envUsername.toLowerCase())) {
      db.admins.push({ username: envUsername, passwordHash: bcrypt.hashSync(envPassword, 10) });
    }
  }

  if (!matchedUsername) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  const token = `MB-${crypto.randomBytes(32).toString('hex')}`;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
  db.sessions = db.sessions || [];
  db.sessions.push({ username: matchedUsername, token, expiresAt });
  writeDb(db);
  addLog(`Admin '${matchedUsername}' logged in successfully`);
  res.json({ success: true, token, username: matchedUsername });
});

app.post('/api/auth/change-password', authenticateAdmin, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Both current and new passwords are required' });
  }
  const username = (req as any).adminUsername;
  const db = readDb();
  const adminIdx = (db.admins || []).findIndex((a: any) => a.username.toLowerCase() === username.toLowerCase());
  if (adminIdx === -1 || !bcrypt.compareSync(oldPassword, db.admins[adminIdx].passwordHash)) {
    return res.status(401).json({ error: 'Incorrect current password' });
  }
  db.admins[adminIdx].passwordHash = bcrypt.hashSync(newPassword, 10);
  writeDb(db);
  addLog(`Admin '${username}' changed their password securely`);
  res.json({ success: true });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const db = readDb();
    db.sessions = (db.sessions || []).filter((s: any) => s.token !== token);
    writeDb(db);
  }
  res.json({ success: true });
});

app.get('/api/auth/me', authenticateAdmin, (req, res) => {
  res.json({ success: true, username: (req as any).adminUsername });
});

app.get('/api/auth/verify', authenticateAdmin, (req, res) => {
  res.json({ success: true, username: (req as any).adminUsername });
});

// ONE-TIME ADMIN SETUP
// This lets you create a brand-new admin login directly from the browser,
// without depending on .env being read correctly by your hosting panel.
// The token below is baked into this file so it works even if environment
// variables fail to load on your host. It can be used ONCE — after a new
// admin is created, this route locks itself permanently (tracked in
// data/db.json as `setupUsed`).
const SETUP_TOKEN = '51e30492400b3fb33aa70303d3b12705fc3151f6d9b4839f';

app.get('/admin-setup', (req, res) => {
  const db = readDb();
  const used = !!db.setupUsed;
  const providedToken = String(req.query.token || '');
  const tokenOk = providedToken === SETUP_TOKEN;
  res.send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>One-Time Admin Setup</title>
<style>
body{font-family:Arial,Helvetica,sans-serif;background:#0f172a;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
.card{background:#1e293b;padding:32px;border-radius:12px;max-width:400px;width:90%;box-shadow:0 10px 30px rgba(0,0,0,.4)}
h1{font-size:20px;margin-top:0}
label{display:block;font-size:13px;margin:14px 0 6px;color:#94a3b8}
input{width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#fff;box-sizing:border-box}
button{margin-top:20px;width:100%;padding:12px;border:none;border-radius:8px;background:#2563eb;color:#fff;font-weight:bold;cursor:pointer}
button:disabled{background:#475569;cursor:not-allowed}
.msg{margin-top:14px;font-size:14px}
.err{color:#f87171}
.ok{color:#4ade80}
</style></head>
<body>
<div class="card">
${used ? `
  <h1>Setup already used</h1>
  <p class="msg">A new admin account was already created with this one-time link. This page is now permanently locked for security. If you need another reset, ask your developer to issue a new token.</p>
` : !tokenOk ? `
  <h1>Invalid or missing token</h1>
  <p class="msg err">Open this page using the exact one-time link you were given (it includes ?token=...).</p>
` : `
  <h1>Create your new admin login</h1>
  <p class="msg">This works one time only. As soon as you submit, this page locks itself.</p>
  <label>New username</label>
  <input id="u" type="text" autocomplete="off" />
  <label>New password</label>
  <input id="p" type="password" autocomplete="new-password" />
  <label>Confirm password</label>
  <input id="p2" type="password" autocomplete="new-password" />
  <button id="btn" onclick="submitSetup()">Create admin account</button>
  <div id="out" class="msg"></div>
  <script>
    async function submitSetup() {
      const u = document.getElementById('u').value.trim();
      const p = document.getElementById('p').value;
      const p2 = document.getElementById('p2').value;
      const out = document.getElementById('out');
      const btn = document.getElementById('btn');
      out.textContent = '';
      out.className = 'msg';
      if (!u || !p) { out.textContent = 'Username and password are required.'; out.className = 'msg err'; return; }
      if (p !== p2) { out.textContent = 'Passwords do not match.'; out.className = 'msg err'; return; }
      if (p.length < 8) { out.textContent = 'Password must be at least 8 characters.'; out.className = 'msg err'; return; }
      btn.disabled = true;
      try {
        const res = await fetch('/api/setup/create-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: '${SETUP_TOKEN}', username: u, password: p })
        });
        const data = await res.json();
        if (data.success) {
          out.textContent = 'Admin account created! You can now log in at /admin with your new username and password. This setup page is now locked.';
          out.className = 'msg ok';
        } else {
          out.textContent = data.error || 'Something went wrong.';
          out.className = 'msg err';
          btn.disabled = false;
        }
      } catch (e) {
        out.textContent = 'Network error. Please try again.';
        out.className = 'msg err';
        btn.disabled = false;
      }
    }
  </script>
`}
</div>
</body></html>`);
});

app.post('/api/setup/create-admin', (req, res) => {
  const { token, username, password } = req.body;
  const db = readDb();
  if (db.setupUsed) {
    return res.status(403).json({ error: 'Setup has already been used and is permanently locked.' });
  }
  if (token !== SETUP_TOKEN) {
    return res.status(401).json({ error: 'Invalid setup token.' });
  }
  if (!username || !password || String(password).length < 8) {
    return res.status(400).json({ error: 'Username and a password of at least 8 characters are required.' });
  }
  db.admins = [
    { username: String(username), passwordHash: bcrypt.hashSync(String(password), 10) }
  ];
  db.setupUsed = true;
  db.sessions = []; // invalidate any old sessions
  writeDb(db);
  addLog(`New admin account '${username}' created via one-time setup link (previous admins replaced)`);
  res.json({ success: true });
});

// BRANDING ASSETS SECURE UPLOAD
app.post('/api/settings/branding/upload', authenticateAdmin, (req, res) => {
  const { name, base64Data, type } = req.body;
  if (!name || !base64Data) {
    return res.status(400).json({ error: 'Name and Base64 data are required' });
  }
  // Validate extension
  const ext = path.extname(name).toLowerCase();
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico'];
  if (!allowedExtensions.includes(ext)) {
    return res.status(400).json({ error: 'Invalid file type. Only PNG, JPG, JPEG, WEBP, SVG, and ICO are supported.' });
  }
  // Estimate base64 decoded size (length * 3 / 4)
  const estimatedSize = (base64Data.length * 3) / 4;
  if (estimatedSize > 5 * 1024 * 1024) {
    return res.status(400).json({ error: 'File size must be less than 5 MB.' });
  }
  try {
    let pureBase64 = base64Data;
    if (base64Data.includes(';base64,')) {
      const parts = base64Data.split(';base64,');
      pureBase64 = parts[1];
      const mime = parts[0].replace('data:', '');
      const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'];
      if (!allowedMimes.includes(mime)) {
        return res.status(400).json({ error: 'Invalid MIME type. Uploading executable or dangerous files is forbidden.' });
      }
    }
    const buffer = Buffer.from(pureBase64, 'base64');
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size must be less than 5 MB.' });
    }
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    const safeName = `branding-${type || 'asset'}-${Date.now()}${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeName);
    fs.writeFileSync(filePath, buffer);
    addLog(`Uploaded branding asset: "${safeName}"`);
    res.json({ success: true, url: `/uploads/${safeName}` });
  } catch (err) {
    console.error('Branding upload failure:', err);
    res.status(500).json({ error: 'Upload failed. Please try again.' });
  }
});

// 2. SETTINGS
app.get('/api/settings', (req, res) => {
  const db = readDb();
  const settings = db.settings || DEFAULT_SETTINGS;
  // Backfill payoutServices for sites created before this field existed
  if (!settings.payoutServices || !Array.isArray(settings.payoutServices)) {
    settings.payoutServices = DEFAULT_SETTINGS.payoutServices;
  }
  res.json(settings);
});

app.put('/api/settings', authenticateAdmin, (req, res) => {
  const db = readDb();
  db.settings = { ...(db.settings || DEFAULT_SETTINGS), ...req.body };
  writeDb(db);
  addLog('Website settings updated');
  res.json({ success: true, settings: db.settings });
});

// 3. STATISTICS
app.get('/api/statistics', (req, res) => {
  const db = readDb();
  // Track visual pageviews implicitly on API calls
  if (!req.query.noIncrement) {
    db.statistics = db.statistics || DEFAULT_STATISTICS;
    db.statistics.totalViews = (db.statistics.totalViews || 0) + 1;
    writeDb(db);
  }
  res.json(db.statistics || DEFAULT_STATISTICS);
});

app.put('/api/statistics', authenticateAdmin, (req, res) => {
  const db = readDb();
  db.statistics = { ...(db.statistics || DEFAULT_STATISTICS), ...req.body };
  writeDb(db);
  addLog('Business statistics updated manually');
  res.json({ success: true, statistics: db.statistics });
});

// 4. ARTICLES
app.get('/api/articles', (req, res) => {
  const db = readDb();
  res.json(db.articles || []);
});

app.post('/api/articles', authenticateAdmin, (req, res) => {
  const db = readDb();
  const newArticle = {
    id: `art-${Date.now()}`,
    ...req.body,
    publishDate: new Date().toISOString().split('T')[0],
    readTime: req.body.readTime || '5 min read',
    author: req.body.author || 'Montu Baruah',
    featured: !!req.body.featured
  };
  db.articles = db.articles || [];
  db.articles.unshift(newArticle);
  // Update stat
  db.statistics = db.statistics || DEFAULT_STATISTICS;
  db.statistics.articlesPublished = db.articles.length;
  writeDb(db);
  addLog(`Article created: "${newArticle.title}"`);
  res.json({ success: true, article: newArticle });
});

app.put('/api/articles/:id', authenticateAdmin, (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const index = (db.articles || []).findIndex((a: any) => a.id === id);
  if (index === -1) return res.status(404).json({ error: 'Article not found' });
  db.articles[index] = { ...db.articles[index], ...req.body };
  writeDb(db);
  addLog(`Article updated: "${db.articles[index].title}"`);
  res.json({ success: true, article: db.articles[index] });
});

app.delete('/api/articles/:id', authenticateAdmin, (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const article = (db.articles || []).find((a: any) => a.id === id);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  db.articles = db.articles.filter((a: any) => a.id !== id);
  // Update stat
  db.statistics = db.statistics || DEFAULT_STATISTICS;
  db.statistics.articlesPublished = db.articles.length;
  writeDb(db);
  addLog(`Article deleted: "${article.title}"`);
  res.json({ success: true });
});

// 5. ARTICLE REVIEWS
app.get('/api/articles/:id/reviews', (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const approvedOnly = req.query.approved === 'true';
  let reviews = (db.articleReviews || []).filter((r: any) => r.articleId === id);
  if (approvedOnly) {
    reviews = reviews.filter((r: any) => r.approved);
  }
  res.json(reviews);
});

app.post('/api/articles/:id/reviews', (req, res) => {
  const db = readDb();
  const articleId = req.params.id;
  const { name, rating, comment } = req.body;
  if (!name || !rating || !comment) {
    return res.status(400).json({ error: 'Required fields missing' });
  }
  const newReview = {
    id: `ar-${Date.now()}`,
    articleId,
    name,
    rating: Number(rating),
    comment,
    date: new Date().toISOString().split('T')[0],
    approved: false // requires admin approval
  };
  db.articleReviews = db.articleReviews || [];
  db.articleReviews.push(newReview);
  writeDb(db);
  addNotification('review', 'New Article Review', `${name} left a ${rating}-star review on article ${articleId}`);
  res.json({ success: true, message: 'Review submitted for approval!' });
});

// 6. ALL REVIEWS (TESTIMONIALS + ARTICLE REVIEWS)
app.get('/api/reviews', (req, res) => {
  const db = readDb();
  const approvedOnly = req.query.approved === 'true';
  let list = db.reviews || [];
  if (approvedOnly) {
    list = list.filter((r: any) => r.approved);
  }
  res.json(list);
});

app.post('/api/reviews', (req, res) => {
  const db = readDb();
  const { name, rating, comment } = req.body;
  if (!name || !rating || !comment) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const newReview = {
    id: `rev-${Date.now()}`,
    name,
    rating: Number(rating),
    comment,
    date: new Date().toISOString().split('T')[0],
    approved: false, // Default pending admin approval
    featured: false
  };
  db.reviews = db.reviews || [];
  db.reviews.push(newReview);
  writeDb(db);
  addNotification('review', 'New Platform Testimonial', `${name} rated us ${rating} stars.`);
  res.json({ success: true, message: 'Thank you for your rating! It has been submitted for approval.' });
});

app.get('/api/admin/reviews', authenticateAdmin, (req, res) => {
  const db = readDb();
  const testimonials = (db.reviews || []).map((r: any) => ({ ...r, reviewType: 'platform' }));
  const articleReviews = (db.articleReviews || []).map((r: any) => {
    const art = (db.articles || []).find((a: any) => a.id === r.articleId);
    return { ...r, reviewType: 'article', articleTitle: art ? art.title : 'Deleted Article' };
  });
  res.json([...testimonials, ...articleReviews]);
});

app.put('/api/reviews/:id/approve', authenticateAdmin, (req, res) => {
  const db = readDb();
  const id = req.params.id;
  // Try platform reviews first
  let target = (db.reviews || []).find((r: any) => r.id === id);
  if (target) {
    target.approved = true;
    db.statistics = db.statistics || DEFAULT_STATISTICS;
    db.statistics.reviewsCount = (db.reviews || []).filter((r: any) => r.approved).length;
    writeDb(db);
    addLog(`Platform testimonial approved for '${target.name}'`);
    return res.json({ success: true });
  }
  // Try article reviews
  target = (db.articleReviews || []).find((r: any) => r.id === id);
  if (target) {
    target.approved = true;
    writeDb(db);
    addLog(`Article review approved for '${target.name}'`);
    return res.json({ success: true });
  }
  res.status(404).json({ error: 'Review not found' });
});

app.put('/api/reviews/:id/feature', authenticateAdmin, (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const target = (db.reviews || []).find((r: any) => r.id === id);
  if (!target) return res.status(404).json({ error: 'Review not found' });
  target.featured = !target.featured;
  writeDb(db);
  addLog(`Platform review featured status toggled for '${target.name}'`);
  res.json({ success: true, review: target });
});

app.delete('/api/reviews/:id', authenticateAdmin, (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const originalPlatformLength = (db.reviews || []).length;
  db.reviews = (db.reviews || []).filter((r: any) => r.id !== id);
  if ((db.reviews || []).length < originalPlatformLength) {
    db.statistics = db.statistics || DEFAULT_STATISTICS;
    db.statistics.reviewsCount = db.reviews.filter((r: any) => r.approved).length;
    writeDb(db);
    addLog(`Platform review deleted`);
    return res.json({ success: true });
  }
  const originalArticleLength = (db.articleReviews || []).length;
  db.articleReviews = (db.articleReviews || []).filter((r: any) => r.id !== id);
  if ((db.articleReviews || []).length < originalArticleLength) {
    writeDb(db);
    addLog(`Article review deleted`);
    return res.json({ success: true });
  }
  res.status(404).json({ error: 'Review not found' });
});

// 7. COURSES (FREE PDFS)
app.get('/api/courses', (req, res) => {
  const db = readDb();
  res.json(db.courses || []);
});

app.post('/api/courses', authenticateAdmin, (req, res) => {
  const db = readDb();
  const newCourse = {
    id: `course-${Date.now()}`,
    ...req.body,
    fileSize: req.body.fileSize || '3.5 MB',
    fileUrl: req.body.fileUrl || '#',
    isComingSoon: !!req.body.isComingSoon
  };
  db.courses = db.courses || [];
  db.courses.push(newCourse);
  // Update statistics
  db.statistics = db.statistics || DEFAULT_STATISTICS;
  db.statistics.freeResources = db.courses.filter((c: any) => !c.isComingSoon).length;
  writeDb(db);
  addLog(`Course PDF added: "${newCourse.title}"`);
  res.json({ success: true, course: newCourse });
});

app.put('/api/courses/:id', authenticateAdmin, (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const index = (db.courses || []).findIndex((c: any) => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Course not found' });
  db.courses[index] = { ...db.courses[index], ...req.body };
  db.statistics = db.statistics || DEFAULT_STATISTICS;
  db.statistics.freeResources = db.courses.filter((c: any) => !c.isComingSoon).length;
  writeDb(db);
  addLog(`Course PDF updated: "${db.courses[index].title}"`);
  res.json({ success: true, course: db.courses[index] });
});

app.delete('/api/courses/:id', authenticateAdmin, (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const course = (db.courses || []).find((c: any) => c.id === id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  db.courses = db.courses.filter((c: any) => c.id !== id);
  db.statistics = db.statistics || DEFAULT_STATISTICS;
  db.statistics.freeResources = db.courses.filter((c: any) => !c.isComingSoon).length;
  writeDb(db);
  addLog(`Course PDF deleted: "${course.title}"`);
  res.json({ success: true });
});

// 7B. TOOLS (DOWNLOADABLE APPS/APKS)
app.get('/api/tools', (req, res) => {
  const db = readDb();
  res.json(db.tools || []);
});

app.post('/api/tools', authenticateAdmin, (req, res) => {
  const db = readDb();
  const newTool = {
    id: `tool-${Date.now()}`,
    ...req.body,
    fileSize: req.body.fileSize || '',
    downloadUrl: req.body.downloadUrl || '#',
    isComingSoon: !!req.body.isComingSoon
  };
  db.tools = db.tools || [];
  db.tools.push(newTool);
  writeDb(db);
  addLog(`Tool added: "${newTool.name}"`);
  res.json({ success: true, tool: newTool });
});

app.put('/api/tools/:id', authenticateAdmin, (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const index = (db.tools || []).findIndex((t: any) => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Tool not found' });
  db.tools[index] = { ...db.tools[index], ...req.body };
  writeDb(db);
  addLog(`Tool updated: "${db.tools[index].name}"`);
  res.json({ success: true, tool: db.tools[index] });
});

app.delete('/api/tools/:id', authenticateAdmin, (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const tool = (db.tools || []).find((t: any) => t.id === id);
  if (!tool) return res.status(404).json({ error: 'Tool not found' });
  db.tools = db.tools.filter((t: any) => t.id !== id);
  writeDb(db);
  addLog(`Tool deleted: "${tool.name}"`);
  res.json({ success: true });
});

// 8. APPS PROMO
app.get('/api/apps', (req, res) => {
  const db = readDb();
  res.json(db.apps || []);
});

app.post('/api/apps', authenticateAdmin, (req, res) => {
  const db = readDb();
  const newApp = {
    id: `app-${Date.now()}`,
    ...req.body,
    features: Array.isArray(req.body.features) ? req.body.features : [],
    isReleased: !!req.body.isReleased
  };
  db.apps = db.apps || [];
  db.apps.push(newApp);
  writeDb(db);
  addLog(`App added: "${newApp.name}"`);
  res.json({ success: true, app: newApp });
});

app.put('/api/apps/:id', authenticateAdmin, (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const index = (db.apps || []).findIndex((a: any) => a.id === id);
  if (index === -1) return res.status(404).json({ error: 'App not found' });
  db.apps[index] = { ...db.apps[index], ...req.body };
  writeDb(db);
  addLog(`App updated: "${db.apps[index].name}"`);
  res.json({ success: true, app: db.apps[index] });
});

app.delete('/api/apps/:id', authenticateAdmin, (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const appItem = (db.apps || []).find((a: any) => a.id === id);
  if (!appItem) return res.status(404).json({ error: 'App not found' });
  db.apps = db.apps.filter((a: any) => a.id !== id);
  writeDb(db);
  addLog(`App deleted: "${appItem.name}"`);
  res.json({ success: true });
});

app.post('/api/apps/:id/pre-register', (req, res) => {
  const { id } = req.params;
  const { emailOrPhone } = req.body;
  if (!emailOrPhone) {
    return res.status(400).json({ error: 'Email or phone is required' });
  }
  const db = readDb();
  db.preRegistrations = db.preRegistrations || [];
  db.preRegistrations.push({
    id: `prereg-${Date.now()}`,
    appId: id,
    emailOrPhone,
    date: new Date().toISOString()
  });
  writeDb(db);
  addNotification(
    'help_request',
    'New App Pre-registration',
    `New pre-registration for App ID ${id}: ${emailOrPhone}`
  );
  addLog(`Pre-registered user for app ${id}: ${emailOrPhone}`);
  res.json({ success: true });
});

// 9. HELP REQUESTS
app.get('/api/help-requests', authenticateAdmin, (req, res) => {
  const db = readDb();
  res.json(db.helpRequests || []);
});

app.post('/api/help-requests', (req, res) => {
  const db = readDb();
  const { name, address, whatsappNumber, serviceType, problemDescription, paymentMethod } = req.body;
  if (!name || !address || !whatsappNumber || !serviceType) {
    return res.status(400).json({ error: 'Required fields missing' });
  }
  // Set prices server-side to avoid frontend tampering.
  // Prices come from the admin-managed service list (db.settings.payoutServices),
  // looked up by the service's stable "key". 'OTHER' is always free/custom (₹0, discussed on WhatsApp).
  let servicePrice = 0;
  if (serviceType !== 'OTHER') {
    const services = (db.settings && db.settings.payoutServices) || DEFAULT_SETTINGS.payoutServices;
    const matchedService = services.find((s: any) => s.key === serviceType);
    servicePrice = matchedService ? Number(matchedService.price) || 0 : 0;
  }

  const isPaidService = servicePrice > 0;
  const newRequest = {
    id: `req-${Date.now()}`,
    name,
    address,
    whatsappNumber,
    serviceType,
    servicePrice,
    problemDescription: problemDescription || '',
    paymentMethod: isPaidService ? (paymentMethod || 'manual_upi') : 'none',
    paymentStatus: isPaidService
       ? (paymentMethod === 'razorpay' ? 'pending' : 'pending_manual_verification')
       : 'paid', // FREE is automatically marked paid
    date: new Date().toISOString()
  };
  db.helpRequests = db.helpRequests || [];
  db.helpRequests.unshift(newRequest);
  let orderId = '';
  // Generate associated order if paid
  if (isPaidService) {
    const newOrder = {
      id: `ord-${Date.now()}`,
      type: 'help_request',
      targetId: newRequest.id,
      amount: servicePrice,
      paymentMethod: newRequest.paymentMethod,
      paymentStatus: newRequest.paymentStatus,
      date: newRequest.date
    };
    db.orders = db.orders || [];
    db.orders.unshift(newOrder);
    orderId = newOrder.id;
         
    addNotification(
      'payment_pending',
      'New Pending Payment',
      `${name} submitted a ${serviceType} request (Amount: ₹${servicePrice}). Payment is ${newRequest.paymentStatus}.`
    );
  } else {
    // Increment completed problem solved statistic for FREE/Other problem directly if needed, or track help request
    db.statistics = db.statistics || DEFAULT_STATISTICS;
    db.statistics.totalHelpRequests = (db.statistics.totalHelpRequests || 0) + 1;
    writeDb(db);
         
    addNotification(
      'help_request',
      'New Help Request',
      `${name} submitted a ${serviceType} request (FREE).`
    );
  }
  writeDb(db);
  res.json({ success: true, request: newRequest, orderId });
});

// 10. CMT REQUESTS
app.get('/api/cmt-requests', authenticateAdmin, (req, res) => {
  const db = readDb();
  res.json(db.cmtRequests || []);
});

app.post('/api/cmt-requests', (req, res) => {
  const db = readDb();
  const { name, address, phoneNumber, budgetType, budgetAmount, paymentMethod } = req.body;
  if (!name || !address || !phoneNumber || !budgetType || !budgetAmount) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }
  const newCmt = {
    id: `cmt-${Date.now()}`,
    name,
    address,
    phoneNumber,
    budgetType,
    budgetAmount: Number(budgetAmount),
    paymentMethod: paymentMethod || 'manual_upi',
    paymentStatus: paymentMethod === 'razorpay' ? 'pending' : 'pending_manual_verification',
    date: new Date().toISOString()
  };
  db.cmtRequests = db.cmtRequests || [];
  db.cmtRequests.unshift(newCmt);
  // Generate associated order
  const newOrder = {
    id: `ord-${Date.now()}`,
    type: 'cmt_request',
    targetId: newCmt.id,
    amount: newCmt.budgetAmount,
    paymentMethod: newCmt.paymentMethod,
    paymentStatus: newCmt.paymentStatus,
    date: newCmt.date
  };
  db.orders = db.orders || [];
  db.orders.unshift(newOrder);
  writeDb(db);
  addNotification(
    'cmt_request',
    'New CMT Page Request',
    `${name} requested a CMT Page (Budget: ₹${budgetAmount}).`
  );
  res.json({ success: true, request: newCmt, orderId: newOrder.id });
});

// 11. WEBSITE PROJECTS
app.get('/api/website-projects', authenticateAdmin, (req, res) => {
  const db = readDb();
  res.json(db.websiteProjects || []);
});

app.post('/api/website-projects', (req, res) => {
  const db = readDb();
  const { name, whatsappNumber, email, projectType, budget, projectDescription } = req.body;
  if (!name || !whatsappNumber || !projectType || !budget) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }
  const newProject = {
    id: `web-${Date.now()}`,
    name,
    whatsappNumber,
    email: email || '',
    projectType,
    budget,
    projectDescription: projectDescription || '',
    date: new Date().toISOString()
  };
  db.websiteProjects = db.websiteProjects || [];
  db.websiteProjects.unshift(newProject);
  writeDb(db);
  addNotification(
    'website_project',
    'New Website Project Request',
    `${name} wants a '${projectType}' website (Budget: ${budget}).`
  );
  res.json({ success: true, project: newProject });
});

// 12. FAQS
app.get('/api/faqs', (req, res) => {
  const db = readDb();
  res.json(db.faqs || []);
});

app.post('/api/faqs', authenticateAdmin, (req, res) => {
  const db = readDb();
  const newFaq = {
    id: `faq-${Date.now()}`,
    question: req.body.question,
    answer: req.body.answer,
    order: (db.faqs || []).length + 1
  };
  db.faqs = db.faqs || [];
  db.faqs.push(newFaq);
  writeDb(db);
  addLog(`FAQ added: "${newFaq.question}"`);
  res.json({ success: true, faq: newFaq });
});

app.put('/api/faqs/:id', authenticateAdmin, (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const index = (db.faqs || []).findIndex((f: any) => f.id === id);
  if (index === -1) return res.status(404).json({ error: 'FAQ not found' });
  db.faqs[index] = { ...db.faqs[index], ...req.body };
  writeDb(db);
  addLog(`FAQ updated: "${db.faqs[index].question}"`);
  res.json({ success: true, faq: db.faqs[index] });
});

app.delete('/api/faqs/:id', authenticateAdmin, (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const faq = (db.faqs || []).find((f: any) => f.id === id);
  if (!faq) return res.status(404).json({ error: 'FAQ not found' });
  db.faqs = db.faqs.filter((f: any) => f.id !== id);
  writeDb(db);
  addLog(`FAQ deleted: "${faq.question}"`);
  res.json({ success: true });
});

// 13. ORDERS & PAYMENTS
app.get('/api/orders', authenticateAdmin, (req, res) => {
  const db = readDb();
  const orders = (db.orders || []).map((o: any) => {
    const order = { ...o };
    if (!order.customerName || !order.productName) {
      if (order.type === 'help_request') {
        const reqItem = (db.helpRequests || []).find((r: any) => r.id === order.targetId);
        if (reqItem) {
          order.customerName = reqItem.name;
          order.productName = reqItem.serviceType.replace('_', ' ');
        }
      } else if (order.type === 'cmt_request') {
        const cmtItem = (db.cmtRequests || []).find((c: any) => c.id === order.targetId);
        if (cmtItem) {
          order.customerName = cmtItem.name;
          order.productName = `CMT Page Bracket ${cmtItem.budgetType}`;
        }
      }
    }
    return order;
  });
  res.json(orders);
});

// Create a real Razorpay order (called before opening Razorpay Checkout)
app.post('/api/orders/create-razorpay-order', async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ error: 'Razorpay is not configured on this server. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' });
  }
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }
  const db = readDb();
  const order = (db.orders || []).find((o: any) => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  try {
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(order.amount * 100), // paise
      currency: 'INR',
      receipt: order.id,
      notes: { targetId: order.targetId, type: order.type }
    });
    order.razorpayOrderId = rzpOrder.id;
    writeDb(db);
    res.json({ success: true, razorpayOrderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency, keyId: RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('Razorpay order creation failed:', err);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

// Verify a completed Razorpay payment using its signature (server-side, cannot be spoofed)
app.post('/api/orders/verify-payment', (req, res) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return res.status(400).json({ error: 'orderId, razorpayOrderId, razorpayPaymentId and razorpaySignature are all required' });
  }
  if (!RAZORPAY_KEY_SECRET) {
    return res.status(503).json({ error: 'Razorpay is not configured on this server.' });
  }
  const db = readDb();
  const orderIndex = (db.orders || []).findIndex((o: any) => o.id === orderId);
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  const order = db.orders[orderIndex];
  if (order.razorpayOrderId !== razorpayOrderId) {
    return res.status(400).json({ error: 'Razorpay order ID does not match this order' });
  }
  // Verify HMAC signature exactly as required by Razorpay docs — this is the
  // only trustworthy proof that the payment actually happened.
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');
  if (expectedSignature !== razorpaySignature) {
    addLog(`Payment signature verification FAILED for order ${order.id}`);
    return res.status(400).json({ error: 'Payment verification failed: invalid signature' });
  }
  order.paymentStatus = 'paid';
  order.transactionId = razorpayPaymentId;
  // Update the original request status
  if (order.type === 'help_request') {
    const reqIndex = (db.helpRequests || []).findIndex((r: any) => r.id === order.targetId);
    if (reqIndex !== -1) {
      db.helpRequests[reqIndex].paymentStatus = 'paid';
             
      // Update statistics
      db.statistics = db.statistics || DEFAULT_STATISTICS;
      db.statistics.totalHelpRequests = (db.statistics.totalHelpRequests || 0) + 1;
      db.statistics.problemsSolved = (db.statistics.problemsSolved || 0) + 1;
    }
  } else if (order.type === 'cmt_request') {
    const cmtIndex = (db.cmtRequests || []).findIndex((r: any) => r.id === order.targetId);
    if (cmtIndex !== -1) {
      db.cmtRequests[cmtIndex].paymentStatus = 'paid';
    }
  }
  writeDb(db);
  addNotification(
    'payment_received',
    'Payment Received (Razorpay)',
    `Received online payment of ₹${order.amount} for ${order.type} (${order.targetId}).`
  );
  addLog(`Payment verified for order ${order.id} via Razorpay (Amount: ₹${order.amount})`);
  res.json({ success: true, order });
});

// Customer submits manual payment proof screenshot
app.post('/api/orders/:id/submit-proof', (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const orderIndex = (db.orders || []).findIndex((o: any) => o.id === id);
  if (orderIndex === -1) return res.status(404).json({ error: 'Order not found' });
  const order = db.orders[orderIndex];
  const { screenshotBase64, screenshotName, transactionId } = req.body;
  if (screenshotBase64) {
    // Validate Base64 mime/extension
    let ext = '.png';
    let pureBase64 = screenshotBase64;
    if (screenshotBase64.includes(';base64,')) {
      const parts = screenshotBase64.split(';base64,');
      pureBase64 = parts[1];
      const mime = parts[0].replace('data:', '');
      const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!allowedMimes.includes(mime)) {
        return res.status(400).json({ error: 'Invalid image format. Only PNG, JPG, JPEG, and WEBP are supported.' });
      }
      if (mime.includes('png')) ext = '.png';
      else if (mime.includes('webp')) ext = '.webp';
      else ext = '.jpg';
    } else if (screenshotName) {
      ext = path.extname(screenshotName).toLowerCase() || '.png';
    }
         
    const buffer = Buffer.from(pureBase64, 'base64');
    if (buffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size is too large. Max size is 5 MB.' });
    }
         
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
         
    const safeName = `proof-${id}-${Date.now()}${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeName);
    fs.writeFileSync(filePath, buffer);
         
    order.manualPaymentScreenshotUrl = `/uploads/${safeName}`;
  }
  order.paymentMethod = 'manual_upi';
  order.paymentStatus = 'pending_manual_verification';
  if (transactionId) {
    order.transactionId = transactionId;
  }
  // Sync request states as well
  if (order.type === 'help_request') {
    const reqIndex = (db.helpRequests || []).findIndex((r: any) => r.id === order.targetId);
    if (reqIndex !== -1) {
      db.helpRequests[reqIndex].paymentMethod = 'manual_upi';
      db.helpRequests[reqIndex].paymentStatus = 'pending_manual_verification';
      db.helpRequests[reqIndex].manualPaymentScreenshotUrl = order.manualPaymentScreenshotUrl;
      db.helpRequests[reqIndex].transactionId = transactionId || '';
    }
  } else if (order.type === 'cmt_request') {
    const cmtIndex = (db.cmtRequests || []).findIndex((r: any) => r.id === order.targetId);
    if (cmtIndex !== -1) {
      db.cmtRequests[cmtIndex].paymentMethod = 'manual_upi';
      db.cmtRequests[cmtIndex].paymentStatus = 'pending_manual_verification';
      db.cmtRequests[cmtIndex].manualPaymentScreenshotUrl = order.manualPaymentScreenshotUrl;
      db.cmtRequests[cmtIndex].transactionId = transactionId || '';
    }
  }
  // Fetch details to fill in order fields for administrative viewing
  if (order.type === 'help_request') {
    const request = (db.helpRequests || []).find((r: any) => r.id === order.targetId);
    if (request) {
      order.customerName = request.name;
      order.productName = request.serviceType.replace('_', ' ');
    }
  } else if (order.type === 'cmt_request') {
    const cmt = (db.cmtRequests || []).find((c: any) => c.id === order.targetId);
    if (cmt) {
      order.customerName = cmt.name;
      order.productName = `CMT Page Bracket ${cmt.budgetType}`;
    }
  }
  writeDb(db);
  addNotification(
    'payment_pending',
    'Receipt screenshot uploaded',
    `A customer has uploaded manual UPI payment proof of ₹${order.amount} for Order ${id}.`
  );
  addLog(`Payment receipt proof submitted for order ${id} (Amount: ₹${order.amount})`);
  res.json({ success: true, order });
});

// Admin manually approves manual UPI QR payment
app.post('/api/orders/:id/approve-manual', authenticateAdmin, (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const orderIndex = (db.orders || []).findIndex((o: any) => o.id === id);
  if (orderIndex === -1) return res.status(404).json({ error: 'Order not found' });
  const order = db.orders[orderIndex];
  order.paymentStatus = 'paid';
  order.transactionId = `manual_appr_${Date.now()}`;
  if (order.type === 'help_request') {
    const reqIndex = (db.helpRequests || []).findIndex((r: any) => r.id === order.targetId);
    if (reqIndex !== -1) {
      db.helpRequests[reqIndex].paymentStatus = 'paid';
             
      // Update stats
      db.statistics = db.statistics || DEFAULT_STATISTICS;
      db.statistics.totalHelpRequests = (db.statistics.totalHelpRequests || 0) + 1;
      db.statistics.problemsSolved = (db.statistics.problemsSolved || 0) + 1;
    }
  } else if (order.type === 'cmt_request') {
    const cmtIndex = (db.cmtRequests || []).findIndex((r: any) => r.id === order.targetId);
    if (cmtIndex !== -1) {
      db.cmtRequests[cmtIndex].paymentStatus = 'paid';
    }
  }
  writeDb(db);
  addNotification(
    'payment_received',
    'Manual Payment Verified',
    `Admin manually verified and approved manual payment of ₹${order.amount} for order ${id}`
  );
  addLog(`Manual payment verified for order ${id} (Amount: ₹${order.amount})`);
  res.json({ success: true, order });
});

// 14. NOTIFICATIONS
app.get('/api/notifications', authenticateAdmin, (req, res) => {
  const db = readDb();
  res.json(db.notifications || []);
});

app.put('/api/notifications/read-all', authenticateAdmin, (req, res) => {
  const db = readDb();
  (db.notifications || []).forEach((n: any) => n.read = true);
  writeDb(db);
  res.json({ success: true });
});

// 15. ACTIVITY LOGS
app.get('/api/activity-logs', authenticateAdmin, (req, res) => {
  const db = readDb();
  res.json(db.activityLogs || []);
});

// 16. MEDIA LIBRARY (IMAGE UPLOADS AS BASE64)
app.get('/api/media', authenticateAdmin, (req, res) => {
  try {
    const files = fs.readdirSync(UPLOADS_DIR);
    const mediaList = files.map(file => ({
      name: file,
      url: `/uploads/${file}`,
      size: fs.statSync(path.join(UPLOADS_DIR, file)).size,
      date: fs.statSync(path.join(UPLOADS_DIR, file)).mtime.toISOString()
    }));
    res.json(mediaList);
  } catch (err) {
    res.json([]);
  }
});

app.post('/api/media', authenticateAdmin, (req, res) => {
  const { name, base64Data } = req.body;
  if (!name || !base64Data) {
    return res.status(400).json({ error: 'Name and Base64 data are required' });
  }
  try {
    const buffer = Buffer.from(base64Data, 'base64');
    const safeName = `${Date.now()}-${name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(UPLOADS_DIR, safeName);
    fs.writeFileSync(filePath, buffer);
         
    addLog(`Uploaded media file: "${safeName}"`);
    res.json({ success: true, url: `/uploads/${safeName}`, name: safeName });
  } catch (err) {
    res.status(500).json({ error: 'Failed to write media file' });
  }
});

app.delete('/api/media/:name', authenticateAdmin, (req, res) => {
  const name = req.params.name;
  const filePath = path.join(UPLOADS_DIR, name);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      addLog(`Deleted media file: "${name}"`);
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete file' });
    }
  }
  res.status(404).json({ error: 'File not found' });
});

// VITE MIDDLEWARE CONFIGURATION FOR DEVELOPMENT OR STATIC FILES FOR PRODUCTION
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve index.html as fallback for SPAs (React Router)
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Montu Baruah website backend running on http://localhost:${PORT}`);
  });
}

startServer();
