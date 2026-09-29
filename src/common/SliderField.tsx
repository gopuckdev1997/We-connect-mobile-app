import { View, Text, LayoutChangeEvent } from "react-native";
import React, { useCallback, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";

interface SliderFieldProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (value: number) => string;
}

const THUMB_SIZE = 24;

// Snaps a raw value to the nearest step and clamps it within [min, max].
const clampToStep = (value: number, min: number, max: number, step: number) => {
  const stepped = Math.round((value - min) / step) * step + min;
  return Math.min(max, Math.max(min, stepped));
};

export const SliderField = ({
  label,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  formatValue = (v) => `${v}`,
}: SliderFieldProps) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const progress = useSharedValue(0);

  // Keep the shared progress in sync whenever the controlled value or track
  // width changes (e.g. parent resets the value, or first layout pass).
  const syncProgress = useCallback(
    (width: number, currentValue: number) => {
      if (width <= 0) return;
      const ratio = (currentValue - min) / (max - min);
      progress.value = Math.min(1, Math.max(0, ratio)) * width;
    },
    [max, min, progress]
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setTrackWidth(width);
    syncProgress(width, value);
  };

  React.useEffect(() => {
    syncProgress(trackWidth, value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, trackWidth]);

  const commitValue = (x: number) => {
    if (trackWidth <= 0) return;
    const ratio = Math.min(1, Math.max(0, x / trackWidth));
    const rawValue = min + ratio * (max - min);
    onValueChange(clampToStep(rawValue, min, max, step));
  };

  const pan = Gesture.Pan()
    .onStart((e) => {
      const clamped = Math.min(trackWidth, Math.max(0, e.x));
      progress.value = clamped;
      runOnJS(commitValue)(clamped);
    })
    .onUpdate((e) => {
      const clamped = Math.min(trackWidth, Math.max(0, e.x));
      progress.value = clamped;
      runOnJS(commitValue)(clamped);
    });

  const fillStyle = useAnimatedStyle(() => ({
    width: progress.value,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value - THUMB_SIZE / 2 }],
  }));

  return (
    <View className="mb-5">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="ml-1 font-sans-bold text-[14px] text-slate-700">
          {label}
        </Text>
        <Text className="mr-1 font-sans-bold text-[14px] text-brand-500">
          {formatValue(value)}
        </Text>
      </View>

      <View className="h-14 justify-center rounded-2xl border border-slate-200 bg-white px-4">
        <GestureDetector gesture={pan}>
          <View
            className="h-8 justify-center"
            onLayout={handleLayout}
            hitSlop={{ top: 12, bottom: 12 }}
          >
            <View
              className="h-1.5 w-full rounded-full bg-slate-200"
              style={{ position: "absolute", top: "50%", marginTop: -3 }}
            />
            <Animated.View
              style={[
                fillStyle,
                { position: "absolute", top: "50%", marginTop: -3, height: 6 },
              ]}
              className="rounded-full bg-brand-500"
            />
            <Animated.View
              style={[
                thumbStyle,
                {
                  position: "absolute",
                  top: "50%",
                  marginTop: -THUMB_SIZE / 2,
                  width: THUMB_SIZE,
                  height: THUMB_SIZE,
                  borderRadius: THUMB_SIZE / 2,
                },
              ]}
              className="border-2 border-brand-500 bg-white shadow-sm"
            />
          </View>
        </GestureDetector>
      </View>
    </View>
  );
};
