import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="md:ml-72 pt-18 md:pt-0 min-h-screen bg-[#f1f5f9] dark:bg-[#1c2434]">
        {children}
      </div>
    </>
  );
}
