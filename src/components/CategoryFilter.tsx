import React, { useMemo, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  // Add "All" option at the beginning of the category list
  const allCategories = useMemo(() => {
    const allOption: Category = { slug: 'all', name: 'All', url: '' };
    return [allOption, ...categories];
  }, [categories]);

  const renderCategory = useCallback(({ item }: { item: Category }) => {
    const isSelected = selectedCategory === item.slug;
    
    return (
      <Pressable
        style={[styles.chip, isSelected && styles.chipSelected]}
        onPress={() => onSelectCategory(item.slug)}
      >
        <Text 
          style={[styles.chipText, isSelected && styles.chipTextSelected]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </Pressable>
    );
  }, [selectedCategory, onSelectCategory]);

  const keyExtractor = useCallback((item: Category) => item.slug, []);

  return (
    <FlatList
      data={allCategories}
      renderItem={renderCategory}
      keyExtractor={keyExtractor}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    marginBottom:spacing.lg,
    height:40,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    height:40,
    justifyContent:'center',
    alignItems:'center',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.background,
  },
});

export default CategoryFilter;
