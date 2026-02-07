# Admin Dashboard Frontend Documentation

> **For Developer Integration with Custom Backend**

---

## Overview

This document describes all frontend files for the Admin Dashboard photo management system. The frontend is built with React, TypeScript, and Tailwind CSS, designed to connect to a custom Node.js/Express backend via REST API.

---

## File Structure

### Core API Layer

| File | Purpose |
|------|---------|
| `src/lib/admin-api.ts` | API client, endpoints configuration, TypeScript types. **This is where you configure the backend URL.** |
| `src/contexts/AdminAuthContext.tsx` | Authentication state management (login, logout, session checking) |

### Admin Pages

| File | Purpose |
|------|---------|
| `src/pages/admin/AdminLogin.tsx` | Login form with validation |
| `src/pages/admin/AdminLayout.tsx` | Protected layout wrapper (redirects to login if not authenticated) |
| `src/pages/admin/AdminDashboard.tsx` | Dashboard overview with statistics |
| `src/pages/admin/AdminPhotos.tsx` | Photo list/grid view with filtering |
| `src/pages/admin/AdminPhotoUpload.tsx` | Photo upload form with category selection |
| `src/pages/admin/AdminPhotoEdit.tsx` | Edit individual photo metadata |

### Admin Components

| File | Purpose |
|------|---------|
| `src/components/admin/AdminSidebar.tsx` | Navigation sidebar with menu items |
| `src/components/admin/AdminHeader.tsx` | Top header with user dropdown menu |

### Routing

| File | Purpose |
|------|---------|
| `src/components/layout/AnimatedRoutes.tsx` | Route definitions (admin routes on lines 47-68) |

---

## Connecting Your Backend

### Step 1: Configure API Base URL

Edit `src/lib/admin-api.ts` and update the base URL:

```typescript
// In src/lib/api.ts - update apiConfig
export const apiConfig = {
  baseUrl: "https://your-backend-domain.com/api", // Change this
};
```

### Step 2: Implement Required Endpoints

Your backend must implement these endpoints:

#### Authentication Endpoints

| Method | Endpoint | Request Body | Response |
|--------|----------|--------------|----------|
| `POST` | `/admin/auth/login` | `{ username, password }` | `{ user: AdminUser, message: string }` |
| `POST` | `/admin/auth/logout` | - | `{ message: string }` |
| `GET` | `/admin/auth/session` | - | `{ user: AdminUser \| null, isAuthenticated: boolean }` |

#### Photo Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/photos` | List all photos (optional `?category=` filter) |
| `GET` | `/admin/photos/:id` | Get single photo by ID |
| `POST` | `/admin/photos/upload` | Upload photo (multipart/form-data) |
| `PATCH` | `/admin/photos/:id` | Update photo metadata |
| `DELETE` | `/admin/photos/:id` | Delete photo |
| `POST` | `/admin/photos/reorder` | Reorder photos `{ photoIds: string[] }` |

---

## TypeScript Types

These types are defined in `src/lib/admin-api.ts`:

```typescript
// Photo Categories
type PhotoCategory = "gallery" | "menu" | "venue";
type PhotoSubcategory = "food" | "ambiance" | "events" | "interior" | "terrace" | "private-dining";

// Admin User
interface AdminUser {
  id: string;
  username: string;
  role: "admin" | "editor";
}

// Photo Object
interface AdminPhoto {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl: string;
  category: PhotoCategory;
  subcategory: PhotoSubcategory;
  title: string;
  titleNl?: string;          // Dutch translation
  alt: string;
  altNl?: string;            // Dutch translation
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Upload Request
interface PhotoUploadData {
  file: File;
  category: PhotoCategory;
  subcategory: PhotoSubcategory;
  title: string;
  titleNl?: string;
  alt: string;
  altNl?: string;
}

// Update Request
interface PhotoUpdateData {
  category?: PhotoCategory;
  subcategory?: PhotoSubcategory;
  title?: string;
  titleNl?: string;
  alt?: string;
  altNl?: string;
  isActive?: boolean;
}
```

---

## Database Schema (PostgreSQL)

```sql
-- Admin Users Table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Photos Table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  category VARCHAR(20) NOT NULL CHECK (category IN ('gallery', 'menu', 'venue')),
  subcategory VARCHAR(30) CHECK (subcategory IN ('food', 'ambiance', 'events', 'interior', 'terrace', 'private-dining')),
  title VARCHAR(200) NOT NULL,
  title_nl VARCHAR(200),
  alt VARCHAR(300) NOT NULL,
  alt_nl VARCHAR(300),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_photos_category ON photos(category);
CREATE INDEX idx_photos_sort_order ON photos(sort_order);
CREATE INDEX idx_photos_is_active ON photos(is_active);
```

---

## Session Authentication

The frontend uses **session-based authentication** with cookies:

- All API requests include `credentials: "include"` for cookie handling
- Backend should use `express-session` with secure cookie settings
- On 401 responses, the frontend redirects to `/admin/login`

### Required Backend Session Setup

```javascript
// Example Express session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));
```

---

## File Upload

Photo uploads use `multipart/form-data` with these fields:

| Field | Type | Required |
|-------|------|----------|
| `file` | File | Yes |
| `category` | string | Yes |
| `subcategory` | string | Yes |
| `title` | string | Yes |
| `alt` | string | Yes |
| `titleNl` | string | No |
| `altNl` | string | No |

Use **Multer** or similar middleware for handling file uploads on the backend.

---

## Admin Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/admin/login` | AdminLogin | Public |
| `/admin` | AdminDashboard | Protected |
| `/admin/photos` | AdminPhotos | Protected |
| `/admin/photos/upload` | AdminPhotoUpload | Protected |
| `/admin/photos/:id/edit` | AdminPhotoEdit | Protected |

---

## Environment Variables (Backend)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/lightsofindia

# Session
SESSION_SECRET=your-secure-random-string

# File Storage
UPLOAD_DIR=/var/www/uploads
MAX_FILE_SIZE=10485760

# Server
PORT=3001
NODE_ENV=production
```

---

## Contact

For questions about the frontend implementation, refer to this documentation or the source code in the files listed above.
