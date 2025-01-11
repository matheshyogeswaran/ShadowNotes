import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Icons for a modern look
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs'; // File system
import DocumentPicker from 'react-native-document-picker'; // Document picker

const SettingsScreen = () => {
  const { colors } = useTheme();

  // Export Notes
  const exportNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (!savedNotes) {
        Alert.alert('No notes available to export.');
        return;
      }
      const fileName = 'notes.json';
      const filePath =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/${fileName}`
          : `${RNFS.DocumentDirectoryPath}/${fileName}`;
      await RNFS.writeFile(filePath, savedNotes, 'utf8');
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
      await AsyncStorage.setItem('notes', JSON.stringify(importedNotes));
      Alert.alert('Success!', 'Notes imported successfully!');
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User canceled the picker.');
      } else {
        console.error('Failed to import notes:', error);
        Alert.alert('Error', 'Failed to import notes. Ensure the file is valid.');
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.card }]} onPress={exportNotes}>
        <Icon name="upload" size={24} color={colors.iconPrimary} style={styles.icon} />
        <Text style={[styles.buttonText, { color: colors.text }]}>Export Notes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.card }]} onPress={importNotes}>
        <Icon name="download" size={24} color={colors.iconPrimary} style={styles.icon} />
        <Text style={[styles.buttonText, { color: colors.text }]}>Import Notes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default SettingsScreen;
