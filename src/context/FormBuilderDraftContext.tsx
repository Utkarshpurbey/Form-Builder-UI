"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { PageDef } from "../components/page-def/builder/pageDef";

type FormBuilderDraftContextValue = {
  savedFormDef: PageDef | null;
  setSavedFormDef: Dispatch<SetStateAction<PageDef | null>>;
};

const FormBuilderDraftContext = createContext<FormBuilderDraftContextValue | null>(null);

export function FormBuilderDraftProvider({ children }: { children: ReactNode }) {
  const [savedFormDef, setSavedFormDef] = useState<PageDef | null>(null);

  const value = useMemo(
    () => ({
      savedFormDef,
      setSavedFormDef,
    }),
    [savedFormDef],
  );

  return (
    <FormBuilderDraftContext.Provider value={value}>{children}</FormBuilderDraftContext.Provider>
  );
}

export function useFormBuilderDraft(): FormBuilderDraftContextValue {
  const ctx = useContext(FormBuilderDraftContext);
  if (!ctx) {
    throw new Error("useFormBuilderDraft must be used within FormBuilderDraftProvider");
  }
  return ctx;
}
