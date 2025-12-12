import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';

import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { loadCartFromStorage } from '../store/slices/cartSlice';
import CartBadge from '../components/CartBadge';
import { colors } from '../theme/colors';
import { RootState } from '../store';
import { Product } from '../types';

export type ProductsStackParamList = {
  ProductList: undefined;
  ProductDetail: { product: Product };
};

export type CartStackParamList = {
  CartList: undefined;
  Checkout: undefined;
};

const ProductsStackNavigator = createNativeStackNavigator<ProductsStackParamList>();
const CartStackNavigator = createNativeStackNavigator<CartStackParamList>();
const Tab = createBottomTabNavigator();

// Products Stack Navigator
const ProductsStack = () => {
  const cartItemsCount = useAppSelector((state: RootState) => state.cart.totalItems);

  return (
    <ProductsStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.background,
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <ProductsStackNavigator.Screen
        name="ProductList"
        component={ProductListScreen}
        options={({ navigation }: { navigation: any }) => ({
          title: 'Products',
          headerRight: () => (
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => navigation.navigate('CartTab')}
            >
              <Icon name="cart-outline" size={24} color={colors.background} />
              <CartBadge count={cartItemsCount} />
            </TouchableOpacity>
          ),
        })}
      />
      <ProductsStackNavigator.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: 'Product Details',
        }}
      />
    </ProductsStackNavigator.Navigator>
  );
};

// Cart Stack Navigator
const CartStack = () => {
  return (
    <CartStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.background,
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <CartStackNavigator.Screen
        name="CartList"
        component={CartScreen}
        options={{ title: 'Shopping Cart' }}
      />
      <CartStackNavigator.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />
    </CartStackNavigator.Navigator>
  );
};

// Bottom Tab Navigator
const TabNavigator = () => {
  const cartItemsCount = useAppSelector((state: RootState) => state.cart.totalItems);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Products"
        component={ProductsStack}
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <Icon name="storefront-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStack}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }: { color: string }) => (
            <View>
              <Icon name="cart-outline" size={24} color={color} />
              <CartBadge count={cartItemsCount} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const dispatch = useAppDispatch();

  // Load cart from AsyncStorage on app start
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          const cartItems = JSON.parse(savedCart);
          dispatch(loadCartFromStorage(cartItems));
        }
      } catch (error) {
        console.log('Error loading cart:', error);
      }
    };

    loadCart();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  cartButton: {
    marginRight: 16,
    position: 'relative',
  },
});

export default AppNavigator;
