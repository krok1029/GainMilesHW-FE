import { Image, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useI18n } from "../../../shared/i18n/I18nProvider";

export function ConsultationHero() {
  const { t } = useI18n();
  return (
    <View style={s.hero} pointerEvents="none">
      <Image
        source={require("../../../../assets/bgImage.png")}
        accessibilityLabel={t.teamBanner}
        resizeMode="contain"
        style={s.image}
      />
      <LinearGradient
        colors={[
          "rgba(170, 163, 134, 1)",
          "rgba(170, 163, 134, 0.64)",
          "rgba(170, 163, 134, 0.25)",
          "rgba(170, 163, 134, 0.04)",
          "rgba(170, 163, 134, 0)",
        ]}
        locations={[0, 0.18, 0.45, 0.72, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const s = StyleSheet.create({
  hero: {
    position: "absolute",
    top: 0,
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#FFF6CA",
  },
  image: { width: "100%", height: "100%", opacity: 0.85 },
});
