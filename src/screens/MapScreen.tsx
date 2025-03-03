import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, LongPressEvent } from 'react-native-maps';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { customMapStyle } from './MapStyles';
import BottomMenu from '../components/BottomMenu';

interface Coordinate {
  latitude: number;
  longitude: number;
}

const MapScreen: React.FC = () => {
  const navigation = useNavigation<BottomTabNavigationProp<any>>();
  const [marker, setMarker] = useState<Coordinate | null>(null);
  const [cityName, setCityName] = useState('');
  const [countryName, setCountryName] = useState('');
  const [currentWeather, setCurrentWeather] = useState('');
  const [calloutPosition, setCalloutPosition] = useState<{ x: number; y: number } | null>(null);
  const mapRef = useRef<MapView>(null);

  useFocusEffect(
    React.useCallback(() => {
      setMarker(null);
      setCalloutPosition(null);
    }, [])
  );

  const updateCalloutPosition = async () => {
    if (marker && mapRef.current) {
      try {
        const point = await mapRef.current.pointForCoordinate(marker);
        setCalloutPosition(point);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleLongPress = async (e: LongPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const coord = { latitude, longitude };
    setMarker(coord);
    if (mapRef.current) {
      try {
        const point = await mapRef.current.pointForCoordinate(coord);
        setCalloutPosition(point);
      } catch (error) {
        console.error(error);
      }
    }
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          lat: latitude,
          lon: longitude,
          units: 'metric',
          lang: 'ua',
          appid: '8dff2345b6f97e4edbd99de9405406fc'
        }
      });
      if (response.data) {
        const temp = Math.round(response.data.main.temp);
        const sign = temp > 0 ? '+' : '';
        setCurrentWeather(`${sign}${temp}°C`);
        setCityName(response.data.name || '');
        setCountryName(response.data.sys?.country || '');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCalloutPress = () => {
    navigation.navigate('Search', { city: cityName });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        customMapStyle={customMapStyle}
        initialRegion={{
          latitude: 50.4501,
          longitude: 30.5234,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        onLongPress={handleLongPress}
        onRegionChangeComplete={updateCalloutPosition}
      >
        {marker && <Marker coordinate={marker} pinColor="#fb8926" />}
      </MapView>
      {calloutPosition && (
        <View 
          style={[
            styles.customCallout, 
            { left: calloutPosition.x - 75, top: calloutPosition.y - 110 }
          ]}
          pointerEvents="box-none"
        >
          <Text style={styles.calloutTitle} onPress={handleCalloutPress}>
            {cityName}{countryName ? `, ${countryName}` : ''}
          </Text>
          <Text style={styles.calloutSubtitle} onPress={handleCalloutPress}>
            {currentWeather}
          </Text>
        </View>
      )}
      <View style={styles.topLabelContainer}>
        <Text style={styles.topLabel}>Location</Text>
      </View>
      <BottomMenu 
         active="Map"
         onPressMap={() => navigation.navigate('Map')}
         onPressSearch={() => navigation.navigate('Search', { city: '' })}
      />
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  customCallout: { 
    position: 'absolute', 
    backgroundColor: '#fff', 
    padding: 10, 
    borderRadius: 6, 
    borderWidth: 1, 
    borderColor: '#aaa',
  },
  calloutTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  calloutSubtitle: { marginTop: 4, fontSize: 14, color: 'blue' },
  topLabelContainer: { 
    position: 'absolute', 
    top: 60, 
    left: 0, 
    right: 0, 
    alignItems: 'center', 
    zIndex: 999 
  },
  topLabel: { fontSize: 16, fontWeight: '900', color: '#2699fb', textTransform: 'uppercase' },
});
