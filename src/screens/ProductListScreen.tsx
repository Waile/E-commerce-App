import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import {
  fetchProducts,
  fetchCategories,
  searchProducts,
  fetchProductsByCategory,
  setSelectedCategory,
} from '../store/slices/productsSlice';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { colors, spacing } from '../theme/colors';
import { Product } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProductsStackParamList } from '../types/navigation';
import { RootState } from '../store';

type ProductListScreenNavigationProp = NativeStackNavigationProp<
  ProductsStackParamList,
  'ProductList'
>;

interface ProductListScreenProps {
  navigation: ProductListScreenNavigationProp;
}

const ProductListScreen: React.FC<ProductListScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items, categories, selectedCategory, loading, error } = useAppSelector(
    (state: RootState) => state.products
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      dispatch(searchProducts(searchQuery));
    } else {
      dispatch(fetchProducts());
    }
  }, [searchQuery, dispatch]);

  const handleCategorySelect = useCallback(
    (category: string) => {
      dispatch(setSelectedCategory(category));
      setSearchQuery('');
      
      if (category === 'all') {
        dispatch(fetchProducts());
      } else {
        dispatch(fetchProductsByCategory(category));
      }
    },
    [dispatch]
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (selectedCategory === 'all') {
        await dispatch(fetchProducts()).unwrap();
      } else {
        await dispatch(fetchProductsByCategory(selectedCategory)).unwrap();
      }
    } catch (err) {
      // Error handled by Redux
    }
    setRefreshing(false);
  }, [dispatch, selectedCategory]);

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetail', { product });
    },
    [navigation]
  );

  if (loading && !refreshing && items.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && items.length === 0) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => dispatch(fetchProducts())}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={handleSearch}
        />
      </View>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => handleProductPress(item)}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default ProductListScreen;
