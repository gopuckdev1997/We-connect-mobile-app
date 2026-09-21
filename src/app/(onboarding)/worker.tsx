import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { User } from "lucide-react-native";

import { ScreenHeader } from "@/common/screenHeader";
import { InputField } from "@/common/InputField";
import { PrimaryButton } from "@/common/PrimaryButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useWorkerStore } from "@/store/useWorkerStore";

export default function WorkerProfile() {
  const router = useRouter();

  const { setProfileData } = useWorkerStore();

  const [fullName, setFullName] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    fullName?.trim() !== "" && experience !== "" && hourlyRate !== "";

  const handleNext = () => {
    if (!isFormValid) return;
    setIsSubmitting(true);

    const payload = {
      fullName,
      experienceInYear: parseInt(experience, 10),
      hourlyRate: parseInt(hourlyRate, 10),
      bio,
    };

    setProfileData(payload);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/(onboarding)/service");
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      {/* 🚨 FIX 1: undefined behavior for Android 🚨 */}
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
      >
        <View>
          <ScreenHeader
            title="Create Helper Profile"
            subtitle="Professional details"
          />

          <View className="mb-8 ml-5 mt-6 flex-row items-center">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {}}
              className="mr-4 h-20 w-20 items-center justify-center rounded-full border border-slate-300 bg-slate-200"
            >
              <User size={32} color="#94A3B8" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="mb-1 font-sans-bold text-[16px] text-slate-900">
                Profile Photo
              </Text>
              <Text className="mb-1 font-sans text-[13px] leading-snug text-slate-500">
                A clear headshot builds high customer trust.
              </Text>
              <TouchableOpacity onPress={() => {}}>
                <Text className="font-sans-bold text-[14px] text-brand-500">
                  Upload Image
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mx-6">
            <InputField
              label="Full name"
              placeholder="Full name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
            <InputField
              label="Years of Experience"
              placeholder="e.g. 5"
              value={experience}
              onChangeText={setExperience}
              keyboardType="number-pad"
              maxLength={2}
            />
            <InputField
              label="Short Bio"
              placeholder="Tell neighbors about your experience, tools, and specialty..."
              value={bio}
              onChangeText={setBio}
              multiline={true}
              numberOfLines={4}
            />
            <InputField
              label="Standard Hourly Rate (₹)"
              placeholder="e.g. 450"
              value={hourlyRate}
              onChangeText={setHourlyRate}
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>

          <View className="mx-6 mt-4">
            <PrimaryButton
              title="Next Setup Service"
              onPress={handleNext}
              disabled={!isFormValid}
              isLoading={isSubmitting}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
