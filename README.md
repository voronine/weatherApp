# WeatherApp

WeatherApp is a mobile application built with React Native CLI that displays weather forecasts using a weather API. The app provides users with two main ways to access weather information: through an interactive map and by searching for a city.

## Features

- **Interactive Map:**
  - A creatively styled map serves as the main screen.
  - Long-pressing on the map places a marker at the chosen location.
  - Tapping the marker displays the city name and current weather at that location.
  - Tapping on the displayed weather text navigates the user to a detailed weekly forecast screen.

- **City Search:**
  - The "Weather" tab features a search field where users can type in a city name.
  - Upon tapping the "Search" button, the app retrieves and displays the weather forecast for that city using a weather API (e.g., OpenWeatherMap).

## Technologies Used

- **React Native CLI:** Developed without Expo to allow greater control over native components.
- **React Navigation:** Utilizes Native Stack Navigator for seamless screen transitions.
- **react-native-maps:** Used to display the map, handle user gestures, and place markers.
- **Axios:** For making HTTP requests to retrieve weather data.
- **Android Studio:** The app is built and compiled for Android using Android Studio.

## Project Architecture

The application consists of two main screens:

- **MapScreen:**  
  Allows users to interact with a map. A long press on the map sets a marker, and tapping on it displays a callout with the city name and current weather. Tapping the callout navigates to the detailed forecast screen.

- **WeatherScreen:**  
  Provides a search interface for users to enter a city name and view the weather forecast for that location.

A custom bottom navigation component is used to switch between these screens.

