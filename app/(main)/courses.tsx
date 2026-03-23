import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
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
import { useLang } from "@/context/LanguageContext";

const C = Colors.light;

interface Course {
  code: string;
  nameEu: string;
  nameEs: string;
  descEu: string;
  descEs: string;
  color: string;
  icon: keyof typeof Feather.glyphMap;
  price: string;
  durationEu: string;
  durationEs: string;
  tag?: boolean;
}

const COURSES: Course[] = [
  { code: "B", nameEu: "B Baimena", nameEs: "Permiso B", descEu: "Turismoetarako eta 3.500 kg arteko furgonetak. Eskaeratuena.", descEs: "Turismo y furgonetas hasta 3.500 kg. El más demandado.", color: "#2563EB", icon: "truck", price: "800€", durationEu: "30 praktika-ordu", durationEs: "30 h. prácticas", tag: true },
  { code: "A", nameEu: "A Baimena", nameEs: "Permiso A", descEu: "Potentzia-mugarik gabeko motoziklak.", descEs: "Motocicletas sin límite de potencia.", color: "#7C3AED", icon: "wind", price: "600€", durationEu: "20 praktika-ordu", durationEs: "20 h. prácticas" },
  { code: "A1", nameEu: "A1 Baimena", nameEs: "Permiso A1", descEu: "125 cc-ko motoziklak.", descEs: "Motocicletas hasta 125 cc.", color: "#9333EA", icon: "zap", price: "450€", durationEu: "15 praktika-ordu", durationEs: "15 h. prácticas" },
  { code: "AM", nameEu: "AM Baimena", nameEs: "Permiso AM", descEu: "Ziklomotoreak eta ibilgailu txikiak.", descEs: "Ciclomotores y cuadriciclos ligeros.", color: "#0891B2", icon: "navigation", price: "350€", durationEu: "10 praktika-ordu", durationEs: "10 h. prácticas" },
  { code: "C", nameEu: "C Baimena", nameEs: "Permiso C", descEu: "3.500 kg-tik gorako kamioiak.", descEs: "Camiones de más de 3.500 kg.", color: "#DC2626", icon: "package", price: "1.200€", durationEu: "40 praktika-ordu", durationEs: "40 h. prácticas" },
  { code: "D", nameEu: "D Baimena", nameEs: "Permiso D", descEu: "8 eserlekutik gorako autobusak.", descEs: "Autobuses y autocares de más de 8 asientos.", color: "#EA580C", icon: "users", price: "1.400€", durationEu: "45 praktika-ordu", durationEs: "45 h. prácticas" },
  { code: "CAP", nameEu: "Gaitasun Profesionalaren Ziurtagiria", nameEs: "Certificado de Aptitud Profesional", descEu: "Salgai eta bidaiari garraio profesionalentzat nahitaezkoa.", descEs: "Obligatorio para conductores profesionales de mercancías y viajeros.", color: "#059669", icon: "award", price: "550€", durationEu: "140 prestakuntza-ordu", durationEs: "140 h. formación" },
  { code: "ADR", nameEu: "Salgai Arriskutsuen Garraioa", nameEs: "Transporte Mercancías Peligrosas", descEu: "Substantzia arriskutsuak garraiatzeko gaikuntza.", descEs: "Habilitación para transportar sustancias peligrosas.", color: "#B45309", icon: "alert-triangle", price: "700€", durationEu: "80 prestakuntza-ordu", durationEs: "80 h. formación" },
];

export default function CoursesScreen() {
  const insets = useSafeAreaInsets();
  const { lang, t } = useLang();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={[styles.root, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>{t.coursesTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 + (Platform.OS === "web" ? 34 : 0) }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>{t.coursesSubtitle}</Text>

        <View style={styles.grid}>
          {COURSES.map((c) => (
            <Pressable
              key={c.code}
              style={({ pressed }) => [
                styles.card,
                selected === c.code && { borderColor: c.color, borderWidth: 2 },
                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelected(c.code === selected ? null : c.code);
              }}
            >
              {c.tag && (
                <View style={[styles.tag, { backgroundColor: c.color }]}>
                  <Text style={styles.tagText}>{t.mostPopular}</Text>
                </View>
              )}
              <View style={[styles.codeChip, { backgroundColor: c.color + "18" }]}>
                <Feather name={c.icon} size={22} color={c.color} />
              </View>
              <Text style={[styles.code, { color: c.color }]}>{c.code}</Text>
              <Text style={styles.cName}>{lang === "eu" ? c.nameEu : c.nameEs}</Text>
              <Text style={styles.desc}>{lang === "eu" ? c.descEu : c.descEs}</Text>
              <View style={styles.cardFooter}>
                <View style={styles.footerItem}>
                  <Feather name="tag" size={11} color={C.textSecondary} />
                  <Text style={styles.footerText}>{t.from} {c.price}</Text>
                </View>
                <View style={styles.footerItem}>
                  <Feather name="clock" size={11} color={C.textSecondary} />
                  <Text style={styles.footerText}>{lang === "eu" ? c.durationEu : c.durationEs}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {selected && (
          <Pressable
            style={({ pressed }) => [styles.ctaBtn, pressed && { opacity: 0.85 }]}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.push("/(main)/contact");
            }}
          >
            <Feather name="send" size={16} color="#fff" />
            <Text style={styles.ctaText}>{t.requestInfo}</Text>
          </Pressable>
        )}
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
  intro: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textSecondary, lineHeight: 20 },
  grid: { gap: 12 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, gap: 6, borderWidth: 1.5, borderColor: C.border, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1, overflow: "hidden" },
  tag: { position: "absolute", top: 12, right: 12, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  tagText: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: "#fff" },
  codeChip: { width: 46, height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  code: { fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: -0.3 },
  cName: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text },
  desc: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSecondary, lineHeight: 18 },
  cardFooter: { flexDirection: "row", gap: 16, marginTop: 6 },
  footerItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  footerText: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.textSecondary },
  ctaBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: C.primary, borderRadius: 14, height: 54 },
  ctaText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#fff" },
});
