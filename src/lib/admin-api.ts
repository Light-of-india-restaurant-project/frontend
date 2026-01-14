// Admin API Configuration for backend connection
// Session-based authentication with local filesystem storage

import { apiConfig, apiFetch } from "./api";

const ADMIN_API_BASE = `${apiConfig.baseUrl}/admin`;

// Session-aware fetch with credentials
export async function adminFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(endpoint, {
    credentials: "include", // Include session cookies
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (response.status === 401) {
    // Redirect to login on unauthorized
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// File upload fetch (multipart/form-data)
export async function adminUploadFetch<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const response = await fetch(endpoint, {
    method: "POST",
    credentials: "include",
    body: formData,
    // Don't set Content-Type - browser will set it with boundary
  });

  if (response.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Upload Error: ${response.status}`);
  }

  return response.json();
}

// Admin API endpoints
export const adminEndpoints = {
  // Auth
  login: `${ADMIN_API_BASE}/auth/login`,
  logout: `${ADMIN_API_BASE}/auth/logout`,
  session: `${ADMIN_API_BASE}/auth/session`,

  // Photos
  photos: `${ADMIN_API_BASE}/photos`,
  photoUpload: `${ADMIN_API_BASE}/photos/upload`,
  photoById: (id: string) => `${ADMIN_API_BASE}/photos/${id}`,
  photoReorder: `${ADMIN_API_BASE}/photos/reorder`,

  // Categories
  categories: `${ADMIN_API_BASE}/categories`,
};

// Types
export type PhotoCategory = "gallery" | "menu" | "venue";
export type PhotoSubcategory = "food" | "ambiance" | "events" | "interior" | "terrace" | "private-dining";

export interface AdminPhoto {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl: string;
  category: PhotoCategory;
  subcategory: PhotoSubcategory;
  title: string;
  titleNl?: string;
  alt: string;
  altNl?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PhotoUploadData {
  file: File;
  category: PhotoCategory;
  subcategory: PhotoSubcategory;
  title: string;
  titleNl?: string;
  alt: string;
  altNl?: string;
}

export interface PhotoUpdateData {
  category?: PhotoCategory;
  subcategory?: PhotoSubcategory;
  title?: string;
  titleNl?: string;
  alt?: string;
  altNl?: string;
  isActive?: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  role: "admin" | "editor";
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SessionResponse {
  user: AdminUser | null;
  isAuthenticated: boolean;
}

// Admin API Methods
export const adminApi = {
  // Auth
  login: (credentials: LoginCredentials) =>
    adminFetch<{ user: AdminUser; message: string }>(adminEndpoints.login, {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    adminFetch<{ message: string }>(adminEndpoints.logout, {
      method: "POST",
    }),

  getSession: () => adminFetch<SessionResponse>(adminEndpoints.session),

  // Photos
  getPhotos: (category?: PhotoCategory) => {
    const url = category
      ? `${adminEndpoints.photos}?category=${category}`
      : adminEndpoints.photos;
    return adminFetch<AdminPhoto[]>(url);
  },

  getPhoto: (id: string) => adminFetch<AdminPhoto>(adminEndpoints.photoById(id)),

  uploadPhoto: (data: PhotoUploadData) => {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("category", data.category);
    formData.append("subcategory", data.subcategory);
    formData.append("title", data.title);
    formData.append("alt", data.alt);
    if (data.titleNl) formData.append("titleNl", data.titleNl);
    if (data.altNl) formData.append("altNl", data.altNl);

    return adminUploadFetch<AdminPhoto>(adminEndpoints.photoUpload, formData);
  },

  updatePhoto: (id: string, data: PhotoUpdateData) =>
    adminFetch<AdminPhoto>(adminEndpoints.photoById(id), {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deletePhoto: (id: string) =>
    adminFetch<{ message: string }>(adminEndpoints.photoById(id), {
      method: "DELETE",
    }),

  reorderPhotos: (photoIds: string[]) =>
    adminFetch<{ message: string }>(adminEndpoints.photoReorder, {
      method: "POST",
      body: JSON.stringify({ photoIds }),
    }),
};
