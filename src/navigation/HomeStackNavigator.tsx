import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/Nowplayingscreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen'; // Add this import if you have a MovieDetailsScreen
import NowPlayingScreen from '../screens/Nowplayingscreen';

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="NowPlaying" component={NowPlayingScreen} />
      <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
