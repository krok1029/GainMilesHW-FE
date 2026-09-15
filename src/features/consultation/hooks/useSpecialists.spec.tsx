import { PropsWithChildren } from "react";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SpecialistProvider } from "../../../app/providers/SpecialistProvider";
import { createHardcodedSpecialistRepository } from "../api/hardcodedSpecialistRepository";
import { useInfiniteSpecialists } from "./useSpecialists";

describe("infinite specialist query", () => {
  it("should preserve loaded rows on next-page failure and recover the same page", async () => {
    // Arrange
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });

    const repository = createHardcodedSpecialistRepository({
      count: 120,
      scenario: "next-error",
      delayMs: 0,
    });

    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={client}>
        <SpecialistProvider repository={repository}>
          {children}
        </SpecialistProvider>
      </QueryClientProvider>
    );

    const target = renderHook(useInfiniteSpecialists, { wrapper });
    await waitFor(() => expect(target.result.current.isSuccess).toBe(true));
    const firstPage = target.result.current.data?.pages[0];

    // Act
    await act(async () => {
      await target.result.current.fetchNextPage();
    });

    // Assert
    await waitFor(() =>
      expect(target.result.current.isFetchNextPageError).toBe(true),
    );

    expect(target.result.current.data?.pages).toEqual([firstPage]);

    await act(async () => {
      await target.result.current.fetchNextPage();
    });

    await waitFor(() =>
      expect(target.result.current.data?.pages).toHaveLength(2),
    );

    expect(target.result.current.data?.pages[1].items[0].id).toBe(
      "specialist-13",
    );

    target.unmount();
    client.clear();
  });
});
