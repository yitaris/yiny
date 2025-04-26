import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="signIn" />
      <Stack.Screen name="(pages)" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
