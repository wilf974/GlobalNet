// Types pour le Dashboard Unifié

export type DashboardModule = 'overview' | 'ca' | 'cms' | 'analytics' | 'settings';

export interface DashboardStats {
  totalDevis: number;
  approvedDevis: number;
  pendingDevis: number;
  rejectedDevis: number;
  totalRevenue: number;
  monthlyRevenue: number;
  conversionRate: number;
  averageDevisValue: number;
  totalClients: number;
  activeClients: number;
  contentPages: number;
  publishedContent: number;
  draftContent: number;
  totalViews: number;
  monthlyViews: number;
  performanceScore: number;
}

export interface CAModuleData {
  devis: DevisData[];
  clients: ClientData[];
  revenue: RevenueData;
  analytics: CAnalyticsData;
  workflows: WorkflowData[];
}

export interface DevisData {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  services: ServiceItem[];
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  completedAt?: Date;
  notes?: string;
  discount?: number;
  tax?: number;
  finalAmount: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

export interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
  totalDevis: number;
  totalRevenue: number;
  lastContact: Date;
  status: 'active' | 'inactive' | 'prospect';
  notes?: string;
}

export interface RevenueData {
  total: number;
  monthly: number;
  yearly: number;
  byMonth: Array<{
    month: string;
    revenue: number;
    devis: number;
  }>;
  byService: Array<{
    service: string;
    revenue: number;
    count: number;
  }>;
}

export interface CAnalyticsData {
  conversionRate: number;
  averageDevisValue: number;
  topServices: Array<{
    name: string;
    revenue: number;
    count: number;
  }>;
  clientRetention: number;
  growthRate: number;
  projections: Array<{
    month: string;
    projectedRevenue: number;
  }>;
}

export interface WorkflowData {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: Date;
}

export interface WorkflowStep {
  id: string;
  name: string;
  order: number;
  isRequired: boolean;
  assignee?: string;
  estimatedTime: number;
}

export interface CMSModuleData {
  pages: PageContent[];
  services: ServiceContent[];
  navigation: NavigationContent;
  footer: FooterContent;
  company: CompanyInfo;
  contact: ContactForm;
  faq: FAQItem[];
  blog: BlogPost[];
  gallery: GalleryItem[];
  settings: SiteSettings;
}

export interface PageContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  metaKeywords: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  seo: SEOData;
}

export interface ServiceContent {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  price: number;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  seo: SEOData;
}

export interface NavigationContent {
  id: string;
  items: NavigationItem[];
  isActive: boolean;
  updatedAt: Date;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  order: number;
  isVisible: boolean;
  children?: NavigationItem[];
}

export interface FooterContent {
  id: string;
  companyInfo: string;
  contactInfo: string;
  socialLinks: SocialLink[];
  legalLinks: LegalLink[];
  isActive: boolean;
  updatedAt: Date;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface LegalLink {
  id: string;
  label: string;
  url: string;
}

export interface CompanyInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo?: string;
  updatedAt: Date;
}

export interface ContactForm {
  id: string;
  submissions: ContactSubmission[];
  settings: ContactFormSettings;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: Date;
  repliedAt?: Date;
}

export interface ContactFormSettings {
  isActive: boolean;
  autoReply: boolean;
  notificationEmail: string;
  fields: ContactField[];
}

export interface ContactField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'phone' | 'textarea';
  isRequired: boolean;
  isVisible: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  seo: SEOData;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  robotsTxt: RobotsTxtSettings;
  seoSettings: SEOSettings;
  emailSettings: EmailSettings;
  updatedAt: Date;
}

export interface RobotsTxtSettings {
  userAgents: UserAgentRule[];
  sitemapUrl: string;
  host: string;
}

export interface UserAgentRule {
  agent: string;
  allowedPaths: string[];
  disallowedPaths: string[];
}

export interface SEOSettings {
  defaultMetaDescription: string;
  defaultMetaKeywords: string[];
  googleAnalyticsId: string;
  googleSearchConsole: string;
  socialMedia: SocialMediaSettings;
}

export interface SocialMediaSettings {
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export interface AnalyticsModuleData {
  overview: AnalyticsOverview;
  performance: PerformanceData;
  traffic: TrafficData;
  conversions: ConversionData;
  reports: ReportData[];
}

export interface AnalyticsOverview {
  totalViews: number;
  uniqueVisitors: number;
  pageViews: number;
  bounceRate: number;
  averageSessionDuration: number;
  conversionRate: number;
  topPages: Array<{
    url: string;
    views: number;
    conversions: number;
  }>;
}

export interface PerformanceData {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  performanceScore: number;
  recommendations: string[];
}

export interface TrafficData {
  total: number;
  bySource: Array<{
    source: string;
    visits: number;
    percentage: number;
  }>;
  byDevice: Array<{
    device: string;
    visits: number;
    percentage: number;
  }>;
  byLocation: Array<{
    location: string;
    visits: number;
    percentage: number;
  }>;
  trends: Array<{
    date: string;
    visits: number;
    uniqueVisitors: number;
  }>;
}

export interface ConversionData {
  totalConversions: number;
  conversionRate: number;
  byPage: Array<{
    page: string;
    conversions: number;
    rate: number;
  }>;
  bySource: Array<{
    source: string;
    conversions: number;
    rate: number;
  }>;
  funnel: Array<{
    step: string;
    visitors: number;
    conversionRate: number;
  }>;
}

export interface ReportData {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  data: any;
  createdAt: Date;
  isScheduled: boolean;
  schedule?: string;
}

export interface DashboardState {
  activeModule: DashboardModule;
  isLoading: boolean;
  error: string | null;
  stats: DashboardStats;
  caData: CAModuleData;
  cmsData: CMSModuleData;
  analyticsData: AnalyticsModuleData;
}

export interface DashboardAction {
  type: 'SET_ACTIVE_MODULE' | 'SET_LOADING' | 'SET_ERROR' | 'UPDATE_STATS' | 'UPDATE_CA_DATA' | 'UPDATE_CMS_DATA' | 'UPDATE_ANALYTICS_DATA';
  payload: any;
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  dateRange: {
    start: Date;
    end: Date;
  };
  filters: Record<string, any>;
  includeCharts: boolean;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  types: string[];
}

export interface UserPermissions {
  canViewDashboard: boolean;
  canManageDevis: boolean;
  canManageClients: boolean;
  canManageContent: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
} 