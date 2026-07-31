import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CameraView, useCameraPermissions, type CameraType } from "expo-camera";
import { router } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLanguage } from "../lib/language";
import { Button } from "../components/Button";
import { border, color, hitSlop, motion, radius, shadow, space, type } from "../theme/tokens";

const SHUTTER_SIZE = 76;
const SIDE_BUTTON_SIZE = 48;

export default function ScanScreen() {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [shutterDown, setShutterDown] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission?.granted]);

  const goToCrop = (uri: string) => router.push({ pathname: "/crop", params: { uri } });

  const takePhoto = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8, shutterSound: false });
      if (photo) goToCrop(photo.uri);
    } finally {
      setCapturing(false);
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t.scan.galleryPermission);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      goToCrop(result.assets[0].uri);
    }
  };

  const flipCamera = () => setFacing((current) => (current === "back" ? "front" : "back"));

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={color.onField} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.permissionContainer, { paddingBottom: insets.bottom + space.lg }]}>
        <Text style={[type.bodyMd, styles.permissionText]}>
          {permission.canAskAgain ? t.scan.cameraPermission : t.scan.cameraPermissionBlocked}
        </Text>
        <Button
          variant="primary"
          onPress={permission.canAskAgain ? requestPermission : () => Linking.openSettings()}
        >
          {permission.canAskAgain ? t.scan.grantAccess : t.scan.openSettings}
        </Button>
        <Button variant="ghost" color={color.onFieldMuted} onPress={pickFromGallery}>
          {t.scan.chooseFromGallery}
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing={facing} />
      <View style={styles.dim} pointerEvents="none" />

      {/* No bottom nav on this screen (matches the prototype's full-bleed
          viewfinder) — the Album pill is the only way back to the collection. */}
      <View style={[styles.topRow, { paddingTop: insets.top + 4 }]}>
        <Pressable
          onPress={() => router.push("/collection")}
          style={styles.albumPill}
          accessibilityLabel={t.scan.album}
        >
          <Feather name="grid" size={16} color={color.onField} />
          <Text style={styles.albumPillLabel}>{t.scan.album}</Text>
        </Pressable>
      </View>

      <View style={styles.topSpacer} />

      <View style={styles.hintPill}>
        <Text style={styles.hint}>{t.scan.hint}</Text>
      </View>

      <View style={[styles.controlsRow, { paddingBottom: insets.bottom + space.md }]}>
        <Pressable
          onPress={pickFromGallery}
          hitSlop={hitSlop}
          style={styles.galleryButton}
          accessibilityLabel={t.scan.chooseFromGallery}
        >
          <Feather name="image" size={20} color={color.onField} />
        </Pressable>

        <Pressable
          onPress={takePhoto}
          onPressIn={() => setShutterDown(true)}
          onPressOut={() => setShutterDown(false)}
          hitSlop={hitSlop}
          disabled={capturing}
          accessibilityLabel={t.scan.takePhoto}
          style={[styles.shutter, shutterDown && styles.shutterDown]}
        >
          {/* Bare white disc, per the prototype — no glyph inside. */}
          {capturing && <ActivityIndicator color={color.ink} />}
        </Pressable>

        <Pressable
          onPress={flipCamera}
          hitSlop={hitSlop}
          style={styles.flipButton}
          accessibilityLabel={t.scan.flipCamera}
        >
          <MaterialCommunityIcons name="camera-flip-outline" size={22} color={color.onField} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.canvasField,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.canvasField,
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.canvasField,
    paddingHorizontal: space.lg,
    gap: space.sm,
  },
  permissionText: {
    color: color.onField,
    textAlign: "center",
    marginBottom: space.xs,
  },
  // A flat scrim rather than the design's radial gradient — keeps the
  // overlay controls legible over a bright live feed without pulling in a
  // gradient dependency for one decorative effect.
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,33,27,0.3)",
  },
  topRow: {
    paddingHorizontal: space.md,
  },
  albumPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: space.xxs,
    borderRadius: radius.md,
    backgroundColor: "rgba(23,51,42,0.72)",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  albumPillLabel: {
    ...type.bodySm,
    color: color.onField,
  },
  topSpacer: {
    flex: 1,
  },
  hintPill: {
    alignSelf: "center",
    maxWidth: 300,
    marginBottom: 18,
    borderRadius: radius.md,
    backgroundColor: "rgba(23,51,42,0.72)",
    paddingVertical: 10,
    paddingHorizontal: space.md,
  },
  hint: {
    ...type.bodySm,
    color: color.onField,
    textAlign: "center",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  // Gallery is a rounded square (it stands for a photo); flip is a true circle.
  galleryButton: {
    width: SIDE_BUTTON_SIZE,
    height: SIDE_BUTTON_SIZE,
    borderRadius: radius.sm,
    backgroundColor: color.surfaceFieldElevated,
    borderWidth: border.hairline,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  flipButton: {
    width: SIDE_BUTTON_SIZE,
    height: SIDE_BUTTON_SIZE,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  shutter: {
    width: SHUTTER_SIZE,
    height: SHUTTER_SIZE,
    borderRadius: radius.full,
    backgroundColor: color.onField,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ scale: 1 }],
    ...Platform.select({
      ios: {
        shadowColor: shadow.fieldGlow.color,
        shadowOpacity: 1,
        shadowRadius: shadow.fieldGlow.radius,
        shadowOffset: { width: 0, height: 0 },
      },
      android: { elevation: 8 },
    }),
  },
  shutterDown: {
    transform: [{ scale: motion.pressScale }],
  },
});
