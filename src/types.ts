export type UserRole = 'customer' | 'provider';

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  tagline?: string;
}

export interface ServiceItem {
  id?: string;
  name: string;
  price: number;
  deliveryTime?: string;
}

export interface Professional {
  id: string;
  userId?: string;
  name: string;
  businessName: string;
  category: string;
  categoryLabel: string;
  state: string;
  city: string;
  rating: number;
  reviewsCount: number;
  startingPrice: number;
  phone: string; // Nigerian phone number (e.g. "8032114455")
  verified: boolean;
  avatar: string;
  bio: string;
  portfolio: string[];
  servicesList: string[]; // e.g. "Brand Identity Guide - ₦95,000"
  badges?: string[];
  completedJobs?: number;
  responseTime?: string;
}

export interface Review {
  id: string;
  proId: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedHire?: boolean;
}

export interface InquiryHistoryItem {
  id: string;
  proName: string;
  proId?: string;
  date: string;
  service: string;
  phone?: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  proId?: string | null;
  avatar?: string;
  token: string;
  expiresAt: number;
}

export interface StoredUserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  proId?: string | null;
  avatar?: string;
  passwordHash: string;
  createdAt: string;
}

export type ViewType = 'home' | 'browse' | 'customer-dashboard' | 'provider-dashboard' | 'saved';
