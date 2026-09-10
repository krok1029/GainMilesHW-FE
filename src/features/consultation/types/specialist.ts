export interface Specialist {
  id: string;
  name: string;
  portraitUrl?: string;
}

export interface SpecialistPage {
  items: Specialist[];
  nextCursor: string | null;
  total: number;
}

export type ListMode = "plain" | "infinite";

export type Scenario = "success" | "first-error" | "next-error" | "empty";

export interface DemoConfig {
  mode: ListMode;
  count: 3 | 120;
  scenario: Scenario;
}
