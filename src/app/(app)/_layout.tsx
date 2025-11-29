/* eslint-disable react/no-unstable-nested-components */
import { Link, Tabs } from 'expo-router';
import React from 'react';
import { Folder } from 'phosphor-react-native';

import { Pressable, Text } from '@/components/ui';
import {
  Feed as FeedIcon,
  Settings as SettingsIcon,
  Style as StyleIcon,
  Home as ProfileIcon,
} from '@/components/ui/icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0ea5e9',
        tabBarStyle: {
          backgroundColor: '#1b1e26', 
          borderTopColor: '#1e40af',
        },
        tabBarInactiveTintColor: '#4d5770', 
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: 'News',
          headerShown: false,
          tabBarIcon: ({ color }) => <FeedIcon color={color} />,
          tabBarButtonTestID: 'news-tab',
        }}
      />
      <Tabs.Screen
        name="collections"
        options={{
          title: 'Collections',
          headerShown: false,
          tabBarIcon: ({ color }) => <Folder size={24} color={color} weight="fill" />,
          tabBarButtonTestID: 'collections-tab',
        }}
      />
      <Tabs.Screen
        name="style"
        options={{
          title: 'Style',
          headerShown: false,
          tabBarIcon: ({ color }) => <StyleIcon color={color} />,
          tabBarButtonTestID: 'style-tab',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
          tabBarButtonTestID: 'profile-tab',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  );
}
