// components/Card.js
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {fontSize} from '../constants/dimensions';

const Card = ({title, description, onPress}) => {
  const {colors} = useTheme(); // Get theme colors

  return (
    <TouchableOpacity
      style={[styles.card, {backgroundColor: colors.card}]}
      onPress={onPress}>
      <Text style={[styles.title, {color: colors.text}]}>{title}</Text>
      <Text
        style={[styles.description, {color: colors.textSecondary}]}
        numberOfLines={2}>
        {description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  description: {
    fontSize: fontSize.md,
    marginTop: 4,
  },
});

export default Card;
