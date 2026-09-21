import { Stack } from "expo-router";

export default function onBoardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="worker" options={{ headerShown: false }} />
      <Stack.Screen name="service" options={{ headerShown: false }} />
    </Stack>
  );
}
