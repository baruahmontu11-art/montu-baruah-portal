import { WebsiteSettings, Statistics, Article, Course, Tool, AppPromo, HelpRequest, CmtRequest, WebsiteProjectRequest, Order, Faq, Review, Notification, AdminActivityLog } from '../types';

const API_BASE = '/api';

function getHeaders() {
  const token = localStorage.getItem('mb_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function fetchSettings(): Promise<WebsiteSettings> {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function updateSettings(settings: Partial<WebsiteSettings>): Promise<boolean> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(settings)
  });
  return res.ok;
}

export async function fetchStatistics(noIncrement = false): Promise<Statistics> {
  const res = await fetch(`${API_BASE}/statistics?noIncrement=${noIncrement}`);
  if (!res.ok) throw new Error('Failed to fetch statistics');
  return res.json();
}

export async function updateStatistics(stats: Partial<Statistics>): Promise<boolean> {
  const res = await fetch(`${API_BASE}/statistics`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(stats)
  });
  return res.ok;
}

export async function fetchArticles(): Promise<Article[]> {
  const res = await fetch(`${API_BASE}/articles`);
  if (!res.ok) throw new Error('Failed to fetch articles');
  return res.json();
}

export async function createArticle(article: Omit<Article, 'id' | 'publishDate'>): Promise<boolean> {
  const res = await fetch(`${API_BASE}/articles`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(article)
  });
  return res.ok;
}

export async function updateArticle(id: string, article: Partial<Article>): Promise<boolean> {
  const res = await fetch(`${API_BASE}/articles/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(article)
  });
  return res.ok;
}

export async function deleteArticle(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/articles/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return res.ok;
}

export async function submitArticleReview(articleId: string, review: { name: string; rating: number; comment: string }): Promise<boolean> {
  const res = await fetch(`${API_BASE}/articles/${articleId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  });
  return res.ok;
}

export async function fetchArticleReviews(articleId: string, approvedOnly = true): Promise<any[]> {
  const res = await fetch(`${API_BASE}/articles/${articleId}/reviews?approved=${approvedOnly}`);
  if (!res.ok) throw new Error('Failed to fetch article reviews');
  return res.json();
}

export async function fetchPlatformReviews(approvedOnly = true): Promise<Review[]> {
  const res = await fetch(`${API_BASE}/reviews?approved=${approvedOnly}`);
  if (!res.ok) throw new Error('Failed to fetch platform reviews');
  return res.json();
}

export async function submitPlatformReview(review: { name: string; rating: number; comment: string }): Promise<boolean> {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  });
  return res.ok;
}

export async function fetchAdminReviews(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/admin/reviews`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch admin reviews');
  return res.json();
}

export async function approveReview(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/reviews/${id}/approve`, {
    method: 'PUT',
    headers: getHeaders()
  });
  return res.ok;
}

export async function toggleFeatureReview(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/reviews/${id}/feature`, {
    method: 'PUT',
    headers: getHeaders()
  });
  return res.ok;
}

export async function deleteReview(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/reviews/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return res.ok;
}

export async function fetchCourses(): Promise<Course[]> {
  const res = await fetch(`${API_BASE}/courses`);
  if (!res.ok) throw new Error('Failed to fetch courses');
  return res.json();
}

export async function createCourse(course: Omit<Course, 'id'>): Promise<boolean> {
  const res = await fetch(`${API_BASE}/courses`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(course)
  });
  return res.ok;
}

export async function updateCourse(id: string, course: Partial<Course>): Promise<boolean> {
  const res = await fetch(`${API_BASE}/courses/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(course)
  });
  return res.ok;
}

export async function deleteCourse(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/courses/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return res.ok;
}

export async function fetchTools(): Promise<Tool[]> {
  const res = await fetch(`${API_BASE}/tools`);
  if (!res.ok) throw new Error('Failed to fetch tools');
  return res.json();
}

export async function createTool(tool: Omit<Tool, 'id'>): Promise<boolean> {
  const res = await fetch(`${API_BASE}/tools`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(tool)
  });
  return res.ok;
}

export async function updateTool(id: string, tool: Partial<Tool>): Promise<boolean> {
  const res = await fetch(`${API_BASE}/tools/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(tool)
  });
  return res.ok;
}

export async function deleteTool(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/tools/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return res.ok;
}

export async function fetchApps(): Promise<AppPromo[]> {
  const res = await fetch(`${API_BASE}/apps`);
  if (!res.ok) throw new Error('Failed to fetch apps');
  return res.json();
}

export async function createApp(appData: Omit<AppPromo, 'id'>): Promise<boolean> {
  const res = await fetch(`${API_BASE}/apps`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(appData)
  });
  return res.ok;
}

export async function updateApp(id: string, appData: Partial<AppPromo>): Promise<boolean> {
  const res = await fetch(`${API_BASE}/apps/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(appData)
  });
  return res.ok;
}

