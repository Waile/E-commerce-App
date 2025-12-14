import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../theme/colors';

interface CartBadgeProps {
  count: number;
  style?:StyleProp<ViewStyle>
}

const CartBadge: React.FC<CartBadgeProps> = ({ count,style }) => {
  if (count === 0) return null;

  return (
    <View style={[styles.badge,style]}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    backgroundColor: colors.badge,
    borderRadius: 10,
    minWidth: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.background,
    fontSize: 11,
    fontWeight: '700',
  },
});

export default CartBadge;
