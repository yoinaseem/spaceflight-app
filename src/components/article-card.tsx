import { Link } from 'expo-router';
import React from 'react';
import { Bookmark } from 'phosphor-react-native';

import type { Article } from '@/api/articles';
import { Image, Pressable, Text, View } from '@/components/ui';
import { FollowButton } from './follow-button';

type Props = {
  article: Article;
  isInAnyCollection?: boolean;
  onBookmarkPress?: (article: Article) => void;
};

export const ArticleCard = ({ article, isInAnyCollection = false, onBookmarkPress }: Props) => {
  const formattedDate = new Date(article.published_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleBookmarkPress = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkPress?.(article);
  };

  return (
    <Link href={`/news/${article.id}` as any} asChild>
      <Pressable>
        <View className="m-2 overflow-hidden rounded-xl border border-neutral-700 bg-neutral-900">
          <View className="relative">
            <Image
              className="h-56 w-full overflow-hidden rounded-t-xl"
              contentFit="cover"
              source={{
                uri: article.image_url || 'https://via.placeholder.com/800x600?text=No+Image',
              }}
            />
            <Pressable
              onPress={handleBookmarkPress}
              className="absolute right-3 top-3 rounded-full bg-black/50 p-2"
            >
              <Bookmark
                size={24}
                color="#ffffff"
                weight={isInAnyCollection ? "fill" : "regular"}
              />
            </Pressable>
          </View>

          <View className="p-4">
            <View className="mb-2 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Text className="text-sm font-medium text-blue-400">
                  {article.news_site}
                </Text>
                <FollowButton siteName={article.news_site} />
              </View>
              <Text className="text-xs text-gray-400">
                {formattedDate}
              </Text>
            </View>

            <Text className="text-xl font-semibold text-white" numberOfLines={2}>
              {article.title}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};
