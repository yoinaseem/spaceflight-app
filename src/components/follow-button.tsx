import { observer } from 'mobx-react-lite';
import React from 'react';
import { Plus, Check } from 'phosphor-react-native';

import { Pressable, Text } from '@/components/ui';
import { useStores } from '@/stores';
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

type Props = {
  siteName: string;
};

export const FollowButton = observer(({ siteName }: Props) => {
  const { subscriptions } = useStores();
  const isFollowing = subscriptions.isFollowing(siteName);
  const [showConfirm, setShowConfirm] = React.useState<'follow' | 'unfollow' | null>(null);

  const handlePress = () => {
    if (isFollowing) {
      setShowConfirm('unfollow');
    } else {
      setShowConfirm('follow');
    }
  };

  const confirmAction = () => {
    if (showConfirm === 'follow') {
      subscriptions.followSite(siteName);
    } else if (showConfirm === 'unfollow') {
      subscriptions.unfollowSite(siteName);
    }
    setShowConfirm(null);
  };

  return (
    <>
      <Pressable
        onPress={handlePress}
        className={`flex-row items-center gap-1 rounded-full p-1 ${
          isFollowing ? 'bg-green-600' : 'bg-primary-blue'
        }`}
      >
        {isFollowing ? (
          <Check size={10} weight="bold" color="#fff" />
        ) : (
          <Plus size={10} weight="bold" color="#fff" />
        )}
        {/* <Text className="text-xs font-semibold text-white">
          {isFollowing ? 'Following' : 'Follow'}
        </Text> */}
      </Pressable>

      <AlertDialog open={showConfirm !== null} onOpenChange={(open) => !open && setShowConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{showConfirm === 'follow' ? 'Follow' : 'Unfollow'}</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to {showConfirm === 'follow' ? 'follow' : 'unfollow'} {siteName}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onPress={() => setShowConfirm(null)}>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={confirmAction}>
              <Text>{showConfirm === 'follow' ? 'Follow' : 'Unfollow'}</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});
