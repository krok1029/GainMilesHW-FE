// Hosts one translated dialog for every entry point in the app.
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { useI18n } from "../i18n/I18nProvider";
import { Button, colors } from "../components/ui";
import { createDialogManager, DialogKey } from "./dialogManager";

const DialogContext = createContext<((key: DialogKey) => boolean) | null>(null);

export function DialogProvider({ children }: PropsWithChildren) {
  const manager = useRef(createDialogManager());
  const [active, setActive] = useState<DialogKey | null>(null);
  const { t } = useI18n();

  const show = useCallback((key: DialogKey) => {
    if (!manager.current.acquire(key)) return false;

    setActive(key);

    return true;
  }, []);

  const close = () => {
    if (!active) return;

    manager.current.release(active);
    setActive(null);
  };

  return (
    <DialogContext.Provider value={show}>
      {children}
      <Modal
        visible={active !== null}
        transparent
        animationType="none"
        onRequestClose={close}
      >
        <View style={s.scrim}>
          <View accessibilityViewIsModal style={s.card} testID="shared-dialog">
            <Text accessibilityRole="header" style={s.title}>
              {active === "coming-soon" ? t.comingSoon : t.linkErrorTitle}
            </Text>
            <Text style={s.body}>
              {active === "coming-soon" ? t.comingSoonBody : t.linkErrorBody}
            </Text>
            <Button title={t.close} onPress={close} />
          </View>
        </View>
      </Modal>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const show = useContext(DialogContext);

  if (!show) throw new Error("DialogProvider is missing");

  return show;
}

const s = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: "#0007",
    justifyContent: "center",
    padding: 28,
    alignItems: "center",
  },

  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 22,
    gap: 18,
  },

  title: { fontSize: 23, fontWeight: "700", color: colors.ink },

  body: { fontSize: 15, lineHeight: 23, color: colors.muted },
});
