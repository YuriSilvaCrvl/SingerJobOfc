// src/components/CustomButton.js
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const CustomButton = ({
  mode = 'contained',
  onPress,
  children,
  style,
  ...props
}) => {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      style={[styles.button, style]}
      {...props}
    >
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    borderRadius: 8,
  },
});

export default CustomButton;

