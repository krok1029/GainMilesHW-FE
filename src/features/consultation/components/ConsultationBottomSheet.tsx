import BottomSheet from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import { ListMode } from "../types/specialist";
import { InfiniteSpecialistList, PlainSpecialistList } from "./SpecialistList";

export function ConsultationBottomSheet({
  mode,
  containerHeight,
  initialTop,
  expandedTop,
}: {
  mode: ListMode;
  containerHeight: number;
  initialTop: number;
  expandedTop: number;
}) {
  const snapPoints = useMemo(
    () => [
      ...new Set([containerHeight - initialTop, containerHeight - expandedTop]),
    ],
    [containerHeight, initialTop, expandedTop],
  );

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
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
      }}
      handleStyle={{ height: 16, padding: 0 }}
      handleIndicatorStyle={{ opacity: 0, height: 0 }}
    >
      {mode === "plain" ? <PlainSpecialistList /> : <InfiniteSpecialistList />}
    </BottomSheet>
  );
}
