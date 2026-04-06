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
      <div className="md:ml-64 pt-16 md:pt-0 min-h-screen">
        {children}
      </div>
    </>
  );
}
