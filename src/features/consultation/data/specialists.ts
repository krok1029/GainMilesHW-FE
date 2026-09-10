import { Specialist } from "../types/specialist";
const originalNames = ["Kan Chung", "Alisa Mak", "Justin Liu"];
export function createSpecialist(index: number): Specialist {
  return {
    id: `specialist-${index + 1}`,
    name:
      originalNames[index] ??
      `Demo Specialist ${String(index + 1).padStart(3, "0")}`,
  };
}
