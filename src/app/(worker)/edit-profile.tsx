import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { User, HelpCircle, Wrench, Zap, Hammer, Paintbrush, Sparkles, Car } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { ScreenHeader } from "@/common/screenHeader";
import { InputField } from "@/common/InputField";
import { SliderField } from "@/common/SliderField";
import { PrimaryButton } from "@/common/PrimaryButton";
import { useFireBaseStore } from "@/store/useFireBaseStore";
import { api } from "@/app/service/api-base";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  "pipe-wrench": Wrench,
  flash: Zap,
  hammer: Hammer,
  "format-paint": Paintbrush,
  broom: Sparkles,
  drizzle: Car,
};

export default function EditWorkerProfile() {
  const router = useRouter();
  const { workerId } = useFireBaseStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | undefined>(undefined);
  const [experienceInYear, setExperienceInYear] = useState(1);
  const [hourlyRate, setHourlyRate] = useState("");
  const [minimumCharge, setMinimumCharge] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  // Load the worker's current details + the full category list in parallel,
  // then pre-fill the form so this behaves like a normal "edit" screen.
  useEffect(() => {
    if (!workerId) {
      setIsLoading(false);
      return;
    }

    Promise.all([
      api.get(`/workers/${workerId}`),
      api.get(`/workers/categories`),
    ])
      .then(([workerRes, categoryRes]: any[]) => {
        setFullName(workerRes.fullName ?? "");
        setAge(workerRes.age ? String(workerRes.age) : "");
        setGender(workerRes.gender);
        setExperienceInYear(workerRes.experienceInYear ?? 1);
        setHourlyRate(workerRes.hourlyRate ? String(workerRes.hourlyRate) : "");
        setMinimumCharge(workerRes.minimumCharge ? String(workerRes.minimumCharge) : "");
        setIsNegotiable(!!workerRes.isNegotiable);
        setProfileImageUrl(workerRes.profileImage ?? null);
        setSelectedCategoryIds(workerRes.categories?.map((c: any) => c.id) ?? []);
        setCategories(categoryRes.category ?? []);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, [workerId]);

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow photo library access to update your profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: asset.uri,
        name: asset.fileName ?? `profile-${Date.now()}.jpg`,
        type: asset.mimeType ?? "image/jpeg",
      } as any);

      const response: any = await api.post("/uploads/profile-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfileImageUrl(response.url);
    } catch (error) {
      console.log(error);
      Alert.alert("Upload failed", "Could not upload the image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const isFormValid =
    fullName.trim() !== "" &&
    Number(age) >= 18 &&
    Number(age) <= 100 &&
    hourlyRate !== "" &&
    selectedCategoryIds.length > 0;

  const handleSave = async () => {
    if (!isFormValid || !workerId) return;
    setIsSaving(true);

    try {
      await api.patch(`/workers/${workerId}`, {
        fullName,
        age: parseInt(age, 10),
        gender,
        experienceInYear,
        hourlyRate: parseInt(hourlyRate, 10),
        minimumCharge: minimumCharge ? parseInt(minimumCharge, 10) : parseInt(hourlyRate, 10),
        isNegotiable,
        profileImage: profileImageUrl ?? undefined,
        categoryIds: selectedCategoryIds,
      });
      router.back();
    } catch (err) {
      console.log(err);
      Alert.alert("Update failed", "Could not save your changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface-background">
        <ActivityIndicator color="#2D5A43" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
      >
        <ScreenHeader title="Edit Profile" subtitle="Update your worker details" />

        <View className="mb-8 ml-5 mt-6 flex-row items-center">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePickImage}
            disabled={isUploadingImage}
            className="mr-4 h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-slate-200"
          >
            {isUploadingImage ? (
              <ActivityIndicator color="#94A3B8" />
            ) : profileImageUrl ? (
              <Image source={{ uri: profileImageUrl }} className="h-20 w-20" resizeMode="cover" />
            ) : (
              <User size={32} color="#94A3B8" />
            )}
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="mb-1 font-sans-bold text-[16px] text-slate-900">
              Profile Photo
            </Text>
            <TouchableOpacity onPress={handlePickImage} disabled={isUploadingImage}>
              <Text className="font-sans-bold text-[14px] text-brand-500">
                {profileImageUrl ? "Change Image" : "Upload Image"}
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
            label="Age"
            placeholder="e.g. 28"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            maxLength={3}
          />
          <View className="mb-5 -mt-2 flex-row gap-2">
            {(["MALE", "FEMALE"] as const).map((option) => (
              <TouchableOpacity
                key={option}
                activeOpacity={0.7}
                onPress={() => setGender(option)}
                className={`flex-1 items-center rounded-2xl border py-3 ${
                  gender === option ? "border-brand-500 bg-brand-50/40" : "border-slate-200 bg-white"
                }`}
              >
                <Text
                  className={`font-sans-bold text-[14px] ${
                    gender === option ? "text-brand-500" : "text-slate-700"
                  }`}
                >
                  {option === "MALE" ? "Male" : "Female"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <SliderField
            label="Years of Experience"
            value={experienceInYear}
            onValueChange={setExperienceInYear}
            min={0}
            max={40}
            step={1}
            formatValue={(v) => `${v} ${v === 1 ? "yr" : "yrs"}`}
          />
          <InputField
            label="Standard Hourly Rate (₹)"
            placeholder="e.g. 450"
            value={hourlyRate}
            onChangeText={setHourlyRate}
            keyboardType="number-pad"
            maxLength={4}
          />
          <InputField
            label="Minimum Charge (₹)"
            placeholder="e.g. 450"
            value={minimumCharge}
            onChangeText={setMinimumCharge}
            keyboardType="number-pad"
            maxLength={4}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsNegotiable((v) => !v)}
            className="mb-5 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white p-4"
          >
            <Text className="font-sans-bold text-[14px] text-slate-700">
              Rate is negotiable
            </Text>
            <View
              className={`h-6 w-11 rounded-full p-0.5 ${isNegotiable ? "bg-brand-500" : "bg-slate-200"}`}
            >
              <View
                className={`h-5 w-5 rounded-full bg-white ${isNegotiable ? "ml-auto" : ""}`}
              />
            </View>
          </TouchableOpacity>

          <Text className="mb-3 font-sans-bold text-[15px] text-slate-700">
            Service Categories
          </Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {categories.map((category) => {
              const isSelected = selectedCategoryIds.includes(category.id);
              const TargetIcon = ICON_MAP[category.icon] || HelpCircle;

              return (
                <TouchableOpacity
                  key={category.id}
                  activeOpacity={0.7}
                  onPress={() => toggleCategory(category.id)}
                  className={`flex-row items-center rounded-2xl border px-4 py-3 ${
                    isSelected ? "border-brand-500 bg-brand-50/40" : "border-slate-200 bg-white"
                  }`}
                >
                  <View
                    className="mr-3 h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <TargetIcon size={16} color={isSelected ? "#2D5A43" : category.color} />
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
        </View>

        <View className="mx-6 mt-4 mb-6">
          <PrimaryButton
            title="Save Changes"
            onPress={handleSave}
            disabled={!isFormValid}
            isLoading={isSaving}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
