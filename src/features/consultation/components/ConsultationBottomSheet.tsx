import BottomSheet from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import { ListMode } from "../types/specialist";
import { InfiniteSpecialistList, PlainSpecialistList } from "./SpecialistList";
export function ConsultationBottomSheet({ mode }: { mode: ListMode }) {
  const snapPoints = useMemo(() => ["68%", "100%"], []);
  return (
    <BottomSheet
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose={false}
      accessible={false}
      accessibilityRole="none"
      backgroundStyle={{
        backgroundColor: "#FFF",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
      }}
      handleIndicatorStyle={{ backgroundColor: "#DAD7D0", width: 34 }}
    >
      {mode === "plain" ? <PlainSpecialistList /> : <InfiniteSpecialistList />}
    </BottomSheet>
  );
}
