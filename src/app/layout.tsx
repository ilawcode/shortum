import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShortcutHub",
  description: "Advanced visual builder for Apple Shortcuts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <Navbar />
        <Sidebar />

        {/* Main Content Area */}
        <main className="md:ml-64 pt-16 md:pt-0 min-h-screen">
          {children}
        </main>

        <Toaster theme="system" position="bottom-right" richColors />
      </body>
    </html>
  );
}
