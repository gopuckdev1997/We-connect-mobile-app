import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/common/screenHeader";
import { InputField } from "@/common/InputField";
import { SliderField } from "@/common/SliderField";
import { PrimaryButton } from "@/common/PrimaryButton";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useEffect, useState } from "react";
import { useWorkerStore } from "@/store/useWorkerStore";
import { useFireBaseStore } from "@/store/useFireBaseStore";
import { api } from "@/app/service/api-base";
import {
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  Sparkles,
  Car,
  HelpCircle
} from 'lucide-react-native';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  "pipe-wrench": Wrench, // Maps to Plumber
  flash: Zap, // Maps to Electrician
  hammer: Hammer, // Maps to Carpenter
  "format-paint": Paintbrush, // Maps to Painter
  broom: Sparkles, // Maps to Cleaning & Housekeeping
  drizzle: Car, // Maps to Driver
};



export default function SetupSerive() {
  const router = useRouter();
  const {
    resetProfileState,
    fullName,
    age,
    gender,
    experienceInYear,
    bio,
    hourlyRate,
    address,
    profileImage,
  } = useWorkerStore();
  // State mapping to Category and Address/preferredLocationRange models
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  // Pre-fill from the location picked on the previous screen, but keep it
  // editable in case the auto-detected pincode isn't quite right.
  const [pincode, setPincode] = useState(address?.locality?.pinCode ?? "");
  const [travelRadius, setTravelRadius] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [workerCategory, setWorkerCategory] = useState<[] | null>()

  const isFormValid =
    selectedCategoryId !== null && pincode.length === 6 && travelRadius > 0;
  
  
  const listWorkersCategories = async () => {
    const response = await api.get(`/workers/categories`);

    let { category } = response;
    return category;



  };


  useEffect(() => {
    listWorkersCategories().then((response)=>{
      console.log(response);
    setWorkerCategory(response?.length > 0 ? response : []);
    }).catch((err)=>{
      console.log(err);
    }).finally(()=>{

    })


  },[])


  const handleCompleteProfile = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);

    // Payload shaped to match backend WorkerOnBoardDto exactly.
    // NOTE: idProofType / idProofDocumentUrl are required by the DTO but
    // there is no capture UI for them yet anywhere in the app — the
    // request will fail backend validation until that's added.
    const finalWorkerPayload = {
      fullName,
      age,
      gender,
      profileImage,
      experienceInYear,
      pricingType: "HOURLY",
      salaryType: "HOURLY",
      hourlyRate,
      // `minimumCharge` has no DB default and is NOT NULL — falling back to
      // hourlyRate until a dedicated input is added.
      minimumCharge: hourlyRate,
      isNegotiable: false,
      categoryIds: selectedCategoryId !== null ? [selectedCategoryId] : [],
      address: address?.address,
      locality: address?.locality,
    };
    console.log({ finalWorkerPayload });

    try {
      const response: any = await api.post("/auth/onboard/worker", finalWorkerPayload);
      console.log({ response });
      // Worker is fully onboarded now — persist their worker id so the
      // dashboard can fetch `/workers/:id` on future app opens too.
      await useFireBaseStore
        .getState()
        .saveSession(
          response.accessToken,
          response.user,
          false,
          "WORKER",
          response.worker?.id
        );
      router.replace("/(worker)/(tabs)/discover");
      resetProfileState();
    } catch (err) {
      console.log({ err });
    } finally {
      setIsSubmitting(false);
    }
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
            contentContainerStyle={{ gap: 8, paddingHorizontal: 8 }}
          >
            {workerCategory?.map((category) => {
              const isSelected = selectedCategoryId === category.id;
              const TargetIcon = ICON_MAP[category.icon] || HelpCircle;

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
                    style={{ backgroundColor: `${category.color}20` }} // Appends '20' for a 12% translucent light bg accent
                  >
                    <TargetIcon
                      size={16}
                      color={isSelected ? "#2D5A43" : category.color}
                    />
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
          </ScrollView>
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
                disabled={true}
                keyboardType="number-pad"
                maxLength={6}
              />

              <SliderField
                label="Travel Radius"
                value={travelRadius}
                onValueChange={setTravelRadius}
                min={1}
                max={50}
                step={1}
                formatValue={(v) => `${v} km`}
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
