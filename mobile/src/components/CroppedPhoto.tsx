import { Image, View, type StyleProp, type ViewStyle } from "react-native";

export type CropRect = { originX: number; originY: number; width: number; height: number };
export type ImageSize = { width: number; height: number };

type Props = {
  uri: string;
  rect: CropRect;
  naturalSize: ImageSize;
  containerWidth: number;
  containerHeight: number;
  style?: StyleProp<ViewStyle>;
};

// There's no cropped file anymore (crop.tsx only records the box the user
// drew) — the full photo is what gets uploaded, so display has to fake the
// crop itself: scale the whole image up until the box exactly covers the
// container, then clip everything outside it.
export function CroppedPhoto({ uri, rect, naturalSize, containerWidth, containerHeight, style }: Props) {
  const coverScale = Math.max(containerWidth / rect.width, containerHeight / rect.height);
  const imageWidth = naturalSize.width * coverScale;
  const imageHeight = naturalSize.height * coverScale;
  const rectCenterX = rect.originX + rect.width / 2;
  const rectCenterY = rect.originY + rect.height / 2;
  const imageLeft = containerWidth / 2 - rectCenterX * coverScale;
  const imageTop = containerHeight / 2 - rectCenterY * coverScale;

  return (
    <View style={[{ width: containerWidth, height: containerHeight, overflow: "hidden" }, style]}>
      <Image
        source={{ uri }}
        style={{ position: "absolute", left: imageLeft, top: imageTop, width: imageWidth, height: imageHeight }}
      />
    </View>
  );
}
