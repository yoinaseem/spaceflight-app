import React, { createContext, useContext, useRef } from 'react';
import { Animated } from 'react-native';

type ScrollToTopHandler = () => void;

type TabBarContextType = {
  scrollY: Animated.Value;
  lastScrollY: React.MutableRefObject<number>;
  tabBarTranslateY: Animated.Value;
  registerScrollHandler: (routeName: string, handler: ScrollToTopHandler) => void;
  unregisterScrollHandler: (routeName: string) => void;
  scrollToTop: (routeName: string) => void;
};

const TabBarContext = createContext<TabBarContextType | null>(null);

export function TabBarProvider({ children }: { children: React.ReactNode }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const tabBarTranslateY = useRef(new Animated.Value(0)).current;
  const scrollHandlers = useRef<Record<string, ScrollToTopHandler>>({});

  const registerScrollHandler = (routeName: string, handler: ScrollToTopHandler) => {
    scrollHandlers.current[routeName] = handler;
  };

  const unregisterScrollHandler = (routeName: string) => {
    delete scrollHandlers.current[routeName];
  };

  const scrollToTop = (routeName: string) => {
    const handler = scrollHandlers.current[routeName];
    if (handler) {
      handler();
    }
  };

  return (
    <TabBarContext.Provider
      value={{
        scrollY,
        lastScrollY,
        tabBarTranslateY,
        registerScrollHandler,
        unregisterScrollHandler,
        scrollToTop,
      }}
    >
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
