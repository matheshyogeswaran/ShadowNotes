import {StyleSheet, Text, View, FlatList,Button} from 'react-native';
import React, { useEffect, useState } from 'react';
import {useTheme} from '@react-navigation/native';
import Header from '../components/Header';
import Card from '../components/Card';
import { fontSize } from '../constants/dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
const HomeScreen = ({ navigation }) => {
    const { colors } = useTheme();
  
    const [notes, setNotes] = useState([]);
  
    // Fetch notes from AsyncStorage
    useEffect(() => {
      const loadNotes = async () => {
        try {
          const savedNotes = await AsyncStorage.getItem('notes');
          if (savedNotes) {
            setNotes(JSON.parse(savedNotes));
          }
        } catch (error) {
          console.error('Failed to load notes:', error);
        }
      };
      const unsubscribe = navigation.addListener('focus', loadNotes); // Reload on focus
      return unsubscribe;
    }, [navigation]);
  
    // Add a new empty note
    const addNote = async () => {
      const newNote = {
        id: Date.now().toString(), // Unique ID
        title: 'New Note',
        description: 'Enter your note here...',
      };
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    };
  
    const styles = StyleSheet.create({
      container: {
        backgroundColor: colors.background,
        padding: 16,
        flex: 1,
      },
      text: {
        color: colors.text,
        fontSize: fontSize.xl,
        marginBottom: 16,
      },
    });
  
    return (
      <View style={styles.container}>
        <Header />
        <Text style={styles.text}>Notes</Text>
  
        {/* Add Note Button */}
        <Button title="Add Note" onPress={addNote} />
  
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card
              title={item.title}
              description={item.description}
              onPress={() => navigation.navigate('Document', { note: item })}
            />
          )}
        />
      </View>
    );
  };
  
  export default HomeScreen;