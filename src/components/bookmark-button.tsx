import React from 'react';
import { Bookmark } from 'phosphor-react-native';
import { Pressable } from '@/components/ui';

type Props = {
  isBookmarked: boolean;
  onPress: () => void;
  variant?: 'overlay' | 'header';
};

export const BookmarkButton = ({ isBookmarked, onPress, variant = 'overlay' }: Props) => {
  if (variant === 'header') {
    return (
      <Pressable onPress={onPress} className="mr-4 p-2">
        <Bookmark
          size={28}
          color="#ffffff"
          weight={isBookmarked ? "fill" : "regular"}
        />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      className="absolute right-3 top-3 rounded-full bg-black/50 p-2"
    >
      <Bookmark
        size={24}
        color="#ffffff"
        weight={isBookmarked ? "fill" : "regular"}
      />
    </Pressable>
  );
};
