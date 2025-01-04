import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import {useTheme} from '@react-navigation/native';
import Card from '../components/Card';
import Header from '../components/Header';
import {fontSize} from '../constants/dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import vector icon

const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission Required',
        message: 'App needs access to storage to save files locally.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Permission Denied!', 'Storage permission is required.');
      return false;
    }
  }
  return true;
};

const HomeScreen = ({navigation}) => {
  const {colors} = useTheme();
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
    const unsubscribe = navigation.addListener('focus', loadNotes);
    return unsubscribe;
  }, [navigation]);

  const deleteNote = async id => {
    try {
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Failed to delete note:', error);
      Alert.alert('Error', 'Failed to delete the note.');
    }
  };

  // Add a new note
  const addNote = async () => {
    const newNote = {
      id: Date.now().toString(),
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
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5, // Shadow for Android
    },
    icon: {
      color: '#fff',
    },
  });

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.text}>Notes</Text>

      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Card
            title={item.title}
            description={item.description}
            onPress={() => navigation.navigate('Document', {note: item})}
            onDelete={() => deleteNote(item.id)} // Pass delete handler
          />
        )}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={addNote}>
        <Icon name="add" size={28} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
