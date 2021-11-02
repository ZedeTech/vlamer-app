import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  HomeScreen,
  SearchScreen,
  ExploreScreen,
  NotificationScreen,
  ProfileScreen,
} from '../../components/screens';

import Header from '../../components/sections/Header';

const HomeStack = createStackNavigator();
export const HomeStackScreen = ({ route }) => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: route.name === 'Home',
        header: (headerProps) => <Header {...headerProps} />,
      }}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
    </HomeStack.Navigator>
  );
};

const SearchStack = createStackNavigator();
export const SearchStackScreen = ({ route }) => {
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerShown: route.name === 'Search',
        header: (headerProps) => <Header {...headerProps} />,
      }}
    >
      <SearchStack.Screen name="Search" component={SearchScreen} />
    </SearchStack.Navigator>
  );
};

const ExploreStack = createStackNavigator();
export const ExploreStackScreen = ({ route }) => {
  return (
    <ExploreStack.Navigator
      screenOptions={{
        headerShown: route.name === 'Explore',
        header: (headerProps) => <Header {...headerProps} />,
      }}
    >
      <ExploreStack.Screen name="Explore" component={ExploreScreen} />
    </ExploreStack.Navigator>
  );
};

const NotificationStack = createStackNavigator();
export const NotificationStackScreen = ({ route }) => {
  return (
    <NotificationStack.Navigator
      screenOptions={{
        headerShown: route.name === 'Notification',
        header: (headerProps) => <Header {...headerProps} />,
      }}
    >
      <NotificationStack.Screen name="Notification" component={NotificationScreen} />
    </NotificationStack.Navigator>
  );
};

const ProfileStack = createStackNavigator();
export const ProfileStackScreen = ({ route }) => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: route.name === 'Profile',
        header: (headerProps) => <Header {...headerProps} />,
      }}
    >
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
};
