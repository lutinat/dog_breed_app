import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

type Prediction = {
  breed: string;
  score: number;
};

type Status = "idle" | "uploading" | "error";

export default function ScanScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePicked = async (result: ImagePicker.ImagePickerResult) => {
    if (result.canceled || result.assets.length === 0) {
      return;
    }
    const asset = result.assets[0];
    setImageUri(asset.uri);
    setPredictions(null);
    setErrorMessage(null);
    await uploadImage(asset.uri);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Camera permission is required to take a photo.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    await handlePicked(result);
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photo library permission is required to pick an image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    await handlePicked(result);
  };

  const uploadImage = async (uri: string) => {
    setStatus("uploading");
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "photo.jpg",
      type: "image/jpeg",
    } as unknown as Blob);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data: { predictions: Prediction[] } = await response.json();
      setPredictions(data.predictions);
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not reach the backend. Is it running and reachable on your network?"
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Scan a dog</Text>

      <View style={styles.buttonRow}>
        <Pressable style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={pickFromGallery}>
          <Text style={styles.buttonText}>Choose from Gallery</Text>
        </Pressable>
      </View>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
      )}

      {status === "uploading" && <ActivityIndicator style={styles.spacing} size="large" />}

      {status === "error" && errorMessage && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}

      {predictions && (
        <View style={styles.spacing}>
          <Text style={styles.resultsTitle}>Predictions</Text>
          {predictions.map((prediction) => (
            <Text key={prediction.breed} style={styles.resultRow}>
              {prediction.breed} — {Math.round(prediction.score * 100)}% match
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
    paddingTop: 80,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    backgroundColor: "#2C5F4F",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  preview: {
    width: 260,
    height: 260,
    borderRadius: 8,
  },
  spacing: {
    marginTop: 16,
    width: "100%",
  },
  error: {
    color: "#C23B34",
    marginTop: 16,
    textAlign: "center",
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  resultRow: {
    fontSize: 16,
    paddingVertical: 4,
  },
});
