"use client";

import type { ReactNode } from "react";
import { FormBuilderDraftProvider } from "../../src/context/FormBuilderDraftContext";
import { AppShellHeader } from "../../src/components/AppShellHeader";

export default function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <FormBuilderDraftProvider>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <AppShellHeader />
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      </div>
    </FormBuilderDraftProvider>
  );
}
