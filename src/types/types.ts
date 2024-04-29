// src/types/types.ts

export interface Stock {
    business_predictability: number;
    symbol: string;
    name: string;
    fair_value: string;
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

export type SavedScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Saved'>;

export interface SavedScreenProps {
  navigation: SavedScreenNavigationProp;
}