export type CarStatus = "available" | "sold" | "reserved";
export type UserRole = "admin" | "staff";
export type InspectionStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "rescheduled";
export type InspectionType = "basic" | "standard" | "full_premium";
export type InspectionLocation = "showroom" | "home_visit";

export interface CarImage {
  id: string;
  car_id: string;
  url: string;
  alt_text?: string | null;
  sort_order: number;
  is_cover: boolean;
}

export interface Car {
  id: string;
  slug: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  engine_capacity?: string | null;
  color?: string | null;
  body_type: string;
  registration_city?: string | null;
  owners?: number | null;
  condition?: string | null;
  features: string[];
  description?: string | null;
  status: CarStatus;
  video_url?: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
  images?: CarImage[];
}

export interface CarFilters {
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  status?: CarStatus | "all";
  search?: string;
  sort?: "price_asc" | "price_desc" | "year_desc" | "newest";
}

export interface Inspection {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  city: string;
  car_brand: string;
  car_model: string;
  car_year?: number | null;
  registration_number?: string | null;
  mileage?: number | null;
  color?: string | null;
  fuel_type?: string | null;
  transmission?: string | null;
  inspection_type: InspectionType;
  preferred_date?: string | null;
  preferred_time?: string | null;
  location_type: InspectionLocation;
  address?: string | null;
  photo_urls: string[];
  notes?: string | null;
  linked_car_id?: string | null;
  status: InspectionStatus;
  created_at: string;
  updated_at?: string;
}

export interface InspectionReport {
  id: string;
  inspection_id: string;
  public_token: string;
  checklist: Record<string, { score: number; notes: string }>;
  rating?: number | null;
  inspector_remarks?: string | null;
  report_photo_urls: string[];
  completed_at?: string | null;
  inspection?: Inspection;
}

export interface Lead {
  id: string;
  type: "contact" | "newsletter" | "inspection";
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name?: string | null;
  role: UserRole;
}
