import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
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
import { useLang } from "@/context/LanguageContext";

const C = Colors.light;

export default function ContactScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLang();

  const ITEMS = [
    { icon: "phone" as const, label: "Telefono", value: "+34 600 000 000", action: () => Linking.openURL("tel:+34600000000"), color: "#22C55E", actionLabel: t.call },
    { icon: "mail" as const, label: "Email", value: "lubaki.autoeskola@gmail.com", action: () => Linking.openURL("mailto:lubaki.autoeskola@gmail.com"), color: "#2563EB", actionLabel: t.sendEmail },
    { icon: "instagram" as const, label: "Instagram", value: "@lubaki.autoeskola", action: () => Linking.openURL("https://www.instagram.com/lubaki.autoeskola/"), color: "#C026D3", actionLabel: t.viewProfile },
    { icon: "globe" as const, label: "Web", value: "lubaki-autoeskola.es", action: () => Linking.openURL("https://sites.google.com/view/lubaki-autoeskola/inicio"), color: "#7C3AED", actionLabel: t.openWeb },
  ];

  const FAQS = [
    { q: t.faq1q, a: t.faq1a },
    { q: t.faq2q, a: t.faq2a },
    { q: t.faq3q, a: t.faq3a },
    { q: t.faq4q, a: t.faq4a },
  ];

  return (
    <View style={[styles.root, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>{t.contactTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 + (Platform.OS === "web" ? 34 : 0) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroBox}>
          <View style={styles.heroIcon}>
            <Feather name="headphones" size={32} color={C.primary} />
          </View>
          <Text style={styles.heroTitle}>{t.contactHero}</Text>
          <Text style={styles.heroSub}>{t.contactSchedule}</Text>
        </View>

        <View style={styles.contactList}>
          {ITEMS.map((item, i) => (
            <Pressable
              key={i}
              style={({ pressed }) => [styles.contactCard, pressed && { opacity: 0.8 }]}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); item.action(); }}
            >
              <View style={[styles.contactIcon, { backgroundColor: item.color + "15" }]}>
                <Feather name={item.icon} size={22} color={item.color} />
              </View>
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>{item.label}</Text>
                <Text style={styles.contactValue}>{item.value}</Text>
              </View>
              <View style={[styles.actionChip, { backgroundColor: item.color + "15" }]}>
                <Text style={[styles.actionChipText, { color: item.color }]}>{item.actionLabel}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t.faqTitle}</Text>

        <View style={styles.faqList}>
          {FAQS.map((faq, i) => (
            <View key={i} style={styles.faqItem}>
              <View style={styles.faqQ}>
                <Feather name="help-circle" size={14} color={C.primary} />
                <Text style={styles.faqQText}>{faq.q}</Text>
              </View>
              <Text style={styles.faqA}>{faq.a}</Text>
            </View>
          ))}
        </View>
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
  heroBox: { backgroundColor: "#fff", borderRadius: 16, padding: 24, alignItems: "center", gap: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  heroIcon: { width: 68, height: 68, borderRadius: 20, backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center", marginBottom: 4 },
  heroTitle: { fontFamily: "Inter_700Bold", fontSize: 20, color: C.text },
  heroSub: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSecondary, textAlign: "center", lineHeight: 19 },
  contactList: { gap: 10 },
  contactCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 14, padding: 16, gap: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  contactIcon: { width: 46, height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  contactText: { flex: 1 },
  contactLabel: { fontFamily: "Inter_500Medium", fontSize: 11, color: C.textSecondary, textTransform: "uppercase", letterSpacing: 0.5 },
  contactValue: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text, marginTop: 2 },
  actionChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  actionChipText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.text, marginTop: 8 },
  faqList: { gap: 10 },
  faqItem: { backgroundColor: "#fff", borderRadius: 12, padding: 16, gap: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  faqQ: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  faqQText: { flex: 1, fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text, lineHeight: 20 },
  faqA: { fontFamily: "Inter_400Regular", fontSize: 13, color: C.textSecondary, lineHeight: 19, marginLeft: 22 },
});
