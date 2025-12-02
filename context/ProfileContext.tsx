import { createContext, ReactNode, useState } from "react";

type ProfileContextType = {
  onSave: (() => void) | null;
  setOnSave: (fn: (() => void) | null) => void;
};

export const ProfileContext = createContext<ProfileContextType>({
  onSave: null,
  setOnSave: () => {},
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [onSave, setOnSave] = useState<(() => void) | null>(null);

  return (
    <ProfileContext.Provider value={{ onSave, setOnSave }}>
      {children}
    </ProfileContext.Provider>
  );
}
