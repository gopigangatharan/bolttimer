/**
 * Utility functions and helpers
 */

/**
 * Generate a unique identifier
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Format time in seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Format duration in seconds to human readable format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Calculate completion percentage
 */
export function getCompletionPercentage(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.round((current / total) * 100));
}

/**
 * Get theme colors based on theme type
 */
export function getThemeColors(theme: string) {
  const themes = {
    classic: {
      primary: '#ef4444',
      secondary: '#f87171',
      accent: '#fca5a5',
      background: '#ffffff',
      surface: '#f8fafc',
    },
    nature: {
      primary: '#22c55e',
      secondary: '#4ade80',
      accent: '#86efac',
      background: '#f0fdf4',
      surface: '#dcfce7',
    },
    ocean: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      accent: '#93c5fd',
      background: '#eff6ff',
      surface: '#dbeafe',
    },
    sunset: {
      primary: '#f97316',
      secondary: '#fb923c',
      accent: '#fdba74',
      background: '#fff7ed',
      surface: '#fed7aa',
    },
    minimal: {
      primary: '#6b7280',
      secondary: '#9ca3af',
      accent: '#d1d5db',
      background: '#ffffff',
      surface: '#f9fafb',
    },
  };

  return themes[theme as keyof typeof themes] || themes.classic;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Clamp a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Play haptic feedback on supported devices
 */
export function playHapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light') {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
    };
    navigator.vibrate(patterns[type]);
  }
}