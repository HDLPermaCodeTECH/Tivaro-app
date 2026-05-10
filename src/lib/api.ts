const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000/api';
export const BASE_URL = API_URL.replace('/api', '');

class ApiService {
  private token: string | null = typeof window !== 'undefined' ? localStorage.getItem('tivaro_token') : null;

  private async request(path: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    if (response.status === 401 || response.status === 403) {
      this.logout();
      if (typeof window !== 'undefined') window.location.href = '/login';
    }

    if (response.status === 204) {
      return null;
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON in api.request:', text);
      throw new Error('Server returned an invalid response (HTML instead of JSON).');
    }
    
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('tivaro_token', token);
    }
  }

  logout() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tivaro_token');
      localStorage.removeItem('tivaro_user');
    }
  }

  getUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('tivaro_user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  // Auth
  auth = {
    register: async (data: any) => {
      const res = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      this.setToken(res.token);
      localStorage.setItem('tivaro_user', JSON.stringify(res.user));
      return res;
    },
    login: async (data: any) => {
      const res = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      this.setToken(res.token);
      localStorage.setItem('tivaro_user', JSON.stringify(res.user));
      return res;
    },
    logout: () => this.logout(),
    upgrade: async () => {
      const res = await this.request('/auth/upgrade', { method: 'PUT' });
      if (res.user) {
        localStorage.setItem('tivaro_user', JSON.stringify(res.user));
      }
      return res;
    },
    createStaff: async (data: any) => {
      return this.request('/auth/staff', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    getStaff: () => this.request('/auth/staff'),
    updateStaff: (id: string, data: any) => this.request(`/auth/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteStaff: (id: string) => this.request(`/auth/staff/${id}`, { method: 'DELETE' }),
    updateProfile: (data: any) => this.request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
    getShiftSummary: () => this.request('/auth/shift-summary'),
    getMe: () => this.request('/auth/me'),
    uploadLogo: (formData: FormData) => fetch(`${API_URL}/auth/logo`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.token}` },
      body: formData
    }).then(async res => {
      if (res.ok) return res.json();
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        throw json;
      } catch (e) {
        throw new Error(text || `Server returned ${res.status}`);
      }
    }),
    getSession: () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('tivaro_token');
        const user = localStorage.getItem('tivaro_user');
        return token && user ? { user: JSON.parse(user) } : null;
      }
      return null;
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Mock Supabase's auth state change
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  };

  // Products
  products = {
    list: () => this.request('/products'),
    create: (data: any) => {
      if (data instanceof FormData) {
        return fetch(`${API_URL}/products`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${this.token}` },
          body: data
        }).then(res => res.ok ? res.json() : res.json().then(e => { throw e }));
      }
      return this.request('/products', { method: 'POST', body: JSON.stringify(data) });
    },
    update: (id: string, data: any) => {
      if (data instanceof FormData) {
        return fetch(`${API_URL}/products/${id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${this.token}` },
          body: data
        }).then(res => res.ok ? res.json() : res.json().then(e => { throw e }));
      }
      return this.request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    },
    delete: (id: string) => this.request(`/products/${id}`, { method: 'DELETE' }),
  };

  // Sales
  sales = {
    list: () => this.request('/sales'),
    create: (data: any) => this.request('/sales', { method: 'POST', body: JSON.stringify(data) }),
  };

  // Receipts
  receipts = {
    get: (id: string) => this.request(`/receipts/${id}`),
  };

  // Dashboard
  dashboard = {
    getStats: () => this.request('/dashboard'),
  };

  // Expenses
  expenses = {
    list: () => this.request('/expenses'),
    create: (data: any) => this.request('/expenses', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => this.request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => this.request(`/expenses/${id}`, { method: 'DELETE' }),
  };

  // Customers (CRM)
  customers = {
    list: () => this.request('/customers'),
    create: (data: any) => this.request('/customers', { method: 'POST', body: JSON.stringify(data) }),
    get: (id: string) => this.request(`/customers/${id}`),
  };

  // Analytics
  analytics = {
    getOverview: () => this.request('/analytics'),
    getPLReport: (start?: string, end?: string) => 
      this.request(`/analytics/pl?start_date=${start || ''}&end_date=${end || ''}&t=${Date.now()}`),
  };

  // Debts (Utang)
  debts = {
    getAll: () => this.request('/debts'),
    create: (data: any) => this.request('/debts', { method: 'POST', body: JSON.stringify(data) }),
    addPayment: (id: string, data: any) => 
      this.request(`/debts/${id}/payments`, { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => this.request(`/debts/${id}`, { method: 'DELETE' }),
  };

  // Reports
  reports = {
    createShiftReport: () => this.request('/reports/shift', { method: 'POST' }),
    getShiftStats: () => this.request('/reports/shift-stats'),
    list: () => this.request('/reports'),
  };

  // Suppliers
  suppliers = {
    list: () => this.request('/suppliers'),
    create: (data: any) => this.request('/suppliers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => this.request(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => this.request(`/suppliers/${id}`, { method: 'DELETE' }),
  };

  // Payments
  payments = {
    createSession: () => this.request('/payments/create-session', { method: 'POST' }),
  };
}

export const api = new ApiService();
