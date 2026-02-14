// User authentication and order API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://lightofrestaurant.nl/api";
const API_V1_URL = `${API_BASE_URL}/v1`;

// Types
export interface User {
  _id: string;
  email: string;
  mobile?: string;
  fullName?: string;
  address?: string;
  postalCode?: string;
  verified: boolean;
  status: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
}

export interface RegisterData {
  email: string;
  password: string;
  mobile: string;
  fullName?: string;
  address?: string;
  postalCode?: string;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
}

export interface CreateOrderData {
  items: OrderItem[];
  pickupTime?: string;
  notes?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: Array<{
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  pickupTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

// Constants
const AUTH_TOKEN_KEY = "light-of-india-auth-token";
const AUTH_REFRESH_TOKEN_KEY = "light-of-india-refresh-token";

// Token management
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
};

// Fetch with auth
async function authFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getAuthToken();
  
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
    credentials: "include", // For cookies
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// User API
export const userApi = {
  // Register new user
  register: async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
    return authFetch(`${API_V1_URL}/users/register`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Verify account
  verifyAccount: async (email: string, otp: number): Promise<{ success: boolean; message: string }> => {
    return authFetch(`${API_V1_URL}/users/verify`, {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },

  // Login
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await authFetch<LoginResponse>(`${API_V1_URL}/users/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    
    if (response.accessToken) {
      setAuthToken(response.accessToken);
    }
    
    return response;
  },

  // Get user profile
  getProfile: async (): Promise<{ success: boolean; profile: User }> => {
    return authFetch(`${API_V1_URL}/users/profile`);
  },

  // Password reset request
  requestPasswordReset: async (email: string): Promise<{ success: boolean; message: string }> => {
    return authFetch(`${API_V1_URL}/users/password-reset-request`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // Reset password
  resetPassword: async (
    email: string,
    otp: number,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    return authFetch(`${API_V1_URL}/users/reset-password`, {
      method: "POST",
      body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
    });
  },

  // Logout
  logout: (): void => {
    clearAuthToken();
  },
};

// Order API
export const orderApi = {
  // Create order
  createOrder: async (data: CreateOrderData): Promise<{ success: boolean; message: string; order: Order }> => {
    return authFetch(`${API_V1_URL}/orders`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Get user's orders
  getOrders: async (params?: { page?: number; limit?: number; status?: string }): Promise<OrdersResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.status) searchParams.set("status", params.status);
    
    const queryString = searchParams.toString();
    const url = `${API_V1_URL}/orders${queryString ? `?${queryString}` : ""}`;
    
    return authFetch(url);
  },

  // Get single order
  getOrder: async (orderId: string): Promise<{ success: boolean; message: string; order: Order }> => {
    return authFetch(`${API_V1_URL}/orders/${orderId}`);
  },

  // Cancel order
  cancelOrder: async (orderId: string): Promise<{ success: boolean; message: string; order: Order }> => {
    return authFetch(`${API_V1_URL}/orders/${orderId}`, {
      method: "DELETE",
    });
  },
};

// Payment API
export const paymentApi = {
  // Initiate payment session
  initiatePayment: async (data: CreateOrderData): Promise<{
    success: boolean;
    message: string;
    paymentUrl: string;
    paymentId: string;
  }> => {
    return authFetch(`${API_V1_URL}/payments/initiate`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Get payment status
  getPaymentStatus: async (paymentId: string): Promise<{
    success: boolean;
    status: string;
    isPaid: boolean;
    order?: {
      orderNumber: string;
      orderId: string;
    };
  }> => {
    // No auth needed for status check
    const response = await fetch(`${API_V1_URL}/payments/${paymentId}/status`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    return response.json();
  },
};
