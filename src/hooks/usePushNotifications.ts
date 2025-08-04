import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

export interface NotificationSettings {
  pushEnabled: boolean;
  soundEnabled: boolean;
  desktopEnabled: boolean;
  emailEnabled: boolean;
  soundVolume: number;
  soundType: 'default' | 'custom' | 'none';
}

export const usePushNotifications = () => {
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    pushEnabled: false,
    soundEnabled: true,
    desktopEnabled: true,
    emailEnabled: false,
    soundVolume: 0.5,
    soundType: 'default'
  });
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Initialiser le contexte audio
  useEffect(() => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
    }
  }, []);

  // Vérifier les permissions au chargement
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Demander les permissions
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast.error('Les notifications ne sont pas supportées par votre navigateur');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setSettings(prev => ({ ...prev, pushEnabled: true }));
        toast.success('Notifications activées avec succès');
        return true;
      } else {
        toast.error('Permission refusée pour les notifications');
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      toast.error('Erreur lors de l\'activation des notifications');
      return false;
    }
  }, []);

  // Jouer un son de notification
  const playNotificationSound = useCallback(async (type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    if (!audioContext || !settings.soundEnabled) return;

    try {
      // Créer un oscillateur pour générer un son
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Configurer le son selon le type
      const frequencies = {
        success: [800, 1000, 1200],
        error: [200, 300, 400],
        warning: [600, 800],
        info: [400, 600]
      };

      const freq = frequencies[type];
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configurer le volume
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(settings.soundVolume, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      // Jouer la séquence de notes
      freq.forEach((frequency, index) => {
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + index * 0.1);
      });

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + freq.length * 0.1);
    } catch (error) {
      console.error('Erreur lors de la lecture du son:', error);
    }
  }, [audioContext, settings.soundEnabled, settings.soundVolume]);

  // Envoyer une notification push
  const sendNotification = useCallback(async (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    action?: { label: string; url: string }
  ) => {
    const notification: PushNotification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
      action
    };

    // Ajouter à la liste locale
    setNotifications(prev => [notification, ...prev]);

    // Notification toast
    const toastOptions = {
      duration: 4000,
      position: 'top-right' as const,
      style: {
        background: type === 'error' ? '#ef4444' : 
                   type === 'warning' ? '#f59e0b' : 
                   type === 'success' ? '#10b981' : '#3b82f6',
        color: 'white',
      },
    };

    toast(message, toastOptions);

    // Notification desktop si activée
    if (settings.desktopEnabled && permission === 'granted') {
      try {
        const desktopNotification = new Notification(title, {
          body: message,
          icon: '/images/logo.jpg',
          badge: '/images/logo.jpg',
          tag: notification.id,
          requireInteraction: type === 'error' || type === 'warning',
        });

        desktopNotification.onclick = () => {
          if (action?.url) {
            window.open(action.url, '_blank');
          }
          desktopNotification.close();
        };

        desktopNotification.onshow = () => {
          playNotificationSound(type);
        };
      } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification desktop:', error);
      }
    } else {
      // Jouer le son même sans notification desktop
      playNotificationSound(type);
    }
  }, [settings.desktopEnabled, permission, playNotificationSound]);

  // Marquer une notification comme lue
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  }, []);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  // Supprimer une notification
  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  }, []);

  // Supprimer toutes les notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Mettre à jour les paramètres
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Statistiques des notifications
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    byType: {
      info: notifications.filter(n => n.type === 'info').length,
      success: notifications.filter(n => n.type === 'success').length,
      warning: notifications.filter(n => n.type === 'warning').length,
      error: notifications.filter(n => n.type === 'error').length,
    }
  };

  return {
    // État
    notifications,
    settings,
    permission,
    stats,
    
    // Actions
    requestPermission,
    sendNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    updateSettings,
    playNotificationSound,
  };
}; 