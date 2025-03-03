import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from '../screens/MapScreen';
import WeatherScreen from '../screens/WeatherScreen';

export type RootStackParamList = {
  Map: undefined;
  Search: { city?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Search" component={WeatherScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
