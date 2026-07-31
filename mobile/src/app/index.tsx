import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Link, router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function ScanScreen() {
  const handlePicked = (result: ImagePicker.ImagePickerResult) => {
    if (result.canceled || result.assets.length === 0) {
      return;
    }
    const asset = result.assets[0];
    router.push({ pathname: "/crop", params: { uri: asset.uri } });
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Camera permission is required to take a photo.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    handlePicked(result);
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
    handlePicked(result);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navRow}>
        <Link href="/collection" style={styles.navLink}>
          <Text style={styles.navLinkText}>Collection</Text>
        </Link>
        <Link href="/profile" style={styles.navLink}>
          <Text style={styles.navLinkText}>Profile</Text>
        </Link>
      </View>

      <View style={styles.center}>
        <Text style={styles.title}>Scan a dog</Text>

        <View style={styles.buttonRow}>
          <Pressable style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={pickFromGallery}>
            <Text style={styles.buttonText}>Choose from Gallery</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    paddingTop: 56,
    paddingHorizontal: 20,
  },
  navLink: {
    padding: 4,
  },
  navLinkText: {
    color: "#2C5F4F",
    fontWeight: "600",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
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
});
