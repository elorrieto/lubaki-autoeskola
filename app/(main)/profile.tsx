import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
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
import { useLang } from "@/context/LanguageContext";

const C = Colors.light;

export default function ProfileScreen() {
  const { user, updateProfile, logout } = useApp();
  const { t } = useLang();
  const insets = useSafeAreaInsets();

  const [peso, setPeso] = useState(user?.peso ?? "");
  const [grasaCorporal, setGrasaCorporal] = useState(user?.grasaCorporal ?? "");
  const [sueno, setSueno] = useState(user?.sueno ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => { setSaved(false); }, [peso, grasaCorporal, sueno]);

  const handleSave = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await updateProfile({ peso, grasaCorporal, sueno });
    setSaved(true);
  };

  const progress = 60;

  const healthFields = [
    { key: "peso" as const, label: t.weightLabel, placeholder: "70", icon: "activity" as const, unit: "kg", value: peso, setter: setPeso },
    { key: "grasaCorporal" as const, label: t.fatLabel, placeholder: "20", icon: "percent" as const, unit: "%", value: grasaCorporal, setter: setGrasaCorporal },
    { key: "sueno" as const, label: t.sleepLabel, placeholder: "8", icon: "moon" as const, unit: "h", value: sueno, setter: setSueno },
  ];

  const infoRows = [
    { label: t.nombre, value: `${user?.nombre ?? ""} ${user?.apellidos ?? ""}`.trim() || "—" },
    { label: t.dni, value: user?.dni || "—" },
    { label: t.telefono, value: user?.telefono || "—" },
    { label: t.direccion, value: user?.direccion || "—" },
  ];

  return (
    <View style={[styles.root, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>{t.profileTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 + (Platform.OS === "web" ? 34 : 0) }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarBlock}>
          <View style={styles.avatar}>
            <Feather name="user" size={36} color={C.primary} />
          </View>
          <Text style={styles.avatarName}>{user?.nombre || user?.username || "Alumno"}</Text>
          <Text style={styles.avatarSub}>{t.activeStudent}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.courseProgress}</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
            </View>
            <Text style={styles.progressPct}>{progress}%</Text>
          </View>
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatVal}>10</Text>
              <Text style={styles.progressStatLbl}>{t.practicalHours}</Text>
            </View>
            <View style={styles.progressStatDivider} />
            <View style={styles.progressStat}>
              <Text style={styles.progressStatVal}>5</Text>
              <Text style={styles.progressStatLbl}>{t.testsCompleted}</Text>
            </View>
            <View style={styles.progressStatDivider} />
            <View style={styles.progressStat}>
              <Text style={styles.progressStatVal}>8</Text>
              <Text style={styles.progressStatLbl}>{t.progress}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.personalData}</Text>
          <View style={styles.infoList}>
            {infoRows.map((row, i) => (
              <View key={i} style={[styles.infoRow, i < infoRows.length - 1 && styles.infoRowBorder]}>
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text style={styles.infoValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.healthHeader}>
            <Text style={styles.cardTitle}>{t.healthTracking}</Text>
            <View style={styles.healthBadge}>
              <Feather name="heart" size={12} color="#DC2626" />
              <Text style={styles.healthBadgeText}>{t.wellbeing}</Text>
            </View>
          </View>
          <Text style={styles.healthInfo}>{t.healthInfo}</Text>

          <View style={styles.healthFields}>
            {healthFields.map((f) => (
              <View key={f.key} style={styles.healthField}>
                <View style={styles.healthFieldIcon}>
                  <Feather name={f.icon} size={16} color={C.primary} />
                </View>
                <View style={styles.healthFieldContent}>
                  <Text style={styles.healthLabel}>{f.label}</Text>
                  <View style={styles.healthInputRow}>
                    <TextInput
                      style={styles.healthInput}
                      value={f.value}
                      onChangeText={f.setter}
                      placeholder={f.placeholder}
                      placeholderTextColor={C.textSecondary}
                      keyboardType="numeric"
                    />
                    <Text style={styles.healthUnit}>{f.unit}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <Pressable
            style={({ pressed }) => [styles.saveBtn, saved && styles.saveBtnDone, pressed && { opacity: 0.85 }]}
            onPress={handleSave}
          >
            <Feather name={saved ? "check" : "save"} size={16} color="#fff" />
            <Text style={styles.saveBtnText}>{saved ? t.saved : t.saveData}</Text>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.8 }]}
          onPress={async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await logout();
            router.replace("/");
          }}
        >
          <Feather name="log-out" size={16} color={C.error} />
          <Text style={styles.logoutText}>{t.logout}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14, backgroundColor: C.primary },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: "rgba(255,255,255,0.15)" },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 18, color: "#fff" },
  scroll: { padding: 16, gap: 16 },
  avatarBlock: { alignItems: "center", gap: 6, paddingVertical: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#DBEAFE", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: C.primary },
  avatarName: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text },
  avatarSub: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSecondary },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardTitle: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.text },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  progressBar: { flex: 1, height: 10, borderRadius: 5, backgroundColor: "#F1F5F9", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 5, backgroundColor: C.primary },
  progressPct: { fontFamily: "Inter_700Bold", fontSize: 14, color: C.primary },
  progressStats: { flexDirection: "row", alignItems: "center" },
  progressStat: { flex: 1, alignItems: "center", gap: 2 },
  progressStatVal: { fontFamily: "Inter_700Bold", fontSize: 18, color: C.text },
  progressStatLbl: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textSecondary, textAlign: "center" },
  progressStatDivider: { width: 1, height: 30, backgroundColor: C.border },
  infoList: { gap: 0 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  infoLabel: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSecondary },
  infoValue: { fontFamily: "Inter_500Medium", fontSize: 13, color: C.text, maxWidth: "55%", textAlign: "right" },
  healthHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  healthBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FEE2E2", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  healthBadgeText: { fontFamily: "Inter_500Medium", fontSize: 11, color: "#DC2626" },
  healthInfo: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSecondary, lineHeight: 18 },
  healthFields: { gap: 10 },
  healthField: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: C.inputBackground, borderRadius: 12, padding: 12 },
  healthFieldIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#DBEAFE", alignItems: "center", justifyContent: "center" },
  healthFieldContent: { flex: 1 },
  healthLabel: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.textSecondary },
  healthInputRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  healthInput: { flex: 1, fontFamily: "Inter_600SemiBold", fontSize: 16, color: C.text, paddingVertical: 2 },
  healthUnit: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSecondary },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: C.primary, borderRadius: 12, height: 48 },
  saveBtnDone: { backgroundColor: "#22C55E" },
  saveBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: "#fff" },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#FEF2F2", borderRadius: 14, height: 52, borderWidth: 1.5, borderColor: "#FECACA" },
  logoutText: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: C.error },
});
