import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLanguage } from "../lib/language";
import { Button } from "../components/Button";
import { color, hitSlop, radius, shadow, space, type } from "../theme/tokens";

const MIN_BOX_SIZE = 48;
const HANDLE_SIZE = 16;
// Prototype pins handles at -7 from each corner, not a true -8 centre.
const HANDLE_OFFSET = 7;
const HANDLE_HIT_SLOP = (hitSlop - HANDLE_SIZE) / 2;
// S04's spec calls for this exact mask tone — distinct from the celebration
// scrim token, which is a different alpha. The prototype dims the whole photo
// evenly and lets the marigold outline carry the selection, rather than
// punching a brighter hole through the mask.
const CROP_MASK = "rgba(15,33,27,0.5)";
const WATERMARK = "rgba(255,255,255,0.14)";
// Fractions of the frame the initial box covers, matching the prototype's
// 46/46/130/150 insets on its 412-wide phone.
const INITIAL_BOX_W = 0.76;
const INITIAL_BOX_H = 0.68;

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
  const { t } = useLanguage();
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);

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
      <SafeAreaView style={styles.center}>
        <Text style={[type.bodyMd, styles.onFieldText]}>{t.crop.noImage}</Text>
      </SafeAreaView>
    );
  }

  if (!naturalSize) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={color.onField} />
      </SafeAreaView>
    );
  }

  return (
    <CropStage
      uri={uri}
      naturalSize={naturalSize}
      onConfirm={(rect) => {
        // No file is cropped here anymore — the full photo and the box the
        // user drew (in the original image's pixel coordinates) both travel
        // to /result as route params. /result shows a display-only crop and
        // uploads the full image plus this rect; the backend crops before
        // inference.
        router.push({
          pathname: "/result",
          params: {
            uri,
            originX: String(rect.originX),
            originY: String(rect.originY),
            width: String(rect.width),
            height: String(rect.height),
          },
        });
      }}
    />
  );
}

