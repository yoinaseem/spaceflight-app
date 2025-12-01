import React from 'react';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';
import { Bookmark } from 'phosphor-react-native';

import type { Article } from '@/api/articles';
import { Pressable, Text, View } from '@/components/ui';

type Props = {
  article: Article;
  isBookmarked: boolean;
  onBookmarkPress: (article: Article) => void;
};

export const ArticleCardHorizontal = ({ article, isBookmarked, onBookmarkPress }: Props) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/${article.id}`);
  };

  const handleBookmark = (e: any) => {
    e.stopPropagation();
    onBookmarkPress(article);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center border-b border-neutral-800 bg-neutral-950 p-4"
    >
      <Image
        source={{ uri: article.image_url }}
        className="h-20 w-20 rounded-lg bg-neutral-800"
        resizeMode="cover"
      />
      <View className="ml-4 flex-1 justify-center">
        <Text className="text-base font-semibold text-white" numberOfLines={3}>
          {article.title}
        </Text>
      </View>
      <Pressable onPress={handleBookmark} className="ml-3 p-2">
        <Bookmark size={24} color="#ffffff" weight={isBookmarked ? 'fill' : 'regular'} />
      </Pressable>
    </Pressable>
  );
};
