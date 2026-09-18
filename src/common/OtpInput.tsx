import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState, useRef, useEffect } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
}

export const OtpInput = ({ length = 4, value, onChange }: OtpInputProps) => {
  const inputRef = useRef<TextInput>(null);

  const [isFocused, setFocused] = useState(false);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      inputRef.current?.focus();
    }, 500); // 500ms allows the sliding animation to complete

    return () => clearTimeout(timerId);
  }, []);

  return (
    <View className="mb-6">
      <Pressable
        className="w-full flex-row justify-between gap-2.5"
        onPress={handlePress}
      >
        {Array(length)
          .fill(0)
          .map((_, index) => {
            const char = value[index] || "";
            const isCurrentFocus = isFocused && value.length === index;
            const isFilled = char !== "";

            return (
              <View
                key={index}
                className={`h-[70px] w-[70px] items-center justify-center rounded-2xl border-2 bg-white
                ${
                  isCurrentFocus
                    ? "border-brand-500"
                    : isFocused
                      ? "border-slate-400"
                      : "border-slate-500"
                }
                `}
              >
                <Text className="mt-1 font-sans-bold text-[32px] text-slate-900">
                  {char}
                </Text>
              </View>
            );
          })}
      </Pressable>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => {
          const cleanText = text.replace(/[^0-9]/g, "");
          console.log(cleanText);
          if (cleanText.length <= length) {
            onChange(cleanText);
          }
        }}
        keyboardType="number-pad"
        maxLength={length}
        onFocus={() => {
          console.log("OTP FOCUS");
          setFocused(true);
        }}
        onBlur={() => {
          console.log("OTP BLUR");
          setFocused(false);
        }}
        // autoFocus={true}
        className="absolute h-full w-full opacity-0"
      />
    </View>
  );
};
