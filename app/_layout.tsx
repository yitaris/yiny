import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen 
          name="index" 
        />
        <Stack.Screen
          name="(tabs)"
        />
      </Stack>
    </AuthProvider>
  );
}
