import React, { memo } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = memo(({
  value,
  onChangeText,
  onSearch,
  placeholder = 'Search products...',
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Feather name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
      
      <TextInput
        style={[styles.input, { color: theme.text }]}
        value={value}
        onChangeText={(text)=>onChangeText(text)}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        returnKeyType="search"
        onSubmitEditing={onSearch}
      />
      
      {/* Clear button appears when there's text */}
      {value.length > 0 && (
        <Pressable style={styles.clearButton} onPress={() => onChangeText('')}>
          <Feather name="x" size={18} color={theme.textSecondary} />
        </Pressable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  clearButton: {
    padding: spacing.xs,
  },
});

export default SearchBar;
