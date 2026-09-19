import React, { useState, useEffect } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Check, Phone } from "lucide-react-native";
import { Labels } from "@/app/constants/labels";
import { ScreenHeader } from "@/common/screenHeader";
import { PrimaryButton } from "@/common/PrimaryButton";

export default function PhoneScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPhoneNumber(1234567890);
    setAgreed(true);
  }, []);

  const isSubmitEnabled = phoneNumber.length >= 10 && agreed;

  const handleSendCode = () => {
    if (!isSubmitEnabled) return;
    setIsSubmitting(true);

    // Simulate network delay, then navigate
    setTimeout(() => {
      setIsSubmitting(false);
      router.push({
        pathname: "/(auth)/verify-otp",
        params: { phone: phoneNumber, role },
      });
    }, 500);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            <ScreenHeader title={"Verification"} subtitle={"Step 1 of 2"} />
            {/*  Content after header*/}
            <View className="mt-7   px-6">
              {/*Heading*/}
              <View>
                <Text className="font-sans-extrabold text-[24px] text-slate-900">
                  Enter your phone number
                </Text>
                <Text className="mt-3 font-sans-light leading-[22px] text-brand-500">
                  We&#39;ll send you a 4-digit verification code to keep your
                  connection secure and spam-free.
                </Text>
              </View>
              {/*  Phone number section*/}
              <View className="mt-7">
                <View>
                  <Text className="font-sans-bold text-[15px] text-[#526054]">
                    Phone number
                  </Text>
                </View>
                <View className="mb-3 mt-3 flex-row items-center gap-3.5 rounded-2xl border border-[#E7E5DF] bg-white px-6 py-2">
                  <View>
                    <Phone size={28} color="#839286" strokeWidth={2.2} />
                  </View>
                  <View className="ml-2">
                    <TextInput
                      className="font-sans text-[22px] text-slate-900"
                      placeholder="Enter Phone number"
                      placeholderTextColor="#526054"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      returnKeyType="done"
                      maxLength={10}
                    />
                  </View>
                </View>
              </View>

              {/*  Agreement*/}
              <View className="min-w-auto mb-12 mt-4 flex-row items-center gap-2.5">
                <View>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => setAgreed(!agreed)}
                  >
                    <View
                      className={`mr-3 mt-0.5 h-6 w-6 items-center justify-center rounded-md border ${
                        agreed
                          ? "border-brand-500 bg-brand-500"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {agreed && (
                        <Check size={16} color="white" strokeWidth={3} />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text className=" mr-10 truncate  font-sans text-[13px]  text-slate-900">
                    I agree to the Terms of Service and Privacy Policy.
                    {Labels.APP_LABEL} guarantees zero marketing spam.
                  </Text>
                </View>
              </View>
            </View>

            {/*  Footer*/}
            <View className="mx-5 mb-5 mt-auto">
              <PrimaryButton
                title={"Send Code"}
                onPress={() => handleSendCode()}
                disabled={!isSubmitEnabled}
                isLoading={isSubmitting}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
