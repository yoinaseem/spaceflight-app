import { Link } from 'expo-router';
import React from 'react';

import { Image, Pressable, Text, View } from '@/components/ui';

type Props = {
  id: number;
  title: string;
  body: string;
  image_url?: string;
};

export const Card = ({ title, body, id, image_url }: Props) => {
  return (
    <Link href={`/feed/${id}` as any} asChild>
      <Pressable>
        <View className="m-2 overflow-hidden rounded-xl  border border-neutral-300 bg-white  dark:bg-neutral-900">
          <Image
            className="h-56 w-full overflow-hidden rounded-t-xl"
            contentFit="cover"
            source={{
              uri: image_url || 'https://via.placeholder.com/800x600?text=No+Image',
            }}
          />

          <View className="p-2">
            <Text className="py-3 text-2xl ">{title}</Text>
            <Text numberOfLines={3} className="leading-snug text-gray-600">
              {body}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};
