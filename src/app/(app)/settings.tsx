import React from 'react';
// import { Env } from '@env';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import {
  colors,
  FocusAwareStatusBar,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { Github, Rate, Share, Support, Website } from '@/components/ui/icons';

export default function Settings() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-neutral-950">
      <FocusAwareStatusBar />
      <ScrollView>
        <View className="flex-1 px-4" style={{ paddingTop: insets.top + 16 }}>
          <Text className="text-xl font-bold text-white">Settings</Text>

          <ItemsContainer title="Support">
            <Item
              text="Share App"
              icon={<Share color={colors.neutral[500]} />}
              onPress={() => {}}
            />
            <Item
              text="Rate App"
              icon={<Rate color={colors.neutral[500]} />}
              onPress={() => {}}
            />
            <Item
              text="Get Support"
              icon={<Support color={colors.neutral[500]} />}
              onPress={() => {}}
            />
          </ItemsContainer>

          <ItemsContainer title="Links">
            <Item text="Privacy Policy" onPress={() => {}} />
            <Item text="Terms of Service" onPress={() => {}} />
            <Item
              text="GitHub"
              icon={<Github color={colors.neutral[500]} />}
              onPress={() => {}}
            />
            <Item
              text="Website"
              icon={<Website color={colors.neutral[500]} />}
              onPress={() => {}}
            />
          </ItemsContainer>

          {/* <ItemsContainer title="settings.about">
            <Item text="settings.app_name" value={Env.NAME} />
            <Item text="settings.version" value={Env.VERSION} />
          </ItemsContainer> */}
        </View>
      </ScrollView>
    </View>
  );
}
