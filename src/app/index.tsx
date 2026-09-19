import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Users, Search, Briefcase } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Labels } from "@/app/constants/labels";
import { PrimaryButton } from "@/common/PrimaryButton";

type UserRole = "CUSTOMER" | "WORKER";

export default function WelcomeScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>("CUSTOMER");

  const handleGetStarted = async () => {
    if (selectedRole) {
      router.push({
        pathname: "/(auth)/phone",
        params: { role: selectedRole },
      });
    }
  };

  const handleGuestBrows = async () => {};

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className=" px-6 py-4"
        showsHorizontalScrollIndicator={false}
      >
        {/*Header*/}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center gap-2.5 ">
            <View
              className="h-10 w-10 items-center justify-center rounded-xl bg-brand-500 px-7 py-7 "
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Users color="white" size={22} />
            </View>
            <Text className="font-sans-extrabold text-xl text-slate-900 shadow-2xl">
              {Labels.APP_LABEL}
            </Text>
          </View>
          <Text className="mb-2 font-sans-extrabold text-[22px] leading-tight text-slate-900">
            Connect with trusted{"\n"}local help today
          </Text>
          <Text className="font-sans text-[15px] leading-relaxed text-slate-600">
            Verified neighborhood professionals ready to serve your local
            household and utility needs.
          </Text>
        </View>

        {/* Selection Section */}

        <View className="mb-6 gap-2.5 ">
          <Text className="mb-3 font-sans-bold text-xs uppercase tracking-wider text-slate-400">
            I WANT TO:
          </Text>
          <TouchableOpacity
            onPress={() => setSelectedRole("WORKER")}
            activeOpacity={0.8}
            className={`mb-4 flex-row items-center rounded-2xl border bg-white p-4 ${
              selectedRole === "WORKER"
                ? "border-brand-500 bg-brand-50/30"
                : "border-slate-200"
            }`}
          >
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-xl bg-[#FEF3C7]">
              <Briefcase size={24} color="#D97706" />
            </View>
            <View className="flex-1">
              <Text className="mb-0.5 font-sans-bold text-[16px] text-slate-900">
                Offer My Services
              </Text>
              <Text className="font-sans text-[13px] leading-snug text-slate-500">
                Register as a local helper and find reliable local jobs.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedRole("CUSTOMER")}
            className={`flex-row items-center rounded-2xl border bg-white p-4  ${
              selectedRole === "CUSTOMER"
                ? "border-brand-500 bg-brand-50/30"
                : "border-slate-200 "
            }`}
          >
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-xl bg-[#EEF3EF]">
              <Search size={24} color="#2D5A43" />
            </View>
            <View className="flex-1">
              <Text className="mb-0.5 font-sans-bold text-[16px] text-slate-900">
                Hire Local Help
              </Text>
              <Text className="font-sans text-[13px] leading-snug text-slate-500">
                Browse verified handymen, plumbers, cleaners, and more.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/*  footer*/}
        <View className="mt-auto pb-2 pt-4">
          <PrimaryButton
            onPress={() => handleGetStarted()}
            title="Get Started"
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleGuestBrows()}
            className="mt-2 items-center"
          >
            <Text className="font-sans text-sm text-slate-600">
              Looking to browse first?{" "}
              <Text className="font-sans-bold text-brand-500">
                Enter as Guest
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
