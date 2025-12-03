import { observer } from 'mobx-react-lite';
import React from 'react';
import { FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'phosphor-react-native';

import { useStores } from '@/stores';
import { FocusAwareStatusBar, Pressable, Text, View } from '@/components/ui';
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

export default observer(function Following() {
  const { subscriptions } = useStores();
  const insets = useSafeAreaInsets();
  const [unfollowConfirm, setUnfollowConfirm] = React.useState<string | null>(null);

  const handleUnfollow = (siteName: string) => {
    setUnfollowConfirm(siteName);
  };

  const confirmUnfollow = () => {
    if (unfollowConfirm) {
      subscriptions.unfollowSite(unfollowConfirm);
      setUnfollowConfirm(null);
    }
  };

  const renderItem = ({ item }: { item: string }) => {
    return (
      <View className="mx-4 mb-4">
        <View className="overflow-hidden rounded-2xl bg-neutral-900/30">
          <View className="flex-row items-center justify-between px-4 py-6">
            <View className="flex-1">
              <Text className="text-base font-bold uppercase tracking-wider text-white">
                {item}
              </Text>
            </View>
            <Pressable
              onPress={() => handleUnfollow(item)}
              className="ml-3 rounded-full bg-neutral-800/50 p-2"
            >
              <X size={16} color="#ffffff" weight="bold" />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-neutral-950" style={{ paddingTop: insets.top }}>
      <FocusAwareStatusBar />
      <View className="border-b border-neutral-700 px-6 py-4">
        <Text className="text-2xl font-bold text-white">Following</Text>
        <Text className="mt-1 text-sm text-gray-400">
          {subscriptions.followedSites.length} {subscriptions.followedSites.length === 1 ? 'site' : 'sites'}
        </Text>
      </View>
      <FlatList
        data={subscriptions.followedSites}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-8">
            <Text className="text-center text-lg text-gray-400">
              No subscriptions yet.
            </Text>
            <Text className="mt-2 text-center text-sm text-gray-500">
              Follow news sites from the News tab!
            </Text>
          </View>
        }
      />

      <AlertDialog open={unfollowConfirm !== null} onOpenChange={(open) => !open && setUnfollowConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unfollow</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to unfollow {unfollowConfirm}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onPress={() => setUnfollowConfirm(null)}>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={confirmUnfollow}>
              <Text>Unfollow</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
});
