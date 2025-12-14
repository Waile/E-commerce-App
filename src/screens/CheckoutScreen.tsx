import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { clearCart } from '../store/slices/cartSlice';
import { colors, spacing, borderRadius } from '../theme/colors';
import { CheckoutFormData, CartItem } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CartStackParamList } from '../types/navigation';
import { RootState } from '../store';

type CheckoutScreenNavigationProp = NativeStackNavigationProp<
  CartStackParamList,
  'Checkout'
>;

interface CheckoutScreenProps {
  navigation: CheckoutScreenNavigationProp;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items, totalAmount } = useAppSelector((state: RootState) => state.cart);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    // Simulate order placement
    Alert.alert(
      'Order Placed!',
      `Thank you for your order, ${formData.fullName}!\n\nTotal: $${totalAmount.toFixed(2)}\n\nYour order will be delivered to:\n${formData.address}, ${formData.city} ${formData.zipCode}`,
      [
        {
          text: 'OK',
          onPress: () => {
            dispatch(clearCart());
            navigation.getParent()?.navigate('Products');
          },
        },
      ]
    );
  };

  const updateField = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map((item: CartItem,index) => (
            <View key={item.product.id} style={[styles.orderItem,index===items.length-1&&styles.lastItem]}>
              <Text style={styles.orderItemName} numberOfLines={1}>
                {item.product.title}
              </Text>
              <Text style={styles.orderItemDetails}>
                {item.quantity} × ${item.product.price}
              </Text>
              <Text style={styles.orderItemPrice}>
                ${(item.quantity * item.product.price).toFixed(2)}
              </Text>
            </View>
          ))}
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={[styles.input, errors.fullName && styles.inputError]}
              value={formData.fullName}
              onChangeText={text => updateField('fullName', text)}
              placeholder="John Doe"
              placeholderTextColor={colors.textSecondary}
            />
            {errors.fullName && (
              <Text style={styles.errorText}>{errors.fullName}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={text => updateField('email', text)}
              placeholder="john@example.com"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={formData.phone}
              onChangeText={text => updateField('phone', text)}
              placeholder="1234567890"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.address && styles.inputError]}
              value={formData.address}
              onChangeText={text => updateField('address', text)}
              placeholder="123 Main Street, Apt 4B"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={[styles.input, errors.city && styles.inputError]}
                value={formData.city}
                onChangeText={text => updateField('city', text)}
                placeholder="New York"
                placeholderTextColor={colors.textSecondary}
              />
              {errors.city && (
                <Text style={styles.errorText}>{errors.city}</Text>
              )}
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>ZIP Code *</Text>
              <TextInput
                style={[styles.input, errors.zipCode && styles.inputError]}
                value={formData.zipCode}
                onChangeText={text => updateField('zipCode', text)}
                placeholder="10001"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
              />
              {errors.zipCode && (
                <Text style={styles.errorText}>{errors.zipCode}</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>Place Order</Text>
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
  scrollView: {
    flex: 1,
  },
  section: {
    padding: spacing.md,
    borderBottomWidth: 8,
    borderBottomColor: colors.surface,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastItem:{
    borderBottomWidth:0
  },
  orderItemName: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginRight: spacing.sm,
  },
  orderItemDetails: {
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    minWidth: 60,
    textAlign: 'right',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 2,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  footer: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  placeOrderButton: {
    backgroundColor: colors.success,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  placeOrderText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default CheckoutScreen;
