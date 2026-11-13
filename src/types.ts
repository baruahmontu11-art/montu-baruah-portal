export interface Admin {
  username: string;
  passwordHash: string;
}

export interface WebsiteSettings {
  name: string;
  tagline: string;
  logoUrl: string;
  heroImageUrl?: string;
  toolkitImageUrl?: string;
  mobileLogoUrl?: string;
  faviconUrl?: string;
  email: string;
  whatsappNumber: string;
  facebookPrimaryUrl: string;
  facebookSecondaryUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  telegramUrl: string;
  upiId: string;
  upiQrUrl: string;
  paytmMerchantId: string;
  razorpayKeyId: string;
  footerText: string;
  contactInfo: string;
  manualPaymentEnabled?: boolean;
  manualPaymentName?: string;
  manualPaymentInstructions?: string;
  manualPaymentPhone?: string;
  payoutServices?: PayoutService[];
}

export interface PayoutService {
  id: string;
  key: string;
  name: string;
  description?: string;
  badge?: string;
  price: number;
  originalPrice?: number;
  order: number;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  coverImageUrl: string;
  excerpt: string;
  content: string;
  publishDate: string;
  readTime: string;
  author: string;
  featured: boolean;
}

export interface ArticleReview {
  id: string;
  articleId: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  fileSize: string;
  fileUrl: string;
  thumbnailUrl: string;
  isComingSoon: boolean;
}

export interface AppPromo {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  posterUrl: string;
  features: string[];
  playStoreUrl: string;
  appStoreUrl: string;
  downloadUrl: string;
  isReleased: boolean;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  workDescription: string;
  imageUrl: string;
  downloadUrl: string;
  fileSize: string;
  isComingSoon: boolean;
}

export interface HelpRequest {
  id: string;
  name: string;
  address: string;
  whatsappNumber: string;
  serviceType: string;
  servicePrice: number;
  problemDescription: string;
  paymentMethod: 'razorpay' | 'manual_upi' | 'none';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'pending_manual_verification';
  date: string;
}

export interface CmtRequest {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  budgetType: string;
  budgetAmount: number;
  paymentMethod: 'razorpay' | 'manual_upi';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'pending_manual_verification';
  date: string;
}

export interface WebsiteProjectRequest {
  id: string;
  name: string;
  whatsappNumber: string;
  email: string;
  projectType: string;
  budget: string;
  projectDescription: string;
  date: string;
}

export interface Order {
  id: string;
  type: 'help_request' | 'cmt_request';
  targetId: string;
  amount: number;
  paymentMethod: 'razorpay' | 'manual_upi';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'pending_manual_verification';
  transactionId?: string;
  razorpayOrderId?: string;
  date: string;
  manualPaymentScreenshotUrl?: string;
  customerName?: string;
  productName?: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
  featured: boolean;
}

export interface Statistics {
  totalViews: number;
  totalHelpRequests: number;
  problemsSolved: number;
  articlesPublished: number;
  freeResources: number;
  reviewsCount: number;
}

export interface Notification {
  id: string;
  type: 'help_request' | 'cmt_request' | 'website_project' | 'review' | 'payment_received' | 'payment_pending';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface AdminActivityLog {
  id: string;
  action: string;
  timestamp: string;
}
