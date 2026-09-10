import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import { Button } from "../../../shared/components/ui";
import { BOOKING_URL } from "../../../shared/config/contactLinks";
import { useContactActions } from "../hooks/useContactActions";
import { ErrorState, LoadingState } from "../components/ConsultationContent";

export function BookingScreen() {
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const busy = useRef(false);
  const openExternal = useContactActions();

  const openInApp = useCallback(async () => {
    if (busy.current) return;

    busy.current = true;
    setState("loading");

    try {
      await WebBrowser.openBrowserAsync(BOOKING_URL);
      setState("idle");
    } catch {
      setState("error");
    } finally {
      busy.current = false;
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") void openInApp();
  }, [openInApp]);

  return (
    <View style={s.screen}>
      {state === "loading" ? (
        <LoadingState message={t.bookingLoading} />
      ) : state === "error" ? (
        <ErrorState onRetry={() => void openInApp()} />
      ) : (
        <Button title={t.book} onPress={() => void openInApp()} />
      )}
      <Button
        title={t.openExternal}
        onPress={() => void openExternal(BOOKING_URL)}
        secondary
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, padding: 24, gap: 16, backgroundColor: "#FFF" },
});
