import { View, Text, TextInput, TextInputProps } from "react-native";
import React, { useState } from "react";

interface InputFieldProps extends TextInputProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  containerClassName?: string;
}

export const InputField = ({
  label,
  containerClassName = "",
  multiline,
  ...props
}: InputFieldProps) => {
  const [isFocused, setFocused] = useState(true);

  return (
    <View className={`mb-5 ${containerClassName}`}>
      <Text className={`mb-2 ml-1 font-sans-bold text-[14px] text-slate-700`}>
        {label}
      </Text>
      <View
        className={`rounded-2xl  border bg-white transition-all ${isFocused ? "border-brand-500" : "border-slate-200"} ${multiline ? "min-h-[100px] py-3" : "h-14 justify-center"} `}
      >
        <TextInput
          className={`px-4 font-sans-medium text-[16px] text-slate-900 ${
            multiline ? "flex-1" : ""
          }`}
          placeholderTextColor="#94A3B8"
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          {...props}
        />
      </View>
    </View>
  );
};
