import React, { createContext, useContext, useRef } from 'react';
import { Animated } from 'react-native';

type TabBarContextType = {
  scrollY: Animated.Value;
  lastScrollY: React.MutableRefObject<number>;
  tabBarTranslateY: Animated.Value;
};

const TabBarContext = createContext<TabBarContextType | null>(null);

export function TabBarProvider({ children }: { children: React.ReactNode }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const tabBarTranslateY = useRef(new Animated.Value(0)).current;

  return (
    <TabBarContext.Provider value={{ scrollY, lastScrollY, tabBarTranslateY }}>
      {children}
    </TabBarContext.Provider>
  );
}

export function useTabBar() {
  const context = useContext(TabBarContext);
  if (!context) {
    throw new Error('useTabBar must be used within TabBarProvider');
  }
  return context;
}
