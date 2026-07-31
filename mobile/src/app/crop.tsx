import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import * as ImageManipulator from "expo-image-manipulator";

const STAGE_WIDTH = Math.min(Dimensions.get("window").width - 32, 500);
const STAGE_HEIGHT = 420;
const MIN_BOX_SIZE = 48;
const HANDLE_SIZE = 28;

type Rect = { x: number; y: number; w: number; h: number };
type Bounds = { left: number; top: number; right: number; bottom: number };
type Corner = "tl" | "tr" | "bl" | "br";

function clamp(value: number, min: number, max: number) {
  "worklet";
  return Math.min(Math.max(value, min), max);
}

function resizeFromCorner(
  corner: Corner,
  start: Rect,
  translationX: number,
  translationY: number,
  bounds: Bounds,
  minSize: number
) {
  "worklet";
  const movesLeft = corner === "tl" || corner === "bl";
  const movesTop = corner === "tl" || corner === "tr";

  let x = start.x;
  let w = start.w;
  if (movesLeft) {
    const rightEdge = start.x + start.w;
    x = clamp(start.x + translationX, bounds.left, rightEdge - minSize);
    w = rightEdge - x;
  } else {
    w = clamp(start.w + translationX, minSize, bounds.right - start.x);
  }

  let y = start.y;
  let h = start.h;
  if (movesTop) {
    const bottomEdge = start.y + start.h;
    y = clamp(start.y + translationY, bounds.top, bottomEdge - minSize);
    h = bottomEdge - y;
  } else {
    h = clamp(start.h + translationY, minSize, bounds.bottom - start.y);
  }

  return { x, y, w, h };
}

export default function CropScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [cropping, setCropping] = useState(false);

  useEffect(() => {
    if (!uri) return;
    Image.getSize(
      uri,
      (width, height) => setNaturalSize({ width, height }),
      () => setNaturalSize(null)
    );
  }, [uri]);

  if (!uri) {
    return (
      <View style={styles.center}>
        <Text>No image to crop.</Text>
      </View>
    );
  }

  if (!naturalSize) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <CropStage
      uri={uri}
      naturalSize={naturalSize}
      cropping={cropping}
      onConfirm={async (rect) => {
        setCropping(true);
        try {
          const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ crop: rect }],
            { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
          );
          router.push({ pathname: "/result", params: { uri: result.uri } });
        } finally {
          setCropping(false);
        }
      }}
    />
  );
}

