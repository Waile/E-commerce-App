import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { CheckoutFormData } from '../types';

interface DeliveryFormProps {
  formData: CheckoutFormData;
  errors: Partial<CheckoutFormData>;
  onFieldChange: (field: keyof CheckoutFormData, value: string) => void;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({
  formData,
  errors,
  onFieldChange,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Delivery Information</Text>

      {/* Full Name Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={[styles.input, errors.fullName && styles.inputError]}
          value={formData.fullName}
          onChangeText={(text) => onFieldChange('fullName', text)}
          placeholder="John Doe"
          placeholderTextColor={colors.textSecondary}
        />
        {errors.fullName && (
          <Text style={styles.errorText}>{errors.fullName}</Text>
        )}
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={formData.email}
          onChangeText={(text) => onFieldChange('email', text)}
          placeholder="john@gmail.com"
          placeholderTextColor={colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      {/* Phone Number Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          value={formData.phone}
          onChangeText={(text) => onFieldChange('phone', text)}
          placeholder="03456789012"
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>

      {/* Address Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.address && styles.inputError]}
          value={formData.address}
          onChangeText={(text) => onFieldChange('address', text)}
          placeholder="House No. 1, Jinnah Street, Lahore"
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={3}
        />
        {errors.address && (
          <Text style={styles.errorText}>{errors.address}</Text>
        )}
      </View>

      {/* City and ZIP Code Row */}
      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.label}>City *</Text>
          <TextInput
            style={[styles.input, errors.city && styles.inputError]}
            value={formData.city}
            onChangeText={(text) => onFieldChange('city', text)}
            placeholder="Lahore"
            placeholderTextColor={colors.textSecondary}
          />
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
        </View>

        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.label}>ZIP Code *</Text>
          <TextInput
            style={[styles.input, errors.zipCode && styles.inputError]}
            value={formData.zipCode}
            onChangeText={(text) => onFieldChange('zipCode', text)}
            placeholder="54000"
            placeholderTextColor={colors.textSecondary}
            keyboardType="number-pad"
          />
          {errors.zipCode && (
            <Text style={styles.errorText}>{errors.zipCode}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default DeliveryForm;
