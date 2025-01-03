import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, Image } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { BackgroundView } from '@/src/components';
import { Tables } from '@/src/libs/database.types';
const supabaseUrl = 'https://xyzcompany.supabase.co';
const supabaseAnonKey = 'public-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ChatScreen() {
  const [messages, setMessages] = useState<Tables<'messages'>[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    fetchMessages();
    // const subscription = supabase
    //   .from('messages')
    //   .on('INSERT', (payload) => {
    //     setMessages((prevMessages) => [...prevMessages, payload.new]);
    //   })
    //   .subscribe();

    // return () => {
    //   supabase.removeSubscription(subscription);
    // };
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) console.error(error);
    else setMessages(data as unknown as Tables<'messages'>[]);
  };

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const { error } = await supabase
      .from('messages')
      .insert([{ content: inputText, sender_id: 'user-id' }]);

    if (error) console.error(error);
    else setInputText('');
  };

  const renderItem = ({ item }: { item: Tables<'messages'> }) => (
    <View
      className={`
      ${item.sender_id === 'user-id' ? 'self-end bg-green-100' : 'self-start bg-white'}
      rounded-md p-2 my-1
    `}
    >
      <Text>{item.message}</Text>
    </View>
  );

  return (
    <BackgroundView>
      <View className="flex-1 p-2 pb-32">
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.uid.toString()}
        />
        <View className="flex-row items-center">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message"
            className="flex-1 border border-gray-300 p-2 mb-2"
          />
          <Button title="Send" onPress={sendMessage} />
        </View>
      </View>
    </BackgroundView>
  );
}