function CropStage({
  uri,
  naturalSize,
  onConfirm,
}: {
  uri: string;
  naturalSize: { width: number; height: number };
  onConfirm: (rect: { originX: number; originY: number; width: number; height: number }) => void;
}) {
  const { t } = useLanguage();
  // The available area is measured rather than hardcoded, then the frame is
  // sized to the photo's own aspect ratio inside it. That way the photo fills
  // the rounded frame edge to edge — the prototype's look — with no letterbox
  // bars, while every pixel stays reachable (a `cover` fit would fill the
  // area too, but would clip the sides of the photo out of the crop entirely).
  const [areaSize, setAreaSize] = useState<{ width: number; height: number } | null>(null);

  const boxX = useSharedValue(0);
  const boxY = useSharedValue(0);
  const boxWidth = useSharedValue(0);
  const boxHeight = useSharedValue(0);

  // The box is seeded here, synchronously, rather than in an effect: the state
  // update below is what first mounts the box and handles, and an effect would
  // not run until after that render had already painted — one frame with every
  // corner collapsed at 0,0 in the top-left. Measuring again with unchanged
  // bounds is also ignored, so a re-layout never throws away a box the user
  // has already dragged.
  const measured = useRef<{ width: number; height: number } | null>(null);
  const onAreaLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width <= 0 || height <= 0) return;
    if (measured.current?.width === width && measured.current?.height === height) return;
    measured.current = { width, height };

    const nextScale = Math.min(width / naturalSize.width, height / naturalSize.height);
    const nextFrameW = naturalSize.width * nextScale;
    const nextFrameH = naturalSize.height * nextScale;
    const nextBoxW = nextFrameW * INITIAL_BOX_W;
    const nextBoxH = nextFrameH * INITIAL_BOX_H;

    boxX.value = (nextFrameW - nextBoxW) / 2;
    boxY.value = (nextFrameH - nextBoxH) / 2;
    boxWidth.value = nextBoxW;
    boxHeight.value = nextBoxH;

    setAreaSize({ width, height });
  };

  const scale = areaSize
    ? Math.min(areaSize.width / naturalSize.width, areaSize.height / naturalSize.height)
    : 1;
  // Frame == displayed photo, so box coordinates are already photo-relative.
  const frameWidth = naturalSize.width * scale;
  const frameHeight = naturalSize.height * scale;

  const bounds: Bounds = { left: 0, top: 0, right: frameWidth, bottom: frameHeight };

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
    .hitSlop(HANDLE_HIT_SLOP)
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
    .hitSlop(HANDLE_HIT_SLOP)
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
    .hitSlop(HANDLE_HIT_SLOP)
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
    .hitSlop(HANDLE_HIT_SLOP)
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

  const tlHandleStyle = useAnimatedStyle(() => ({ left: boxX.value - HANDLE_OFFSET, top: boxY.value - HANDLE_OFFSET }));
  const trHandleStyle = useAnimatedStyle(() => ({
    left: boxX.value + boxWidth.value - HANDLE_OFFSET,
    top: boxY.value - HANDLE_OFFSET,
  }));
  const blHandleStyle = useAnimatedStyle(() => ({
    left: boxX.value - HANDLE_OFFSET,
    top: boxY.value + boxHeight.value - HANDLE_OFFSET,
  }));
  const brHandleStyle = useAnimatedStyle(() => ({
    left: boxX.value + boxWidth.value - HANDLE_OFFSET,
    top: boxY.value + boxHeight.value - HANDLE_OFFSET,
  }));

  const confirm = () => {
    if (!areaSize) return;
    const originX = clamp(boxX.value / scale, 0, naturalSize.width);
    const originY = clamp(boxY.value / scale, 0, naturalSize.height);
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
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <Button variant="ghost" icon="rotate-ccw" color={color.onFieldMuted} onPress={() => router.back()}>
            {t.crop.retake}
          </Button>
        </View>
        <Text style={styles.headerTitle}>{t.crop.title}</Text>
        <View style={styles.headerSide} />
      </View>

      <View style={styles.area} onLayout={onAreaLayout}>
        {areaSize && (
          <View style={[styles.frame, { width: frameWidth, height: frameHeight }]}>
            <Image source={{ uri }} style={StyleSheet.absoluteFill} />
            <View style={styles.dim} pointerEvents="none" />

            <GestureDetector gesture={bodyPan}>
              <Animated.View style={[styles.box, boxStyle]}>
                <View style={styles.watermark} pointerEvents="none">
                  <MaterialCommunityIcons name="dog" size={90} color={WATERMARK} />
                </View>
              </Animated.View>
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
        )}
      </View>

      <View style={styles.footer}>
        <Text style={[type.bodySm, styles.hint]}>{t.crop.hint}</Text>
        <Button variant="primary" fullWidth onPress={confirm} disabled={!areaSize}>
          {t.crop.confirm}
        </Button>
      </View>
    </SafeAreaView>
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
  onFieldText: {
    color: color.onField,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.md,
    paddingTop: space.xxs,
    paddingBottom: 10,
  },
  headerSide: {
    flex: 1,
  },
  headerTitle: {
    ...type.labelUppercase,
    color: color.onFieldMuted,
  },
  area: {
    flex: 1,
    marginHorizontal: space.md,
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: color.canvasField,
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: CROP_MASK,
  },
  box: {
    position: "absolute",
    borderWidth: 1.5,
    borderColor: color.accent,
    borderRadius: 4,
    shadowColor: shadow.fieldGlow.color,
    shadowOpacity: 1,
    shadowRadius: shadow.fieldGlow.radius,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  watermark: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    position: "absolute",
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: 4,
    backgroundColor: color.accent,
  },
  footer: {
    paddingHorizontal: space.md,
    paddingBottom: 20,
    paddingTop: space.md,
    gap: space.sm,
  },
  hint: {
    color: color.onFieldMuted,
    textAlign: "center",
  },
});
