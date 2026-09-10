import { createHardcodedSpecialistRepository } from "./hardcodedSpecialistRepository";

describe("hardcoded specialist repository", () => {
  it("should preserve ordering and return exactly the same 120 items in both modes", async () => {
    // Arrange
    const target = createHardcodedSpecialistRepository({
      count: 120,
      delayMs: 0,
    });

    // Act
    const all = await target.getAll();
    const paged = [];
    let cursor: string | null = null;

    do {
      const page = await target.getPage({ cursor, limit: 12 });
      paged.push(...page.items);
      cursor = page.nextCursor;
    } while (cursor !== null);

    // Assert
    expect(paged).toEqual(all);
    expect(new Set(paged.map((item) => item.id)).size).toBe(120);

    expect(paged.slice(0, 3).map((item) => item.name)).toEqual([
      "Kan Chung",
      "Alisa Mak",
      "Justin Liu",
    ]);

    expect(paged[119]).toEqual({
      id: "specialist-120",
      name: "Demo Specialist 120",
    });
  });

  it("should terminate on a partial final page", async () => {
    const target = createHardcodedSpecialistRepository({
      count: 13,
      delayMs: 0,
    });

    const page = await target.getPage({ cursor: "12", limit: 12 });

    expect(page).toEqual({
      items: [{ id: "specialist-13", name: "Demo Specialist 013" }],
      total: 13,
      nextCursor: null,
    });
  });

  it("should return an empty terminal page for empty data", async () => {
    const target = createHardcodedSpecialistRepository({
      scenario: "empty",
      delayMs: 0,
    });

    expect(await target.getAll()).toEqual([]);

    expect(await target.getPage({ cursor: null, limit: 12 })).toEqual({
      items: [],
      total: 0,
      nextCursor: null,
    });
  });

  it.each([
    { cursor: "-1", limit: 12 },
    { cursor: "bad", limit: 12 },
    { cursor: "", limit: 12 },
    { cursor: "4", limit: 12 },
    { cursor: null, limit: 0 },
    { cursor: null, limit: 1.5 },
  ])("should reject invalid pagination %j", async (request) => {
    const target = createHardcodedSpecialistRepository({ delayMs: 0 });

    await expect(target.getPage(request)).rejects.toThrow(
      "Invalid pagination request",
    );
  });

  it("should fail the first request once and allow explicit retry", async () => {
    const target = createHardcodedSpecialistRepository({
      scenario: "first-error",
      delayMs: 0,
    });

    await expect(target.getAll()).rejects.toThrow("Simulated loading failure");

    expect((await target.getAll()).map((item) => item.name)).toEqual([
      "Kan Chung",
      "Alisa Mak",
      "Justin Liu",
    ]);
  });

  it("should recover a failed next page without skipping its items", async () => {
    const target = createHardcodedSpecialistRepository({
      count: 120,
      scenario: "next-error",
      delayMs: 0,
    });

    const first = await target.getPage({ cursor: null, limit: 12 });

    await expect(
      target.getPage({ cursor: first.nextCursor, limit: 12 }),
    ).rejects.toThrow("Simulated loading failure");

    const retry = await target.getPage({ cursor: first.nextCursor, limit: 12 });

    expect(retry.items[0]).toEqual({
      id: "specialist-13",
      name: "Demo Specialist 013",
    });

    expect(retry.nextCursor).toBe("24");
  });

  it("should cancel an in-flight request", async () => {
    const target = createHardcodedSpecialistRepository({ delayMs: 500 });
    const controller = new AbortController();
    const request = target.getAll(controller.signal);
    controller.abort();
    await expect(request).rejects.toThrow("Request aborted");
  });

  it("should reject an already cancelled request", async () => {
    const target = createHardcodedSpecialistRepository();
    const controller = new AbortController();
    controller.abort();

    await expect(target.getAll(controller.signal)).rejects.toThrow(
      "Request aborted",
    );
  });
});
