// Shapes returned by the backend endpoints (see backend/README.md).

export type Bucket = 'today' | 'past' | 'upcoming';

export interface FeedEvent {
  id: string;
  title: string;
  description: string | null;
  organized_by: string | null;
  venue: string | null;
  starts_at: string;
  ends_at: string | null;
  rewards: string | null;
  registration_url: string | null;
  poster_url: string | null;
  is_featured: boolean;
  club_id: string | null;
  club_name: string | null;
  club_short_name: string | null;
  club_logo_url: string | null;
  category_id: string | null;
  category_name: string | null;
  category_icon: string | null;
  category_color: string | null;
  days_from_today: number;
  updated_at: string;
}

export interface Club {
  id: string;
  name: string;
  short_name: string | null;
  description: string | null;
  logo_url: string | null;
  instagram_url: string | null;
  website_url: string | null;
}

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

export interface Announcement {
  id: string;
  title: string;
  body: string | null;
  link_url: string | null;
  image_url: string | null;
}

export interface AppConfig {
  timezone?: string;
  past_days?: number;
  upcoming_days?: number;
  maintenance_mode?: boolean;
  maintenance_message?: string;
  min_app_version?: string;
  contact_email?: string | null;
  [key: string]: unknown;
}

export interface Bootstrap {
  server_time: string;
  config: AppConfig;
  announcements: Announcement[];
  clubs: Club[];
  categories: Category[];
}

export interface FeedFilters {
  clubId: string | null;
  categoryId: string | null;
}
