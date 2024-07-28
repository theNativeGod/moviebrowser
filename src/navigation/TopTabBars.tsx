import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import PopularScreen from '../screens/PopularScreen';
import TopRatedScreen from '../screens/TopRatedScreen';
import UpcomingScreen from '../screens/UpcomingScreen';
import NowPlayingScreen from '../screens/Nowplayingscreen';

const TopTab = createMaterialTopTabNavigator();

const TopTabsNavigator = () => {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontSize: 12},
        tabBarStyle: {backgroundColor: '#f0f0f0'},
        tabBarIndicatorStyle: {backgroundColor: '#0000ff'},
      }}>
      <TopTab.Screen name="NowPlaying" component={NowPlayingScreen} />
      <TopTab.Screen name="Popular" component={PopularScreen} />
      <TopTab.Screen name="Upcoming" component={UpcomingScreen} />
      <TopTab.Screen name="Top Rated" component={TopRatedScreen} />
    </TopTab.Navigator>
  );
};

export default TopTabsNavigator;
