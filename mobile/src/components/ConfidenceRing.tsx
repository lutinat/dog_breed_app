import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { color } from "../theme/tokens";

type Segment = { pct: number; color: string };

type Props = {
  segments: Segment[];
  size?: number;
  thickness?: number;
  children?: ReactNode;
};

// The segments intentionally don't have to sum to 100 — the remainder is
// drawn in surfaceSunken rather than attributed to a guess the model didn't
// make. Same rule the mix-split screen (S11) states explicitly: don't draw
// certainty the model doesn't have.
export function ConfidenceRing({ segments, size = 196, thickness = 11, children }: Props) {
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  let cumulative = 0;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={color.surfaceSunken} strokeWidth={thickness} fill="none" />
        {segments.map((segment, index) => {
          const length = (segment.pct / 100) * circumference;
          const offset = -((cumulative / 100) * circumference);
          cumulative += segment.pct;
          return (
            <Circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={segment.color}
              strokeWidth={thickness}
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={offset}
              strokeLinecap="butt"
              fill="none"
              rotation={-90}
              origin={`${size / 2}, ${size / 2}`}
            />
          );
        })}
      </Svg>
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <View style={styles.center}>
          <View style={{ width: size - thickness * 2, height: size - thickness * 2, borderRadius: (size - thickness * 2) / 2, overflow: "hidden" }}>
            {children}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
