import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs'; // For local storage
import DocumentPicker from 'react-native-document-picker'; // For importing files
import {useTheme} from '@react-navigation/native';
import Card from '../components/Card';
import Header from '../components/Header';
import {fontSize} from '../constants/dimensions';

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
      // Filter out the deleted note
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);

      // Update AsyncStorage
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

  // Request storage permissions (Android only)
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to storage to save files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const exportNotes = async () => {
    const permissionGranted = await requestStoragePermission();
    if (!permissionGranted) {
      return; // Exit if permission not granted
    }

    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (!savedNotes) {
        Alert.alert('No notes available to export.');
        return;
      }

      const fileName = 'notes.json';
      const filePath =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/${fileName}` // Android: Downloads folder
          : `${RNFS.DocumentDirectoryPath}/${fileName}`; // iOS: Documents folder

      // Write the notes to the file
      await RNFS.writeFile(filePath, savedNotes, 'utf8');

      Alert.alert('Success!', `Notes exported to: ${filePath}`);
    } catch (error) {
      console.error('Failed to export notes:', error);
      Alert.alert('Failed to export notes.');
    }
  };

  // Import notes from local storage
  const importNotes = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      // Read content from the selected file
      const content = await RNFS.readFile(res.uri, 'utf8');
      const importedNotes = JSON.parse(content);

      // Validate the imported content
      if (!Array.isArray(importedNotes)) {
        Alert.alert('Invalid format!', 'Please select a valid notes file.');
        return;
      }

      // Save imported notes to AsyncStorage
      await AsyncStorage.setItem('notes', JSON.stringify(importedNotes));
      setNotes(importedNotes);
      Alert.alert('Success!', 'Notes imported successfully!');
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User canceled the picker.');
      } else {
        console.error('Failed to import notes:', error);
        Alert.alert('Failed to import notes.');
      }
    }
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

      <Button title="Add Note" onPress={addNote} />
      <Button title="Export Notes (Local)" onPress={exportNotes} />
      <Button title="Import Notes (Local)" onPress={importNotes} />

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
    </View>
  );
};

export default HomeScreen;
