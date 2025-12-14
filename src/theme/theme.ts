export interface Theme {
  primary: string;
  primaryDark: string;
  secondary: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  star: string;
  badge: string;
  shadow: string;
  overlay: string;
}

// Light theme with new primary color (teal/cyan)
export const lightTheme: Theme = {
  primary: '#0891b2',
  primaryDark: '#0e7490',
  secondary: '#10b981',
  background: '#ffffff',
  surface: '#f9fafb',
  card: '#ffffff',
  text: '#111827',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  star: '#fbbf24',
  badge: '#dc2626',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Dark theme
export const darkTheme: Theme = {
  primary: '#06b6d4',
  primaryDark: '#0891b2',
  secondary: '#34d399',
  background: '#111827',
  surface: '#1f2937',
  card: '#1f2937',
  text: '#f9fafb',
  textSecondary: '#9ca3af',
  border: '#374151',
  error: '#f87171',
  success: '#34d399',
  warning: '#fbbf24',
  star: '#fbbf24',
  badge: '#ef4444',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
