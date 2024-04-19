// src/types/types.ts

export interface Stock {
    symbol: string;
    name: string;
  }


import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type RootTabParamList = {
  Plate: undefined;
  Saved: undefined;
};

export type PlateScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Plate'>;

export interface PlateScreenProps {
  navigation: PlateScreenNavigationProp;
}