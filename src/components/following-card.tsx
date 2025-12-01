import { Link } from 'expo-router';
import React from 'react';
import { BlurView } from 'expo-blur';

import type { Article } from '@/api/articles';
import { Image, Pressable, Text, View } from '@/components/ui';
import { BookmarkButton } from './bookmark-button';
import { getAccentColor } from '@/lib/get-accent-color';

type Props = {
  article: Article;
  isInAnyCollection?: boolean;
  onBookmarkPress?: (article: Article) => void;
};

export const FollowingCard = ({ article, isInAnyCollection = false, onBookmarkPress }: Props) => {
  const formattedDate = new Date(article.published_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const accentColor = getAccentColor(article.news_site);

  const handleBookmarkPress = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmarkPress?.(article);
  };

  return (
    <Link href={{ pathname: '/[id]', params: { id: article.id.toString() } }} asChild>
      <Pressable>
        <View className="mx-4 mb-8">
          <View className="overflow-hidden rounded-2xl bg-neutral-900/30 backdrop-blur-xl">
            {/* News site header with accent color */}
            <View className="flex-row items-center justify-between px-4 py-3" style={{ backgroundColor: `${accentColor}20` }}>
              <Text
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: accentColor }}
              >
                {article.news_site}
              </Text>
              <Text className="text-xs" style={{ color: accentColor, opacity: 0.7 }}>
                {formattedDate}
              </Text>
            </View>

            <View className="relative">
              <Image
                className="h-48 w-full"
                contentFit="cover"
                source={{
                  uri: article.image_url || 'https://via.placeholder.com/800x600?text=No+Image',
                }}
              />

              <BookmarkButton
                isBookmarked={isInAnyCollection}
                onPress={handleBookmarkPress}
                variant="overlay"
              />
            </View>

            {/* Title section */}
            <View className="rounded-b-2xl bg-neutral-900/80 px-4 py-4">
              <Text className="text-lg font-bold leading-snug text-white" numberOfLines={3}>
                {article.title}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};
