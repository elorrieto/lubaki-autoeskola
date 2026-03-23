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
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { useLang } from "@/context/LanguageContext";

const C = Colors.light;

interface FormData {
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: string;
  direccion: string;
  cuentaBancaria: string;
  username: string;
  password: string;
}

export default function RegisterScreen() {
  const { register } = useApp();
  const { t } = useLang();
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState<FormData>({
    nombre: "", apellidos: "", dni: "", telefono: "",
    direccion: "", cuentaBancaria: "", username: "", password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const FIELDS: { key: keyof FormData; label: string; icon: keyof typeof Feather.glyphMap; placeholder: string; keyboard?: "default" | "email-address" | "numeric" | "phone-pad"; secure?: boolean }[] = [
    { key: "nombre", label: t.nombre, icon: "user", placeholder: t.nombre },
    { key: "apellidos", label: t.apellidos, icon: "users", placeholder: t.apellidos },
    { key: "dni", label: t.dni, icon: "credit-card", placeholder: "12345678A" },
    { key: "telefono", label: t.telefono, icon: "phone", placeholder: "+34 600 000 000", keyboard: "phone-pad" },
    { key: "direccion", label: t.direccion, icon: "map-pin", placeholder: "—" },
    { key: "cuentaBancaria", label: t.cuentaBancaria, icon: "dollar-sign", placeholder: "ES12 1234 5678 9012 3456 7890" },
    { key: "username", label: t.usuario, icon: "at-sign", placeholder: "usuario123" },
    { key: "password", label: t.contrasena, icon: "lock", placeholder: "••••••••", secure: true },
  ];

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.nombre.trim()) e.nombre = t.required;
    if (!form.apellidos.trim()) e.apellidos = t.required;
    if (!form.dni.trim()) e.dni = t.required;
    if (!form.telefono.trim()) e.telefono = t.required;
    if (!form.username.trim()) e.username = t.required;
    if (!form.password.trim()) e.password = t.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    try {
      await register({
        nombre: form.nombre, apellidos: form.apellidos, dni: form.dni,
        telefono: form.telefono, direccion: form.direccion,
        cuentaBancaria: form.cuentaBancaria, username: form.username,
      });
      router.replace("/(main)/home");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={C.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{t.registerTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 + (Platform.OS === "web" ? 34 : 0) }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>{t.registerSubtitle}</Text>

        <View style={styles.form}>
          {FIELDS.map((field) => (
            <View key={field.key} style={styles.fieldBlock}>
              <Text style={styles.label}>{field.label}</Text>
              <View style={[styles.inputRow, errors[field.key] ? styles.inputError : null]}>
                <Feather
                  name={field.icon}
                  size={17}
                  color={errors[field.key] ? C.error : C.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  placeholderTextColor={C.textSecondary}
                  value={form[field.key]}
                  onChangeText={(v) => setForm((prev) => ({ ...prev, [field.key]: v }))}
                  secureTextEntry={!!field.secure}
                  keyboardType={field.keyboard ?? "default"}
                  autoCapitalize={["username", "password", "dni"].includes(field.key) ? "none" : "words"}
                />
              </View>
              {errors[field.key] && <Text style={styles.errorText}>{errors[field.key]}</Text>}
            </View>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.btnText}>{loading ? t.completing : t.registerTitle}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: "#fff" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: C.inputBackground },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 18, color: C.text },
  scroll: { padding: 20, gap: 20 },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 14, color: C.textSecondary, lineHeight: 20 },
  form: { gap: 14 },
  fieldBlock: { gap: 6 },
  label: { fontFamily: "Inter_500Medium", fontSize: 13, color: C.text },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 14, height: 50, borderWidth: 1.5, borderColor: C.border },
  inputError: { borderColor: C.error, backgroundColor: "#FFF5F5" },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 15, color: C.text },
  errorText: { fontFamily: "Inter_400Regular", fontSize: 12, color: C.error, marginLeft: 4 },
  btn: { backgroundColor: C.primary, borderRadius: 14, height: 54, alignItems: "center", justifyContent: "center", marginTop: 8 },
  btnText: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: "#fff" },
});
