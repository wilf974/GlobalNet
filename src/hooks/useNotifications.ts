import { useState, useEffect, useCallback, useRef } from 'react';
import { Notification as NotificationType, NotificationPreferences, AudioSettings, PushNotificationPayload } from '../types/notifications';

interface UseNotificationsReturn {
  notifications: NotificationType[];
  addNotification: (notification: Omit<NotificationType, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  preferences: NotificationPreferences;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
  audioSettings: AudioSettings;
  updateAudioSettings: (settings: Partial<AudioSettings>) => void;
  playSound: (type: 'notification' | 'success' | 'error' | 'warning') => void;
  requestPushPermission: () => Promise<boolean>;
  sendPushNotification: (payload: PushNotificationPayload) => Promise<void>;
  unreadCount: number;
}

const defaultPreferences: NotificationPreferences = {
  push: true,
  sound: true,
  email: false,
  desktop: true,
  soundVolume: 0.5,
  soundType: 'default',
};

const defaultAudioSettings: AudioSettings = {
  enabled: true,
  volume: 0.5,
  sounds: {
    notification: '/sounds/notification.mp3',
    success: '/sounds/success.mp3',
    error: '/sounds/error.mp3',
    warning: '/sounds/warning.mp3',
  },
};

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(defaultAudioSettings);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<Map<string, AudioBuffer>>(new Map());

  // Initialiser l'AudioContext
  useEffect(() => {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      audioContextRef.current = new AudioContext();
      loadAudioBuffers();
    }
  }, []);

  // Charger les buffers audio
  const loadAudioBuffers = useCallback(async () => {
    if (!audioContextRef.current) return;

    try {
      const soundTypes = ['notification', 'success', 'error', 'warning'];
      
      for (const type of soundTypes) {
        const response = await fetch(audioSettings.sounds[type as keyof typeof audioSettings.sounds]);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        audioBuffersRef.current.set(type, audioBuffer);
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des sons:', error);
    }
  }, [audioSettings.sounds]);

  // Jouer un son
  const playSound = useCallback((type: 'notification' | 'success' | 'error' | 'warning') => {
    if (!audioSettings.enabled || !preferences.sound || !audioContextRef.current) return;

    const buffer = audioBuffersRef.current.get(type);
    if (!buffer) return;

    try {
      const source = audioContextRef.current.createBufferSource();
      const gainNode = audioContextRef.current.createGain();
      
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      gainNode.gain.value = audioSettings.volume * preferences.soundVolume;
      source.start(0);
    } catch (error) {
      console.warn('Erreur lors de la lecture du son:', error);
    }
  }, [audioSettings, preferences.sound, preferences.soundVolume]);

  // Ajouter une notification
  const addNotification = useCallback((notification: Omit<NotificationType, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationType = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Jouer le son si activé
    if (notification.sound && ['notification', 'success', 'error', 'warning'].includes(notification.sound)) {
      playSound(notification.sound as 'notification' | 'success' | 'error' | 'warning');
    } else {
      playSound('notification');
    }

    // Envoyer une notification push si activé
    if (preferences.push && 'Notification' in window && Notification.permission === 'granted') {
      sendPushNotification({
        title: notification.title,
        body: notification.message,
        icon: '/images/logo.jpg',
        badge: '/images/badge.png',
        tag: notification.type,
      });
    }
  }, [preferences.push, playSound]);

  // Marquer comme lu
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  // Marquer tout comme lu
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  }, []);

  // Supprimer une notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  // Effacer toutes les notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Mettre à jour les préférences
  const updatePreferences = useCallback((prefs: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
  }, []);

  // Mettre à jour les paramètres audio
  const updateAudioSettings = useCallback((settings: Partial<AudioSettings>) => {
    setAudioSettings(prev => ({ ...prev, ...settings }));
  }, []);

  // Demander la permission pour les notifications push
  const requestPushPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('Notifications non supportées par ce navigateur');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('Permission de notification refusée');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      return false;
    }
  }, []);

  // Envoyer une notification push
  const sendPushNotification = useCallback(async (payload: PushNotificationPayload): Promise<void> => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    try {
      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon,
        badge: payload.badge,
        tag: payload.tag,
        data: payload.data,
      });

      // Gérer les clics sur la notification
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification push:', error);
    }
  }, []);

  // Compter les notifications non lues
  const unreadCount = notifications.filter(notif => !notif.read).length;

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    preferences,
    updatePreferences,
    audioSettings,
    updateAudioSettings,
    playSound,
    requestPushPermission,
    sendPushNotification,
    unreadCount,
  };
} 