export async function deleteApp(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/apps/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return res.ok;
}

export async function fetchHelpRequests(): Promise<HelpRequest[]> {
  const res = await fetch(`${API_BASE}/help-requests`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch help requests');
  return res.json();
}

export async function createHelpRequest(request: Omit<HelpRequest, 'id' | 'servicePrice' | 'paymentStatus' | 'date'>): Promise<any> {
  const res = await fetch(`${API_BASE}/help-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  if (!res.ok) throw new Error('Failed to create help request');
  return res.json();
}

export async function fetchCmtRequests(): Promise<CmtRequest[]> {
  const res = await fetch(`${API_BASE}/cmt-requests`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch CMT requests');
  return res.json();
}

export async function createCmtRequest(request: Omit<CmtRequest, 'id' | 'paymentStatus' | 'date'>): Promise<any> {
  const res = await fetch(`${API_BASE}/cmt-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  if (!res.ok) throw new Error('Failed to create CMT request');
  return res.json();
}

export async function fetchWebsiteProjects(): Promise<WebsiteProjectRequest[]> {
  const res = await fetch(`${API_BASE}/website-projects`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch website project requests');
  return res.json();
}

export async function createWebsiteProject(request: Omit<WebsiteProjectRequest, 'id' | 'date'>): Promise<boolean> {
  const res = await fetch(`${API_BASE}/website-projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  return res.ok;
}

export async function fetchFaqs(): Promise<Faq[]> {
  const res = await fetch(`${API_BASE}/faqs`);
  if (!res.ok) throw new Error('Failed to fetch FAQs');
  return res.json();
}

export async function createFaq(faq: Omit<Faq, 'id' | 'order'>): Promise<boolean> {
  const res = await fetch(`${API_BASE}/faqs`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(faq)
  });
  return res.ok;
}

export async function updateFaq(id: string, faq: Partial<Faq>): Promise<boolean> {
  const res = await fetch(`${API_BASE}/faqs/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(faq)
  });
  return res.ok;
}

export async function deleteFaq(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/faqs/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return res.ok;
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function createRazorpayOrder(orderId: string): Promise<{ success: boolean; razorpayOrderId: string; amount: number; currency: string; keyId: string }> {
  const res = await fetch(`${API_BASE}/orders/create-razorpay-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to start Razorpay checkout');
  }
  return res.json();
}

export async function verifyRazorpayPayment(orderId: string, razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<any> {
  const res = await fetch(`${API_BASE}/orders/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Payment verification failed');
  }
  return res.json();
}

export async function approveManualPayment(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/orders/${id}/approve-manual`, {
    method: 'POST',
    headers: getHeaders()
  });
  return res.ok;
}

export async function fetchNotifications(): Promise<Notification[]> {
  const res = await fetch(`${API_BASE}/notifications`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function readAllNotifications(): Promise<boolean> {
  const res = await fetch(`${API_BASE}/notifications/read-all`, {
    method: 'PUT',
    headers: getHeaders()
  });
  return res.ok;
}

export async function fetchActivityLogs(): Promise<AdminActivityLog[]> {
  const res = await fetch(`${API_BASE}/activity-logs`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch activity logs');
  return res.json();
}

export async function fetchMedia(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/media`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch media');
  return res.json();
}

export async function uploadMedia(name: string, base64Data: string): Promise<any> {
  const res = await fetch(`${API_BASE}/media`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name, base64Data })
  });
  if (!res.ok) throw new Error('Failed to upload media');
  return res.json();
}

export async function deleteMedia(name: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/media/${name}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return res.ok;
}

export async function loginAdmin(username: string, password: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
         
    if (res.status === 401) {
      return { success: false, error: 'Invalid Administrator credentials.' };
    }
         
    if (!res.ok) {
      throw new Error('Connection failed');
    }
         
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Could not reach the authentication server.' };
  }
}

export async function verifyToken(): Promise<boolean> {
  const token = localStorage.getItem('mb_admin_token');
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/verify`, {
      headers: getHeaders()
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

export async function preRegisterApp(appId: string, emailOrPhone: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/apps/${appId}/pre-register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrPhone })
  });
  return res.ok;
}

export async function uploadBrandingAsset(name: string, base64Data: string, type: 'logo' | 'mobileLogo' | 'favicon'): Promise<any> {
  const res = await fetch(`${API_BASE}/settings/branding/upload`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name, base64Data, type })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Branding upload failed');
  }
  return res.json();
}

export async function changeAdminPassword(oldPassword: string, newPassword: string): Promise<any> {
  const res = await fetch(`${API_BASE}/auth/change-password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ oldPassword, newPassword })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Password update failed');
  }
  return res.json();
}

export async function submitManualPaymentProof(orderId: string, payload: { screenshotBase64?: string; screenshotName?: string; transactionId?: string }): Promise<any> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/submit-proof`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to submit payment proof');
  }
  return res.json();
}
