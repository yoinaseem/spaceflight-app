import { FlashList } from '@shopify/flash-list';
import BottomSheet from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Article } from '@/api/articles';
import { useArticles } from '@/api/articles';
import { ArticleCard } from '@/components/article-card';
import { CollectionSelectorModal } from '@/components/collection-selector-modal';
import { useStores } from '@/stores';
import { Button, EmptyList, FocusAwareStatusBar, Text, View } from '@/components/ui';

const News = observer(() => {
  const { collection: collectionStore } = useStores();
  const [offset, setOffset] = React.useState(0);
  const [allArticles, setAllArticles] = React.useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null);
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const limit = 20;

  const { data, isPending, isError, error, refetch } = useArticles({
    variables: { limit, offset }
  });
  const insets = useSafeAreaInsets();

  const handleBookmarkPress = (article: Article) => {
    setSelectedArticle(article);
    bottomSheetRef.current?.expand();
  };

  React.useEffect(() => {
    if (data) {
      if (offset === 0) {
        setAllArticles(data);
      } else {
        setAllArticles((prev) => [...prev, ...data]);
      }
    }
  }, [data, offset]);

  const handleLoadMore = () => {
    setOffset((prev) => prev + limit);
  };

  const renderItem = ({ item }: { item: Article }) => {
    const isInAnyCollection = collectionStore.getCollectionsForArticle(item.id).length > 0;
    return (
      <ArticleCard
        article={item}
        isInAnyCollection={isInAnyCollection}
        onBookmarkPress={handleBookmarkPress}
      />
    );
  };

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-950 p-4">
        <Text className="text-lg font-bold text-white">Error Loading data</Text>
        <Text className="mt-2 text-center text-sm text-gray-400">
          {error?.message || 'Unknown error'}
        </Text>
      </View>
    );
  }

  const renderFooter = () => {
    if (isPending && offset > 0) {
      return (
        <View className="py-4">
          <Text className="text-center text-gray-400">Loading...</Text>
        </View>
      );
    }

    if (data && data.length === limit) {
      return (
        <View className="p-4">
          <Button label="Load More" onPress={handleLoadMore} />
        </View>
      );
    }

    return null;
  };

  return (
    <View className="flex-1 bg-neutral-950" style={{ paddingTop: insets.top }}>
      <FocusAwareStatusBar />
      <FlashList
        data={allArticles}
        renderItem={renderItem}
        keyExtractor={(_, index) => `item-${index}`}
        ListEmptyComponent={<EmptyList isLoading={isPending} />}
        ListFooterComponent={renderFooter}
        estimatedItemSize={300}
        extraData={collectionStore.collections}
      />
      <CollectionSelectorModal article={selectedArticle} bottomSheetRef={bottomSheetRef} />
    </View>
  );
});

export default News;
