import { observer } from 'mobx-react-lite';
import React from 'react';
import { Alert, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DotsThree, Folder, Plus } from 'phosphor-react-native';

import { useStores } from '@/stores';
import type { Collection } from '@/stores/collection-store';
import { CollectionNameModal } from '@/components/collection-name-modal';
import { Button, FocusAwareStatusBar, Pressable, Text, View } from '@/components/ui';

export default observer(function Collections() {
  const { collection: collectionStore } = useStores();
  const insets = useSafeAreaInsets();
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [editingCollection, setEditingCollection] = React.useState<Collection | null>(null);

  const handleCreateCollection = () => {
    setShowCreateModal(true);
  };

  const handleConfirmCreate = (name: string) => {
    collectionStore.createCollection(name);
    setShowCreateModal(false);
  };

  const handleConfirmRename = (name: string) => {
    if (editingCollection) {
      collectionStore.renameCollection(editingCollection.id, name);
      setEditingCollection(null);
    }
  };

  const handleDeleteCollection = (collection: Collection) => {
    if (collection.name === 'Favourites') {
      Alert.alert('Cannot Delete', 'The Favourites collection cannot be deleted.');
      return;
    }

    Alert.alert(
      'Delete Collection',
      `Are you sure you want to delete "${collection.name}"? This will remove ${collection.articles.length} article(s).`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => collectionStore.deleteCollection(collection.id),
        },
      ]
    );
  };

  const handleCollectionMenu = (collection: Collection) => {
    const actions: any[] = [];

    // Only allow renaming if not Favourites
    if (collection.name !== 'Favourites') {
      actions.push({
        text: 'Rename',
        onPress: () => setEditingCollection(collection),
      });
      actions.push({
        text: 'Delete',
        style: 'destructive',
        onPress: () => handleDeleteCollection(collection),
      });
    }

    actions.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert(collection.name, 'Choose an action', actions);
  };

  return (
    <View className="flex-1 bg-neutral-950" style={{ paddingTop: insets.top }}>
      <FocusAwareStatusBar />

      <View className="border-b border-neutral-700 px-6 py-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-white">Collections</Text>
            <Text className="mt-1 text-sm text-gray-400">
              {collectionStore.collections.length} {collectionStore.collections.length === 1 ? 'collection' : 'collections'}
            </Text>
          </View>
          <Pressable
            onPress={handleCreateCollection}
            className="rounded-full bg-blue-600 p-2"
          >
            <Plus size={24} color="#ffffff" weight="bold" />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={collectionStore.collections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between border-b border-neutral-800 px-6 py-10">
            <View className="flex-1 flex-row items-center">
              <View className="mr-3 rounded-lg bg-blue-600/20 p-3">
                <Folder size={24} color="#3b82f6" weight="fill" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-white">
                  {item.name}
                </Text>
                <Text className="text-sm text-gray-400">
                  {item.articles.length} {item.articles.length === 1 ? 'article' : 'articles'}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => handleCollectionMenu(item)}
              className="ml-3 rounded-full p-1"
            >
              <DotsThree size={20} color="#9ca3af" weight="bold" />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-center text-lg text-gray-400">
              No collections yet.
            </Text>
            <Text className="mt-2 text-center text-sm text-gray-500">
              Create a collection to organize your articles!
            </Text>
          </View>
        }
      />

      <CollectionNameModal
        visible={showCreateModal}
        title="Create Collection"
        onConfirm={handleConfirmCreate}
        onCancel={() => setShowCreateModal(false)}
      />

      <CollectionNameModal
        visible={editingCollection !== null}
        title="Rename Collection"
        initialValue={editingCollection?.name || ''}
        onConfirm={handleConfirmRename}
        onCancel={() => setEditingCollection(null)}
      />
    </View>
  );
});
