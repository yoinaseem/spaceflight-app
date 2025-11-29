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

      <View className="flex-1 p-4">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-white">Collections</Text>
          <Pressable
            onPress={handleCreateCollection}
            className="rounded-full bg-blue-600 p-2"
          >
            <Plus size={24} color="#ffffff" weight="bold" />
          </Pressable>
        </View>

        <FlatList
          data={collectionStore.collections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mb-3 rounded-xl border border-neutral-700 bg-neutral-800 p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="mr-3 rounded-lg bg-blue-600/20 p-3">
                    <Folder size={24} color="#3b82f6" weight="fill" />
                  </View>
                  <View>
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
                  className="rounded-full p-2"
                >
                  <DotsThree size={24} color="#9ca3af" weight="bold" />
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View className="mt-20 items-center">
              <Folder size={64} color="#6b7280" weight="thin" />
              <Text className="mt-4 text-center text-gray-400">
                No collections yet
              </Text>
            </View>
          }
        />
      </View>

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
