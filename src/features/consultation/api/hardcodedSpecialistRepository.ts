// Generates only requested rows; deterministic failures make loading states repeatable.
import { createSpecialist } from "../data/specialists";
import { Scenario } from "../types/specialist";
import { SpecialistRepository } from "./specialistRepository";

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(new Error("Request aborted"));
    };

    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", abort);
      resolve();
    }, ms);

    if (signal?.aborted) abort();
    else signal?.addEventListener("abort", abort, { once: true });
  });
}

export function createHardcodedSpecialistRepository({
  count = 3,
  scenario = "success",
  delayMs = 650,
  cacheKey = "hardcoded",
}: {
  count?: number;
  scenario?: Scenario;
  delayMs?: number;
  cacheKey?: string;
} = {}): SpecialistRepository {
  if (!Number.isInteger(count) || count < 0)
    throw new Error("Invalid specialist count");

  const total = scenario === "empty" ? 0 : count;
  let failed = false;

  async function request(offset: number, signal?: AbortSignal) {
    await delay(delayMs, signal);

    if (
      !failed &&
      ((scenario === "first-error" && offset === 0) ||
        (scenario === "next-error" && offset > 0))
    ) {
      failed = true;
      throw new Error("Simulated loading failure");
    }
  }

  return {
    cacheKey,

    async getAll(signal) {
      await request(0, signal);

      return Array.from({ length: total }, (_, index) =>
        createSpecialist(index),
      );
    },

    async getPage({ cursor, limit, signal }) {
      const offset = cursor === null ? 0 : Number(cursor);

      if (
        !Number.isInteger(limit) ||
        limit < 1 ||
        !Number.isInteger(offset) ||
        offset < 0 ||
        offset > total ||
        (cursor !== null && !/^\d+$/.test(cursor))
      ) {
        throw new Error("Invalid pagination request");
      }

      await request(offset, signal);
      const end = Math.min(offset + limit, total);

      return {
        items: Array.from({ length: end - offset }, (_, index) =>
          createSpecialist(offset + index),
        ),
        nextCursor: end < total ? String(end) : null,
        total,
      };
    },
  };
}
