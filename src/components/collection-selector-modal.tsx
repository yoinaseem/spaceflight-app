import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Image } from 'react-native';
import { Check, XCircle, Plus } from 'phosphor-react-native';

import type { Article } from '@/api/articles';
import { useStores } from '@/stores';
import { CollectionNameModal } from '@/components/collection-name-modal';
import { Pressable, Text, View } from '@/components/ui';
import { showSuccessMessage } from '@/components/ui/utils';

type Props = {
  article: Article | null;
  bottomSheetRef: React.RefObject<BottomSheet | null>;
};

export const CollectionSelectorModal = observer(({ article, bottomSheetRef }: Props) => {
  const { collection: collectionStore } = useStores();
  const snapPoints = React.useMemo(() => ['50%', '75%'], []);
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const handleCreateNewCollection = () => {
    setShowCreateModal(true);
  };

  const handleConfirmCreate = (name: string) => {
    collectionStore.createCollection(name);
    setShowCreateModal(false);
  };

  const handleSelectCollection = (collectionId: string) => {
    if (!article) return;

    const isInCollection = collectionStore.isArticleInCollection(collectionId, article.id);

    if (isInCollection) {
      collectionStore.removeArticleFromCollection(collectionId, article.id);
      showSuccessMessage('Removed from collection');
    } else {
      collectionStore.addArticleToCollection(collectionId, article);
      showSuccessMessage('Saved successfully!');
    }
  };

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: 'hsl(0, 0%, 12%)' }}
      handleIndicatorStyle={{ backgroundColor: 'hsl(0, 0%, 46%)' }}
    >
      <View className="flex-1 px-4">
        <Text className="mb-4 text-xl font-bold text-white">Save to Collection</Text>

        <Pressable
          onPress={handleCreateNewCollection}
          className="mb-4 flex-row items-center rounded-xl bg-primary-blue/10 p-4"
        >
          <View className="mr-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-blue/20">
            <Plus size={24} color="#0ea5e9" weight="bold" />
          </View>
          <Text className="text-base font-medium text-white">Create New Collection</Text>
        </Pressable>

        <BottomSheetFlatList
          data={collectionStore.collections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          renderItem={({ item }) => {
            const isInCollection = article
              ? collectionStore.isArticleInCollection(item.id, article.id)
              : false;

            const mostRecentArticle = item.articles[0];

            return (
              <Pressable
                onPress={() => handleSelectCollection(item.id)}
                className="mb-3 flex-row items-center justify-between rounded-xl bg-neutral-800 p-4"
              >
                <View className="flex-row items-center flex-1">
                  {mostRecentArticle ? (
                    <Image
                      source={{ uri: mostRecentArticle.image_url }}
                      className="mr-3 h-12 w-12 rounded-lg bg-neutral-700"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="mr-3 h-12 w-12 rounded-lg border border-neutral-700 bg-black" />
                  )}
                  <View className="flex-1">
                    <Text className="text-base font-medium text-white">{item.name}</Text>
                    <Text className="text-sm text-gray-400">
                      {item.articles.length} {item.articles.length === 1 ? 'article' : 'articles'}
                    </Text>
                  </View>
                </View>

                {isInCollection ? (
                  <View className="ml-2 rounded-full bg-primary-blue p-1">
                    <Check size={20} color="#ffffff" weight="bold" />
                  </View>
                ) : (
                  <View className="ml-2 rounded-full border-2 border-gray-600 p-1">
                    <XCircle size={20} color="transparent" weight="bold" />
                  </View>
                )}
              </Pressable>
            );
          }}
        />
      </View>

      <CollectionNameModal
        visible={showCreateModal}
        title="Create Collection"
        onConfirm={handleConfirmCreate}
        onCancel={() => setShowCreateModal(false)}
      />
    </BottomSheet>
  );
});
