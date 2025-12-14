import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather'

import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';

import { useAppSelector } from '../hooks/useAppDispatch';
import CartBadge from '../components/CartBadge';
import { borderRadius, colors } from '../theme/colors';
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
            <Pressable
              style={styles.cartButton}
              onPress={() => navigation.navigate('CartTab')}
            >
              <CartBadge count={cartItemsCount} style={styles.headerBadge} />
             <Feather name="shopping-cart" size={24} color={colors.background} />
            </Pressable>
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
            <Feather name="shopping-bag" size={24} color={color} />
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
              <Feather name="shopping-cart" size={24} color={color} />
              <CartBadge count={cartItemsCount} style={styles.badgePosition} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  cartButton: {
    marginRight: 10,
    height:43,
    width:43,
    justifyContent:"center",
    alignItems:"center"
  },
  badgePosition:{
    right: -6,
    top: -10
  },
  headerBadge:{
    right: 2,
    top:0,
    minWidth: 14,
    minHeight: 14,
    borderRadius:borderRadius.full
    
  }
});

export default AppNavigator;
