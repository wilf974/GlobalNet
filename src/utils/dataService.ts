import fs from 'fs';
import path from 'path';

// Types pour les données
export interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
  totalDevis: number;
  totalRevenue: number;
  lastContact: string;
  status: 'active' | 'inactive' | 'prospect';
  notes?: string;
}

export interface DevisData {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  services: ServiceItem[];
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  completedAt?: string;
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

export interface FactureData {
  id: string;
  devisId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  services: ServiceItem[];
  totalAmount: number;
  status: 'en_attente' | 'payee' | 'en_retard';
  createdAt: string;
  dueDate: string;
  paidAt?: string;
  notes?: string;
  discount?: number;
  tax?: number;
  finalAmount: number;
  paymentMethod?: string;
}

// Chemins des fichiers de données
const DATA_DIR = path.join(process.cwd(), 'data');
const CLIENTS_FILE = path.join(DATA_DIR, 'clients.json');
const DEVIS_FILE = path.join(DATA_DIR, 'devis.json');
const FACTURES_FILE = path.join(DATA_DIR, 'factures.json');

// Fonctions utilitaires
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

const readJsonFile = <T>(filePath: string): T => {
  try {
    if (!fs.existsSync(filePath)) {
      return {} as T;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
    return {} as T;
  }
};

const writeJsonFile = <T>(filePath: string, data: T): void => {
  try {
    ensureDataDir();
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, 'utf8');
  } catch (error) {
    console.error(`Erreur lors de l'écriture du fichier ${filePath}:`, error);
    throw error;
  }
};

// Service de gestion des clients
export class ClientService {
  static getAll(): ClientData[] {
    const data = readJsonFile<{ clients: ClientData[] }>(CLIENTS_FILE);
    return data.clients || [];
  }

  static getById(id: string): ClientData | null {
    const clients = this.getAll();
    return clients.find(client => client.id === id) || null;
  }

  static create(client: Omit<ClientData, 'id'>): ClientData {
    const clients = this.getAll();
    const newClient: ClientData = {
      ...client,
      id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lastContact: new Date().toISOString()
    };
    
    clients.push(newClient);
    writeJsonFile(CLIENTS_FILE, { 
      clients, 
      lastUpdated: new Date().toISOString() 
    });
    
    return newClient;
  }

  static update(id: string, updates: Partial<ClientData>): ClientData | null {
    const clients = this.getAll();
    const index = clients.findIndex(client => client.id === id);
    
    if (index === -1) return null;
    
    clients[index] = { ...clients[index], ...updates };
    writeJsonFile(CLIENTS_FILE, { 
      clients, 
      lastUpdated: new Date().toISOString() 
    });
    
    return clients[index];
  }

  static delete(id: string): boolean {
    const clients = this.getAll();
    const filteredClients = clients.filter(client => client.id !== id);
    
    if (filteredClients.length === clients.length) return false;
    
    writeJsonFile(CLIENTS_FILE, { 
      clients: filteredClients, 
      lastUpdated: new Date().toISOString() 
    });
    
    return true;
  }
}

// Service de gestion des devis
export class DevisService {
  static getAll(): DevisData[] {
    const data = readJsonFile<{ devis: DevisData[] }>(DEVIS_FILE);
    return data.devis || [];
  }

  static getById(id: string): DevisData | null {
    const devis = this.getAll();
    return devis.find(devis => devis.id === id) || null;
  }

