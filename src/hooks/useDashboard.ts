import { useState, useEffect, useCallback, useReducer } from 'react';
import { 
  DashboardState, 
  DashboardAction, 
  DashboardModule, 
  DashboardStats,
  CAModuleData,
  CMSModuleData,
  AnalyticsModuleData,
  DevisData,
  ClientData,
  RevenueData,
  CAnalyticsData,
  WorkflowData,
  PageContent,
  ServiceContent,
  NavigationContent,
  FooterContent,
  CompanyInfo,
  ContactForm,
  FAQItem,
  BlogPost,
  GalleryItem,
  SiteSettings,
  AnalyticsOverview,
  PerformanceData,
  TrafficData,
  ConversionData,
  ReportData,
  ExportOptions,
  NotificationSettings,
  UserPermissions
} from '../types/dashboard';
import { useClients, useDevis, useFactures } from './usePersistentData';

// État initial du dashboard
const initialState: DashboardState = {
  activeModule: 'overview',
  isLoading: false,
  error: null,
  stats: {
    totalDevis: 0,
    approvedDevis: 0,
    pendingDevis: 0,
    rejectedDevis: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    averageDevisValue: 0,
    totalClients: 0,
    activeClients: 0,
    contentPages: 0,
    publishedContent: 0,
    draftContent: 0,
    totalViews: 0,
    monthlyViews: 0,
    performanceScore: 0
  },
  caData: {
    devis: [],
    clients: [],
    revenue: {
      total: 0,
      monthly: 0,
      yearly: 0,
      byMonth: [],
      byService: []
    },
    analytics: {
      conversionRate: 0,
      averageDevisValue: 0,
      topServices: [],
      clientRetention: 0,
      growthRate: 0,
      projections: []
    },
    workflows: []
  },
  cmsData: {
    pages: [],
    services: [],
    navigation: {
      id: '1',
      items: [],
      isActive: true,
      updatedAt: new Date()
    },
    footer: {
      id: '1',
      companyInfo: '',
      contactInfo: '',
      socialLinks: [],
      legalLinks: [],
      isActive: true,
      updatedAt: new Date()
    },
    company: {
      id: '1',
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      updatedAt: new Date()
    },
    contact: {
      id: '1',
      submissions: [],
      settings: {
        isActive: true,
        autoReply: false,
        notificationEmail: '',
        fields: []
      }
    },
    faq: [],
    blog: [],
    gallery: [],
    settings: {
      id: '1',
      siteName: '',
      siteDescription: '',
      siteUrl: '',
      maintenanceMode: false,
      maintenanceMessage: '',
      robotsTxt: {
        userAgents: [],
        sitemapUrl: '',
        host: ''
      },
      seoSettings: {
        defaultMetaDescription: '',
        defaultMetaKeywords: [],
        googleAnalyticsId: '',
        googleSearchConsole: '',
        socialMedia: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: ''
        }
      },
      emailSettings: {
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: '',
        fromEmail: '',
        fromName: ''
      },
      updatedAt: new Date()
    }
  },
  analyticsData: {
    overview: {
      totalViews: 0,
      uniqueVisitors: 0,
      pageViews: 0,
      bounceRate: 0,
      averageSessionDuration: 0,
      conversionRate: 0,
      topPages: []
    },
    performance: {
      pageLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0,
      performanceScore: 0,
      recommendations: []
    },
    traffic: {
      total: 0,
      bySource: [],
      byDevice: [],
      byLocation: [],
      trends: []
    },
    conversions: {
      totalConversions: 0,
      conversionRate: 0,
      byPage: [],
      bySource: [],
      funnel: []
    },
    reports: []
  }
};

// Reducer pour gérer les actions du dashboard
const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'SET_ACTIVE_MODULE':
      return {
        ...state,
        activeModule: action.payload
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    
    case 'UPDATE_STATS':
      return {
        ...state,
        stats: { ...state.stats, ...action.payload }
      };
    
    case 'UPDATE_CA_DATA':
      return {
        ...state,
        caData: { ...state.caData, ...action.payload }
      };
    
    case 'UPDATE_CMS_DATA':
      return {
        ...state,
        cmsData: { ...state.cmsData, ...action.payload }
      };
    
    case 'UPDATE_ANALYTICS_DATA':
      return {
        ...state,
        analyticsData: { ...state.analyticsData, ...action.payload }
      };
    
    default:
      return state;
  }
};

