// API Configuration for backend connection
// This allows connecting to different environments (local, staging, production)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    // Menu endpoints
    menuDineIn: `${API_BASE_URL}/menu/dine-in`,
    menuTakeaway: `${API_BASE_URL}/menu/takeaway`,
    menuSpecial: `${API_BASE_URL}/menu/special`,
    
    // Reservation endpoints
    reservations: `${API_BASE_URL}/reservations`,
    availableSlots: `${API_BASE_URL}/reservations/available-slots`,
    
    // Contact & Newsletter
    contact: `${API_BASE_URL}/contact`,
    newsletter: `${API_BASE_URL}/newsletter`,
    
    // Gallery
    gallery: `${API_BASE_URL}/gallery`,
  },
};

// Generic fetch wrapper with error handling
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Typed API methods
export const api = {
  // Menu
  getMenuDineIn: () => apiFetch(apiConfig.endpoints.menuDineIn),
  getMenuTakeaway: () => apiFetch(apiConfig.endpoints.menuTakeaway),
  getSpecialMenus: () => apiFetch(apiConfig.endpoints.menuSpecial),

  // Reservations
  createReservation: (data: ReservationData) =>
    apiFetch(apiConfig.endpoints.reservations, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAvailableSlots: (date: string) =>
    apiFetch(`${apiConfig.endpoints.availableSlots}?date=${date}`),

  // Contact
  sendContactMessage: (data: ContactData) =>
    apiFetch(apiConfig.endpoints.contact, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Newsletter
  subscribeNewsletter: (email: string) =>
    apiFetch(apiConfig.endpoints.newsletter, {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  // Gallery
  getGalleryImages: () => apiFetch(apiConfig.endpoints.gallery),
};

// Types
export interface ReservationData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
}

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isSpicy?: boolean;
  allergens?: string[];
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  category: "food" | "ambiance" | "events";
}
