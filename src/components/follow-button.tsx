import { observer } from 'mobx-react-lite';
import React from 'react';
import { Plus, Check } from 'phosphor-react-native';
import { Alert } from 'react-native';

import { Pressable, Text } from '@/components/ui';
import { useStores } from '@/stores';

type Props = {
  siteName: string;
};

export const FollowButton = observer(({ siteName }: Props) => {
  const { subscriptions } = useStores();
  const isFollowing = subscriptions.isFollowing(siteName);

  const handlePress = () => {
    if (isFollowing) {
      Alert.alert(
        'Unfollow',
        `Would you like to unfollow ${siteName}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Unfollow',
            style: 'destructive',
            onPress: () => subscriptions.unfollowSite(siteName),
          },
        ]
      );
    } else {
      Alert.alert(
        'Follow',
        `Would you like to follow ${siteName}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Follow',
            onPress: () => subscriptions.followSite(siteName),
          },
        ]
      );
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`flex-row items-center gap-1 rounded-full p-1 ${
        isFollowing ? 'bg-green-600' : 'bg-blue-600'
      }`}
    >
      {isFollowing ? (
        <Check size={10} weight="bold" color="#fff" />
      ) : (
        <Plus size={10} weight="bold" color="#fff" />
      )}
      {/* <Text className="text-xs font-semibold text-white">
        {isFollowing ? 'Following' : 'Follow'}
      </Text> */}
    </Pressable>
  );
});
