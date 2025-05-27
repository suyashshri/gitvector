import AppSideBar from "@/components/layout/AppSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
// import { cookies } from "next/headers";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const MainLayout = async ({ children }: Props) => {
  // const cookieStore = await cookies();
  // const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSideBar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
};

const MainContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="transition-all duration-300 px-1 py-2 flex-1 max-h-screen">
      <div className="flex items-center gap-2 h-12 border-sidebar-border bg-white border shadow rounded-md p-2 px-4">
        <div className="ml-auto" />
        <UserButton />
      </div>
      <div className="h-2" />
      <div className="bg-white border-sidebar-border border shadow rounded-md p-2 px-4 h-[calc(100vh-4.5rem)] overflow-auto">
        {children}
      </div>
    </main>
  );
};

export default MainLayout;
