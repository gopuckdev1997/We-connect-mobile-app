import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/common/screenHeader";
import { InputField } from "@/common/InputField";
import { PrimaryButton } from "@/common/PrimaryButton";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Droplet, Zap, Wrench, MapPin } from "lucide-react-native";
import { useState } from "react";
import { useWorkerStore } from "@/store/useWorkerStore";

// Mocking the Category table from your database
const MOCK_CATEGORIES = [
  { id: 1, name: "Plumbing", icon: Droplet, color: "#0284C7", bg: "#F0F9FF" },
  { id: 2, name: "Electrical", icon: Zap, color: "#D97706", bg: "#FEF3C7" },
  { id: 3, name: "Handyman", icon: Wrench, color: "#475569", bg: "#F1F5F9" },
];

export default function SetupSerive() {
  const router = useRouter();
  const { resetProfileState, fullName, experienceInYear, bio, hourlyRate } =
    useWorkerStore();
  // State mapping to Category and Address/preferredLocationRange models
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [pincode, setPincode] = useState("");
  const [travelRadius, setTravelRadius] = useState("5");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    selectedCategoryId !== null && pincode.length === 6 && travelRadius !== "";

  console.log({ fullName });

  const handleCompleteProfile = () => {
    if (!isFormValid) return;
    setIsSubmitting(true);

    // In a real app, you would combine the data from `worker.tsx` with this data
    // using a global state manager (like Zustand) and send it to NestJS here.
    const finalWorkerPayload = {
      // ...data from previous screen (fullName, hourlyRate, etc.)
      categoryId: selectedCategoryId,
      location: {
        pincode: pincode,
        preferredLocationRange: parseInt(travelRadius, 10),
      },
      fullName,
      experienceInYear,
      bio,
      hourlyRate,
    };

    console.log("SENDING TO NESTJS BACKEND:", finalWorkerPayload);

    // Simulate Network Request to /api/workers
    setTimeout(() => {
      setIsSubmitting(false);
      // Profile complete! Send them to the Discovery Dashboard
      // router.push("/(tabs)/discover");
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-background" edges={["top"]}>
      {/* 🚨 FIX 1: undefined behavior for Android 🚨 */}
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
      >
        <ScreenHeader title="Setup Services" subtitle="What do you do?" />
        <View className="mx-7 mb-8  mt-2">
          <Text className="mb-3 ml-2 font-sans-bold text-[15px] text-slate-700">
            Primary Specialty
          </Text>
          <View className="mb-4 ml-2 flex-row flex-wrap gap-2">
            {MOCK_CATEGORIES.map((category) => {
              const isSelected = selectedCategoryId === category.id;
              const IconComponent = category.icon;

              return (
                <TouchableOpacity
                  key={category.id}
                  activeOpacity={0.7}
                  onPress={() => setSelectedCategoryId(category.id)}
                  className={`flex-row items-center rounded-2xl border px-4 py-3 transition-all ${
                    isSelected
                      ? "border-brand-500 bg-brand-50/40 "
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <View
                    className="mr-3 h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: category.bg }}
                  >
                    <IconComponent size={16} color={category.color} />
                  </View>
                  <Text
                    className={`font-sans-bold text-[15px] ${
                      isSelected ? "text-brand-500" : "text-slate-700"
                    }`}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* Location Details Area */}
          <View className="mb-4 ">
            <Text className="mb-3 ml-2 flex-row items-center font-sans-bold text-[15px] text-slate-700">
              Service Area Coverage
            </Text>
            <View className="mx-2 mb-4 ">
              <InputField
                label="Work Pincode (e.g. Ottapalam)"
                placeholder="Enter 6-digit pincode"
                value={pincode}
                onChangeText={setPincode}
                keyboardType="number-pad"
                maxLength={6}
              />

              <InputField
                label="Travel Radius (in kilometers)"
                placeholder="e.g. 10"
                value={travelRadius}
                onChangeText={setTravelRadius}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
          </View>

          <View className="min-h-[32px] flex-1" />

          <PrimaryButton
            title="Complete Registration"
            onPress={handleCompleteProfile}
            disabled={!isFormValid}
            isLoading={isSubmitting}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
