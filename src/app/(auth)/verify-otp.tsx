import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/common/screenHeader";
import { PrimaryButton } from "@/common/PrimaryButton";
import { OtpInput } from "@/common/OtpInput";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFireBaseStore } from "@/store/useFireBaseStore";
import { getAuth } from "@react-native-firebase/auth";
import { api } from "@/app/service/api-base";

export default function OtpVerifyScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{
    phone: string;
    role: string;
  }>();

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otlLength,setOtpLength] = useState(6);
  const [timeLeft, setTimeLeft] = useState(59);

  const {confirmSession,phoneNumber,saveSession} =useFireBaseStore()


  const handleResendCode = () => {
    if (timeLeft > 0) return;
    setTimeLeft(59);
  };

  const handleVerify = async() => {
    if (otp.length !== otlLength) return;
    setIsVerifying(true);

    try{
      // submit otp request to firebase sdk

      const userCredential = await confirmSession.confirm(otp);

      if (!userCredential) {
        console.error("Verification Error:", error);
        Alert.alert(
          "Verification Failed",
          "The 6-digit OTP code is incorrect or expired."
        );
      }
      const idToken = await userCredential.user.getIdToken();
      if (!idToken) {
        Alert.alert(`Something went wrong while fetching id Token`);
      }

      console.log("Verification Token:", idToken);

      // backend Api calling to send Id token to backend
     const response =  await api.post(`auth/firebase-login`,{idToken:idToken});

      console.log({ response });

      const { accessToken, newUser, user, workerId } = response;
      if(!accessToken){
        Alert.alert(`Access Token is invalid or not found`);
      }

      await saveSession(accessToken,user,newUser,role,workerId)

      if(role==="WORKER"){
        if(newUser  || !user?.profileCompleted){
          router.replace(`/(onboarding)/worker`)
        } else {
          // Returning, already-onboarded worker — straight to their dashboard.
          router.replace(`/(worker)/(tabs)/discover`)
        }
      }

      if (role === "CUSTOMER") {
        if (newUser || !user?.profileCompleted) {
          // redirecting to customer onBoarding screen
          // router.replace(`/(onboarding)/worker`);
        } else {
          //redirect to worker profile
          router.replace(`/(worker)/(tabs)/discover`)
        }
      }

    }catch(e){
      console.log({
        message:`An error has been occurred: ${e}`,
      })
    }finally{
      setIsVerifying(false);
    }
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
                  {`Enter the ${otlLength}-digit code`}
                </Text>
                <Text className="mt-3 font-sans-light leading-[22px] text-brand-500">
                  {`We sent a secure verification code to  ${phoneNumber}`}
                </Text>
              </View>

              {/*  Otp section*/}
              <View className="mt-6 ">
                <OtpInput value={otp} onChange={setOtp} length={6} />
                <View className="mb-auto flex-row items-center">
                  <Text className=" font-sans text-[15px] text-slate-600 ">
                    Did&#39;t receive code?
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
                    disabled={otp.length !== otlLength}
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
