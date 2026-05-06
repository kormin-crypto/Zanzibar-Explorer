const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? "Request failed");
  }
  return res.json() as Promise<T>;
}

export const adminApi = {
  login: (password: string) => request<{ ok: boolean }>("POST", "/admin/login", { password }),
  logout: () => request<{ ok: boolean }>("POST", "/admin/logout"),

  // Inquiries
  getInquiries: () => request<Inquiry[]>("GET", "/admin/inquiries"),
  updateInquiryStatus: (id: number, status: string) =>
    request<Inquiry>("PATCH", `/admin/inquiries/${id}/status`, { status }),
  deleteInquiry: (id: number) => request<{ ok: boolean }>("DELETE", `/admin/inquiries/${id}`),

  // Packages
  getPackages: () => request<Package[]>("GET", "/admin/packages"),
  createPackage: (data: Partial<Package>) => request<Package>("POST", "/admin/packages", data),
  updatePackage: (id: number, data: Partial<Package>) => request<Package>("PUT", `/admin/packages/${id}`, data),
  deletePackage: (id: number) => request<{ ok: boolean }>("DELETE", `/admin/packages/${id}`),

  // Activities
  getActivities: () => request<Activity[]>("GET", "/admin/activities"),
  createActivity: (data: Partial<Activity>) => request<Activity>("POST", "/admin/activities", data),
  updateActivity: (id: number, data: Partial<Activity>) => request<Activity>("PUT", `/admin/activities/${id}`, data),
  deleteActivity: (id: number) => request<{ ok: boolean }>("DELETE", `/admin/activities/${id}`),

  // Accommodations
  getAccommodations: () => request<Accommodation[]>("GET", "/admin/accommodations"),
  createAccommodation: (data: Partial<Accommodation>) => request<Accommodation>("POST", "/admin/accommodations", data),
  updateAccommodation: (id: number, data: Partial<Accommodation>) => request<Accommodation>("PUT", `/admin/accommodations/${id}`, data),
  deleteAccommodation: (id: number) => request<{ ok: boolean }>("DELETE", `/admin/accommodations/${id}`),
};

export interface Inquiry {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  packageId?: number | null;
  numberOfVisitors: number;
  numberOfDays: number;
  preferredStartDate?: string | null;
  message: string;
  status: string;
  activityIds: number[];
  accommodationId?: number | null;
  estimatedTotal?: number | null;
  createdAt: string;
}

export interface Package {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  minDays: number;
  maxDays: number;
  basePricePerPersonPerDay: number;
  imageUrl: string;
  galleryImages: string[];
  accommodationId: number;
  highlights: string[];
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
}

export interface Activity {
  id: number;
  name: string;
  description: string;
  category: string;
  durationHours: number;
  pricePerPerson: number;
  imageUrl: string;
  isPopular: boolean;
}

export interface Accommodation {
  id: number;
  name: string;
  type: string;
  description: string;
  location: string;
  pricePerNight: number;
  imageUrl: string;
  amenities: string[];
  stars: number;
}
