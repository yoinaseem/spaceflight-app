import { FlashList as NFlashList } from '@shopify/flash-list';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { MagnifyingGlass } from 'phosphor-react-native';

import { Text } from './text';
type Props = {
  isLoading: boolean;
  title?: string;
  description?: string;
};

export const List = NFlashList;

export const EmptyList = React.memo(({ isLoading, title, description }: Props) => {
  return (
    <View className="min-h-[400px] flex-1 items-center justify-center">
      {!isLoading ? (
        <View className="items-center">
          <MagnifyingGlass size={64} color="#6b7280" weight="thin" />
          <Text className="pt-4 text-center text-white">{title || 'No results found'}</Text>
          <Text className="pt-2 text-center text-sm text-gray-400">{description || 'Try a different search term'}</Text>
        </View>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
});
