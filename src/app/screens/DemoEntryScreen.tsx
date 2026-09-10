import { useRef, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../navigation/types";
import { useI18n } from "../../shared/i18n/I18nProvider";
import { useFeatureFlags } from "../../shared/featureFlags/FeatureFlagProvider";
import { useDialog } from "../../shared/dialog/DialogProvider";
import { Button, Choices, colors, Section } from "../../shared/components/ui";
import {
  ListMode,
  Scenario,
} from "../../features/consultation/types/specialist";
export function DemoEntryScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Demo">) {
  const { t, locale, setLocale } = useI18n();
  const { consultationEnabled, setConsultationEnabled } = useFeatureFlags();
  const showDialog = useDialog();
  const [mode, setMode] = useState<ListMode>("plain");
  const [count, setCount] = useState<3 | 120>(3);
  const [scenario, setScenario] = useState<Scenario>("success");
  const session = useRef(0);
  const insets = useSafeAreaInsets();
  const enter = () => {
    if (!consultationEnabled) {
      showDialog("coming-soon");
      return;
    }
    navigation.navigate("Consultation", {
      mode,
      count,
      scenario,
      sessionId: `demo-${Date.now()}-${++session.current}`,
    });
  };
  const changeMode = (next: ListMode) => {
    setMode(next);
    if (next === "plain" && scenario === "next-error") setScenario("success");
  };
  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={[
        s.container,
        {
          paddingTop: insets.top + 26,
          paddingBottom: Math.max(insets.bottom, 28),
        },
      ]}
    >
      <View style={s.header}>
        <Text style={s.brand}>
          GUM<Text style={{ color: colors.gold }}>.</Text>
        </Text>
        <Text style={s.tag}>{t.demo}</Text>
      </View>
      <View style={s.intro}>
        <Text accessibilityRole="header" style={s.title}>
          {t.setup}
        </Text>
        <Text style={s.subtitle}>{t.setupHint}</Text>
      </View>
      <View style={s.toggle}>
        <View style={{ gap: 5 }}>
          <Text style={s.label}>{t.feature}</Text>
          <Text style={s.subtitle}>
            {consultationEnabled ? t.enabled : t.disabled}
          </Text>
        </View>
        <Switch
          accessibilityLabel={t.feature}
          value={consultationEnabled}
          onValueChange={setConsultationEnabled}
          trackColor={{ true: "#B69535", false: "#D6D6D6" }}
        />
      </View>
      <Section title={t.language}>
        <Choices
          value={locale}
          onChange={setLocale}
          options={[
            { label: "English", value: "en" },
            { label: "繁體中文", value: "zh-HK" },
          ]}
        />
      </Section>
      <Section title={t.listMode}>
        <Choices
          value={mode}
          onChange={changeMode}
          options={[
            { label: t.plain, value: "plain" },
            { label: t.infinite, value: "infinite" },
          ]}
        />
      </Section>
      <Section title={t.dataset}>
        <Choices
          value={count}
          onChange={(next) => {
            setCount(next);
            if (next === 3 && scenario === "next-error") setScenario("success");
          }}
          options={[
            { label: t.original, value: 3 },
            { label: t.expanded, value: 120 },
          ]}
        />
      </Section>
      <Section title={t.scenario}>
        <Choices
          value={scenario}
          onChange={setScenario}
          options={[
            { label: t.success, value: "success" },
            { label: t.firstError, value: "first-error" },
            ...(mode === "infinite" && count === 120
              ? [{ label: t.nextError, value: "next-error" as const }]
              : []),
            { label: t.empty, value: "empty" },
          ]}
        />
      </Section>
      <View style={s.actions}>
        <Button title={t.enter} onPress={enter} testID="enter-consultation" />
        {!consultationEnabled ? (
          <Button
            title={t.doublePress}
            onPress={() => {
              enter();
              enter();
            }}
            secondary
            testID="double-press"
          />
        ) : null}
      </View>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FCFBF7" },
  container: { padding: 26, gap: 25 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontSize: 31,
    letterSpacing: -2,
    fontWeight: "900",
    color: colors.ink,
  },
  tag: {
    color: colors.muted,
    fontSize: 11,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 8,
    borderRadius: 20,
  },
  intro: { gap: 10, paddingTop: 12 },
  title: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -1,
  },
  subtitle: { fontSize: 13, lineHeight: 20, color: colors.muted },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    backgroundColor: "#FFF",
  },
  label: { fontSize: 15, fontWeight: "600", color: colors.ink },
  actions: { gap: 12, paddingTop: 4 },
});
