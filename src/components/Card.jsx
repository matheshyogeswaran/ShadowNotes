import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {fontSize} from '../constants/dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the Icon

const Card = ({title, description, onPress, onDelete, onLike, liked}) => {
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, {backgroundColor: colors.card}]}
      onPress={onPress}>
      <View style={styles.content}>
        {/* Title and Description */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, {color: colors.text}]}>{title}</Text>
          <Text
            style={[styles.description, {color: colors.textSecondary}]}
            numberOfLines={2}>
            {description}
          </Text>
        </View>

        {/* Like Button */}
        <TouchableOpacity onPress={onLike} style={styles.likeButton}>
          <Icon
            name={liked ? 'favorite' : 'favorite-border'}
            size={24}
            color={liked ? 'red' : 'gray'}
          />
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Icon name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  likeButton: {
    padding: 8,
    marginRight: 8,
  },
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensures the button is aligned to the right
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  description: {
    fontSize: fontSize.md,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8, // Padding for better touch area
  },
});

export default Card;
