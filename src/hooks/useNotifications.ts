/**
 * Custom hook for browser notifications and sound effects
 */
import { useCallback, useRef, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { NotificationOptions } from '../types';

export function useNotifications() {
  const { settings } = useSettings();
  const audioRef = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    // Initialize audio elements
    const sounds = {
      start: '/sounds/start.mp3',
      pause: '/sounds/pause.mp3',
      resume: '/sounds/resume.mp3',
      stop: '/sounds/stop.mp3',
      complete: '/sounds/complete.mp3',
    };

    Object.entries(sounds).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.volume = settings.soundVolume;
      audioRef.current[key] = audio;
    });

    return () => {
      // Cleanup audio elements
      Object.values(audioRef.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, [settings.soundVolume]);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return true;
  }, []);

  const showNotification = useCallback(async (options: NotificationOptions) => {
    if (!settings.notificationsEnabled) return;

    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        badge: '/favicon.ico',
        silent: !options.sound,
      });

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.warn('Failed to show notification:', error);
    }
  }, [settings.notificationsEnabled, requestPermission]);

  const playSound = useCallback((soundType: string) => {
    if (!settings.soundEnabled || !audioRef.current[soundType]) return;

    try {
      const audio = audioRef.current[soundType];
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.warn('Failed to play sound:', error);
      });
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }, [settings.soundEnabled]);

  return {
    showNotification,
    playSound,
    requestPermission,
  };
}