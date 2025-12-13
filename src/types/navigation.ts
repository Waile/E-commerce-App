import { Product } from './index';

export type RootStackParamList = {
  Products: undefined;
  CartTab: undefined;
};

export type ProductsStackParamList = {
  ProductList: undefined;
  ProductDetail: { product: Product };
};

export type CartStackParamList = {
  CartList: undefined;
  Checkout: undefined;
};
