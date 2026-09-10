// Keep query state independent of the hardcoded or future CMS data source.
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSpecialistRepository } from "../../../app/providers/SpecialistProvider";

export const PAGE_SIZE = 12;

export function useSpecialists() {
  const repository = useSpecialistRepository();

  return useQuery({
    queryKey: ["specialists", repository.cacheKey, "plain"],
    queryFn: ({ signal }) => repository.getAll(signal),
  });
}

export function useInfiniteSpecialists() {
  const repository = useSpecialistRepository();

  return useInfiniteQuery({
    queryKey: ["specialists", repository.cacheKey, "infinite"],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) =>
      repository.getPage({ cursor: pageParam, limit: PAGE_SIZE, signal }),
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
}
