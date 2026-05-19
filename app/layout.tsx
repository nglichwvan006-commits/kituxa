import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QLKTX",
  description: "Quản lí phòng ký túc xá với Supabase"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
