import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "TaskFlow | Task Dashboard",
  description: "A reusable project task dashboard built with Next.js and React.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
