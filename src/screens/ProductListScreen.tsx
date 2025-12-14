import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/theme';
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
  const { theme } = useTheme();
  const { items, categories, selectedCategory, loading, error } = useAppSelector(
    (state: RootState) => state.products
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Load products and categories when component mounts
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Reset search when user returns to this screen
  useFocusEffect(
    useCallback(() => {
      // Clear search and show all products when coming back
      if (searchQuery) {
        setSearchQuery('');
        if (selectedCategory === 'all') {
          dispatch(fetchProducts());
        } else {
          dispatch(fetchProductsByCategory(selectedCategory));
        }
      }
    }, [searchQuery, selectedCategory, dispatch])
  );

  // Trigger search when user presses search button or hits enter
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      dispatch(searchProducts(searchQuery));
    } else {
      // If search is empty, restore products based on selected category
      if (selectedCategory === 'all') {
        dispatch(fetchProducts());
      } else {
        dispatch(fetchProductsByCategory(selectedCategory));
      }
    }
  }, [searchQuery, dispatch, selectedCategory]);

  // Handle text change in search bar
  const handleSearchTextChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
      
      // If user clears the search, automatically restore products
      if (text.trim() === '') {
        if (selectedCategory === 'all') {
          dispatch(fetchProducts());
        } else {
          dispatch(fetchProductsByCategory(selectedCategory));
        }
      }
    },
    [dispatch, selectedCategory]
  );

  // Handle category selection
  const handleCategorySelect = useCallback(
    (category: string) => {
      dispatch(setSelectedCategory(category));
      // Clear search when switching categories
      setSearchQuery('');
      
      if (category === 'all') {
        dispatch(fetchProducts());
      } else {
        dispatch(fetchProductsByCategory(category));
      }
    },
    [dispatch]
  );

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // If user is searching, refresh search results
      if (searchQuery.trim()) {
        await dispatch(searchProducts(searchQuery)).unwrap();
      } else if (selectedCategory === 'all') {
        await dispatch(fetchProducts()).unwrap();
      } else {
        await dispatch(fetchProductsByCategory(selectedCategory)).unwrap();
      }
    } catch (error) {
      console.log("Error fetching products: ", error);
    }
    setRefreshing(false);
  }, [dispatch, selectedCategory, searchQuery]);

  // Navigate to product detail screen
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.background }]}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearchTextChange}
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
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No products found</Text>
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
              colors={[theme.primary]}
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
  },
  searchContainer: {
    padding: spacing.md,
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
  },
});

export default ProductListScreen;
