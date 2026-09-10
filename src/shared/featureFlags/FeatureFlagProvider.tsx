import { createContext, PropsWithChildren, useContext, useState } from "react";
const Context = createContext<{
  consultationEnabled: boolean;
  setConsultationEnabled: (enabled: boolean) => void;
} | null>(null);
export function FeatureFlagProvider({ children }: PropsWithChildren) {
  const [consultationEnabled, setConsultationEnabled] = useState(true);
  return (
    <Context.Provider value={{ consultationEnabled, setConsultationEnabled }}>
      {children}
    </Context.Provider>
  );
}
export function useFeatureFlags() {
  const flags = useContext(Context);
  if (!flags) throw new Error("FeatureFlagProvider is missing");
  return flags;
}
