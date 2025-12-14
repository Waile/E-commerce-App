import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import { colors, spacing, borderRadius } from '../theme/colors';
import { CartItem } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CartStackParamList } from '../types/navigation';
import { RootState } from '../store';

type CartScreenNavigationProp = NativeStackNavigationProp<
  CartStackParamList,
  'CartList'
>;

interface CartScreenProps {
  navigation: CartScreenNavigationProp;
}

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items, totalAmount, totalItems } = useAppSelector((state: RootState) => state.cart);

  const handleRemove = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemove(productId);
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product.thumbnail }} style={styles.image} />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.product.title}
        </Text>
        <Text style={styles.itemPrice}>${item.product.price}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              handleUpdateQuantity(item.product.id, item.quantity - 1)
            }
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantity}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              handleUpdateQuantity(item.product.id, item.quantity + 1)
            }
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.itemRight}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemove(item.product.id)}
        >
          <Feather name="x" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <Text style={styles.itemTotal}>
          ${(item.product.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="shopping-cart" size={64} color={colors.textSecondary} />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.getParent()?.navigate('Products')}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={item => item.product.id.toString()}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items ({totalItems})</Text>
          <Text style={styles.summaryValue}>${totalAmount.toFixed(2)}</Text>
        </View>
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
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
  listContent: {
    padding: spacing.md,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  itemPrice: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: spacing.md,
    minWidth: 30,
    textAlign: 'center',
  },
  itemRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  removeButton: {
    padding: spacing.xs,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  shopButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  shopButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default CartScreen;
