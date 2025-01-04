import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, Button, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DocumentScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { note } = route.params; // Get the passed note data

  // State for editable content
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);

  // Save the updated note to AsyncStorage
  const saveNote = async () => {
    try {
      // Retrieve existing notes
      const existingNotes = await AsyncStorage.getItem('notes');
      const notes = existingNotes ? JSON.parse(existingNotes) : [];

      // Find and update the current note
      const updatedNotes = notes.map((n) =>
        n.id === note.id ? { ...n, title, description } : n
      );

      // Save updated notes back to AsyncStorage
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      Alert.alert('Saved!', 'Your note has been updated successfully.');

      // Navigate back to the previous screen
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save the note.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Editable Title */}
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        placeholderTextColor={colors.textSecondary}
      />

      {/* Editable Description */}
      <TextInput
        style={[styles.textArea, { color: colors.text }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        placeholderTextColor={colors.textSecondary}
        multiline
      />

      {/* Save Button */}
      <Button title="Save" onPress={saveNote} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  textArea: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    textAlignVertical: 'top',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
});

export default DocumentScreen;
