import React from 'react';
import { BackgroundView, Header } from '../../components';
import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function NotFound() {
  const router = useRouter();
  return (
    <BackgroundView>
      <Header title="NotFound" onBack={() => router.back()} />
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(1000)} style={styles.content}>
          <Animated.View
            entering={FadeInDown.duration(1000).delay(300)}
            style={styles.iconContainer}
          >
            <MaterialIcons name="error-outline" size={120} color="#FF6B6B" />
          </Animated.View>

          <Animated.Text entering={FadeInDown.duration(1000).delay(600)} style={styles.title}>
            404
          </Animated.Text>

          <Animated.Text entering={FadeInDown.duration(1000).delay(900)} style={styles.subtitle}>
            ページが見つかりませんでした
          </Animated.Text>

          <Animated.View entering={FadeInDown.duration(1000).delay(1200)}>
            <Pressable style={styles.button} onPress={() => router.replace('/')}>
              <Text style={styles.buttonText}>ホームに戻る</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
    </BackgroundView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
