import { useState, useEffect, useCallback } from 'react';
import { 
  PageContent, 
  ServiceContent, 
  TestimonialContent, 
  CompanyInfo, 
  ContactForm, 
  FAQItem, 
  BlogPost, 
  GalleryItem, 
  SiteSettings,
  CMSStats,
  CMSPermissions 
} from '../types/cms';

interface UseCMSReturn {
  // Pages
  pages: PageContent[];
  createPage: (page: Omit<PageContent, 'id' | 'lastModified' | 'createdBy'>) => Promise<void>;
  updatePage: (id: string, updates: Partial<PageContent>) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  publishPage: (id: string) => Promise<void>;
  unpublishPage: (id: string) => Promise<void>;
  
  // Services
  services: ServiceContent[];
  createService: (service: Omit<ServiceContent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateService: (id: string, updates: Partial<ServiceContent>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  reorderServices: (newOrder: string[]) => Promise<void>;
  
  // Testimonials
  testimonials: TestimonialContent[];
  createTestimonial: (testimonial: Omit<TestimonialContent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTestimonial: (id: string, updates: Partial<TestimonialContent>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  approveTestimonial: (id: string) => Promise<void>;
  rejectTestimonial: (id: string) => Promise<void>;
  
  // Company Info
  companyInfo: CompanyInfo | null;
  updateCompanyInfo: (updates: Partial<CompanyInfo>) => Promise<void>;
  
  // Contact Forms
  contactForms: ContactForm[];
  markContactFormAsRead: (id: string) => Promise<void>;
  replyToContactForm: (id: string, reply: string) => Promise<void>;
  deleteContactForm: (id: string) => Promise<void>;
  
  // FAQ
  faqItems: FAQItem[];
  createFAQItem: (item: Omit<FAQItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateFAQItem: (id: string, updates: Partial<FAQItem>) => Promise<void>;
  deleteFAQItem: (id: string) => Promise<void>;
  reorderFAQItems: (newOrder: string[]) => Promise<void>;
  
  // Blog
  blogPosts: BlogPost[];
  createBlogPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>) => Promise<void>;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  publishBlogPost: (id: string) => Promise<void>;
  unpublishBlogPost: (id: string) => Promise<void>;
  
  // Gallery
  galleryItems: GalleryItem[];
  createGalleryItem: (item: Omit<GalleryItem, 'id' | 'createdAt'>) => Promise<void>;
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  reorderGalleryItems: (newOrder: string[]) => Promise<void>;
  
  // Site Settings
  siteSettings: SiteSettings | null;
  updateSiteSettings: (updates: Partial<SiteSettings>) => Promise<void>;
  
  // Stats
  stats: CMSStats;
  refreshStats: () => Promise<void>;
  
  // Permissions
  permissions: CMSPermissions;
  
  // Loading states
  loading: {
    pages: boolean;
    services: boolean;
    testimonials: boolean;
    companyInfo: boolean;
    contactForms: boolean;
    faq: boolean;
    blog: boolean;
    gallery: boolean;
    settings: boolean;
  };
  
  // Error handling
  errors: {
    pages: string | null;
    services: string | null;
    testimonials: string | null;
    companyInfo: string | null;
    contactForms: string | null;
    faq: string | null;
    blog: string | null;
    gallery: string | null;
    settings: string | null;
  };
}

// Mock data for development
const mockPages: PageContent[] = [
  {
    id: '1',
    slug: 'about',
    title: 'À propos',
    content: '<h1>À propos de GlobalNet Services</h1><p>Votre partenaire de confiance pour le nettoyage professionnel.</p>',
    metaDescription: 'Découvrez GlobalNet Services, votre partenaire de confiance pour le nettoyage professionnel.',
    isPublished: true,
    lastModified: new Date(),
    createdBy: 'admin',
    seoKeywords: ['nettoyage', 'professionnel', 'services'],
  },
  {
    id: '2',
    slug: 'services',
    title: 'Nos Services',
    content: '<h1>Nos Services de Nettoyage</h1><p>Une gamme complète de services adaptés à vos besoins.</p>',
    metaDescription: 'Découvrez notre gamme complète de services de nettoyage professionnel.',
    isPublished: true,
    lastModified: new Date(),
    createdBy: 'admin',
    seoKeywords: ['services', 'nettoyage', 'professionnel'],
  },
];

const mockServices: ServiceContent[] = [
  {
    id: '1',
    name: 'Nettoyage Résidentiel',
    description: 'Service complet de nettoyage pour particuliers',
    shortDescription: 'Nettoyage complet de votre logement',
    price: 'À partir de 50€',
    features: ['Nettoyage complet', 'Désinfection', 'Produits écologiques'],
    image: '/images/services/residential.jpg',
    isActive: true,
    order: 1,
    category: 'residential',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Nettoyage Commercial',
    description: 'Solutions de nettoyage pour entreprises',
    shortDescription: 'Nettoyage professionnel pour locaux commerciaux',
    price: 'Sur devis',
    features: ['Nettoyage régulier', 'Désinfection', 'Flexibilité horaire'],
    image: '/images/services/commercial.jpg',
    isActive: true,
    order: 2,
    category: 'commercial',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockCompanyInfo: CompanyInfo = {
  id: '1',
  name: 'GlobalNet Services',
  description: 'Entreprise de nettoyage professionnel',
  address: '123 Rue de la Paix, 75001 Paris',
  phone: '+33 1 23 45 67 89',
  email: 'contact@globalnet-services.fr',
  website: 'https://globalnet-services.fr',
  siret: '12345678901234',
  tvaNumber: 'FR12345678901',
  insuranceInfo: 'Assurance professionnelle en cours',
  logo: '/images/logo.jpg',
  heroImage: '/images/hero.jpg',
  aboutContent: 'GlobalNet Services est votre partenaire de confiance pour tous vos besoins de nettoyage professionnel.',
  mission: 'Fournir des services de nettoyage de qualité exceptionnelle',
  values: ['Qualité', 'Fiabilité', 'Écologie'],
  teamMembers: [
    {
      id: '1',
      name: 'Jean Dupont',
      position: 'Directeur',
      bio: 'Plus de 15 ans d\'expérience',
      photo: '/images/team/jean.jpg',
      email: 'jean@globalnet-services.fr',
      phone: '+33 1 23 45 67 89',
      isActive: true,
      order: 1,
    },
  ],
  socialMedia: {
    facebook: 'https://facebook.com/globalnet',
    linkedin: 'https://linkedin.com/company/globalnet',
  },
  businessHours: {
    monday: { open: '08:00', close: '18:00', closed: false },
    tuesday: { open: '08:00', close: '18:00', closed: false },
    wednesday: { open: '08:00', close: '18:00', closed: false },
    thursday: { open: '08:00', close: '18:00', closed: false },
    friday: { open: '08:00', close: '18:00', closed: false },
    saturday: { open: '09:00', close: '17:00', closed: false },
    sunday: { open: '', close: '', closed: true },
  },
  serviceAreas: ['Paris', 'Île-de-France', 'Province'],
  certifications: ['ISO 9001', 'Certification écologique'],
  updatedAt: new Date(),
};

const mockSiteSettings: SiteSettings = {
  id: '1',
  siteName: 'GlobalNet Services',
  siteDescription: 'Services de nettoyage professionnel',
  primaryColor: '#2980b9',
  secondaryColor: '#34495e',
  accentColor: '#e74c3c',
  fontFamily: 'Inter, sans-serif',
  enableBlog: true,
  enableTestimonials: true,
  enableGallery: true,
  enableFAQ: true,
  maintenanceMode: false,
  maintenanceMessage: 'Site en maintenance',
  googleAnalyticsId: 'GA-XXXXXXXXX',
  smtpSettings: {
    host: 'smtp.gmail.com',
    port: 587,
    username: 'contact@globalnet-services.fr',
    password: '',
    secure: false,
    fromEmail: 'contact@globalnet-services.fr',
    fromName: 'GlobalNet Services',
  },
  updatedAt: new Date(),
};

export function useCMS(): UseCMSReturn {
  // State for all content types
  const [pages, setPages] = useState<PageContent[]>(mockPages);
  const [services, setServices] = useState<ServiceContent[]>(mockServices);
  const [testimonials, setTestimonials] = useState<TestimonialContent[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(mockCompanyInfo);
  const [contactForms, setContactForms] = useState<ContactForm[]>([]);
  const [faqItems, setFAQItems] = useState<FAQItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(mockSiteSettings);
  
  // Loading states
  const [loading, setLoading] = useState({
    pages: false,
    services: false,
    testimonials: false,
    companyInfo: false,
    contactForms: false,
    faq: false,
    blog: false,
    gallery: false,
    settings: false,
  });
  
  // Error states
  const [errors, setErrors] = useState<{
    pages: string | null;
    services: string | null;
    testimonials: string | null;
    companyInfo: string | null;
    contactForms: string | null;
    faq: string | null;
    blog: string | null;
    gallery: string | null;
    settings: string | null;
  }>({
    pages: null,
    services: null,
    testimonials: null,
    companyInfo: null,
    contactForms: null,
    faq: null,
    blog: null,
    gallery: null,
    settings: null,
  });
  
  // Stats
  const [stats, setStats] = useState<CMSStats>({
    totalPages: mockPages.length,
    totalServices: mockServices.length,
    totalTestimonials: 0,
    totalContactForms: 0,
    totalBlogPosts: 0,
    totalGalleryItems: 0,
    unreadContactForms: 0,
    pendingTestimonials: 0,
    draftBlogPosts: 0,
    lastContentUpdate: new Date(),
  });
  
  // Permissions (mock for now)
  const [permissions] = useState<CMSPermissions>({
    canManagePages: true,
    canManageServices: true,
    canManageTestimonials: true,
    canManageCompanyInfo: true,
    canManageContactForms: true,
    canManageFAQ: true,
    canManageBlog: true,
    canManageGallery: true,
    canManageSettings: true,
    canManageUsers: true,
  });
  
  // Generic CRUD operations
  const createPage = useCallback(async (page: Omit<PageContent, 'id' | 'lastModified' | 'createdBy'>) => {
    setLoading(prev => ({ ...prev, pages: true }));
    try {
      const newPage: PageContent = {
        ...page,
        id: crypto.randomUUID(),
        lastModified: new Date(),
        createdBy: 'admin', // TODO: Get from auth context
      };
      setPages(prev => [newPage, ...prev]);
      setErrors(prev => ({ ...prev, pages: null }));
    } catch (error) {
      setErrors(prev => ({ ...prev, pages: 'Erreur lors de la création de la page' as string | null }));
    } finally {
      setLoading(prev => ({ ...prev, pages: false }));
    }
  }, []);
  
  const updatePage = useCallback(async (id: string, updates: Partial<PageContent>) => {
    setLoading(prev => ({ ...prev, pages: true }));
    try {
      setPages(prev => prev.map(page => 
        page.id === id 
          ? { ...page, ...updates, lastModified: new Date() }
          : page
      ));
      setErrors(prev => ({ ...prev, pages: null }));
    } catch (error) {
      setErrors(prev => ({ ...prev, pages: 'Erreur lors de la mise à jour de la page' }));
    } finally {
      setLoading(prev => ({ ...prev, pages: false }));
    }
  }, []);
  
  const deletePage = useCallback(async (id: string) => {
    setLoading(prev => ({ ...prev, pages: true }));
    try {
      setPages(prev => prev.filter(page => page.id !== id));
      setErrors(prev => ({ ...prev, pages: null }));
    } catch (error) {
      setErrors(prev => ({ ...prev, pages: 'Erreur lors de la suppression de la page' }));
    } finally {
      setLoading(prev => ({ ...prev, pages: false }));
    }
  }, []);
  
  const publishPage = useCallback(async (id: string) => {
    await updatePage(id, { isPublished: true });
  }, [updatePage]);
  
  const unpublishPage = useCallback(async (id: string) => {
    await updatePage(id, { isPublished: false });
  }, [updatePage]);
  
  // Services CRUD
  const createService = useCallback(async (service: Omit<ServiceContent, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(prev => ({ ...prev, services: true }));
    try {
      const newService: ServiceContent = {
        ...service,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setServices(prev => [newService, ...prev]);
      setErrors(prev => ({ ...prev, services: null }));
    } catch (error) {
      setErrors(prev => ({ ...prev, services: 'Erreur lors de la création du service' }));
    } finally {
      setLoading(prev => ({ ...prev, services: false }));
    }
  }, []);
  
  const updateService = useCallback(async (id: string, updates: Partial<ServiceContent>) => {
    setLoading(prev => ({ ...prev, services: true }));
    try {
      setServices(prev => prev.map(service => 
        service.id === id 
          ? { ...service, ...updates, updatedAt: new Date() }
          : service
      ));
      setErrors(prev => ({ ...prev, services: null }));
    } catch (error) {
      setErrors(prev => ({ ...prev, services: 'Erreur lors de la mise à jour du service' }));
    } finally {
      setLoading(prev => ({ ...prev, services: false }));
    }
  }, []);
  
  const deleteService = useCallback(async (id: string) => {
    setLoading(prev => ({ ...prev, services: true }));
    try {
      setServices(prev => prev.filter(service => service.id !== id));
      setErrors(prev => ({ ...prev, services: null }));
    } catch (error) {
      setErrors(prev => ({ ...prev, services: 'Erreur lors de la suppression du service' }));
    } finally {
      setLoading(prev => ({ ...prev, services: false }));
    }
  }, []);
  
  const reorderServices = useCallback(async (newOrder: string[]) => {
    setLoading(prev => ({ ...prev, services: true }));
    try {
      setServices(prev => {
        const reordered = newOrder.map((id, index) => {
          const service = prev.find(s => s.id === id);
          return service ? { ...service, order: index + 1 } : null;
        }).filter(Boolean) as ServiceContent[];
        
        return reordered;
      });
      setErrors(prev => ({ ...prev, services: null }));
    } catch (error) {
      setErrors(prev => ({ ...prev, services: 'Erreur lors du réordonnancement' }));
    } finally {
      setLoading(prev => ({ ...prev, services: false }));
    }
  }, []);
  
  // Company Info
  const updateCompanyInfo = useCallback(async (updates: Partial<CompanyInfo>) => {
    setLoading(prev => ({ ...prev, companyInfo: true }));
    try {
      setCompanyInfo(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
      setErrors(prev => ({ ...prev, companyInfo: null }));
    } catch (error) {
      setErrors(prev => ({ ...prev, companyInfo: 'Erreur lors de la mise à jour des informations' }));
    } finally {
      setLoading(prev => ({ ...prev, companyInfo: false }));
    }
  }, []);
  
  // Site Settings
  const updateSiteSettings = useCallback(async (updates: Partial<SiteSettings>) => {
    setLoading(prev => ({ ...prev, settings: true }));
    try {
      setSiteSettings(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
      setErrors(prev => ({ ...prev, settings: null }));
    } catch (error) {
      setErrors(prev => ({ ...prev, settings: 'Erreur lors de la mise à jour des paramètres' }));
    } finally {
      setLoading(prev => ({ ...prev, settings: false }));
    }
  }, []);
  
  // Stats
  const refreshStats = useCallback(async () => {
    try {
      const newStats: CMSStats = {
        totalPages: pages.length,
        totalServices: services.length,
        totalTestimonials: testimonials.length,
        totalContactForms: contactForms.length,
        totalBlogPosts: blogPosts.length,
        totalGalleryItems: galleryItems.length,
        unreadContactForms: contactForms.filter(form => !form.isRead).length,
        pendingTestimonials: testimonials.filter(testimonial => !testimonial.isApproved).length,
        draftBlogPosts: blogPosts.filter(post => !post.isPublished).length,
        lastContentUpdate: new Date(),
      };
      setStats(newStats);
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
    }
  }, [pages, services, testimonials, contactForms, blogPosts, galleryItems]);
  
  // Update stats when content changes
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);
  
  // Mock implementations for other CRUD operations
  const createTestimonial = useCallback(async () => {}, []);
  const updateTestimonial = useCallback(async () => {}, []);
  const deleteTestimonial = useCallback(async () => {}, []);
  const approveTestimonial = useCallback(async () => {}, []);
  const rejectTestimonial = useCallback(async () => {}, []);
  
  const markContactFormAsRead = useCallback(async () => {}, []);
  const replyToContactForm = useCallback(async () => {}, []);
  const deleteContactForm = useCallback(async () => {}, []);
  
  const createFAQItem = useCallback(async () => {}, []);
  const updateFAQItem = useCallback(async () => {}, []);
  const deleteFAQItem = useCallback(async () => {}, []);
  const reorderFAQItems = useCallback(async () => {}, []);
  
  const createBlogPost = useCallback(async () => {}, []);
  const updateBlogPost = useCallback(async () => {}, []);
  const deleteBlogPost = useCallback(async () => {}, []);
  const publishBlogPost = useCallback(async () => {}, []);
  const unpublishBlogPost = useCallback(async () => {}, []);
  
  const createGalleryItem = useCallback(async () => {}, []);
  const updateGalleryItem = useCallback(async () => {}, []);
  const deleteGalleryItem = useCallback(async () => {}, []);
  const reorderGalleryItems = useCallback(async () => {}, []);
  
  return {
    // Pages
    pages,
    createPage,
    updatePage,
    deletePage,
    publishPage,
    unpublishPage,
    
    // Services
    services,
    createService,
    updateService,
    deleteService,
    reorderServices,
    
    // Testimonials
    testimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    approveTestimonial,
    rejectTestimonial,
    
    // Company Info
    companyInfo,
    updateCompanyInfo,
    
    // Contact Forms
    contactForms,
    markContactFormAsRead,
    replyToContactForm,
    deleteContactForm,
    
    // FAQ
    faqItems,
    createFAQItem,
    updateFAQItem,
    deleteFAQItem,
    reorderFAQItems,
    
    // Blog
    blogPosts,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    publishBlogPost,
    unpublishBlogPost,
    
    // Gallery
    galleryItems,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    reorderGalleryItems,
    
    // Site Settings
    siteSettings,
    updateSiteSettings,
    
    // Stats
    stats,
    refreshStats,
    
    // Permissions
    permissions,
    
    // Loading states
    loading,
    
    // Error handling
    errors,
  };
} 