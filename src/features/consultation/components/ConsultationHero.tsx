// Temporary banner placeholder; replace with the supplied Figma team image.
import { StyleSheet, Text, View } from "react-native";
import { useI18n } from "../../../shared/i18n/I18nProvider";
export function ConsultationHero() {
  const { t } = useI18n();
  return (
    <View style={s.hero} accessibilityLabel={t.teamBanner}>
      <View style={s.circle} />
      <Text style={s.brand}>GUM</Text>
      <View style={s.team} accessibilityElementsHidden>
        <View style={s.person}>
          <View style={s.head} />
          <View style={s.jacket} />
        </View>
        <View style={s.person}>
          <View style={[s.head, { backgroundColor: "#B3A382" }]} />
          <View style={[s.jacket, { backgroundColor: "#D8B94F" }]} />
        </View>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  hero: { height: 260, backgroundColor: "#EEE4B6", overflow: "hidden" },
  circle: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#E4C95D",
    alignSelf: "center",
    top: 22,
  },
  brand: {
    position: "absolute",
    right: 24,
    top: 20,
    fontSize: 23,
    letterSpacing: -1.5,
    fontWeight: "900",
    color: "#756331",
  },
  team: { flexDirection: "row", alignSelf: "center", top: 52, gap: 6 },
  person: { alignItems: "center", width: 120 },
  head: {
    width: 57,
    height: 68,
    borderRadius: 26,
    backgroundColor: "#C4B28D",
    zIndex: 1,
  },
  jacket: {
    width: 120,
    height: 160,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: "#484741",
    marginTop: -3,
  },
});
