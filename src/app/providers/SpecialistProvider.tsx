import { createContext, PropsWithChildren, useContext } from "react";
import { SpecialistRepository } from "../../features/consultation/api/specialistRepository";
const Context = createContext<SpecialistRepository | null>(null);
export function SpecialistProvider({
  repository,
  children,
}: PropsWithChildren<{ repository: SpecialistRepository }>) {
  return <Context.Provider value={repository}>{children}</Context.Provider>;
}
export function useSpecialistRepository() {
  const repository = useContext(Context);
  if (!repository) throw new Error("SpecialistProvider is missing");
  return repository;
}
