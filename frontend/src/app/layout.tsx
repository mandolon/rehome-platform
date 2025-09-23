import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { MockProvider } from "@/components/MockProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rehome Platform",
  description: "Modern project management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MockProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </MockProvider>
      </body>
    </html>
  );
}
