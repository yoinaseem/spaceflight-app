import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import FlashMessage from 'react-native-flash-message';
import { APIProvider } from '@/api/common/api-provider';
import { StoresProvider } from '@/stores';

const ThemedApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <APIProvider>
      <BottomSheetModalProvider>
        {children}
        <FlashMessage position="top" />
      </BottomSheetModalProvider>
    </APIProvider>
  );
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={styles.container}>
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