// Both retrieval modes share virtualized cards; infinite mode retains earlier pages.
import { useCallback, useMemo, useRef } from "react";
import { ListRenderItem, StyleSheet, Text, View } from "react-native";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import { Button } from "../../../shared/components/ui";
import { Specialist } from "../types/specialist";
import {
  useInfiniteSpecialists,
  useSpecialists,
} from "../hooks/useSpecialists";
import { SpecialistCard } from "./SpecialistCard";
import {
  ConsultationHeading,
  ContactDetails,
  ErrorState,
  LoadingState,
} from "./ConsultationContent";
const renderItem: ListRenderItem<Specialist> = ({ item }) => (
  <SpecialistCard specialist={item} />
);
const keyExtractor = (item: Specialist) => item.id;
const listProps = {
  renderItem,
  keyExtractor,
  contentContainerStyle: { paddingHorizontal: 34, paddingBottom: 24 },
  initialNumToRender: 6,
  windowSize: 7,
  maxToRenderPerBatch: 8,
};
export function PlainSpecialistList() {
  const query = useSpecialists();
  const { t } = useI18n();
  return (
    <BottomSheetFlatList<Specialist>
      {...listProps}
      data={query.data ?? []}
      ListHeaderComponent={
        <>
          <ConsultationHeading />
          {query.isPending ? (
            <LoadingState />
          ) : query.isError ? (
            <ErrorState
              onRetry={() => void query.refetch()}
              disabled={query.isFetching}
            />
          ) : null}
        </>
      }
      ListEmptyComponent={
        !query.isPending && !query.isError ? (
          <Text style={s.message}>{t.noSpecialists}</Text>
        ) : null
      }
      ListFooterComponent={<ContactDetails />}
    />
  );
}
export function InfiniteSpecialistList() {
  const query = useInfiniteSpecialists();
  const { t } = useI18n();
  // Query state updates on render; this gate also covers repeated same-turn events.
  const inFlight = useRef(false);
  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  );
  const { hasNextPage, isFetching, isFetchNextPageError, fetchNextPage } =
    query;
  const loadMore = useCallback(
    async (retry = false) => {
      if (
        inFlight.current ||
        isFetching ||
        !hasNextPage ||
        (isFetchNextPageError && !retry)
      )
        return;
      inFlight.current = true;
      try {
        await fetchNextPage({ cancelRefetch: false });
      } finally {
        inFlight.current = false;
      }
    },
    [hasNextPage, isFetching, isFetchNextPageError, fetchNextPage],
  );
  return (
    <BottomSheetFlatList<Specialist>
      {...listProps}
      data={items}
      onEndReached={() => void loadMore()}
      onEndReachedThreshold={0.3}
      ListHeaderComponent={
        <>
          <ConsultationHeading />
          {query.isPending ? (
            <LoadingState />
          ) : query.isError && !query.data ? (
            <ErrorState
              onRetry={() => void query.refetch()}
              disabled={isFetching}
            />
          ) : null}
        </>
      }
      ListEmptyComponent={
        !query.isPending && !query.isError ? (
          <Text style={s.message}>{t.noSpecialists}</Text>
        ) : null
      }
      ListFooterComponent={
        <View>
          {query.isFetchingNextPage ? (
            <LoadingState more />
          ) : isFetchNextPageError ? (
            <ErrorState more onRetry={() => void loadMore(true)} />
          ) : hasNextPage ? (
            <Button
              title={t.loadMore}
              onPress={() => void loadMore()}
              secondary
              disabled={isFetching}
            />
          ) : items.length > 0 ? (
            <Text style={s.message}>{t.end}</Text>
          ) : null}
          <ContactDetails />
        </View>
      }
    />
  );
}
const s = StyleSheet.create({
  message: {
    fontSize: 13,
    textAlign: "center",
    color: "#707070",
    paddingVertical: 20,
  },
});
