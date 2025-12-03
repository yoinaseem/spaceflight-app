import React from 'react';

import { Button, Input, Text, View } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = {
  visible: boolean;
  title: string;
  initialValue?: string;
  onConfirm: (name: string) => void;
  onCancel: () => void;
};

export const CollectionNameModal = ({
  visible,
  title,
  initialValue = '',
  onConfirm,
  onCancel,
}: Props) => {
  const [name, setName] = React.useState(initialValue);

  React.useEffect(() => {
    if (visible) {
      setName(initialValue);
    }
  }, [visible, initialValue]);

  const handleConfirm = () => {
    if (name.trim()) {
      onConfirm(name.trim());
      setName('');
    }
  };

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent style={{ width: 320, maxWidth: '90%' }}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <View className="py-4">
          <Input
            value={name}
            onChangeText={setName}
            placeholder="Enter collection name"
            autoFocus
            onSubmitEditing={handleConfirm}
            style={{ width: '100%' }}
          />
        </View>

        <DialogFooter className="flex-row gap-3">
          <Button onPress={onCancel} variant="secondary" className="flex-1">
            <Text>Cancel</Text>
          </Button>
          <Button onPress={handleConfirm} className="flex-1">
            <Text>Confirm</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