function CropStage({
  uri,
  naturalSize,
  cropping,
  onConfirm,
}: {
  uri: string;
  naturalSize: { width: number; height: number };
  cropping: boolean;
  onConfirm: (rect: { originX: number; originY: number; width: number; height: number }) => void;
}) {
  const scale = Math.min(STAGE_WIDTH / naturalSize.width, STAGE_HEIGHT / naturalSize.height);
  const displayWidth = naturalSize.width * scale;
  const displayHeight = naturalSize.height * scale;
  const offsetX = (STAGE_WIDTH - displayWidth) / 2;
  const offsetY = (STAGE_HEIGHT - displayHeight) / 2;

  const bounds: Bounds = {
    left: offsetX,
    top: offsetY,
    right: offsetX + displayWidth,
    bottom: offsetY + displayHeight,
  };

  const initialW = displayWidth * 0.7;
  const initialH = displayHeight * 0.7;

  const boxX = useSharedValue(offsetX + (displayWidth - initialW) / 2);
  const boxY = useSharedValue(offsetY + (displayHeight - initialH) / 2);
  const boxWidth = useSharedValue(initialW);
  const boxHeight = useSharedValue(initialH);

  const bodyStart = useSharedValue({ x: 0, y: 0 });
  const bodyPan = Gesture.Pan()
    .onStart(() => {
      bodyStart.value = { x: boxX.value, y: boxY.value };
    })
    .onUpdate((e) => {
      boxX.value = clamp(bodyStart.value.x + e.translationX, bounds.left, bounds.right - boxWidth.value);
      boxY.value = clamp(bodyStart.value.y + e.translationY, bounds.top, bounds.bottom - boxHeight.value);
    });

  const tlStart = useSharedValue<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const tlPan = Gesture.Pan()
    .onStart(() => {
      tlStart.value = { x: boxX.value, y: boxY.value, w: boxWidth.value, h: boxHeight.value };
    })
    .onUpdate((e) => {
      const rect = resizeFromCorner("tl", tlStart.value, e.translationX, e.translationY, bounds, MIN_BOX_SIZE);
      boxX.value = rect.x;
      boxY.value = rect.y;
      boxWidth.value = rect.w;
      boxHeight.value = rect.h;
    });

  const trStart = useSharedValue<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const trPan = Gesture.Pan()
    .onStart(() => {
      trStart.value = { x: boxX.value, y: boxY.value, w: boxWidth.value, h: boxHeight.value };
    })
    .onUpdate((e) => {
      const rect = resizeFromCorner("tr", trStart.value, e.translationX, e.translationY, bounds, MIN_BOX_SIZE);
      boxX.value = rect.x;
      boxY.value = rect.y;
      boxWidth.value = rect.w;
      boxHeight.value = rect.h;
    });

  const blStart = useSharedValue<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const blPan = Gesture.Pan()
    .onStart(() => {
      blStart.value = { x: boxX.value, y: boxY.value, w: boxWidth.value, h: boxHeight.value };
    })
    .onUpdate((e) => {
      const rect = resizeFromCorner("bl", blStart.value, e.translationX, e.translationY, bounds, MIN_BOX_SIZE);
      boxX.value = rect.x;
      boxY.value = rect.y;
      boxWidth.value = rect.w;
      boxHeight.value = rect.h;
    });

  const brStart = useSharedValue<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const brPan = Gesture.Pan()
    .onStart(() => {
      brStart.value = { x: boxX.value, y: boxY.value, w: boxWidth.value, h: boxHeight.value };
    })
    .onUpdate((e) => {
      const rect = resizeFromCorner("br", brStart.value, e.translationX, e.translationY, bounds, MIN_BOX_SIZE);
      boxX.value = rect.x;
      boxY.value = rect.y;
      boxWidth.value = rect.w;
      boxHeight.value = rect.h;
    });

  const boxStyle = useAnimatedStyle(() => ({
    left: boxX.value,
    top: boxY.value,
    width: boxWidth.value,
    height: boxHeight.value,
  }));

  const topMaskStyle = useAnimatedStyle(() => ({ left: 0, top: 0, width: STAGE_WIDTH, height: boxY.value }));
  const bottomMaskStyle = useAnimatedStyle(() => ({
    left: 0,
    top: boxY.value + boxHeight.value,
    width: STAGE_WIDTH,
    height: STAGE_HEIGHT - (boxY.value + boxHeight.value),
  }));
  const leftMaskStyle = useAnimatedStyle(() => ({
    left: 0,
    top: boxY.value,
    width: boxX.value,
    height: boxHeight.value,
  }));
  const rightMaskStyle = useAnimatedStyle(() => ({
    left: boxX.value + boxWidth.value,
    top: boxY.value,
    width: STAGE_WIDTH - (boxX.value + boxWidth.value),
    height: boxHeight.value,
  }));

  const tlHandleStyle = useAnimatedStyle(() => ({ left: boxX.value - HANDLE_SIZE / 2, top: boxY.value - HANDLE_SIZE / 2 }));
  const trHandleStyle = useAnimatedStyle(() => ({
    left: boxX.value + boxWidth.value - HANDLE_SIZE / 2,
    top: boxY.value - HANDLE_SIZE / 2,
  }));
  const blHandleStyle = useAnimatedStyle(() => ({
    left: boxX.value - HANDLE_SIZE / 2,
    top: boxY.value + boxHeight.value - HANDLE_SIZE / 2,
  }));
  const brHandleStyle = useAnimatedStyle(() => ({
    left: boxX.value + boxWidth.value - HANDLE_SIZE / 2,
    top: boxY.value + boxHeight.value - HANDLE_SIZE / 2,
  }));

  const confirm = () => {
    const originX = clamp((boxX.value - offsetX) / scale, 0, naturalSize.width);
    const originY = clamp((boxY.value - offsetY) / scale, 0, naturalSize.height);
    const width = Math.min(boxWidth.value / scale, naturalSize.width - originX);
    const height = Math.min(boxHeight.value / scale, naturalSize.height - originY);

    onConfirm({
      originX: Math.round(originX),
      originY: Math.round(originY),
      width: Math.round(width),
      height: Math.round(height),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Frame the dog</Text>
      <Text style={styles.subtitle}>Drag the box, resize from the corners</Text>

      <View style={[styles.stage, { width: STAGE_WIDTH, height: STAGE_HEIGHT }]}>
        <Image
          source={{ uri }}
          style={{ position: "absolute", left: offsetX, top: offsetY, width: displayWidth, height: displayHeight }}
        />

        <Animated.View style={[styles.mask, topMaskStyle]} />
        <Animated.View style={[styles.mask, bottomMaskStyle]} />
        <Animated.View style={[styles.mask, leftMaskStyle]} />
        <Animated.View style={[styles.mask, rightMaskStyle]} />

        <GestureDetector gesture={bodyPan}>
          <Animated.View style={[styles.box, boxStyle]} />
        </GestureDetector>

        <GestureDetector gesture={tlPan}>
          <Animated.View style={[styles.handle, tlHandleStyle]} />
        </GestureDetector>
        <GestureDetector gesture={trPan}>
          <Animated.View style={[styles.handle, trHandleStyle]} />
        </GestureDetector>
        <GestureDetector gesture={blPan}>
          <Animated.View style={[styles.handle, blHandleStyle]} />
        </GestureDetector>
        <GestureDetector gesture={brPan}>
          <Animated.View style={[styles.handle, brHandleStyle]} />
        </GestureDetector>
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={confirm} disabled={cropping}>
          {cropping ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Confirm Crop</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "#71807A",
    marginBottom: 8,
  },
  stage: {
    backgroundColor: "#111",
    overflow: "hidden",
  },
  mask: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.5)",
    pointerEvents: "none",
  },
  box: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  handle: {
    position: "absolute",
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#2C5F4F",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  button: {
    backgroundColor: "#2C5F4F",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 140,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  secondaryButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: "#2C5F4F",
  },
  secondaryButtonText: {
    color: "#2C5F4F",
    fontWeight: "600",
  },
});
