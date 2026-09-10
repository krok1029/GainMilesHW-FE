import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });

  // Keep the image crop tied to screen width, rather than the available list height.
  const initialTop = Math.min(
    contentSize.width * 0.59,
    Math.max(contentSize.height - 180, 0),
  );

  const expandedTop = Math.min(insets.top + 52, initialTop);

  return (
    <SpecialistProvider repository={repository}>
      <View style={s.screen}>
        <View
          style={s.content}
          onLayout={({ nativeEvent: { layout } }) => {
            setContentSize((current) =>
              current.width === layout.width && current.height === layout.height
                ? current
                : { width: layout.width, height: layout.height },
            );
          }}
        >
          <ConsultationHero />
          {contentSize.height > 0 && (
            <ConsultationBottomSheet
              mode={mode}
              containerHeight={contentSize.height}
              initialTop={initialTop}
              expandedTop={expandedTop}
            />
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.backToSettings}
            onPress={() => navigation.popToTop()}
            style={({ pressed }) => [
              s.back,
              { top: insets.top + 8, opacity: pressed ? 0.5 : 1 },
            ]}
          >
            <View style={s.chevron} />
          </Pressable>
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

  content: {
    flex: 1,
    minHeight: 180,
    overflow: "hidden",
    backgroundColor: "#FFF6CA",
  },

  back: {
    position: "absolute",
    left: 0,
    width: 48,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  chevron: {
    width: 12,
    height: 12,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#383838",
    transform: [{ rotate: "45deg" }],
  },

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
