import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, Text, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from '../components/Card';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LikedNotesScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [likedNotes, setLikedNotes] = useState([]);

  // Fetch liked notes from AsyncStorage
  useEffect(() => {
    const loadLikedNotes = async () => {
      try {
        const savedNotes = await AsyncStorage.getItem('notes');
        if (savedNotes) {
          const allNotes = JSON.parse(savedNotes);
          setLikedNotes(allNotes.filter(note => note.liked)); // Filter liked notes
        }
      } catch (error) {
        console.error('Failed to load liked notes:', error);
      }
    };
    const unsubscribe = navigation.addListener('focus', loadLikedNotes);
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.header, { color: colors.text }]}>Liked Notes</Text>
        <FlatList
          data={likedNotes}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Card
              title={item.title}
              description={item.description}
              liked={item.liked}
              onPress={() => navigation.navigate('Document', { note: item })}
              onLike={() => {}} // Prevent likes in the liked screen
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
    marginTop: Platform.OS === 'ios' ? 16 : 0, // Add top margin for iOS devices
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default LikedNotesScreen;
