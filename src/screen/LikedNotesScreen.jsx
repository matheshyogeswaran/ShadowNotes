import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet,Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from '../components/Card';
import { useTheme } from '@react-navigation/native';

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text>hi</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default LikedNotesScreen;
