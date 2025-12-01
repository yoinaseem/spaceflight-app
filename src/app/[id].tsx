import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Bookmark } from 'phosphor-react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react-lite';

import type { Article } from '@/api/articles';
import { useArticle } from '@/api/articles';
import { CollectionSelectorModal } from '@/components/collection-selector-modal';
import { useStores } from '@/stores';
import {
  ActivityIndicator,
  Button,
  FocusAwareStatusBar,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from '@/components/ui';

function ArticleDetail() {
  const local = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { collection: collectionStore } = useStores();
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const { data, isPending, isError } = useArticle({
    variables: { id: Number(local.id) },
  });

  const handleOpenArticle = React.useCallback(() => {
    if (data?.url) {
      Linking.openURL(data.url);
    }
  }, [data?.url]);

  const handleClose = React.useCallback(() => {
    router.back();
  }, [router]);

  const handleBookmark = React.useCallback(() => {
    if (data) {
      bottomSheetRef.current?.expand();
    }
  }, [data]);

  if (isPending) {
    return (
      <View className="flex-1 justify-center bg-neutral-950 p-3">
        <FocusAwareStatusBar />
        <ActivityIndicator />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 justify-center bg-neutral-950 p-3">
        <FocusAwareStatusBar />
        <Text className="text-center text-white">Error loading article</Text>
      </View>
    );
  }

  const formattedDate = new Date(data.published_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isInAnyCollection = collectionStore.getCollectionsForArticle(data.id).length > 0;

  return (
    <View className="flex-1 bg-neutral-950">
      <FocusAwareStatusBar />
      {/* Custom Header */}
      <View
        className="flex-row items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4"
        style={{ paddingTop: insets.top + 12, paddingBottom: 12 }}
      >
        <Pressable onPress={handleClose} className="p-2">
          <X size={28} color="#ffffff" weight="bold" />
        </Pressable>
        <Pressable onPress={handleBookmark} className="p-2">
          <Bookmark size={28} color="#ffffff" weight={isInAnyCollection ? 'fill' : 'regular'} />
        </Pressable>
      </View>

      <ScrollView className="flex-1">
        <Image
          className="h-64 w-full"
          contentFit="cover"
          source={{
            uri: data.image_url || 'https://via.placeholder.com/800x600?text=No+Image',
          }}
        />

        <View className="p-4">
          <Text className="mb-2 text-sm font-medium text-blue-400">
            {data.news_site}
          </Text>

          <Text className="mb-3 text-2xl font-bold leading-tight text-white">
            {data.title}
          </Text>

          <Text className="mb-4 text-sm text-gray-400">
            {formattedDate}
          </Text>

          <Text className="mb-6 text-base leading-relaxed text-gray-300">
            {data.summary}
          </Text>

          <Button
            label="Read Full Article"
            onPress={handleOpenArticle}
            className="mb-4"
          />

          {data.launches.length > 0 && (
            <View className="mb-4">
              <Text className="mb-2 text-lg font-semibold text-white">Related Launches</Text>
              {data.launches.map((launch, index) => (
                <Text key={index} className="text-sm text-gray-400">
                  • {launch.launch_id}
                </Text>
              ))}
            </View>
          )}

          {data.events.length > 0 && (
            <View className="mb-4">
              <Text className="mb-2 text-lg font-semibold text-white">Related Events</Text>
              {data.events.map((event, index) => (
                <Text key={index} className="text-sm text-gray-400">
                  • Event {event.event_id}
                </Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <CollectionSelectorModal article={data} bottomSheetRef={bottomSheetRef} />
    </View>
  );
}

export default observer(ArticleDetail);
