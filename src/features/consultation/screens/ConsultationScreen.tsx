import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../../../app/navigation/types";
import { SpecialistProvider } from "../../../app/providers/SpecialistProvider";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import { Button } from "../../../shared/components/ui";
import { createHardcodedSpecialistRepository } from "../api/hardcodedSpecialistRepository";
import { whatsappUrl } from "../api/contactLinks";
import { useContactActions } from "../hooks/useContactActions";
import { ConsultationBottomSheet } from "../components/ConsultationBottomSheet";
import { ConsultationHero } from "../components/ConsultationHero";
export function ConsultationScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Consultation">) {
  const { count, scenario, mode, sessionId } = route.params;
  const repository = useMemo(
    () =>
      createHardcodedSpecialistRepository({
        count,
        scenario,
        cacheKey: sessionId,
      }),
    [count, scenario, sessionId],
  );
  const { t, locale } = useI18n();
  const insets = useSafeAreaInsets();
  const open = useContactActions();
  return (
    <SpecialistProvider repository={repository}>
      <View style={s.screen}>
        <View style={s.content}>
          <ConsultationHero />
          <ConsultationBottomSheet mode={mode} />
        </View>
        <View
          style={[s.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}
        >
          <View style={s.hours}>
            <Text style={s.hourText}>{t.hours}</Text>
            <Text style={s.hourText}>{t.weekdays}</Text>
            <Text style={s.hourText}>{t.holidays}</Text>
          </View>
          <Button
            title={t.book}
            onPress={() => navigation.navigate("Booking")}
          />
          <Button
            title={t.whatsapp}
            onPress={() => void open(whatsappUrl(locale))}
          />
        </View>
      </View>
    </SpecialistProvider>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFF" },
  content: { flex: 1, minHeight: 180 },
  footer: {
    backgroundColor: "#FFF",
    paddingHorizontal: 22,
    paddingTop: 12,
    gap: 12,
    borderTopWidth: 1,
    borderColor: "#F5F5F5",
  },
  hours: { alignItems: "center", paddingBottom: 2 },
  hourText: {
    fontSize: 11,
    lineHeight: 17,
    color: "#606060",
    textAlign: "center",
  },
});
