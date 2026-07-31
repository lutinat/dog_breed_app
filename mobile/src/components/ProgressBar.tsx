import { StyleSheet, View } from "react-native";

import { color, radius } from "../theme/tokens";

type Props = {
  value: number;
  max: number;
};

export function ProgressBar({ value, max }: Props) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    height: 10,
    backgroundColor: color.surfaceSunken,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: color.primary,
    borderRadius: radius.pill,
  },
});
