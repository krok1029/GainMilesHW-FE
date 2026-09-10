// UI-facing contract: CMS adapters must preserve stable IDs and server ordering.
import { Specialist, SpecialistPage } from "../types/specialist";

export interface SpecialistRepository {
  readonly cacheKey: string;
  getAll(signal?: AbortSignal): Promise<Specialist[]>;
  getPage(request: {
    cursor: string | null;
    limit: number;
    signal?: AbortSignal;
  }): Promise<SpecialistPage>;
}
