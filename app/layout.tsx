import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClientProviders } from "../src/components/ClientProviders";
import "../src/index.css";

export const metadata: Metadata = {
  title: "Formvity",
  description: "Form builder UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
