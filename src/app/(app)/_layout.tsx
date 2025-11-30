/* eslint-disable react/no-unstable-nested-components */
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Folder, User, MagnifyingGlass } from 'phosphor-react-native';
import {
  Feed as FeedIcon,
  Settings as SettingsIcon,
} from '@/components/ui/icons';
import { TabBarProvider, useTabBar } from '@/contexts/tab-bar-context';

function TabsContent() {
  const { tabBarTranslateY } = useTabBar();

  // Create a custom tab bar component that supports animation
  const tabBarComponent = React.useCallback(
    (props: any) => {
      const { BottomTabBar } = require('@react-navigation/bottom-tabs');
      const Animated = require('react-native').Animated;

      return (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            transform: [{ translateY: tabBarTranslateY }],
          }}
        >
          <BottomTabBar {...props} />
        </Animated.View>
      );
    },
    [tabBarTranslateY]
  );

  return (
    <Tabs
      tabBar={tabBarComponent}
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
        name="explore"
        options={{
          title: 'Explore',
          headerShown: false,
          tabBarIcon: ({ color }) => <MagnifyingGlass size={24} color={color} weight="bold" />,
          tabBarButtonTestID: 'explore-tab',
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
        name="following"
        options={{
          title: 'Following',
          headerShown: false,
          tabBarIcon: ({ color }) => <User size={24} color={color} weight="fill" />,
          tabBarButtonTestID: 'following-tab',
        }}
      />
      <Tabs.Screen
        name="style"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null, // Hide from tab bar
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

export default function TabLayout() {
  return (
    <TabBarProvider>
      <TabsContent />
    </TabBarProvider>
  );
}
