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

const DAYS_EU = ["Al", "As", "Az", "Og", "Or", "La", "Ig"];
const DAYS_ES = ["L", "M", "X", "J", "V", "S", "D"];

const MONTHS_EU = [
  "Urtarrila","Otsaila","Martxoa","Apirila","Maiatza","Ekaina",
  "Uztaila","Abuztua","Iraila","Urria","Azaroa","Abendua",
];
const MONTHS_ES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

interface Slot { time: string; available: boolean; booked?: boolean }
interface DaySchedule { dayEu: string; dayEs: string; date: number; slots: Slot[] }

const SCHEDULE: DaySchedule[] = [
  { dayEu: "Al", dayEs: "Lun", date: 24, slots: [
    { time: "09:00", available: false },
    { time: "10:00", available: true, booked: true },
    { time: "11:00", available: true },
    { time: "16:00", available: true },
    { time: "17:00", available: false },
  ]},
  { dayEu: "As", dayEs: "Mar", date: 25, slots: [
    { time: "09:00", available: true },
    { time: "10:00", available: true },
    { time: "17:00", available: true },
  ]},
  { dayEu: "Az", dayEs: "Mié", date: 26, slots: [
    { time: "10:00", available: false },
    { time: "12:00", available: true },
    { time: "16:00", available: false },
  ]},
  { dayEu: "Og", dayEs: "Jue", date: 27, slots: [
    { time: "09:00", available: true },
    { time: "11:00", available: true },
    { time: "17:00", available: true },
  ]},
  { dayEu: "Or", dayEs: "Vie", date: 28, slots: [
    { time: "09:00", available: false },
    { time: "10:00", available: true },
  ]},
];

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { lang, t } = useLang();
  const [selectedDay, setSelectedDay] = useState(0);

  const now = new Date();
  const MONTHS = lang === "eu" ? MONTHS_EU : MONTHS_ES;
  const monthLabel = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  const dayData = SCHEDULE[selectedDay];
  const dayLabel = lang === "eu" ? dayData.dayEu : dayData.dayEs;

  return (
    <View style={[styles.root, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>{t.calendarTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 + (Platform.OS === "web" ? 34 : 0) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.monthRow}>
          <Feather name="calendar" size={16} color={C.primary} />
          <Text style={styles.monthText}>{monthLabel}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
          <View style={styles.daysRow}>
            {SCHEDULE.map((d, i) => (
              <Pressable
                key={i}
                style={[styles.dayChip, i === selectedDay && styles.dayChipActive]}
                onPress={() => { Haptics.selectionAsync(); setSelectedDay(i); }}
              >
                <Text style={[styles.dayName, i === selectedDay && styles.dayTextActive]}>
                  {lang === "eu" ? d.dayEu : d.dayEs}
                </Text>
                <Text style={[styles.dayDate, i === selectedDay && styles.dayTextActive]}>{d.date}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <Text style={styles.sectionTitle}>{t.availableSlots} — {dayLabel}</Text>

        <View style={styles.slotList}>
          {dayData.slots.map((slot, i) => (
            <Pressable
              key={i}
              style={({ pressed }) => [
                styles.slot,
                slot.booked && styles.slotBooked,
                !slot.available && !slot.booked && styles.slotUnavailable,
                pressed && slot.available && !slot.booked && { opacity: 0.75 },
              ]}
              disabled={!slot.available || slot.booked}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            >
              <View style={styles.slotLeft}>
                <Feather
                  name={slot.booked ? "check-circle" : slot.available ? "clock" : "x-circle"}
                  size={18}
                  color={slot.booked ? "#22C55E" : slot.available ? C.primary : "#9CA3AF"}
                />
                <Text style={[styles.slotTime, !slot.available && !slot.booked && styles.slotTimeDisabled]}>
                  {slot.time}
                </Text>
              </View>
              <View style={[
                styles.slotBadge,
                slot.booked ? styles.badgeBooked : slot.available ? styles.badgeAvail : styles.badgeNot,
              ]}>
                <Text style={[
                  styles.slotBadgeText,
                  slot.booked ? styles.badgeBookedText : slot.available ? styles.badgeAvailText : styles.badgeNotText,
                ]}>
                  {slot.booked ? t.booked : slot.available ? t.available : t.occupied}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: "#22C55E" }]} /><Text style={styles.legendText}>{t.yourClass}</Text></View>
          <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: C.primary }]} /><Text style={styles.legendText}>{t.available}</Text></View>
          <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: "#E5E7EB" }]} /><Text style={styles.legendText}>{t.occupied}</Text></View>
        </View>

        <View style={styles.infoBox}>
          <Feather name="info" size={14} color="#7C3AED" />
          <Text style={styles.infoText}>{t.calendarInfo}</Text>
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
  monthRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  monthText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: C.text },
  daysScroll: { marginHorizontal: -16 },
  daysRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingVertical: 4 },
  dayChip: { width: 56, height: 68, borderRadius: 14, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", gap: 4, borderWidth: 1.5, borderColor: C.border },
  dayChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  dayName: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.textSecondary },
  dayDate: { fontFamily: "Inter_700Bold", fontSize: 18, color: C.text },
  dayTextActive: { color: "#fff" },
  sectionTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: C.text },
  slotList: { gap: 8 },
  slot: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", borderRadius: 12, padding: 14, borderWidth: 1.5, borderColor: C.border },
  slotBooked: { borderColor: "#BBF7D0", backgroundColor: "#F0FDF4" },
  slotUnavailable: { backgroundColor: "#F9FAFB" },
  slotLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  slotTime: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: C.text },
  slotTimeDisabled: { color: "#9CA3AF" },
  slotBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeBooked: { backgroundColor: "#DCFCE7" },
  badgeAvail: { backgroundColor: "#DBEAFE" },
  badgeNot: { backgroundColor: "#F3F4F6" },
  slotBadgeText: { fontFamily: "Inter_500Medium", fontSize: 12 },
  badgeBookedText: { color: "#166534" },
  badgeAvailText: { color: "#1D4ED8" },
  badgeNotText: { color: "#6B7280" },
  legend: { flexDirection: "row", gap: 16, justifyContent: "center" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textSecondary },
  infoBox: { flexDirection: "row", gap: 10, backgroundColor: "#F5F3FF", borderRadius: 12, padding: 14, alignItems: "flex-start" },
  infoText: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 13, color: "#5B21B6", lineHeight: 19 },
});
