import type { Metadata } from "next";
import Sidebar from "@/app/components/dashboard/Sidebar";
import ProfileMenu from "@/app/components/dashboard/ProfileMenu";

export const metadata: Metadata = {
  title: "EXPLORE — VAWD_IMAGE",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-bg overflow-hidden relative">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Absolute header over the content for the profile menu */}
        <header className="absolute top-0 right-0 h-14 px-4 sm:px-6 z-50 flex items-center justify-end pointer-events-none w-full">
            <div className="pointer-events-auto">
                <ProfileMenu />
            </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 w-full h-full overflow-y-auto relative">
            {children}
        </div>
      </main>
    </div>
  );
}
