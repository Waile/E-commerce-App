import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { clearCart } from '../store/slices/cartSlice';
import { colors, spacing, borderRadius } from '../theme/colors';
import { CheckoutFormData, CartItem } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CartStackParamList } from '../types/navigation';
import { RootState } from '../store';
import OrderSummaryItem from '../components/OrderSummaryItem';
import DeliveryForm from '../components/DeliveryForm';
import CustomAlert from '../components/CustomAlert';

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
  
  // Form state management
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  // Validate all form fields before submission
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
    } else if (!/^\d{11,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be at least 11 digits';
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

  // Handle order submission
  const handlePlaceOrder = () => {
    if (!validateForm()) {
      setShowErrorAlert(true);
      return;
    }

    // Show success message and clear cart
    setShowSuccessAlert(true);
  };

  // Navigate back to products after successful order
  const handleOrderSuccess = () => {
    dispatch(clearCart());
    setShowSuccessAlert(false);
    navigation.getParent()?.navigate('Products');
  };

  // Update form field and clear its error
  const updateField = useCallback((field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    setErrors((prev) => {
      if (prev[field]) {
        return { ...prev, [field]: undefined };
      }
      return prev;
    });
  }, []);

  // Render individual order item
  const renderOrderItem = useCallback(
    ({ item, index }: { item: CartItem; index: number }) => (
      <OrderSummaryItem item={item} isLast={index === items.length - 1} />
    ),
    [items.length]
  );

  // Header component for the FlatList
  const listHeader = useMemo(
    () => (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
      </View>
    ),
    []
  );

  // Footer component showing total and delivery form
  const listFooter = useMemo(
    () => (
      <>
        <View style={styles.section}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        <DeliveryForm
          formData={formData}
          errors={errors}
          onFieldChange={updateField}
        />
      </>
    ),
    [formData, errors, totalAmount]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id.toString()}
        renderItem={renderOrderItem}
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Place Order Button */}
      <View style={styles.footer}>
        <Pressable
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderText}>Place Order</Text>
        </Pressable>
      </View>

      {/* Success Alert */}
      <CustomAlert
        visible={showSuccessAlert}
        title="Order Placed!"
        message={`Thank you for your order, ${formData.fullName}!\n\nTotal: $${totalAmount.toFixed(2)}\n\nYour order will be delivered to:\n${formData.address}, ${formData.city} ${formData.zipCode}`}
        buttons={[
          {
            text: 'OK',
            onPress: handleOrderSuccess,
          },
        ]}
        onClose={handleOrderSuccess}
      />

      {/* Validation Error Alert */}
      <CustomAlert
        visible={showErrorAlert}
        title="Validation Error"
        message="Please fill in all required fields correctly."
        buttons={[
          {
            text: 'OK',
            style: 'cancel',
          },
        ]}
        onClose={() => setShowErrorAlert(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    flexGrow: 1,
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
  footer: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  placeOrderButton: {
    backgroundColor: colors.primary,
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
