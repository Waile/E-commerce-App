import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../theme/theme';

// Helper hook to create themed styles
export const useThemedStyles = <T extends Record<string, any>>(
  styleFactory: (theme: Theme) => T
): T => {
  const { theme } = useTheme();
  return useMemo(() => styleFactory(theme), [theme, styleFactory]);
};
