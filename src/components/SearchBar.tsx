import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';
import { colors, spacing, borderRadius } from '../theme/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSearch,
  placeholder = 'Search products...',
}) => {
  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
      
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
        onSubmitEditing={onSearch}
      />
      
      {/* Clear button appears when there's text */}
      {value.length > 0 && (
        <Pressable style={styles.clearButton} onPress={() => onChangeText('')}>
          <Feather name="x" size={18} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    padding: spacing.xs,
  },
});

export default SearchBar;
