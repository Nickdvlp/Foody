"use client";

import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Home, PlusCircle, ListOrdered, Settings, LogOut } from "lucide-react";
import AuthButton from "@/modules/auth/ui/auth-button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const OwnerSidebar = () => {
  const router = useRouter();
  const partner = useSelector((state: RootState) => state.partner.partner);

  return (
    <Sidebar>
      <div className="flex flex-col justify-between h-full bg-gradient-to-b from-orange-50 via-orange-100 to-orange-200 text-gray-800">
        {/* Header */}
        <SidebarHeader className="border-b border-orange-200 py-3">
          <div
            className="flex items-center justify-center gap-3 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => router.push("/")}
          >
            <Image
              src="/icon.png"
              width={36}
              height={36}
              alt="Foody Logo"
              className="rounded-md shadow-sm"
            />
            <h1 className="text-xl font-bold text-orange-600">Foody</h1>
          </div>
        </SidebarHeader>

        {/* Content */}
        <SidebarContent className="px-3 mt-4">
          <SidebarGroup>
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => redirect(`/partner-view/${partner?.id}`)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-100 hover:text-orange-600 transition-colors"
                >
                  <Home size={18} />
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => redirect(`/create-restaurant/${partner?.id}`)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-100 hover:text-orange-600 transition-colors"
                >
                  <PlusCircle size={18} />
                  Add Restaurant
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  // onClick={() => router.push("/owner/settings")}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-orange-100 hover:text-orange-600 transition-colors"
                >
                  <Settings size={18} />
                  Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="border-t border-orange-200 py-3 px-3">
          <div className="flex items-center justify-end pr-5">
            <AuthButton />
          </div>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
};

export default OwnerSidebar;
