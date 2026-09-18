import React from "react";
import { TouchableOpacity, ActivityIndicator, Text } from "react-native";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled: boolean;
  isLoading: boolean;
  className?: string;
}

export const PrimaryButton = ({
  title,
  onPress,
  disabled,
  isLoading,
  className = "",
}: PrimaryButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`h-14 w-full items-center  justify-center rounded-2xl
    ${disabled ? "bg-slate-200" : "bg-brand-500"}
     ${className}`}
    >
      {isLoading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text
          className={`font-sans-bold text-[16px] ${disabled ? "text-slate-400" : "text-white"}`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
