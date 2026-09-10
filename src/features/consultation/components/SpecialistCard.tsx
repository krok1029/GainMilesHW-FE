import { memo, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Specialist } from "../types/specialist";
import { useI18n } from "../../../shared/i18n/I18nProvider";
export const SpecialistCard = memo(function SpecialistCard({
  specialist,
}: {
  specialist: Specialist;
}) {
  const { t } = useI18n();
  const [failed, setFailed] = useState(false);
  return (
    <View style={s.card}>
      {specialist.portraitUrl && !failed ? (
        <Image
          source={{ uri: specialist.portraitUrl }}
          accessibilityLabel={specialist.name}
          style={s.portrait}
          onError={() => setFailed(true)}
        />
      ) : (
        <View style={s.portrait} accessibilityLabel={t.specialistPortrait} />
      )}
      <Text style={s.name}>{specialist.name}</Text>
    </View>
  );
});
const s = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderColor: "#F4F4F4",
    borderWidth: 1,
    boxShadow: "0px 3px 6px rgba(0,0,0,0.07)",
  },
  portrait: { width: 76, height: 76, borderRadius: 7, backgroundColor: "#AAA" },
  name: { flex: 1, fontSize: 14, color: "#282828", fontWeight: "500" },
});
