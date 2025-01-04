import { Tables } from '@/src/libs/database.types';
import { View, Text, FlatList } from 'react-native';

export default function MessageViewer({ messages }: { messages: Tables<'messages'>[] }) {
  const renderItem = ({ item }: { item: Tables<'messages'> }) => (
    <View
      className={`
      ${item.sender_id === 'user-id' ? 'self-end bg-light-info' : 'self-start bg-light-background'}
      rounded-md p-4 mb-8
    `}
    >
      {/* Avatar */}
      {item.sender_id !== 'user-id' && <Text>avatar</Text>}
      {/* Message */}
      <Text className=" text-xl text-light-text dark:text-dark-text">{item.message}</Text>
    </View>
  );

  return (
    <FlatList
      data={messages}
      renderItem={renderItem}
      keyExtractor={(item) => item.uid.toString()}
      scrollEnabled={true}
    />
  );
}
