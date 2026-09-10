import { DemoConfig } from "../../features/consultation/types/specialist";
export type RootStackParamList = {
  Demo: undefined;
  Consultation: DemoConfig & { sessionId: string };
  Booking: undefined;
};
