export const metadata = {
  title: "Sci?Fi Chase",
  description: "20s cinematic spacecraft chase"
};

import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
