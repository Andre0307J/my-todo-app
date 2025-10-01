/* eslint-disable react-refresh/only-export-components */

import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/lib/providers";

export const metadata: Metadata = {
  title: "My Todo App",
  description: "A Todo List App migrated to Next.js",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}