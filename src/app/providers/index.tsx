import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Toaster } from 'sonner-native';
import { APIProvider } from '@/api/common/api-provider';
import { StoresProvider } from '@/stores';

const ThemedApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <APIProvider>
      <BottomSheetModalProvider>
        {children}
        <Toaster />
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