// Reserves the shared dialog slot before React can batch visibility updates.
export type DialogKey = "coming-soon" | "link-error";
export function createDialogManager() {
  let active: DialogKey | null = null;
  return {
    acquire(key: DialogKey) {
      // Reserve synchronously before React renders; all entry points share this gate.
      if (active !== null) return false;
      active = key;
      return true;
    },
    release(key: DialogKey) {
      if (active === key) active = null;
    },
  };
}
