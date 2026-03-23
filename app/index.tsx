import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { type Lang, useLang } from "@/context/LanguageContext";

const C = Colors.light;

export default function LoginScreen() {
  const { isLoggedIn, login } = useApp();
  const { lang, t, setLang } = useLang();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoggedIn) router.replace("/(main)/home");
  }, [isLoggedIn]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogoPress = () => {
    holdProgress.setValue(0);
    Animated.timing(logoScale, { toValue: 0.92, duration: 100, useNativeDriver: true }).start();

    Animated.timing(holdProgress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    holdTimer.current = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.timing(logoScale, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      router.push("/admin");
    }, 2000);
  };

  const handleLogoRelease = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    holdProgress.stopAnimation();
    holdProgress.setValue(0);
    Animated.timing(logoScale, { toValue: 1, duration: 150, useNativeDriver: true }).start();
  };

  const handleLogin = async () => {
    if (!username.trim()) {
      setError(t.errorUsername);
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    setError("");
    try {
      await login(username.trim());
      router.replace("/(main)/home");
    } finally {
      setLoading(false);
    }
  };

  const progressWidth = holdProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#0A2463", "#1B4699", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) + 12,
              paddingBottom: insets.bottom + 24 + (Platform.OS === "web" ? 34 : 0),
            },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Language switcher */}
          <View style={styles.langRow}>
            {(["eu", "es"] as Lang[]).map((l) => (
              <Pressable
                key={l}
                style={[styles.langBtn, lang === l && styles.langBtnActive]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setLang(l);
                }}
              >
                <Text style={[styles.langText, lang === l && styles.langTextActive]}>
                  {l === "eu" ? "Euskera" : "Castellano"}
                </Text>
              </Pressable>
            ))}
          </View>

          <Animated.View
            style={[
              styles.logoSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* Logo with long-press to admin */}
            <Pressable
              onPressIn={handleLogoPress}
              onPressOut={handleLogoRelease}
              onLongPress={() => {}}
              delayLongPress={2500}
              accessible={false}
            >
              <Animated.View style={[styles.iconWrapper, { transform: [{ scale: logoScale }] }]}>
                <Feather name="shield" size={42} color="#fff" />
                {/* Progress ring border */}
                <Animated.View
                  style={[
                    styles.holdRing,
                    { width: progressWidth },
                  ]}
                />
              </Animated.View>
            </Pressable>
            <Text style={styles.brandName}>Lubaki</Text>
            <Text style={styles.brandSub}>Autoeskola</Text>
            <Text style={styles.tagline}>{t.tagline}</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.cardTitle}>{t.loginTitle}</Text>

            {!!error && (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={14} color={C.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <View style={styles.inputRow}>
                <Feather name="user" size={18} color={C.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={t.username}
                  placeholderTextColor={C.textSecondary}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  returnKeyType="next"
                />
              </View>
              <View style={styles.inputRow}>
                <Feather name="lock" size={18} color={C.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder={t.password}
                  placeholderTextColor={C.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <Pressable onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  <Feather name={showPass ? "eye-off" : "eye"} size={18} color={C.textSecondary} />
                </Pressable>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [styles.btnPrimary, pressed && { opacity: 0.85 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.btnPrimaryText}>
                {loading ? t.entering : t.enter}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.btnSecondary, pressed && { opacity: 0.7 }]}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.btnSecondaryText}>{t.createAccount}</Text>
            </Pressable>
          </Animated.View>

          <View style={styles.links}>
            <Pressable
              style={({ pressed }) => [styles.linkBtn, pressed && { opacity: 0.6 }]}
              onPress={() =>
                Linking.openURL("https://sites.google.com/view/lubaki-autoeskola/inicio")
              }
            >
              <Feather name="globe" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.linkText}>{t.website}</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.linkBtn, pressed && { opacity: 0.6 }]}
              onPress={() => Linking.openURL("https://www.instagram.com/lubaki.autoeskola/")}
            >
              <Feather name="instagram" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.linkText}>{t.instagram}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 24,
  },
  langRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: 3,
    gap: 3,
  },
  langBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 9,
  },
  langBtnActive: {
    backgroundColor: "#fff",
  },
  langText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
  langTextActive: {
    color: C.primary,
  },
  logoSection: { alignItems: "center", gap: 6 },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    overflow: "hidden",
  },
  holdRing: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  brandName: {
    fontFamily: "Inter_700Bold",
    fontSize: 36,
    color: "#fff",
    letterSpacing: -0.5,
  },
  brandSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  tagline: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: C.text,
    marginBottom: 4,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEF2F2",
    padding: 10,
    borderRadius: 10,
  },
  errorText: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.error },
  inputGroup: { gap: 10 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: C.text,
  },
  eyeBtn: { padding: 4 },
  btnPrimary: {
    backgroundColor: C.primary,
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#fff" },
  btnSecondary: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondaryText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: C.primary },
  links: { flexDirection: "row", gap: 24 },
  linkBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  linkText: { fontFamily: "Inter_400Regular", fontSize: 13, color: "rgba(255,255,255,0.8)" },
});
