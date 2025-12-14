import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Pressable, StatusBar } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';

import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';

import { useAppSelector } from '../hooks/useAppDispatch';
import CartBadge from '../components/CartBadge';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { borderRadius } from '../theme/theme';
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
  const { theme } = useTheme();

  return (
    <ProductsStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: theme.background,
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
          headerLeft: () => <ThemeToggle />,
          headerRight: () => (
            <Pressable
              style={styles.cartButton}
              onPress={() => navigation.navigate('CartTab')}
            >
              <CartBadge count={cartItemsCount} style={styles.headerBadge} />
              <Feather name="shopping-cart" size={24} color={theme.background} />
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
  const { theme } = useTheme();

  return (
    <CartStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: theme.background,
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
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: theme.border,
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
  const { theme, isDark } = useTheme();

  // Custom navigation theme based on app theme
  const navigationTheme = {
    ...isDark ? DarkTheme : DefaultTheme,
    colors: {
      ...isDark ? DarkTheme.colors : DefaultTheme.colors,
      primary: theme.primary,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
    },
  };

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.primary}
      />
      <NavigationContainer theme={navigationTheme}>
        <TabNavigator />
      </NavigationContainer>
    </>
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
