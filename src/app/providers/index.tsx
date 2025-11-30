import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import FlashMessage from 'react-native-flash-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { APIProvider } from '@/api/common/api-provider';
import { StoresProvider } from '@/stores';

const ThemedApp = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();

  return (
    <APIProvider>
      <BottomSheetModalProvider>
        {children}
        <FlashMessage
          position="top"
          floating
          style={{
            paddingTop: insets.top + 10,
            alignItems: 'center',
          }}
          titleStyle={{
            fontSize: 14,
            fontWeight: '600',
            textAlign: 'center',
          }}
          textStyle={{
            fontSize: 13,
            textAlign: 'center',
          }}
        />
      </BottomSheetModalProvider>
    </APIProvider>
  );
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: '#0a0a0a' }]}>
      <StoresProvider>
        <ThemedApp>
          {children}
        </ThemedApp>
      </StoresProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});