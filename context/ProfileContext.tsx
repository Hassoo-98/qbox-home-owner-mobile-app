import { createContext, ReactNode, useMemo, useState } from "react";

type ProfileContextType = {
  onSave: (() => void) | null;
  setOnSave: (fn: (() => void) | null) => void;
};

export const ProfileContext = createContext<ProfileContextType>({
  onSave: null,
  setOnSave: () => { },
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [onSave, setOnSave] = useState<(() => void) | null>(null);

  const value = useMemo(() => ({ onSave, setOnSave }), [onSave]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

