// API Configuration for backend connection
// This allows connecting to different environments (local, staging, production)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://lightofrestaurant.nl/api";
const API_V1_URL = `${API_BASE_URL}/v1`;

export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    // Menu endpoints (v1)
    menuDineIn: `${API_V1_URL}/menu/dine-in`,
    menuTakeaway: `${API_V1_URL}/menu/takeaway`,
    menuSpecial: `${API_V1_URL}/menu/special`,
    
    // Reservation endpoints (v1)
    reservations: `${API_V1_URL}/reservations`,
    availableSlots: `${API_V1_URL}/reservations/available-slots`,
    reservationSettings: `${API_V1_URL}/reservations/settings`,
    
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
  getMenuDineIn: () => apiFetch<MenuResponse>(apiConfig.endpoints.menuDineIn),
  getMenuTakeaway: () => apiFetch<MenuResponse>(apiConfig.endpoints.menuTakeaway),
  getSpecialMenus: () => apiFetch<MenuResponse>(apiConfig.endpoints.menuSpecial),

  // Reservations
  createReservation: (data: ReservationData) =>
    apiFetch<ReservationResponse>(apiConfig.endpoints.reservations, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAvailableSlots: (date: string, guests: number) =>
    apiFetch<AvailableSlotsResponse>(`${apiConfig.endpoints.availableSlots}?date=${date}&guests=${guests}`),
  getReservationSettings: () =>
    apiFetch<ReservationSettingsResponse>(apiConfig.endpoints.reservationSettings),

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

// Types - aligned with backend response structure
export interface ReservationData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
}

export interface ReservationResponse {
  message: string;
  success: boolean;
  data: {
    _id: string;
    confirmationCode: string;
    name: string;
    email: string;
    date: string;
    time: string;
    endTime: string;
    guests: number;
    status: string;
  };
}

export interface AvailableSlot {
  time: string;
  tables: Array<{
    id: string;
    name: string;
    capacity: number;
    isAvailable: boolean;
    floor?: { name: string; locationType: string };
    row?: { name: string };
  }>;
}

export interface AvailableSlotsResponse {
  message: string;
  success: boolean;
  data: AvailableSlot[];
}

export interface OperatingHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface ReservationSettingsResponse {
  message: string;
  success: boolean;
  data: {
    operatingHours: OperatingHours[];
    reservationDuration: number;
    slotInterval: number;
    maxAdvanceDays: number;
    maxGuestsPerReservation: number;
    minGuestsPerReservation: number;
  };
}

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface MenuItem {
  _id: string;
  id?: string; // Alias for _id for compatibility
  name: string;
  nameNl?: string;
  description: string;
  descriptionNl?: string;
  price: number;
  category: string;
  menuType?: 'takeaway' | 'dine-in' | 'both';
  image?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isSpicy?: boolean;
  isDoubleSpicy?: boolean;
  isSignature?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  allergens?: string[];
}

export interface MenuCategory {
  _id: string;
  name: string;
  nameNl?: string;
  icon?: string;
  isActive?: boolean;
  sortOrder?: number;
  items: MenuItem[];
}

export interface MenuResponse {
  categories: MenuCategory[];
  updatedAt?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  category: "food" | "ambiance" | "events";
}
