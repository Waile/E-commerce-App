import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/colors';
import { CartItem } from '../types';

interface OrderSummaryItemProps {
  item: CartItem;
  isLast: boolean;
}

const OrderSummaryItem: React.FC<OrderSummaryItemProps> = ({ item, isLast }) => {
  const itemTotal = item?.quantity * item?.product?.price;

  return (
    <View style={[styles.orderItem, isLast && styles.lastItem]}>
      <Text style={styles.itemName} numberOfLines={1}>
        {item?.product?.title}
      </Text>
      <Text style={styles.itemDetails}>
        {item?.quantity} × ${item?.product?.price}
      </Text>
      <Text style={styles.itemPrice}>
        ${itemTotal?.toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal:spacing.md,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginRight: spacing.sm,
  },
  itemDetails: {
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    minWidth: 60,
    textAlign: 'right',
  },
});

export default OrderSummaryItem;