  static create(devis: Omit<DevisData, 'id' | 'createdAt' | 'updatedAt'>): DevisData {
    const devisList = this.getAll();
    const newDevis: DevisData = {
      ...devis,
      id: `devis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    devisList.push(newDevis);
    writeJsonFile(DEVIS_FILE, { 
      devis: devisList, 
      lastUpdated: new Date().toISOString() 
    });
    
    return newDevis;
  }

  static update(id: string, updates: Partial<DevisData>): DevisData | null {
    const devisList = this.getAll();
    const index = devisList.findIndex(devis => devis.id === id);
    
    if (index === -1) return null;
    
    devisList[index] = { 
      ...devisList[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    
    writeJsonFile(DEVIS_FILE, { 
      devis: devisList, 
      lastUpdated: new Date().toISOString() 
    });
    
    return devisList[index];
  }

  static delete(id: string): boolean {
    const devisList = this.getAll();
    const filteredDevis = devisList.filter(devis => devis.id !== id);
    
    if (filteredDevis.length === devisList.length) return false;
    
    writeJsonFile(DEVIS_FILE, { 
      devis: filteredDevis, 
      lastUpdated: new Date().toISOString() 
    });
    
    return true;
  }

  static getByStatus(status: DevisData['status']): DevisData[] {
    const devis = this.getAll();
    return devis.filter(devis => devis.status === status);
  }

  static getByClient(clientId: string): DevisData[] {
    const devis = this.getAll();
    return devis.filter(devis => devis.clientName === clientId);
  }
}

// Service de gestion des factures
export class FactureService {
  static getAll(): FactureData[] {
    const data = readJsonFile<{ factures: FactureData[] }>(FACTURES_FILE);
    return data.factures || [];
  }

  static getById(id: string): FactureData | null {
    const factures = this.getAll();
    return factures.find(facture => facture.id === id) || null;
  }

  static createFromDevis(devis: DevisData): FactureData {
    const factures = this.getAll();
    const newFacture: FactureData = {
      id: `facture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      devisId: devis.id,
      clientName: devis.clientName,
      clientEmail: devis.clientEmail,
      clientPhone: devis.clientPhone,
      services: devis.services,
      totalAmount: devis.totalAmount,
      status: 'en_attente',
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 jours
      notes: devis.notes,
      discount: devis.discount,
      tax: devis.tax,
      finalAmount: devis.finalAmount
    };
    
    factures.push(newFacture);
    writeJsonFile(FACTURES_FILE, { 
      factures, 
      lastUpdated: new Date().toISOString() 
    });
    
    return newFacture;
  }

  static update(id: string, updates: Partial<FactureData>): FactureData | null {
    const factures = this.getAll();
    const index = factures.findIndex(facture => facture.id === id);
    
    if (index === -1) return null;
    
    factures[index] = { ...factures[index], ...updates };
    writeJsonFile(FACTURES_FILE, { 
      factures, 
      lastUpdated: new Date().toISOString() 
    });
    
    return factures[index];
  }

  static delete(id: string): boolean {
    const factures = this.getAll();
    const filteredFactures = factures.filter(facture => facture.id !== id);
    
    if (filteredFactures.length === factures.length) return false;
    
    writeJsonFile(FACTURES_FILE, { 
      factures: filteredFactures, 
      lastUpdated: new Date().toISOString() 
    });
    
    return true;
  }

  static getByStatus(status: FactureData['status']): FactureData[] {
    const factures = this.getAll();
    return factures.filter(facture => facture.status === status);
  }

  static markAsPaid(id: string, paymentMethod: string = 'virement'): FactureData | null {
    return this.update(id, {
      status: 'payee',
      paidAt: new Date().toISOString(),
      paymentMethod
    });
  }
}

// Service de statistiques
export class StatsService {
  static getDashboardStats() {
    const clients = ClientService.getAll();
    const devis = DevisService.getAll();
    const factures = FactureService.getAll();

    const totalRevenue = factures
      .filter(f => f.status === 'payee')
      .reduce((sum, f) => sum + f.finalAmount, 0);

    const monthlyRevenue = factures
      .filter(f => f.status === 'payee' && new Date(f.paidAt!).getMonth() === new Date().getMonth())
      .reduce((sum, f) => sum + f.finalAmount, 0);

    const approvedDevis = devis.filter(d => d.status === 'approved').length;
    const pendingDevis = devis.filter(d => d.status === 'pending').length;
    const draftDevis = devis.filter(d => d.status === 'draft').length;

    return {
      totalClients: clients.length,
      totalDevis: devis.length,
      approvedDevis,
      pendingDevis,
      draftDevis,
      totalRevenue,
      monthlyRevenue,
      conversionRate: devis.length > 0 ? (approvedDevis / devis.length) * 100 : 0,
      averageDevisValue: devis.length > 0 ? devis.reduce((sum, d) => sum + d.totalAmount, 0) / devis.length : 0
    };
  }
} 