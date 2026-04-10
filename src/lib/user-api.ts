// User authentication and order API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://lightofrestaurant.nl/api";
const API_V1_URL = `${API_BASE_URL}/v1`;

// Types
export interface User {
  _id: string;
  email: string;
  mobile?: string;
  fullName?: string;
  postalCode?: string;
  streetName?: string;
  houseNumber?: string;
  city?: string;
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
  postalCode?: string;
  streetName?: string;
  houseNumber?: string;
  city?: string;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
}

export interface DeliveryAddress {
  postalCode: string;
  streetName: string;
  houseNumber: string;
  city: string;
}

export interface CreateOrderData {
  items?: OrderItem[];
  cateringItems?: Array<{
    packId: string;
    peopleCount: number;
    quantity: number;
  }>;
  offerItems?: Array<{
    offerId: string;
    quantity: number;
  }>;
  isPickup?: boolean;
  pickupTime?: string;
  notes?: string;
  deliveryAddress?: DeliveryAddress;
  contactMobile: string;
  email: string;
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
  cateringItems?: Array<{
    packId: string;
    name: string;
    pricePerPerson: number;
    peopleCount: number;
    quantity: number;
  }>;
  offerItems?: Array<{
    offerId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  pickupTime?: string;
  notes?: string;
  deliveryAddress: DeliveryAddress;
  contactMobile: string;
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
    otp: string,
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
  // Check if postal code is in delivery area (public, no auth required)
  checkDeliveryArea: async (postalCode: string): Promise<{
    success: boolean;
    deliverable: boolean;
    postalCode: string;
    zoneName?: string;
    message: string;
  }> => {
    const response = await fetch(`${API_V1_URL}/delivery-zones/check/${encodeURIComponent(postalCode)}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    return response.json();
  },

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

// Catering Types
export interface CateringMenuItem {
  _id: string;
  name: string;
  description: string;
  descriptionNl: string;
  price: number;
}

export interface CateringPack {
  _id: string;
  name: string;
  description: string;
  descriptionNl: string;
  category: 'vegetarian' | 'non-vegetarian' | 'mixed';
  pricePerPerson: number;
  minPeople: number;
  menuItems: CateringMenuItem[];
  image?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface CateringDeliveryAddress {
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  additionalInfo?: string;
}

export interface CateringOrderData {
  cateringPackId: string;
  peopleCount: number;
  deliveryDate: string;
  deliveryTime: string;
  deliveryAddress: CateringDeliveryAddress;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}

// Catering API
export const cateringApi = {
  // Get all active catering packs (public)
  getPacks: async (): Promise<{
    success: boolean;
    packs: CateringPack[];
  }> => {
    const response = await fetch(`${API_V1_URL}/catering/packs`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    return response.json();
  },

  // Get single pack (public)
  getPack: async (packId: string): Promise<{
    success: boolean;
    pack: CateringPack;
  }> => {
    const response = await fetch(`${API_V1_URL}/catering/packs/${packId}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    return response.json();
  },

  // Initiate catering payment (public)
  initiatePayment: async (data: CateringOrderData): Promise<{
    success: boolean;
    message: string;
    paymentUrl: string;
    paymentId: string;
  }> => {
    const response = await fetch(`${API_V1_URL}/payments/catering/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    return response.json();
  },

  // Get catering payment status (public)
  getPaymentStatus: async (paymentId: string): Promise<{
    success: boolean;
    status: string;
    isPaid: boolean;
    order?: {
      orderNumber: string;
      orderId: string;
    };
  }> => {
    const response = await fetch(`${API_V1_URL}/payments/catering/${paymentId}/status`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    return response.json();
  },
};

// Offer Types
export interface Offer {
  _id: string;
  name: string;
  description: string;
  descriptionNl: string;
  price: number;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  validFrom?: string;
  validUntil?: string;
}

// Discount interface
export interface Discount {
  _id: string;
  type: 'delivery' | 'pickup';
  percentage: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Offer API
export const offerApi = {
  // Get all active offers (public)
  getActiveOffers: async (): Promise<{
    success: boolean;
    offers: Offer[];
  }> => {
    const response = await fetch(`${API_V1_URL}/offers/active`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    return response.json();
  },
};

// Discount API
export const discountApi = {
  // Get active discounts (public)
  getActiveDiscounts: async (): Promise<{
    success: boolean;
    discounts: Discount[];
  }> => {
    const response = await fetch(`${API_V1_URL}/discounts/active`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    return response.json();
  },

  // Calculate discount (public)
  calculateDiscount: async (type: 'delivery' | 'pickup', originalAmount: number): Promise<{
    success: boolean;
    data: {
      type: string;
      originalAmount: number;
      discountPercentage: number;
      discountAmount: number;
      finalAmount: number;
    };
  }> => {
    const response = await fetch(`${API_V1_URL}/discounts/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, originalAmount }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    return response.json();
  },
};

// Settings API
export const settingsApi = {
  getOrderSettings: async (): Promise<{
    success: boolean;
    data: {
      deliveryEnabled: boolean;
      pickupEnabled: boolean;
      pickupStartTime: string;
      pickupEndTime: string;
      pickupInterval: number;
    };
  }> => {
    const response = await fetch(`${API_V1_URL}/reservations/settings`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    return response.json();
  },
};