// Hook principal du dashboard
export const useDashboard = () => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  
  // Hooks pour les données persistantes
  const { 
    clients: persistentClients, 
    loading: clientsLoading, 
    error: clientsError,
    createClient: createPersistentClient,
    updateClient: updatePersistentClient,
    deleteClient: deletePersistentClient
  } = useClients();
  
  const { 
    devis: persistentDevis, 
    loading: devisLoading, 
    error: devisError,
    createDevis: createPersistentDevis,
    updateDevis: updatePersistentDevis,
    deleteDevis: deletePersistentDevis
  } = useDevis();
  
  const { 
    factures: persistentFactures, 
    loading: facturesLoading, 
    error: facturesError
  } = useFactures();

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    frequency: 'immediate',
    types: ['devis', 'clients', 'content', 'analytics']
  });

  const [userPermissions, setUserPermissions] = useState<UserPermissions>({
    canViewDashboard: true,
    canManageDevis: true,
    canManageClients: true,
    canManageContent: true,
    canViewAnalytics: true,
    canExportData: true,
    canManageUsers: false,
    canManageSettings: true
  });

  // Actions pour le module CA/Devis
  const setActiveModule = useCallback((module: DashboardModule) => {
    dispatch({ type: 'SET_ACTIVE_MODULE', payload: module });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  // Actions pour les devis (avec persistance)
  const addDevis = useCallback(async (devis: Omit<DevisData, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createPersistentDevis(devis);
    } catch (error) {
      console.error('Erreur lors de la création du devis:', error);
      throw error;
    }
  }, [createPersistentDevis]);

  const updateDevis = useCallback(async (id: string, updates: Partial<DevisData>) => {
    try {
      await updatePersistentDevis(id, updates);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du devis:', error);
      throw error;
    }
  }, [updatePersistentDevis]);

  const deleteDevis = useCallback(async (id: string) => {
    try {
      await deletePersistentDevis(id);
    } catch (error) {
      console.error('Erreur lors de la suppression du devis:', error);
      throw error;
    }
  }, [deletePersistentDevis]);

  // Actions pour les clients (avec persistance)
  const addClient = useCallback(async (client: Omit<ClientData, 'id'>) => {
    try {
      await createPersistentClient(client);
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
      throw error;
    }
  }, [createPersistentClient]);

  const updateClient = useCallback(async (id: string, updates: Partial<ClientData>) => {
    try {
      await updatePersistentClient(id, updates);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
      throw error;
    }
  }, [updatePersistentClient]);

  const deleteClient = useCallback(async (id: string) => {
    try {
      await deletePersistentClient(id);
    } catch (error) {
      console.error('Erreur lors de la suppression du client:', error);
      throw error;
    }
  }, [deletePersistentClient]);

  // Synchronisation des données persistantes avec l'état du dashboard
  useEffect(() => {
    if (!clientsLoading && !devisLoading) {
      dispatch({ 
        type: 'UPDATE_CA_DATA', 
        payload: { 
          clients: persistentClients,
          devis: persistentDevis
        } 
      });
    }
  }, [persistentClients, persistentDevis, clientsLoading, devisLoading]);

  // Actions pour le contenu CMS
  const addPage = useCallback((page: PageContent) => {
    const updatedPages = [...state.cmsData.pages, page];
    dispatch({ 
      type: 'UPDATE_CMS_DATA', 
      payload: { pages: updatedPages } 
    });
  }, [state.cmsData.pages]);

  const updatePage = useCallback((id: string, updates: Partial<PageContent>) => {
    const updatedPages = state.cmsData.pages.map(page => 
      page.id === id ? { ...page, ...updates } : page
    );
    dispatch({ 
      type: 'UPDATE_CMS_DATA', 
      payload: { pages: updatedPages } 
    });
  }, [state.cmsData.pages]);

  const deletePage = useCallback((id: string) => {
    const updatedPages = state.cmsData.pages.filter(page => page.id !== id);
    dispatch({ 
      type: 'UPDATE_CMS_DATA', 
      payload: { pages: updatedPages } 
    });
  }, [state.cmsData.pages]);

  const addService = useCallback((service: ServiceContent) => {
    const updatedServices = [...state.cmsData.services, service];
    dispatch({ 
      type: 'UPDATE_CMS_DATA', 
      payload: { services: updatedServices } 
    });
  }, [state.cmsData.services]);

  const updateService = useCallback((id: string, updates: Partial<ServiceContent>) => {
    const updatedServices = state.cmsData.services.map(service => 
      service.id === id ? { ...service, ...updates } : service
    );
    dispatch({ 
      type: 'UPDATE_CMS_DATA', 
      payload: { services: updatedServices } 
    });
  }, [state.cmsData.services]);

  const deleteService = useCallback((id: string) => {
    const updatedServices = state.cmsData.services.filter(service => service.id !== id);
    dispatch({ 
      type: 'UPDATE_CMS_DATA', 
      payload: { services: updatedServices } 
    });
  }, [state.cmsData.services]);

  // Actions pour la navigation
  const updateNavigation = useCallback((navigation: NavigationContent) => {
    dispatch({ 
      type: 'UPDATE_CMS_DATA', 
      payload: { navigation } 
    });
  }, []);

  // Actions pour le footer
  const updateFooter = useCallback((footer: FooterContent) => {
    dispatch({ 
      type: 'UPDATE_CMS_DATA', 
      payload: { footer } 
    });
  }, []);

  // Actions pour les informations entreprise
  const updateCompanyInfo = useCallback((company: CompanyInfo) => {
    dispatch({ 
      type: 'UPDATE_CMS_DATA', 
      payload: { company } 
    });
  }, []);

  // Actions pour les paramètres du site
  const updateSiteSettings = useCallback((settings: SiteSettings) => {
    dispatch({ 
      type: 'UPDATE_CMS_DATA', 
      payload: { settings } 
    });
  }, []);

  // Actions pour les analytics
  const updateAnalyticsOverview = useCallback((overview: AnalyticsOverview) => {
    dispatch({ 
      type: 'UPDATE_ANALYTICS_DATA', 
      payload: { overview } 
    });
  }, []);

  const updatePerformanceData = useCallback((performance: PerformanceData) => {
    dispatch({ 
      type: 'UPDATE_ANALYTICS_DATA', 
      payload: { performance } 
    });
  }, []);

  const updateTrafficData = useCallback((traffic: TrafficData) => {
    dispatch({ 
      type: 'UPDATE_ANALYTICS_DATA', 
      payload: { traffic } 
    });
  }, []);

  const updateConversionData = useCallback((conversions: ConversionData) => {
    dispatch({ 
      type: 'UPDATE_ANALYTICS_DATA', 
      payload: { conversions } 
    });
  }, []);

  // Fonction pour exporter les données
  const exportData = useCallback(async (options: ExportOptions) => {
    setLoading(true);
    try {
      // Simulation d'export - à remplacer par l'implémentation réelle
      const data = {
        format: options.format,
        dateRange: options.dateRange,
        filters: options.filters,
        includeCharts: options.includeCharts,
        data: state
      };
      
      // Ici, vous pouvez implémenter la logique d'export réelle
      console.log('Exporting data:', data);
      
      // Simulation d'un délai d'export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return { success: true, message: 'Export réussi' };
    } catch (error) {
      setError('Erreur lors de l\'export');
      return { success: false, message: 'Erreur lors de l\'export' };
    } finally {
      setLoading(false);
    }
  }, [state]);

  // Fonction pour charger les données initiales
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulation du chargement des données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données mockées pour la démonstration
      const mockStats: DashboardStats = {
        totalDevis: 156,
        approvedDevis: 89,
        pendingDevis: 45,
        rejectedDevis: 22,
        totalRevenue: 125000,
        monthlyRevenue: 18500,
        conversionRate: 57.1,
        averageDevisValue: 802,
        totalClients: 67,
        activeClients: 45,
        contentPages: 12,
        publishedContent: 10,
        draftContent: 2,
        totalViews: 15420,
        monthlyViews: 3240,
        performanceScore: 95
      };

      dispatch({ type: 'UPDATE_STATS', payload: mockStats });
      
    } catch (error) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement initial des données
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    // État
    ...state,
    notificationSettings,
    userPermissions,
    
    // Données persistantes
    caData: {
      ...state.caData,
      clients: persistentClients,
      devis: persistentDevis
    },
    
    // États de chargement
    clientsLoading,
    devisLoading,
    facturesLoading,
    
    // Erreurs
    clientsError,
    devisError,
    facturesError,
    
    // Actions de base
    setActiveModule,
    setLoading,
    setError,
    
    // Actions CA/Devis (avec persistance)
    addDevis,
    updateDevis,
    deleteDevis,
    addClient,
    updateClient,
    deleteClient,
    
    // Actions CMS
    addPage,
    updatePage,
    deletePage,
    addService,
    updateService,
    deleteService,
    updateNavigation,
    updateFooter,
    updateCompanyInfo,
    updateSiteSettings,
    
    // Actions Analytics
    updateAnalyticsOverview,
    updatePerformanceData,
    updateTrafficData,
    updateConversionData,
    
    // Actions utilitaires
    exportData,
    loadDashboardData,
    setNotificationSettings,
    setUserPermissions
  };
}; 