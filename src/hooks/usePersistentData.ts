import { useState, useEffect, useCallback } from 'react';
import { ClientData, DevisData, FactureData } from '@/types/dashboard';

// Types pour les réponses API
interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface ClientsResponse {
  clients: ClientData[];
}

interface DevisResponse {
  devis: DevisData[];
}

interface FacturesResponse {
  factures: FactureData[];
}

// Hook pour les clients
export const useClients = () => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/clients');
      const data: ApiResponse<ClientsResponse> = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        // Convertir les dates string en Date objects
        const clientsWithDates = (data.data?.clients || []).map(client => ({
          ...client,
          lastContact: new Date(client.lastContact)
        }));
        setClients(clientsWithDates);
        setError(null);
      }
    } catch (err) {
      setError('Erreur lors du chargement des clients');
      console.error('Erreur fetchClients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createClient = useCallback(async (clientData: Omit<ClientData, 'id'>) => {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      const data: ApiResponse<{ client: ClientData }> = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setClients(prev => [...prev, data.data!.client]);
      return data.data!.client;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du client';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateClient = useCallback(async (id: string, updates: Partial<ClientData>) => {
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data: ApiResponse<{ client: ClientData }> = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setClients(prev => prev.map(client => 
        client.id === id ? data.data!.client : client
      ));
      return data.data!.client;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du client';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteClient = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      });

      const data: ApiResponse<{ message: string }> = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setClients(prev => prev.filter(client => client.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression du client';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    loading,
    error,
    createClient,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  };
};

// Hook pour les devis
export const useDevis = () => {
  const [devis, setDevis] = useState<DevisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevis = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/devis');
      const data: ApiResponse<DevisResponse> = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        // Convertir les dates string en Date objects
        const devisWithDates = (data.data?.devis || []).map(devis => ({
          ...devis,
          createdAt: new Date(devis.createdAt),
          updatedAt: new Date(devis.updatedAt),
          approvedAt: devis.approvedAt ? new Date(devis.approvedAt) : undefined,
          completedAt: devis.completedAt ? new Date(devis.completedAt) : undefined
        }));
        setDevis(devisWithDates);
        setError(null);
      }
    } catch (err) {
      setError('Erreur lors du chargement des devis');
      console.error('Erreur fetchDevis:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createDevis = useCallback(async (devisData: Omit<DevisData, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/devis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(devisData),
      });

      const data: ApiResponse<{ devis: DevisData }> = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setDevis(prev => [...prev, data.data!.devis]);
      return data.data!.devis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du devis';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateDevis = useCallback(async (id: string, updates: Partial<DevisData>) => {
    try {
      const response = await fetch(`/api/devis/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data: ApiResponse<{ devis: DevisData }> = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setDevis(prev => prev.map(devis => 
        devis.id === id ? data.data!.devis : devis
      ));
      return data.data!.devis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du devis';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteDevis = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/devis/${id}`, {
        method: 'DELETE',
      });

      const data: ApiResponse<{ message: string }> = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setDevis(prev => prev.filter(devis => devis.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression du devis';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchDevis();
  }, [fetchDevis]);

  return {
    devis,
    loading,
    error,
    createDevis,
    updateDevis,
    deleteDevis,
    refetch: fetchDevis,
  };
};

// Hook pour les factures
export const useFactures = () => {
  const [factures, setFactures] = useState<FactureData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFactures = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/factures');
      const data: ApiResponse<FacturesResponse> = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setFactures(data.data?.factures || []);
        setError(null);
      }
    } catch (err) {
      setError('Erreur lors du chargement des factures');
      console.error('Erreur fetchFactures:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFactures();
  }, [fetchFactures]);

  return {
    factures,
    loading,
    error,
    refetch: fetchFactures,
  };
}; 