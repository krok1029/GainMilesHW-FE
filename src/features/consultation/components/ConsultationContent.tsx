import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import { Button, colors } from "../../../shared/components/ui";
import { EMAIL_URL, PHONE_URL } from "../../../shared/config/contactLinks";
import { useContactActions } from "../hooks/useContactActions";

export function ConsultationHeading() {
  const { t } = useI18n();

  return (
    <View style={s.heading}>
      <Text style={s.eyebrow}>{t.eyebrow}</Text>
      <Text accessibilityRole="header" style={s.title}>
        {t.title}
      </Text>
      <View style={s.divider} />
      <Text style={s.description}>{t.introduction}</Text>
    </View>
  );
}

export function ContactDetails() {
  const { t } = useI18n();
  const open = useContactActions();

  return (
    <View style={s.contact}>
      <Text style={s.small}>
        {t.contactBeforePhone}
        <Text
          accessibilityRole="link"
          onPress={() => void open(PHONE_URL)}
          style={s.link}
        >
          {t.contactPhone}
        </Text>
        {t.contactBeforeEmail}
        <Text
          accessibilityRole="link"
          onPress={() => void open(EMAIL_URL)}
          style={s.link}
        >
          memberservice@gumhk.com
        </Text>
        {t.contactAfterEmail}
      </Text>
      <View style={s.notice}>
        <Text style={s.info}>ⓘ</Text>
        <Text style={[s.small, { flex: 1 }]}>{t.privacy}</Text>
      </View>
    </View>
  );
}

export function LoadingState({
  more = false,
  message,
}: {
  more?: boolean;
  message?: string;
}) {
  const { t } = useI18n();

  return (
    <View style={s.state} accessibilityLiveRegion="polite">
      <ActivityIndicator color={colors.ink} />
      <Text style={s.small}>
        {message ?? (more ? t.loadingMore : t.loading)}
      </Text>
    </View>
  );
}

export function ErrorState({
  onRetry,
  more = false,
  disabled = false,
}: {
  onRetry: () => void;
  more?: boolean;
  disabled?: boolean;
}) {
  const { t } = useI18n();

  return (
    <View style={s.state} accessibilityLiveRegion="polite">
      <Text style={s.error}>{more ? t.nextPageError : t.error}</Text>
      <Button title={t.retry} onPress={onRetry} secondary disabled={disabled} />
    </View>
  );
}

const s = StyleSheet.create({
  heading: { paddingBottom: 20, paddingTop: 16 },

  eyebrow: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    color: colors.ink,
  },

  title: { fontSize: 22, lineHeight: 28, fontWeight: "700", color: "#555555" },

  divider: { height: 1, backgroundColor: "#F1F1F1", marginVertical: 8 },

  description: { fontSize: 13, lineHeight: 18, color: "#555555" },

  contact: { paddingVertical: 16 },

  small: { fontSize: 12, lineHeight: 18, color: colors.muted },

  link: { color: "#18709F" },

  notice: {
    flexDirection: "row",
    padding: 13,
    gap: 8,
    backgroundColor: "#FFFAE7",
    borderColor: "#EAE3C8",
    borderWidth: 1,
    borderRadius: 9,
    marginTop: 16,
  },

  info: { color: "#C3A03E", fontSize: 16 },

  state: { paddingVertical: 24, gap: 14 },

  error: { color: "#8E3D2B", fontSize: 14, lineHeight: 21 },
});
