import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import NowPlayingScreen from '../screens/Nowplayingscreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import UpcomingScreen from '../screens/UpcomingScreen';
import TopRatedScreen from '../screens/TopRatedScreen';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons or any other icon set

const Tab = createBottomTabNavigator();

const BottomTabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          switch (route.name) {
            case 'NowPlaying':
              iconName = 'movie';
              break;
            case 'Popular':
              iconName = 'star';
              break;
            case 'Upcoming':
              iconName = 'schedule';
              break;
            case 'TopRated':
              iconName = 'star-rate';
              break;
            default:
              iconName = 'help'; // Default icon for debugging
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="NowPlaying" component={NowPlayingScreen} />
      <Tab.Screen name="Popular" component={MovieDetailsScreen} />
      <Tab.Screen name="Upcoming" component={UpcomingScreen} />
      <Tab.Screen name="TopRated" component={TopRatedScreen} />
    </Tab.Navigator>
  );
};

// Styles for the screens
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});

export default BottomTabsNavigator;
