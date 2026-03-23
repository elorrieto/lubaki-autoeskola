import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";

const C = Colors.light;

function StatCard({ icon, value, label, color }: { icon: keyof typeof Feather.glyphMap; value: string; label: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <View style={[styles.statIcon, { backgroundColor: color + "18" }]}>
        <Feather name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuItem({ icon, title, subtitle, onPress, color = C.primary }: { icon: keyof typeof Feather.glyphMap; title: string; subtitle: string; onPress: () => void; color?: string }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.75, transform: [{ scale: 0.98 }] }]}
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
    >
      <View style={[styles.menuIcon, { backgroundColor: color + "15" }]}>
        <Feather name={icon} size={22} color={color} />
      </View>
      <View style={styles.menuText}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={C.border} />
    </Pressable>
  );
}

export default function HomeScreen() {
  const { user, logout } = useApp();
  const { t } = useLang();
  const insets = useSafeAreaInsets();
  const nombre = user?.nombre || "Alumno";

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#0A2463", "#1B4699"]}
        style={[styles.headerGradient, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) + 16 }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>{t.welcome}</Text>
            <Text style={styles.name}>{nombre}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.7 }]}
            onPress={async () => { await logout(); router.replace("/"); }}
          >
            <Feather name="log-out" size={20} color="rgba(255,255,255,0.8)" />
          </Pressable>
        </View>
        <View style={styles.nextClass}>
          <Feather name="calendar" size={14} color="rgba(255,255,255,0.7)" />
          <Text style={styles.nextClassText}>{t.nextClass}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 + (Platform.OS === "web" ? 34 : 0) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsRow}>
          <StatCard icon="clock" value="10" label={t.practicalHours} color="#2563EB" />
          <StatCard icon="check-circle" value="5" label={t.testsCompleted} color="#22C55E" />
          <StatCard icon="award" value="60%" label={t.progress} color="#F59E0B" />
        </View>

        <View style={styles.notice}>
          <Feather name="info" size={14} color="#2563EB" />
          <Text style={styles.noticeText}>{t.motto}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t.mainMenu}</Text>

        <View style={styles.menuList}>
          <MenuItem icon="calendar" title={t.schedules} subtitle={t.scheduleSub} onPress={() => router.push("/(main)/calendar")} color="#2563EB" />
          <MenuItem icon="book-open" title={t.enrollment} subtitle={t.enrollmentSub} onPress={() => router.push("/(main)/courses")} color="#7C3AED" />
          <MenuItem icon="phone" title={t.contact} subtitle={t.contactSub} onPress={() => router.push("/(main)/contact")} color="#059669" />
          <MenuItem icon="user" title={t.profile} subtitle={t.profileSub} onPress={() => router.push("/(main)/profile")} color="#DC2626" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },
  headerGradient: { paddingHorizontal: 20, paddingBottom: 28, gap: 10 },
  headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  greeting: { fontFamily: "Inter_400Regular", fontSize: 14, color: "rgba(255,255,255,0.7)" },
  name: { fontFamily: "Inter_700Bold", fontSize: 26, color: "#fff", marginTop: 2 },
  logoutBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center", marginTop: 4 },
  nextClass: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, alignSelf: "flex-start" },
  nextClassText: { fontFamily: "Inter_500Medium", fontSize: 13, color: "rgba(255,255,255,0.9)" },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 14, alignItems: "center", gap: 6, borderTopWidth: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  statIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 10, color: C.textSecondary, textAlign: "center" },
  notice: { flexDirection: "row", gap: 10, backgroundColor: "#EFF6FF", borderRadius: 12, padding: 14, alignItems: "flex-start" },
  noticeText: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 13, color: "#1E40AF", lineHeight: 19 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.text, marginTop: 4 },
  menuList: { gap: 10 },
  menuItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 14, padding: 16, gap: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  menuIcon: { width: 46, height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  menuText: { flex: 1 },
  menuTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: C.text },
  menuSubtitle: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textSecondary, marginTop: 2 },
});
