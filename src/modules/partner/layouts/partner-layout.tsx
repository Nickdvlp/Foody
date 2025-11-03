import OwnerSidebar from "@/components/owner-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

interface HomeLayoutProps {
  children: React.ReactNode;
}

const PartnerLayout = ({ children }: HomeLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <div className="flex min-h-screen ">
          <div className="md:block hidden">
            <OwnerSidebar />
          </div>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PartnerLayout;
