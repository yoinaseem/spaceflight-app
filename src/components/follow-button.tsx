import { observer } from 'mobx-react-lite';
import React from 'react';
import { Plus, Check } from 'phosphor-react-native';

import { Pressable, Text } from '@/components/ui';
import { useStores } from '@/stores';

type Props = {
  siteName: string;
};

export const FollowButton = observer(({ siteName }: Props) => {
  const { subscriptions } = useStores();
  const isFollowing = subscriptions.isFollowing(siteName);

  const handlePress = () => {
    subscriptions.toggleFollow(siteName);
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`flex-row items-center gap-1 rounded-full px-3 py-1.5 ${
        isFollowing ? 'bg-neutral-700' : 'bg-blue-600'
      }`}
    >
      {isFollowing ? (
        <Check size={14} weight="bold" color="#fff" />
      ) : (
        <Plus size={14} weight="bold" color="#fff" />
      )}
      <Text className="text-xs font-semibold text-white">
        {isFollowing ? 'Following' : 'Follow'}
      </Text>
    </Pressable>
  );
});
