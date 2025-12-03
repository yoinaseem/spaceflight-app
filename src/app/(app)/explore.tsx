import { FlashList } from '@shopify/flash-list';
import BottomSheet from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MagnifyingGlass, X } from 'phosphor-react-native';
import { RefreshControl } from 'react-native';

import type { Article } from '@/api/articles';
import { useSearchArticles } from '@/api/articles';
import { ArticleCard } from '@/components/article-card';
import { CollectionSelectorModal } from '@/components/collection-selector-modal';
import { useStores } from '@/stores';
import { Button, EmptyList, FocusAwareStatusBar, Input, Pressable, Text, View } from '@/components/ui';
import { useTabBar } from '@/contexts/tab-bar-context';

const Explore = observer(() => {
  const { collection: collectionStore } = useStores();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const [offset, setOffset] = React.useState(0);
  const [allArticles, setAllArticles] = React.useState<Article[]>([]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null);
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const flashListRef = React.useRef<FlashList<Article>>(null);
  const insets = useSafeAreaInsets();
  const { registerScrollHandler, unregisterScrollHandler } = useTabBar();
  const limit = 20;

  // Register scroll to top handler
  React.useEffect(() => {
    registerScrollHandler('explore', () => {
      flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
    });

    return () => {
      unregisterScrollHandler('explore');
    };
  }, [registerScrollHandler, unregisterScrollHandler]);

  const { data, isPending, refetch } = useSearchArticles({
    variables: { search: debouncedQuery, limit, offset },
    enabled: debouncedQuery.trim().length > 0,
  });

  React.useEffect(() => {
    // Clear results immediately if search is empty
    if (searchQuery.trim().length === 0) {
      setDebouncedQuery('');
      setAllArticles([]);
      setOffset(0);
      return;
    }

    // Debounce search query
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
      setOffset(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  React.useEffect(() => {
    if (data && debouncedQuery.trim().length > 0) {
      if (offset === 0) {
        setAllArticles(data);
      } else {
        setAllArticles((prev) => [...prev, ...data]);
      }
    }
  }, [data, offset, debouncedQuery]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setOffset(0);

    const [_] = await Promise.all([
      refetch(),
      new Promise(resolve => setTimeout(resolve, 1000))
    ]);

    setIsRefreshing(false);
  };

  const handleLoadMore = () => {
    setOffset((prev) => prev + limit);
  };

  const handleBookmarkPress = (article: Article) => {
    setSelectedArticle(article);
    bottomSheetRef.current?.expand();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setAllArticles([]);
    setOffset(0);
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

  const renderFooter = () => {
    if (isPending && offset > 0) {
      return (
        <View className="py-4">
          <Text className="text-center text-gray-400">Loading...</Text>
        </View>
      );
    }

    if (data && data.length === limit && debouncedQuery.length > 0) {
      return (
        <View className="p-4">
          <Button onPress={handleLoadMore}>
            <Text>Load More</Text>
          </Button>
        </View>
      );
    }

    return null;
  };

  return (
    <View className="flex-1 bg-neutral-950" style={{ paddingTop: insets.top }}>
      <FocusAwareStatusBar />

      <View className="border-b border-neutral-700 px-6 py-4">
        <Text className="text-2xl font-bold text-white">Explore</Text>
        <View className="mt-3 flex-row items-center gap-2">
          <View className="absolute left-3 z-10">
            <MagnifyingGlass size={20} color="#9ca3af" weight="bold" />
          </View>
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search articles..."
            className="flex-1 pl-10 pr-10"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={handleClearSearch} className="absolute right-3 rounded-full bg-neutral-700 p-1">
              <X size={16} color="#ffffff" weight="bold" />
            </Pressable>
          )}
        </View>
      </View>

      <FlashList
        ref={flashListRef}
        data={allArticles}
        renderItem={renderItem}
        keyExtractor={(_, index) => `item-${index}`}
        estimatedItemSize={300}
        extraData={collectionStore.collections}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 90,
        }}
        refreshControl={
          debouncedQuery.length > 0 ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#3b82f6"
              colors={['#3b82f6']}
              progressViewOffset={insets.top}
            />
          ) : undefined
        }
        ListEmptyComponent={
          searchQuery.trim().length === 0 ? (
            <View className="flex-1 items-center justify-center p-8">
              <MagnifyingGlass size={64} color="#6b7280" weight="thin" />
              <Text className="mt-4 text-center text-lg text-gray-400">
                Search for articles
              </Text>
              <Text className="mt-2 text-center text-sm text-gray-500">
                Enter keywords to find spaceflight news
              </Text>
            </View>
          ) : (
            <EmptyList isLoading={isPending} />
          )
        }
      />
      <CollectionSelectorModal article={selectedArticle} bottomSheetRef={bottomSheetRef} />
    </View>
  );
});

export default Explore;
