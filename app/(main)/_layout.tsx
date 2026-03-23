import { Stack } from "expo-router";
import React from "react";

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="calendar" />
      <Stack.Screen name="courses" />
      <Stack.Screen name="contact" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
