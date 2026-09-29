import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { User } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

import { ScreenHeader } from "@/common/screenHeader";
import { InputField } from "@/common/InputField";
import { SliderField } from "@/common/SliderField";
import { PrimaryButton } from "@/common/PrimaryButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useWorkerStore } from "@/store/useWorkerStore";
import { AddressAutoCompleteField } from "@/common/AddressField";
import { api } from "@/app/service/api-base";

export default function WorkerProfile() {
  const router = useRouter();

  const { setProfileData } = useWorkerStore();

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | undefined>(
    undefined
  );
  const [experience, setExperience] = useState(1);
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [resolvedAddress, setResolvedAddress] = useState<any>(null);

  // `localImageUri` is only for instant on-device preview. `profileImageUrl`
  // is the permanent URL returned by the backend after upload — that's the
  // value we actually submit with the rest of the profile.
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    fullName?.trim() !== "" &&
    Number(age) >= 18 &&
    Number(age) <= 100 &&
    experience > 0 &&
    hourlyRate !== "";

  const handlePickImage = async () => {
    // 1. Ask for permission to read the photo library.
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow photo library access to upload a profile picture."
      );
      return;
    }

    // 2. Launch the native picker UI.
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    setLocalImageUri(asset.uri);
    setIsUploadingImage(true);

    try {
      // 3. A picked file is just a local `file://` uri — it has to be sent
      // as multipart/form-data (not JSON) so the backend receives an actual
      // binary file stream. `FormData` + `{ uri, name, type }` is the RN way
      // of representing a file part.
      const formData = new FormData();
      formData.append("file", {
        uri: asset.uri,
        name: asset.fileName ?? `profile-${Date.now()}.jpg`,
        type: asset.mimeType ?? "image/jpeg",
      } as any);

      // Our shared `api` instance defaults to Content-Type: application/json,
      // so it must be overridden per-request for file uploads.
      const response: any = await api.post("/uploads/profile-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfileImageUrl(response.url);
    } catch (error) {
      console.log(error);
      Alert.alert("Upload failed", "Could not upload the image. Please try again.");
      setLocalImageUri(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleNext = () => {
    if (!isFormValid) return;
    setIsSubmitting(true);

    const payload = {
      fullName,
      age: parseInt(age, 10),
      gender,
      experienceInYear: experience,
      hourlyRate: parseInt(hourlyRate, 10),
      bio,
      address: resolvedAddress,
      profileImage: profileImageUrl,
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
                onPress={handlePickImage}
                disabled={isUploadingImage}
                className="mr-4 h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-slate-200"
              >
                {isUploadingImage ? (
                  <ActivityIndicator color="#94A3B8" />
                ) : localImageUri ? (
                  <Image
                    source={{ uri: localImageUri }}
                    className="h-20 w-20"
                    resizeMode="cover"
                  />
                ) : (
                  <User size={32} color="#94A3B8" />
                )}
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="mb-1 font-sans-bold text-[16px] text-slate-900">
                  Profile Photo
                </Text>
                <Text className="mb-1 font-sans text-[13px] leading-snug text-slate-500">
                  A clear headshot builds high customer trust.
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
                      gender === option
                        ? "border-brand-500 bg-brand-50/40"
                        : "border-slate-200 bg-white"
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
              <AddressAutoCompleteField
                label={`Location`}
                onAddressResolved={(payload) => setResolvedAddress(payload)}
              />
              {resolvedAddress ? (
                <View className="-mt-3 mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <Text
                    className="font-sans-medium text-[13px] text-slate-700"
                    numberOfLines={2}
                  >
                    {resolvedAddress.address?.formattedAddress}
                  </Text>
                  <View className="mt-2 flex-row flex-wrap gap-2">
                    {resolvedAddress.locality?.city ? (
                      <View className="rounded-full bg-white px-3 py-1">
                        <Text className="font-sans-medium text-[12px] text-slate-600">
                          {resolvedAddress.locality.city}
                        </Text>
                      </View>
                    ) : null}
                    {resolvedAddress.locality?.district ? (
                      <View className="rounded-full bg-white px-3 py-1">
                        <Text className="font-sans-medium text-[12px] text-slate-600">
                          {resolvedAddress.locality.district}
                        </Text>
                      </View>
                    ) : null}
                    {resolvedAddress.locality?.pinCode ? (
                      <View className="rounded-full bg-white px-3 py-1">
                        <Text className="font-sans-medium text-[12px] text-slate-600">
                          {resolvedAddress.locality.pinCode}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              ) : null}
              <SliderField
                label="Years of Experience"
                value={experience}
                onValueChange={setExperience}
                min={0}
                max={40}
                step={1}
                formatValue={(v) => `${v} ${v === 1 ? "yr" : "yrs"}`}
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
