export interface PageContent {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaDescription: string;
  isPublished: boolean;
  lastModified: Date;
  createdBy: string;
  seoKeywords?: string[];
  featuredImage?: string;
}

export interface ServiceContent {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: string;
  features: string[];
  image: string;
  isActive: boolean;
  order: number;
  category: 'residential' | 'commercial' | 'industrial' | 'specialized';
  createdAt: Date;
  updatedAt: Date;
}

export interface TestimonialContent {
  id: string;
  clientName: string;
  clientCompany?: string;
  content: string;
  rating: number;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  siret: string;
  tvaNumber: string;
  insuranceInfo: string;
  logo: string;
  heroImage: string;
  aboutContent: string;
  mission: string;
  values: string[];
  teamMembers: TeamMember[];
  socialMedia: SocialMediaLinks;
  businessHours: BusinessHours;
  serviceAreas: string[];
  certifications: string[];
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  photo: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  order: number;
}

export interface SocialMediaLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
}

export interface BusinessHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

export interface ContactForm {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  service?: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: Date;
  repliedAt?: Date;
  replyMessage?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'services' | 'pricing' | 'booking';
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  featuredImage: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: 'before-after' | 'projects' | 'team' | 'equipment';
  isActive: boolean;
  order: number;
  createdAt: Date;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  enableBlog: boolean;
  enableTestimonials: boolean;
  enableGallery: boolean;
  enableFAQ: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  googleAnalyticsId?: string;
  googleMapsApiKey?: string;
  recaptchaSiteKey?: string;
  recaptchaSecretKey?: string;
  smtpSettings: SMTPSettings;
  updatedAt: Date;
}

export interface SMTPSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  secure: boolean;
  fromEmail: string;
  fromName: string;
}

export interface CMSPermissions {
  canManagePages: boolean;
  canManageServices: boolean;
  canManageTestimonials: boolean;
  canManageCompanyInfo: boolean;
  canManageContactForms: boolean;
  canManageFAQ: boolean;
  canManageBlog: boolean;
  canManageGallery: boolean;
  canManageSettings: boolean;
  canManageUsers: boolean;
}

export interface CMSStats {
  totalPages: number;
  totalServices: number;
  totalTestimonials: number;
  totalContactForms: number;
  totalBlogPosts: number;
  totalGalleryItems: number;
  unreadContactForms: number;
  pendingTestimonials: number;
  draftBlogPosts: number;
  lastContentUpdate: Date;
} 