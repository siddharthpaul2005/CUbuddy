export interface Club {
  id: string;
  name: string;
  short_name: string | null;
  description: string | null;
  logo_url: string | null;
  logo_path: string | null;
  instagram_url: string | null;
  website_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  sort_order: number;
}

export interface EventRow {
  id: string;
  title: string;
  description: string | null;
  club_id: string | null;
  category_id: string | null;
  organized_by: string | null;
  venue: string | null;
  starts_at: string;
  ends_at: string | null;
  rewards: string | null;
  registration_url: string | null;
  poster_url: string | null;
  poster_path: string | null;
  is_published: boolean;
  is_featured: boolean;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string | null;
  link_url: string | null;
  image_url: string | null;
  image_path: string | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  sort_order: number;
}

export interface AppConfigRow {
  key: string;
  value: unknown;
  description: string | null;
  updated_at: string;
}
