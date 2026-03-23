import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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

type Tab = "stats" | "students" | "teachers";

interface Student {
  id: string; nombre: string; apellidos: string; dni: string; telefono: string;
  permiso: string; horasPracticas: number; testsAprobados: number;
  aprobadoPrimera: boolean; estado: "activo" | "aprobado" | "baja";
  satisfaccion: number; profesor: string; matricula: string;
}

interface Teacher {
  id: string; nombre: string; apellidos: string; especialidad: string;
  alumnos: number; aprobadosPrimera: number; totalAprobados: number;
  satisfaccionMedia: number; horasImpartidas: number; estado: "activo" | "vacaciones";
}

const STUDENTS: Student[] = [
  { id: "1", nombre: "Ane", apellidos: "Etxebarria Zubikarai", dni: "12345678A", telefono: "+34 612 345 678", permiso: "B", horasPracticas: 18, testsAprobados: 12, aprobadoPrimera: true, estado: "aprobado", satisfaccion: 5, profesor: "Nicoll Duran", matricula: "2024-001" },
  { id: "2", nombre: "Jon", apellidos: "Garmendia López", dni: "87654321B", telefono: "+34 623 456 789", permiso: "B", horasPracticas: 10, testsAprobados: 5, aprobadoPrimera: false, estado: "activo", satisfaccion: 4, profesor: "Agustin Garcia", matricula: "2024-002" },
  { id: "3", nombre: "Miren", apellidos: "Ugalde Azkue", dni: "11223344C", telefono: "+34 634 567 890", permiso: "A", horasPracticas: 15, testsAprobados: 8, aprobadoPrimera: true, estado: "activo", satisfaccion: 5, profesor: "Nicoll Duran", matricula: "2024-003" },
  { id: "4", nombre: "Ibai", apellidos: "Fernández Ruiz", dni: "55667788D", telefono: "+34 645 678 901", permiso: "B", horasPracticas: 22, testsAprobados: 15, aprobadoPrimera: false, estado: "aprobado", satisfaccion: 3, profesor: "Agustin Garcia", matricula: "2024-004" },
  { id: "5", nombre: "Leire", apellidos: "Olabarria Iturbe", dni: "99887766E", telefono: "+34 656 789 012", permiso: "C", horasPracticas: 30, testsAprobados: 10, aprobadoPrimera: true, estado: "activo", satisfaccion: 5, profesor: "Aitor Delgado", matricula: "2024-005" },
  { id: "6", nombre: "Unai", apellidos: "Pérez Martínez", dni: "44332211F", telefono: "+34 667 890 123", permiso: "B", horasPracticas: 5, testsAprobados: 2, aprobadoPrimera: false, estado: "baja", satisfaccion: 2, profesor: "Agustin Garcia", matricula: "2024-006" },
  { id: "7", nombre: "Itziar", apellidos: "Goikoetxea Saez", dni: "33221100G", telefono: "+34 678 901 234", permiso: "AM", horasPracticas: 8, testsAprobados: 6, aprobadoPrimera: true, estado: "aprobado", satisfaccion: 4, profesor: "Nicoll Duran", matricula: "2024-007" },
  { id: "8", nombre: "Asier", apellidos: "Zabala Irizar", dni: "77665544H", telefono: "+34 689 012 345", permiso: "B", horasPracticas: 14, testsAprobados: 9, aprobadoPrimera: false, estado: "activo", satisfaccion: 4, profesor: "Aitor Delgado", matricula: "2024-008" },
];

const TEACHERS: Teacher[] = [
  { id: "t1", nombre: "Nicoll", apellidos: "Duran Carreño", especialidad: "B, A, A1, AM", alumnos: 12, aprobadosPrimera: 8, totalAprobados: 10, satisfaccionMedia: 4.7, horasImpartidas: 248, estado: "activo" },
  { id: "t2", nombre: "Agustin", apellidos: "Garcia Manso", especialidad: "B, C, D, CAP", alumnos: 9, aprobadosPrimera: 5, totalAprobados: 7, satisfaccionMedia: 4.2, horasImpartidas: 196, estado: "activo" },
  { id: "t3", nombre: "Aitor", apellidos: "Delgado", especialidad: "B, ADR, C", alumnos: 6, aprobadosPrimera: 4, totalAprobados: 5, satisfaccionMedia: 4.5, horasImpartidas: 142, estado: "vacaciones" },
];

