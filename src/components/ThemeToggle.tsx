import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { toggleTheme, isDark, theme } = useTheme();

  return (
    <Pressable
      style={styles.container}
      onPress={toggleTheme}
      hitSlop={8}
    >
      <Feather
        name={isDark ? 'sun' : 'moon'}
        size={24}
        color={theme.text}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginRight: 8,
  },
});

export default ThemeToggle;
