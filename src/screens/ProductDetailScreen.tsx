import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addToCart } from '../store/slices/cartSlice';
import { colors, spacing, borderRadius } from '../theme/colors';
import { ProductsStackParamList } from '../navigation/AppNavigator';

const { width } = Dimensions.get('window');

type ProductDetailScreenProps = NativeStackScreenProps<ProductsStackParamList, 'ProductDetail'>;

const ProductDetailScreen = ({
  route,
  navigation,
}: ProductDetailScreenProps) => {
  const { product } = route.params;
  const dispatch = useAppDispatch();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    Alert.alert(
      'Added to Cart',
      `${product.title} has been added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        {
          text: 'View Cart',
          onPress: () => navigation.getParent()?.navigate('CartTab'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.images[selectedImageIndex] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          
          {product.images.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailContainer}
            >
              {product.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImageIndex(index)}
                  style={[
                    styles.thumbnail,
                    selectedImageIndex === index && styles.thumbnailSelected,
                  ]}
                >
                  <Image
                    source={{ uri: image }}
                    style={styles.thumbnailImage}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.brand}>{product.brand}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.star}>⭐</Text>
              <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
            </View>
          </View>

          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price}</Text>
            {product.discountPercentage > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  {Math.round(product.discountPercentage)}% OFF
                </Text>
              </View>
            )}
          </View>

          <View style={styles.stockContainer}>
            <Text style={styles.stockLabel}>Availability: </Text>
            <Text
              style={[
                styles.stockValue,
                product.stock > 0 ? styles.inStock : styles.outOfStock,
              ]}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.addButton,
            product.stock === 0 && styles.addButtonDisabled,
          ]}
          onPress={handleAddToCart}
          disabled={product.stock === 0}
        >
          <Text style={styles.addButtonText}>
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    backgroundColor: colors.surface,
  },
  mainImage: {
    width: width,
    height: width,
  },
  thumbnailContainer: {
    padding: spacing.md,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailSelected: {
    borderColor: colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  brand: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 16,
    marginRight: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginRight: spacing.md,
  },
  discountBadge: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  discountText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  stockLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  stockValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  inStock: {
    color: colors.success,
  },
  outOfStock: {
    color: colors.error,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  addButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ProductDetailScreen;
