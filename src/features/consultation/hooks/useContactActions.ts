import { useRef } from "react";
import { Linking } from "react-native";
import { useDialog } from "../../../shared/dialog/DialogProvider";
export function useContactActions() {
  const showDialog = useDialog();
  const busy = useRef(false);
  return async (url: string) => {
    if (busy.current) return;
    busy.current = true;
    try {
      await Linking.openURL(url);
    } catch {
      showDialog("link-error");
    } finally {
      busy.current = false;
    }
  };
}
