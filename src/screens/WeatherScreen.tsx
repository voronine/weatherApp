import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import BottomMenu from '../components/BottomMenu';

type SearchRouteProp = RouteProp<RootStackParamList, 'Search'>;

interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: { temp: number };
}

const WeatherScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<SearchRouteProp>();
  const [city, setCity] = useState<string>(route.params?.city || '');
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSearch = async () => {
    if (!city) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const forecastResponse = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
        params: {
          q: city,
          units: 'metric',
          lang: 'ua',
          appid: '8dff2345b6f97e4edbd99de9405406fc'
        }
      });
      const list: ForecastItem[] = forecastResponse.data.list;
      const grouped: { [date: string]: ForecastItem[] } = {};
      list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(item);
      });
      const dailyForecasts: ForecastItem[] = Object.keys(grouped).map(date => {
        const forecasts = grouped[date];
        const noonForecast = forecasts.find(item => item.dt_txt.includes("12:00:00"));
        return noonForecast || forecasts[0];
      });
      setForecast(dailyForecasts.slice(0, 5));
    } catch (error: any) {
      setErrorMsg('Failed to fetch data. Check API key, city name or rate limits.');
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (route.params?.city) {
      handleSearch();
    } else {
      setCity('');
      setForecast([]);
    }
  }, [route.params?.city]);

  const renderForecastItem = ({ item }: { item: ForecastItem }) => {
    const dayName = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
    const temp = Math.round(item.main.temp);
    return (
      <View style={styles.dayContainer}>
        <Text style={styles.dayText}>{dayName}</Text>
        <Text style={styles.dayTemp}>{temp}°</Text>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback 
      onPress={() => Keyboard.dismiss()} 
      accessible={false}
    >
      <View style={styles.container}>
        <View style={styles.search}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter city name"
              value={city}
              onChangeText={setCity}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity onPress={handleSearch} style={styles.searchIconWrapper}>
            <Text style={{ fontSize: 16 }}>🔍</Text>
          </TouchableOpacity>
        </View>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <View style={styles.listContainer}>
          {forecast.length > 0 && (
            <FlatList
              data={forecast}
              renderItem={renderForecastItem}
              keyExtractor={(item) => item.dt.toString()}
            />
          )}
          {loading && (
            <View style={styles.loaderOverlay}>
              <ActivityIndicator size="large" color="#2699fb" />
            </View>
          )}
        </View>

        <BottomMenu
          active="Search"
          onPressMap={() => {
            setCity('');
            setForecast([]);
            navigation.navigate('Map');
          }}
          onPressSearch={() => {
            setCity('');
            setForecast([]);
            navigation.navigate('Search', { city: '' });
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default WeatherScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    position: 'relative',
    marginTop: 30,
  },
  search: {
    flexDirection: 'row',
  },
  searchContainer: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  input: {
    flex: 1,
    height: '100%',
  },
  searchIconWrapper: {
    height: 40,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2699fb',
    borderRadius: 30,
    marginLeft: 4,
    paddingHorizontal: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
  },
  listContainer: {
    flex: 1,
    marginTop: 32,
    position: 'relative',
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2699fb',
    padding: 12,
    marginVertical: 24,
    borderRadius: 8,
  },
  dayText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  dayTemp: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