function StarRating({ value }: { value: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Feather key={s} name="star" size={11} color={s <= value ? "#F59E0B" : "#E5E7EB"} />
      ))}
    </View>
  );
}

function StatBox({ value, label, color, icon }: { value: string; label: string; color: string; icon: keyof typeof Feather.glyphMap }) {
  return (
    <View style={[statStyles.box, { borderTopColor: color }]}>
      <View style={[statStyles.iconWrap, { backgroundColor: color + "18" }]}>
        <Feather name={icon} size={18} color={color} />
      </View>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  box: { flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 12, alignItems: "center", gap: 4, borderTopWidth: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  value: { fontFamily: "Inter_700Bold", fontSize: 20, color: "#0A0A0A" },
  label: { fontFamily: "Inter_400Regular", fontSize: 10, color: "#6B7280", textAlign: "center" },
});

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<Tab>("stats");

  const totalAlumnos = STUDENTS.length;
  const aprobados = STUDENTS.filter((s) => s.estado === "aprobado").length;
  const aprobadosPrimera = STUDENTS.filter((s) => s.aprobadoPrimera).length;
  const bajas = STUDENTS.filter((s) => s.estado === "baja").length;
  const activos = STUDENTS.filter((s) => s.estado === "activo").length;
  const tasaAprobadosPrimera = Math.round((aprobadosPrimera / Math.max(aprobados, 1)) * 100);
  const satisfaccionMedia = STUDENTS.reduce((acc, s) => acc + s.satisfaccion, 0) / STUDENTS.length;
  const satisfaccionPct = Math.round((satisfaccionMedia / 5) * 100);

  const permisoCount: Record<string, number> = {};
  STUDENTS.forEach((s) => { permisoCount[s.permiso] = (permisoCount[s.permiso] || 0) + 1; });

  const TABS: { key: Tab; label: string; icon: keyof typeof Feather.glyphMap }[] = [
    { key: "stats", label: t.statsTab, icon: "bar-chart-2" },
    { key: "students", label: t.studentsTab, icon: "users" },
    { key: "teachers", label: t.teachersTab, icon: "user-check" },
  ];

  const estadoBadge = (e: string) => {
    if (e === "aprobado") return { bg: "#DCFCE7", text: "#166534", label: t.approved };
    if (e === "activo") return { bg: "#DBEAFE", text: "#1D4ED8", label: t.active };
    return { bg: "#FEE2E2", text: "#991B1B", label: t.dropped };
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
      <LinearGradient colors={["#0A2463", "#1B4699"]} style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t.adminTitle}</Text>
          <Text style={styles.headerSub}>Lubaki Autoeskola</Text>
        </View>
        <View style={styles.adminBadge}>
          <Feather name="shield" size={14} color="#F59E0B" />
          <Text style={styles.adminBadgeText}>Admin</Text>
        </View>
      </LinearGradient>

      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => { Haptics.selectionAsync(); setActiveTab(tab.key); }}
          >
            <Feather name={tab.icon} size={15} color={activeTab === tab.key ? C.primary : C.textSecondary} />
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 + (Platform.OS === "web" ? 34 : 0) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── ESTADÍSTICAS ─── */}
        {activeTab === "stats" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.generalSummary}</Text>
            <View style={styles.statsGrid}>
              <StatBox value={String(totalAlumnos)} label={t.totalStudents} color="#2563EB" icon="users" />
              <StatBox value={String(activos)} label={t.activeStudents} color="#22C55E" icon="activity" />
              <StatBox value={String(aprobados)} label={t.approvedStudents} color="#7C3AED" icon="award" />
              <StatBox value={String(bajas)} label={t.droppedStudents} color="#EF4444" icon="x-circle" />
            </View>

            <View style={styles.bigCard}>
              <View style={styles.bigCardHeader}>
                <View style={styles.bigCardIconWrap}>
                  <Feather name="trending-up" size={22} color="#22C55E" />
                </View>
                <View>
                  <Text style={styles.bigCardTitle}>{t.firstTimeRate}</Text>
                  <Text style={styles.bigCardSub}>{aprobadosPrimera} {t.outOf} {aprobados} {t.approvedStudentsOf}</Text>
                </View>
              </View>
              <View style={styles.progressRow}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${tasaAprobadosPrimera}%` as any, backgroundColor: "#22C55E" }]} />
                </View>
                <Text style={[styles.progressPct, { color: "#22C55E" }]}>{tasaAprobadosPrimera}%</Text>
              </View>
              <Text style={styles.progressNote}>
                {tasaAprobadosPrimera >= 60 ? t.aboveNational : t.belowNational}
              </Text>
            </View>

            <View style={styles.bigCard}>
              <View style={styles.bigCardHeader}>
                <View style={[styles.bigCardIconWrap, { backgroundColor: "#FEF3C7" }]}>
                  <Feather name="heart" size={22} color="#F59E0B" />
                </View>
                <View>
                  <Text style={styles.bigCardTitle}>{t.satisfactionIndex}</Text>
                  <Text style={styles.bigCardSub}>{satisfaccionMedia.toFixed(1)} / 5 — {t.avgOf} {totalAlumnos} {t.studentsTab.toLowerCase()}</Text>
                </View>
              </View>
              <View style={styles.progressRow}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${satisfaccionPct}%` as any, backgroundColor: "#F59E0B" }]} />
                </View>
                <Text style={[styles.progressPct, { color: "#F59E0B" }]}>{satisfaccionPct}%</Text>
              </View>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Feather key={s} name="star" size={20} color={s <= Math.round(satisfaccionMedia) ? "#F59E0B" : "#E5E7EB"} />
                ))}
                <Text style={styles.starsLabel}>{satisfaccionMedia.toFixed(1)}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t.studentsByPermit}</Text>
              <View style={styles.permisoList}>
                {Object.entries(permisoCount).map(([permiso, count]) => (
                  <View key={permiso} style={styles.permisoRow}>
                    <View style={styles.permisoChip}><Text style={styles.permisoCode}>{permiso}</Text></View>
                    <View style={styles.permisoBar}>
                      <View style={[styles.permisoBarFill, { width: `${Math.round((count / totalAlumnos) * 100)}%` as any }]} />
                    </View>
                    <Text style={styles.permisoCount}>{count}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t.performanceByTeacher}</Text>
              {TEACHERS.map((teacher) => {
                const tasa = Math.round((teacher.aprobadosPrimera / Math.max(teacher.totalAprobados, 1)) * 100);
                return (
                  <View key={teacher.id} style={styles.teacherStat}>
                    <View style={styles.teacherStatAvatar}>
                      <Text style={styles.teacherInitial}>{teacher.nombre[0]}</Text>
                    </View>
                    <View style={{ flex: 1, gap: 4 }}>
                      <Text style={styles.teacherStatName}>{teacher.nombre} {teacher.apellidos}</Text>
                      <View style={styles.teacherStatRow}>
                        <Text style={styles.teacherStatInfo}>{teacher.alumnos} {t.students}</Text>
                        <Text style={styles.teacherStatInfo}>{t.firstTime}: {tasa}%</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                          <Feather name="star" size={11} color="#F59E0B" />
                          <Text style={styles.teacherStatInfo}>{teacher.satisfaccionMedia}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ─── ALUMNOS ─── */}
        {activeTab === "students" && (
          <View style={styles.section}>
            <View style={styles.listHeader}>
              <Text style={styles.sectionTitle}>{totalAlumnos} {t.registeredStudents}</Text>
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>{activos} {t.activeStudents.toLowerCase()}</Text>
              </View>
            </View>
            {STUDENTS.map((s) => {
              const badge = estadoBadge(s.estado);
              return (
                <View key={s.id} style={styles.studentCard}>
                  <View style={styles.studentCardTop}>
                    <View style={styles.studentAvatar}>
                      <Text style={styles.studentInitial}>{s.nombre[0]}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.studentNameRow}>
                        <Text style={styles.studentName}>{s.nombre} {s.apellidos}</Text>
                        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                          <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
                        </View>
                      </View>
                      <Text style={styles.studentMeta}>{t.specialty.replace("Especialidad", "Permiso")} {s.permiso} · {s.matricula}</Text>
                    </View>
                  </View>

                  <View style={styles.studentGrid}>
                    <View style={styles.studentStat}>
                      <Feather name="clock" size={12} color={C.textSecondary} />
                      <Text style={styles.studentStatVal}>{s.horasPracticas}h</Text>
                    </View>
                    <View style={styles.studentStat}>
                      <Feather name="check-circle" size={12} color={C.textSecondary} />
                      <Text style={styles.studentStatVal}>{s.testsAprobados} {t.tests}</Text>
                    </View>
                    <View style={styles.studentStat}>
                      <Feather name="user" size={12} color={C.textSecondary} />
                      <Text style={styles.studentStatVal}>{s.profesor}</Text>
                    </View>
                    <StarRating value={s.satisfaccion} />
                  </View>

                  <View style={styles.studentDetails}>
                    <View style={styles.studentDetailRow}>
                      <Feather name="credit-card" size={12} color={C.textSecondary} />
                      <Text style={styles.studentDetailText}>{s.dni}</Text>
                    </View>
                    <View style={styles.studentDetailRow}>
                      <Feather name="phone" size={12} color={C.textSecondary} />
                      <Text style={styles.studentDetailText}>{s.telefono}</Text>
                    </View>
                    {s.aprobadoPrimera && (
                      <View style={styles.firstTimeBadge}>
                        <Feather name="zap" size={11} color="#166534" />
                        <Text style={styles.firstTimeBadgeText}>{t.firstTimeBadge}</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ─── PROFESORES ─── */}
        {activeTab === "teachers" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{TEACHERS.length} {t.teachers}</Text>
            {TEACHERS.map((teacher) => {
              const tasa = Math.round((teacher.aprobadosPrimera / Math.max(teacher.totalAprobados, 1)) * 100);
              return (
                <View key={teacher.id} style={styles.teacherCard}>
                  <View style={styles.teacherCardTop}>
                    <View style={styles.teacherAvatar}>
                      <Text style={styles.teacherAvatarText}>{teacher.nombre[0]}{teacher.apellidos[0]}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.teacherNameRow}>
                        <Text style={styles.teacherName}>{teacher.nombre} {teacher.apellidos}</Text>
                        <View style={[styles.badge, teacher.estado === "activo" ? { backgroundColor: "#DCFCE7" } : { backgroundColor: "#FEF3C7" }]}>
                          <Text style={[styles.badgeText, teacher.estado === "activo" ? { color: "#166534" } : { color: "#92400E" }]}>
                            {teacher.estado === "activo" ? t.active : "Vacaciones"}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.teacherSpec}>{t.specialty}: {teacher.especialidad}</Text>
                    </View>
                  </View>

                  <View style={styles.teacherStatsRow}>
                    <View style={styles.teacherStatBox}>
                      <Text style={styles.teacherStatBoxVal}>{teacher.alumnos}</Text>
                      <Text style={styles.teacherStatBoxLbl}>{t.studentsTab}</Text>
                    </View>
                    <View style={styles.teacherStatBoxDiv} />
                    <View style={styles.teacherStatBox}>
                      <Text style={styles.teacherStatBoxVal}>{teacher.totalAprobados}</Text>
                      <Text style={styles.teacherStatBoxLbl}>{t.approvedStudents}</Text>
                    </View>
                    <View style={styles.teacherStatBoxDiv} />
                    <View style={styles.teacherStatBox}>
                      <Text style={[styles.teacherStatBoxVal, { color: "#22C55E" }]}>{tasa}%</Text>
                      <Text style={styles.teacherStatBoxLbl}>{t.firstTime}</Text>
                    </View>
                    <View style={styles.teacherStatBoxDiv} />
                    <View style={styles.teacherStatBox}>
                      <Text style={[styles.teacherStatBoxVal, { color: "#F59E0B" }]}>{teacher.satisfaccionMedia}</Text>
                      <Text style={styles.teacherStatBoxLbl}>{t.avgRating}</Text>
                    </View>
                  </View>

                  <View style={styles.teacherProgressBlock}>
                    <Text style={styles.teacherProgressLabel}>{t.firstTimeApproved}</Text>
                    <View style={styles.progressRow}>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${tasa}%` as any, backgroundColor: "#22C55E" }]} />
                      </View>
                      <Text style={[styles.progressPct, { color: "#22C55E" }]}>{tasa}%</Text>
                    </View>
                  </View>

                  <View style={styles.teacherProgressBlock}>
                    <Text style={styles.teacherProgressLabel}>{t.satisfaction} ({teacher.satisfaccionMedia}/5)</Text>
                    <View style={styles.progressRow}>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${Math.round((teacher.satisfaccionMedia / 5) * 100)}%` as any, backgroundColor: "#F59E0B" }]} />
                      </View>
                      <Text style={[styles.progressPct, { color: "#F59E0B" }]}>{Math.round((teacher.satisfaccionMedia / 5) * 100)}%</Text>
                    </View>
                  </View>

                  <View style={styles.teacherHoursRow}>
                    <Feather name="clock" size={13} color={C.textSecondary} />
                    <Text style={styles.teacherHoursText}>{teacher.horasImpartidas} {t.hoursGiven}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  backBtn: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: "rgba(255,255,255,0.15)" },
  headerCenter: { flex: 1 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: "#fff" },
  headerSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 1 },
  adminBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(245,158,11,0.2)", borderWidth: 1, borderColor: "rgba(245,158,11,0.4)", paddingHorizontal: 8, paddingVertical: 5, borderRadius: 20 },
  adminBadgeText: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: "#F59E0B" },
  tabBar: { flexDirection: "row", backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: C.border },
  tab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabActive: { borderBottomColor: C.primary },
  tabText: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.textSecondary },
  tabTextActive: { fontFamily: "Inter_600SemiBold", color: C.primary },
  scroll: { padding: 16 },
  section: { gap: 12 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: C.text },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  bigCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  bigCardHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  bigCardIconWrap: { width: 46, height: 46, borderRadius: 12, backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center" },
  bigCardTitle: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.text },
  bigCardSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textSecondary, marginTop: 2 },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  progressBar: { flex: 1, height: 10, borderRadius: 5, backgroundColor: "#F1F5F9", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 5 },
  progressPct: { fontFamily: "Inter_700Bold", fontSize: 14 },
  progressNote: { fontFamily: "Inter_400Regular", fontSize: 12, color: "#22C55E" },
  starsRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  starsLabel: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#F59E0B", marginLeft: 4 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardTitle: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.text },
  permisoList: { gap: 8 },
  permisoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  permisoChip: { width: 34, height: 28, borderRadius: 6, backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center" },
  permisoCode: { fontFamily: "Inter_700Bold", fontSize: 12, color: C.primary },
  permisoBar: { flex: 1, height: 8, borderRadius: 4, backgroundColor: "#F1F5F9", overflow: "hidden" },
  permisoBarFill: { height: "100%", borderRadius: 4, backgroundColor: C.primary },
  permisoCount: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.text, width: 20, textAlign: "right" },
  teacherStat: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 },
  teacherStatAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#DBEAFE", alignItems: "center", justifyContent: "center" },
  teacherInitial: { fontFamily: "Inter_700Bold", fontSize: 14, color: C.primary },
  teacherStatName: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: C.text },
  teacherStatRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  teacherStatInfo: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textSecondary },
  listHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  activePill: { backgroundColor: "#DCFCE7", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  activePillText: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: "#166534" },
  studentCard: { backgroundColor: "#fff", borderRadius: 16, padding: 14, gap: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  studentCardTop: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  studentAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#DBEAFE", alignItems: "center", justifyContent: "center" },
  studentInitial: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.primary },
  studentNameRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  studentName: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: C.text },
  studentMeta: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textSecondary, marginTop: 2 },
  badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20 },
  badgeText: { fontFamily: "Inter_600SemiBold", fontSize: 10 },
  studentGrid: { flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 6, borderTopWidth: 1, borderTopColor: C.border, flexWrap: "wrap" },
  studentStat: { flexDirection: "row", alignItems: "center", gap: 4 },
  studentStatVal: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.text },
  studentDetails: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 10 },
  studentDetailRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  studentDetailText: { fontFamily: "Inter_400Regular", fontSize: 11, color: C.textSecondary },
  firstTimeBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#DCFCE7", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 20 },
  firstTimeBadgeText: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: "#166534" },
  teacherCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  teacherCardTop: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  teacherAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#EDE9FE", alignItems: "center", justifyContent: "center" },
  teacherAvatarText: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#7C3AED" },
  teacherNameRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  teacherName: { fontFamily: "Inter_700Bold", fontSize: 15, color: C.text },
  teacherSpec: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textSecondary, marginTop: 2 },
  teacherStatsRow: { flexDirection: "row", backgroundColor: C.inputBackground, borderRadius: 12, overflow: "hidden" },
  teacherStatBox: { flex: 1, alignItems: "center", paddingVertical: 10, gap: 2 },
  teacherStatBoxVal: { fontFamily: "Inter_700Bold", fontSize: 16, color: C.text },
  teacherStatBoxLbl: { fontFamily: "Inter_400Regular", fontSize: 10, color: C.textSecondary },
  teacherStatBoxDiv: { width: 1, backgroundColor: C.border },
  teacherProgressBlock: { gap: 6 },
  teacherProgressLabel: { fontFamily: "Inter_500Medium", fontSize: 12, color: C.textSecondary },
  teacherHoursRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  teacherHoursText: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.textSecondary },
});
