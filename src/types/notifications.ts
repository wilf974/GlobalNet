export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
  sound?: 'default' | 'success' | 'error' | 'warning' | 'custom';
}

export interface NotificationPreferences {
  push: boolean;
  sound: boolean;
  email: boolean;
  desktop: boolean;
  soundVolume: number;
  soundType: 'default' | 'success' | 'error' | 'warning' | 'custom';
}

export interface AudioSettings {
  enabled: boolean;
  volume: number;
  sounds: {
    notification: string;
    success: string;
    error: string;
    warning: string;
  };
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export type NotificationType = 'devis' | 'approval' | 'system' | 'reminder';

export interface NotificationTemplate {
  type: NotificationType;
  title: string;
  message: string;
  sound: string;
  icon: string;
} 