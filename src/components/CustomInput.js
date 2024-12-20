// src/components/CustomInput.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';

const CustomInput = ({
  label,
  value,
  onChangeText,
  error,
  errorText,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        error={error}
        mode="outlined"
        style={[styles.input, style]}
        {...props}
      />
      {error && errorText && (
        <HelperText 
          type="error" 
          visible={error}
        >
          {errorText}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
  },
});

export default CustomInput;
