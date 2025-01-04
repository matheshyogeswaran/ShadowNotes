import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

const DocumentScreen = ({ route }) => {
  const { colors } = useTheme();
  const { note } = route.params; // Get the passed note data

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{note.title}</Text>
      <Text style={[styles.content, { color: colors.text }]}>{note.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default DocumentScreen;
