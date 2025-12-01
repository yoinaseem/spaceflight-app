import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0a0a0a' },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="collections" />
      <Stack.Screen name="[collectionId]" />
    </Stack>
  );
}
