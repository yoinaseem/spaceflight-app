import React from 'react';
import { Modal as RNModal } from 'react-native';

import { Button, Input, Pressable, Text, View } from '@/components/ui';

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
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50"
        onPress={onCancel}
      >
        <Pressable
          className="w-4/5 rounded-2xl bg-neutral-800 p-6"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="mb-4 text-xl font-bold text-white">{title}</Text>

          <Input
            value={name}
            onChangeText={setName}
            placeholder="Enter collection name"
            autoFocus
            className="mb-4"
            onSubmitEditing={handleConfirm}
          />

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button label="Cancel" onPress={onCancel} variant="secondary" />
            </View>
            <View className="flex-1">
              <Button label="Confirm" onPress={handleConfirm} />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
};
