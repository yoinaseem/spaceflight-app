/* eslint-disable react/no-unstable-nested-components */
import { Tabs, usePathname } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { User, MagnifyingGlass, House } from 'phosphor-react-native';
import {
  Settings as SettingsIcon,
} from '@/components/ui/icons';
import { TabBarProvider, useTabBar } from '@/contexts/tab-bar-context';

function TabsContent() {
  const { tabBarTranslateY, scrollToTop } = useTabBar();
  const pathname = usePathname();

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
          backgroundColor: '#0a0a0a',
          borderTopColor: '#1f1f1f',
        },
        tabBarInactiveTintColor: '#6b7280',
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
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <House size={24} color={color} weight={focused ? 'fill' : 'regular'} />
          ),
          tabBarButtonTestID: 'home-tab',
        }}
        listeners={{
          tabPress: (e) => {
            if (pathname.startsWith('/news')) {
              e.preventDefault();
              scrollToTop('news');
            }
          },
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MagnifyingGlass size={24} color={color} weight={focused ? 'fill' : 'regular'} />
          ),
          tabBarButtonTestID: 'explore-tab',
        }}
        listeners={{
          tabPress: (e) => {
            if (pathname === '/explore') {
              e.preventDefault();
              scrollToTop('explore');
            }
          },
        }}
      />
      <Tabs.Screen
        name="following"
        options={{
          title: 'Following',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <User size={24} color={color} weight={focused ? 'fill' : 'regular'} />
          ),
          tabBarButtonTestID: 'following-tab',
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
