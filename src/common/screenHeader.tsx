import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";

interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
}

export const ScreenHeader = ({ title, subtitle }: ScreenHeaderProps) => {
  const router = useRouter();
  return (
    <View className=" flex-row items-center gap-3.5 border-b border-[#E7E5DF] px-6 pb-3 pt-3">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.back()}
        className="mr-4 h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm"
      >
        <ChevronLeft size={24} color="#151F32" />
      </TouchableOpacity>
      <View>
        <Text className="font-sans-bold text-[18px] text-slate-900">
          {title}
        </Text>
        {subtitle && (
          <Text className="font-sans text-[12px] text-slate-500 ">
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};

// <View className=" flex-row items-center gap-3.5 border-b border-[#E7E5DF] px-6 pb-6 pt-3">
//   <View className="ml-1 mt-3 rounded-full border border-[#E7E5DF] bg-white px-2 py-2">
//     <TouchableOpacity activeOpacity={0.5} onPress={() => router.back()}>
//       <ChevronLeft size={28} color="#1F2A22" />
//     </TouchableOpacity>
//   </View>
//   <View className="ml-3">
//     <Text className="font-sans-bold text-[18px] text-slate-900">
//       Verification
//     </Text>
//     <Text className="font-sans text-[12px] text-slate-900">Step 1 of 2</Text>
//   </View>
// </View>;
