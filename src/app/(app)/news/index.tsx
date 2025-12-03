import { FlashList } from '@shopify/flash-list';
import BottomSheet from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RefreshControl, Animated as RNAnimated } from 'react-native';
import { CaretDown } from 'phosphor-react-native';

import type { Article } from '@/api/articles';
import { useArticles } from '@/api/articles';
import { ArticleCard } from '@/components/article-card';
import { CollectionSelectorModal } from '@/components/collection-selector-modal';
import { useStores } from '@/stores';
import { Button, EmptyList, FocusAwareStatusBar, Text, View } from '@/components/ui';
import { Icon } from '@/components/ui/icon';
import { useTabBar } from '@/contexts/tab-bar-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Animated = RNAnimated;

type FilterMode = 'news' | 'following';

const News = observer(() => {
  const { collection: collectionStore, subscriptions } = useStores();
  const [offset, setOffset] = React.useState(0);
  const [allArticles, setAllArticles] = React.useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [filterMode, setFilterMode] = React.useState<FilterMode>('news');
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const limit = 20;

  const { data, isPending, isError, error, refetch } = useArticles({
    variables: { limit, offset }
  });
  const insets = useSafeAreaInsets();
  const { lastScrollY, tabBarTranslateY } = useTabBar();

  const HIDE_THRESHOLD = 100; // Total scroll distance to fully hide
  const SCROLL_START_THRESHOLD = 20; // Don't start hiding until this point
  const accumulatedScroll = React.useRef(0);

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const diff = currentScrollY - lastScrollY.current;

    // Don't do anything if we're at the very top
    if (currentScrollY <= SCROLL_START_THRESHOLD) {
      accumulatedScroll.current = 0;
      tabBarTranslateY.setValue(0);
      lastScrollY.current = currentScrollY;
      return;
    }

    // Accumulate scroll, clamped between 0 and HIDE_THRESHOLD
    accumulatedScroll.current = Math.max(
      0,
      Math.min(HIDE_THRESHOLD, accumulatedScroll.current + diff)
    );

    // Directly set the value - no animation, just follow the finger
    tabBarTranslateY.setValue(accumulatedScroll.current);

    lastScrollY.current = currentScrollY;
  };

  const handleScrollEnd = () => {
    const currentValue = accumulatedScroll.current;
    const shouldHide = currentValue > HIDE_THRESHOLD / 2;

    Animated.spring(tabBarTranslateY, {
      toValue: shouldHide ? HIDE_THRESHOLD : 0,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();

    accumulatedScroll.current = shouldHide ? HIDE_THRESHOLD : 0;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setOffset(0);

    const [_] = await Promise.all([
      refetch(),
      new Promise(resolve => setTimeout(resolve, 1000))
    ]);

    setIsRefreshing(false);
  };

  const handleFilterSelect = (mode: FilterMode) => {
    setFilterMode(mode);
    setOffset(0);
  };

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

  // Separate effect to handle filtering whenever filter mode or subscriptions change
  const displayedArticles = React.useMemo(() => {
    if (filterMode === 'following') {
      return allArticles.filter(article => subscriptions.isFollowing(article.news_site));
    }
    return allArticles;
  }, [allArticles, filterMode, subscriptions.followedSites]);

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
    <View className="flex-1 bg-neutral-950">
      <FocusAwareStatusBar />
      <View style={{ height: insets.top, backgroundColor: '#0a0a0a' }} />

      <Animated.View
        className="border-b border-neutral-700 px-6 py-4"
        style={{
          position: 'absolute',
          top: insets.top,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: '#0a0a0a',
          transform: [
            {
              translateY: tabBarTranslateY.interpolate({
                inputRange: [0, 100],
                outputRange: [0, -(insets.top + 80)],
              }),
            },
          ],
        }}
        pointerEvents="auto"
      >
        <Animated.View
          style={{
            opacity: tabBarTranslateY.interpolate({
              inputRange: [0, 50],
              outputRange: [1, 0],
              extrapolate: 'clamp',
            }),
          }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger className="flex-row items-center">
              <Text className="text-2xl font-bold text-white">
                {filterMode === 'news' ? 'News' : 'Following'}
              </Text>
              <Icon as={CaretDown} size={20} color="#ffffff" weight="bold" className="ml-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-24 mt-4">
              <DropdownMenuRadioGroup value={filterMode} onValueChange={(value) => handleFilterSelect(value as FilterMode)}>
                <DropdownMenuRadioItem value="news">
                  <Text>News</Text>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="following">
                  <Text>Following</Text>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {filterMode === 'following' && (
            <Text className="mt-1 text-sm text-gray-400">
              {subscriptions.followedSites.length} {subscriptions.followedSites.length === 1 ? 'source' : 'sources'}
            </Text>
          )}
        </Animated.View>
      </Animated.View>

      <FlashList
        data={displayedArticles}
        renderItem={renderItem}
        keyExtractor={(_, index) => `item-${index}`}
        ListEmptyComponent={<EmptyList isLoading={isPending} />}
        ListFooterComponent={renderFooter}
        estimatedItemSize={300}
        extraData={collectionStore.collections}
        onScroll={handleScroll}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={8}
        contentContainerStyle={{
          paddingTop: 72,
          paddingBottom: insets.bottom + 90,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
            colors={['#3b82f6']}
            progressViewOffset={insets.top}
          />
        }
      />
      <CollectionSelectorModal article={selectedArticle} bottomSheetRef={bottomSheetRef} />
    </View>
  );
});

export default News;
