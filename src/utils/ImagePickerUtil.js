// src/utils/ImagePickerUtil.js
import * as ImagePicker from 'expo-image-picker';

class ImagePickerUtil {
  static async pickImage(options = {}) {
    // Solicitar permissão
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Desculpe, precisamos de permissão para acessar a galeria.');
      return null;
    }

    // Abrir seletor de imagem
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      ...options
    });

    if (!result.canceled) {
      return result.assets[0];
    }

    return null;
  }

  static async takePhoto(options = {}) {
    // Solicitar permissão da câmera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Desculpe, precisamos de permissão para acessar a câmera.');
      return null;
    }

    // Abrir câmera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      ...options
    });

    if (!result.canceled) {
      return result.assets[0];
    }

    return null;
  }
}

export default ImagePickerUtil;