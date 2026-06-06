import { createContext, ReactNode, useMemo, useState } from "react";

type ProfileContextType = {
  onSave: (() => void) | null;
  isSaving: boolean;
  setOnSave: (fn: (() => void) | null) => void;
  setIsSaving: (next: boolean) => void;
};

export const ProfileContext = createContext<ProfileContextType>({
  onSave: null,
  isSaving: false,
  setOnSave: () => { },
  setIsSaving: () => { },
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [onSave, setOnSave] = useState<(() => void) | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const value = useMemo(() => ({ onSave, isSaving, setOnSave, setIsSaving }), [isSaving, onSave]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}
