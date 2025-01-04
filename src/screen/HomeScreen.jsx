import {StyleSheet, Text, View, FlatList} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import Header from '../components/Header';
import Card from '../components/Card';
import { fontSize } from '../constants/dimensions';

const HomeScreen = ({navigation}) => {
  const {colors} = useTheme();

  // Sample Notes Data
  const notes = [
    {
      id: '1',
      title: 'Note 1',
      description: 'This is the description for Note 1.',
    },
    {
      id: '2',
      title: 'Note 2',
      description: 'This is the description for Note 2.',
    },
    {
      id: '3',
      title: 'Note 3',
      description: 'This is the description for Note 3.',
    },
  ];

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
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Card
            title={item.title}
            description={item.description}
            onPress={() => navigation.navigate('Document', {note: item})}
          />
        )}
      />
    </View>
  );
};

export default HomeScreen;
