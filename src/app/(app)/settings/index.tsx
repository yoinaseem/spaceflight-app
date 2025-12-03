import React from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bookmark } from 'phosphor-react-native';
import { Linking } from 'react-native';
import Constants from 'expo-constants';

import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import {
  colors,
  FocusAwareStatusBar,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { Github, Website } from '@/components/ui/icons';

export default function Settings() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleGitHubPress = () => {
    Linking.openURL('https://github.com/yoinaseem/spaceflight-app');
  };

  const handleAPIPress = () => {
    Linking.openURL('https://www.spaceflightnewsapi.net');
  };

  return (
    <View className="flex-1 bg-neutral-950">
      <FocusAwareStatusBar />
      <ScrollView>
        <View className="flex-1 px-4" style={{ paddingTop: insets.top + 16 }}>
          <Text className="text-xl font-bold text-white">Settings</Text>

          <ItemsContainer title="About">
            <Item text="App Name" value="Spaceflight News" />
            <Item text="Version" value={Constants.expoConfig?.version || '1.0.0'} />
          </ItemsContainer>

          <ItemsContainer title="Collections">
            <Item
              text="Saved"
              icon={<Bookmark color={colors.neutral[500]} weight="fill" />}
              onPress={() => router.push('/(app)/settings/collections')}
            />
          </ItemsContainer>

          <ItemsContainer title="Links">
            <Item
              text="GitHub"
              icon={<Github color={colors.neutral[500]} />}
              onPress={handleGitHubPress}
            />
            <Item
              text="Spaceflight News API"
              icon={<Website color={colors.neutral[500]} />}
              onPress={handleAPIPress}
            />
          </ItemsContainer>
        </View>
      </ScrollView>
    </View>
  );
}
