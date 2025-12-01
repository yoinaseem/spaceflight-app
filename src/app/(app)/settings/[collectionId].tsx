import { observer } from 'mobx-react-lite';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft } from 'phosphor-react-native';
import { FlatList } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

import type { Article } from '@/api/articles';
import { useStores } from '@/stores';
import { ArticleCardHorizontal } from '@/components/article-card-horizontal';
import { CollectionSelectorModal } from '@/components/collection-selector-modal';
import { Button, FocusAwareStatusBar, Pressable, Text, View } from '@/components/ui';

const ITEMS_PER_PAGE = 20;

export default observer(function CollectionDetail() {
  const { collectionId } = useLocalSearchParams<{ collectionId: string }>();
  const { collection: collectionStore } = useStores();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentPage, setCurrentPage] = React.useState(0);
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null);
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const collection = collectionStore.collections.find((c) => c.id === collectionId);

  if (!collection) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-950">
        <Text className="text-lg text-white">Collection not found</Text>
      </View>
    );
  }

  const totalArticles = collection.articles.length;
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalArticles);
  const paginatedArticles = collection.articles.slice(startIndex, endIndex);
  const totalPages = Math.ceil(totalArticles / ITEMS_PER_PAGE);
  const hasNextPage = currentPage < totalPages - 1;
  const hasPreviousPage = currentPage > 0;

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleBookmarkPress = (article: Article) => {
    setSelectedArticle(article);
    bottomSheetRef.current?.expand();
  };

  return (
    <View className="flex-1 bg-neutral-950" style={{ paddingTop: insets.top }}>
      <FocusAwareStatusBar />

      <View className="border-b border-neutral-700 px-6 py-4">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-3">
            <CaretLeft size={28} color="#ffffff" weight="bold" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-white">{collection.name}</Text>
            <Text className="mt-1 text-sm text-gray-400">
              {totalArticles} {totalArticles === 1 ? 'article' : 'articles'}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={paginatedArticles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isInAnyCollection = collectionStore.getCollectionsForArticle(item.id).length > 0;
          return (
            <ArticleCardHorizontal
              article={item}
              isBookmarked={isInAnyCollection}
              onBookmarkPress={handleBookmarkPress}
            />
          );
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-center text-lg text-gray-400">
              No articles in this collection yet.
            </Text>
            <Text className="mt-2 text-center text-sm text-gray-500">
              Bookmark articles to add them here!
            </Text>
          </View>
        }
        ListFooterComponent={
          totalArticles > ITEMS_PER_PAGE ? (
            <View className="p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-400">
                  Showing {startIndex + 1}-{endIndex} of {totalArticles}
                </Text>
                <Text className="text-sm text-gray-400">
                  Page {currentPage + 1} of {totalPages}
                </Text>
              </View>
              <View className="mt-4 flex-row gap-3">
                {hasPreviousPage && (
                  <View className="flex-1">
                    <Button label="Previous" onPress={handlePreviousPage} />
                  </View>
                )}
                {hasNextPage && (
                  <View className="flex-1">
                    <Button label="Next" onPress={handleNextPage} />
                  </View>
                )}
              </View>
            </View>
          ) : null
        }
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20,
        }}
      />
      <CollectionSelectorModal article={selectedArticle} bottomSheetRef={bottomSheetRef} />
    </View>
  );
});
