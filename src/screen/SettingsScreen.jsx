import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs'; // File system
import DocumentPicker from 'react-native-document-picker'; // Document picker

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

const SettingsScreen = () => {
  // Export Notes
  const exportNotes = async () => {
    // const permissionGranted = await requestStoragePermission();
    // if (!permissionGranted) {
    //   return;
    // }

    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (!savedNotes) {
        Alert.alert('No notes available to export.');
        return;
      }

      // Ensure notes are exported with the latest structure
      const notes = JSON.parse(savedNotes);
      if (!Array.isArray(notes)) {
        Alert.alert('Error!', 'Notes data is corrupted.');
        return;
      }

      const fileName = 'notes.json';
      const filePath =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/${fileName}`
          : `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.writeFile(filePath, JSON.stringify(notes), 'utf8');

      Alert.alert('Success!', `Notes exported to: ${filePath}`);
    } catch (error) {
      console.error('Failed to export notes:', error);
      Alert.alert('Failed to export notes.');
    }
  };

  // Import Notes
  const importNotes = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });

      const content = await RNFS.readFile(res.uri, 'utf8');
      const importedNotes = JSON.parse(content);

      if (!Array.isArray(importedNotes)) {
        Alert.alert('Invalid format!', 'Please select a valid notes file.');
        return;
      }

      // Ensure all notes have the "liked" field
      const normalizedNotes = importedNotes.map(note => ({
        ...note,
        liked: note.liked ?? false, // Default to false if "liked" is missing
      }));

      await AsyncStorage.setItem('notes', JSON.stringify(normalizedNotes));
      Alert.alert('Success!', 'Notes imported successfully!');
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User canceled the picker.');
      } else {
        console.error('Failed to import notes:', error);
        Alert.alert(
          'Error',
          'Failed to import notes. Ensure the file is valid.',
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Button title="Export Notes" onPress={exportNotes} />
      <Button title="Import Notes" onPress={importNotes} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default SettingsScreen;
