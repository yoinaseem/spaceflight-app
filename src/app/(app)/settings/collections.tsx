import { observer } from 'mobx-react-lite';
import React from 'react';
import { FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DotsThree, Plus, CaretLeft } from 'phosphor-react-native';

import { useStores } from '@/stores';
import type { Collection } from '@/stores/collection-store';
import { CollectionNameModal } from '@/components/collection-name-modal';
import { Button, FocusAwareStatusBar, Pressable, Text, View } from '@/components/ui';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default observer(function Collections() {
  const { collection: collectionStore } = useStores();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [editingCollection, setEditingCollection] = React.useState<Collection | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<Collection | null>(null);
  const [showCannotDeleteAlert, setShowCannotDeleteAlert] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleCreateCollection = () => {
    setShowCreateModal(true);
  };

  const handleConfirmCreate = (name: string) => {
    try {
      collectionStore.createCollection(name);
      setShowCreateModal(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create collection');
    }
  };

  const handleConfirmRename = (name: string) => {
    if (editingCollection) {
      try {
        collectionStore.renameCollection(editingCollection.id, name);
        setEditingCollection(null);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to rename collection');
      }
    }
  };

  const handleDeleteCollection = (collection: Collection) => {
    if (collection.name === 'Favourites') {
      setShowCannotDeleteAlert(true);
      return;
    }

    setDeleteConfirm(collection);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      collectionStore.deleteCollection(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };


  return (
    <View className="flex-1 bg-neutral-950" style={{ paddingTop: insets.top }}>
      <FocusAwareStatusBar />

      <View className="border-b border-neutral-700 px-6 py-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center">
            <Pressable onPress={() => router.back()} className="mr-3">
              <CaretLeft size={28} color="#ffffff" weight="bold" />
            </Pressable>
            <View>
              <Text className="text-2xl font-bold text-white">Collections</Text>
              <Text className="mt-1 text-sm text-gray-400">
                {collectionStore.collections.length} {collectionStore.collections.length === 1 ? 'collection' : 'collections'}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={handleCreateCollection}
            className="rounded-full bg-primary-blue p-2"
          >
            <Plus size={24} color="#ffffff" weight="bold" />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={collectionStore.collections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const mostRecentArticle = item.articles[0];
          return (
            <Pressable
              onPress={() => router.push(`/(app)/settings/${item.id}`)}
              className="flex-row items-center justify-between border-b border-neutral-800 px-6 py-10"
            >
              <View className="flex-1 flex-row items-center">
                {mostRecentArticle ? (
                  <Image
                    source={{ uri: mostRecentArticle.image_url }}
                    className="h-16 w-16 rounded-lg bg-neutral-800"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-16 w-16 rounded-lg border border-neutral-700 bg-black" />
                )}
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-semibold text-white">
                    {item.name}
                  </Text>
                  <Text className="mt-1 text-sm text-gray-400">
                    {item.articles.length} {item.articles.length === 1 ? 'article' : 'articles'}
                  </Text>
                </View>
              </View>

              {item.name !== 'Favourites' && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    onPress={(e) => {
                      e.stopPropagation();
                    }}
                    className="ml-3 rounded-full p-1"
                  >
                    <DotsThree size={20} color="#9ca3af" weight="bold" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-32">
                    <DropdownMenuItem onPress={() => setEditingCollection(item)}>
                      <Text>Rename</Text>
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onPress={() => handleDeleteCollection(item)}>
                      <Text>Delete</Text>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </Pressable>
          );
        }}
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

      {/* Cannot Delete Favourites Alert */}
      <AlertDialog open={showCannotDeleteAlert} onOpenChange={setShowCannotDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cannot Delete</AlertDialogTitle>
            <AlertDialogDescription>
              The Favourites collection cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onPress={() => setShowCannotDeleteAlert(false)}>
              <Text>OK</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Collection Confirmation */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm?.name}"? This will remove {deleteConfirm?.articles.length} article(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onPress={() => setDeleteConfirm(null)}>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={confirmDelete}>
              <Text>Delete</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Alert */}
      <AlertDialog open={errorMessage !== null} onOpenChange={(open) => !open && setErrorMessage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onPress={() => setErrorMessage(null)}>
              <Text>OK</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
});
