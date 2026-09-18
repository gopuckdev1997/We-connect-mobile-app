import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/common/screenHeader";
import { PrimaryButton } from "@/common/PrimaryButton";
import { OtpInput } from "@/common/OtpInput";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function OtpVerifyScreen({}) {
  const router = useRouter();
  const { phone, role } = useLocalSearchParams<{
    phone: string;
    role: string;
  }>();

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(59);

  const handleResendCode = () => {
    if (timeLeft > 0) return;
    setTimeLeft(59);
  };

  const handleVerify = () => {
    if (otp.length !== 4) return;
    setIsVerifying(true);

    // Simulate backend verification delay
    setTimeout(() => {
      setIsVerifying(false);

      // Routing Logic based on Schema Role
      if (role === "WORKER") {
        router.push("/(onboarding)/worker");
      } else {
        router.push("/(tabs)/discover");
      }
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1">
            <ScreenHeader title={`Verify Phone`} subtitle={`Step 2 of 2`} />
            <View className="flex-1 px-6">
              {/*Phone otp details*/}
              <View className="mt-6 ">
                <Text className="font-sans-extrabold text-[24px] text-slate-900">
                  Enter the 4-digit code
                </Text>
                <Text className="mt-3 font-sans-light leading-[22px] text-brand-500">
                  We sent a secure verification code to +1 (555) 019-2834
                </Text>
              </View>

              {/*  Otp section*/}
              <View className="mt-6 ">
                <OtpInput value={otp} onChange={setOtp} length={4} />
                <View className="mb-auto flex-row items-center">
                  <Text className=" font-sans text-[15px] text-slate-600 ">
                    Didn&#39;t receive code?
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleResendCode}
                    disabled={timeLeft > 0}
                  >
                    <Text
                      className={`font-sans-bold text-[15px] ${
                        timeLeft > 0 ? "text-slate-400" : "text-brand-500"
                      }`}
                    >
                      {timeLeft > 0 ? `Resend (${timeLeft}s)` : "Resend Now"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="mt-6 ">
                  <PrimaryButton
                    title="Verify & Log In"
                    onPress={handleVerify}
                    disabled={otp.length !== 4}
                    isLoading={isVerifying}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
