import React, { useState, useEffect } from 'react';
import { Button, Header } from '@/src/components';
import {
  View,
  TextInput,
  FlatList,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { BackgroundView } from '@/src/components';
import { Tables } from '@/src/libs/database.types';
import { borderColor } from '@/src/themes/ColorUtil';
import { SafeAreaView } from 'react-native-safe-area-context';
import MessageViewer from './component/MessagesViewer';
import { useRouter } from 'expo-router';
const supabaseUrl = 'https://xyzcompany.supabase.co';
const supabaseAnonKey = 'public-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Tables<'messages'>[]>([
    {
      uid: '1',
      message: 'Hello',
      sender_id: 'user-id',
      created_at: new Date().toUTCString(),
      is_view: [],
      plan_id: null,
    },
    {
      uid: '2',
      message: 'Hello',
      sender_id: 'user-id',
      created_at: new Date().toUTCString(),
      is_view: [],
      plan_id: null,
    },
    {
      uid: '3',
      message: 'Hello',
      sender_id: 'user-id',
      created_at: new Date().toUTCString(),
      is_view: [],
      plan_id: null,
    },
    {
      uid: '4',
      message: 'Hello',
      sender_id: 'user-id',
      created_at: new Date().toUTCString(),
      is_view: [],
      plan_id: null,
    },
    {
      uid: '5',
      message: 'Hello',
      sender_id: 'other-id',
      created_at: new Date().toUTCString(),
      is_view: [],
      plan_id: null,
    },
  ]);
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
    const body = {
      plan_id: '1',
    };
    const response = await fetch(
      process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL + '/messages/list',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    const { data, error } = await response.json();
    console.log(data);
    if (!response.ok) {
      console.log('Failed to fetch messages');
      console.log(JSON.stringify(error));
      return;
    }

    setMessages((data as unknown as Tables<'messages'>[]) || []);
  };

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const { error } = await supabase
      .from('messages')
      .insert([{ content: inputText, sender_id: 'user-id' }]);

    if (error) console.error(error);
    else setInputText('');
  };

  const renderMessage = () => {
    return (
      <View className="w-full flex flex-row">
        <TextInput
          value={inputText}
          placeholder="Type a message..."
          className={`flex-1 rounded-xl items-center border p-4 text-xl mr-4
                ${borderColor} text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background
                `}
          onChangeText={setInputText}
        />
        <Button theme="theme" text="Send" onPress={sendMessage} />
      </View>
    );
  };

  return (
    <SafeAreaView>
      <BackgroundView>
        <Header
          title="Chat"
          onBack={() => {
            router.back();
          }}
        />
        <View className="flex flex-col justify-between h-full">
          {/* ヘッダー */}
          <View className="flex-1 gap-4">
            {/* メッセージエリア */}
            <View className="p-4 rounded-xl flex-1 mb-4 bg-light-theme dark:bg-dark-theme">
              <MessageViewer messages={messages} />
            </View>
          </View>
          {/* 入力エリア */}
          {Platform.OS === 'ios' ? (
            <KeyboardAvoidingView className="flex w-full" behavior={'padding'}>
              {renderMessage()}
            </KeyboardAvoidingView>
          ) : (
            renderMessage()
          )}
        </View>
      </BackgroundView>
    </SafeAreaView>
  );
}
