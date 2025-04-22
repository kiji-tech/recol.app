import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const articles = [
  {
    id: '1',
    title: 'AIが変える未来の働き方',
    summary: 'AI技術の進化が私たちの働き方にどのような影響を与えるのかを解説します。',
    date: '2024-06-01',
  },
  {
    id: '2',
    title: '気候変動と私たちの生活',
    summary: '地球温暖化が日常生活に及ぼす影響について考察します。',
    date: '2024-05-28',
  },
  {
    id: '3',
    title: '最新スマートフォン徹底比較',
    summary: '2024年最新モデルのスマートフォンを比較レビューします。',
    date: '2024-05-20',
  },
  // ...必要に応じて追加...
];

export default function BlogScreen() {
  return (
    <FlatList
      data={articles}
      renderItem={({ item }) => (
        <View style={styles.articleContainer}> 
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.summary}>{item.summary}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  articleContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summary: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
});
