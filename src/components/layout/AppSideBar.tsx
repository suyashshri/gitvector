"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar";
import {
  CreditCard,
  FolderTree,
  LayoutDashboard,
  MessageCircleQuestion,
  PlusIcon,
  Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import useProject from "@/hooks/use-project";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Q & A",
    href: "/q&a",
    icon: MessageCircleQuestion,
  },
  {
    name: "Meeting",
    href: "/meeting",
    icon: Video,
  },
  {
    name: "Files Visualisation",
    href: "/visualise",
    icon: FolderTree,
  },
  {
    name: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
];

const AppSideBar = () => {
  const pathname = usePathname();
  const { open } = useSidebar();
  const { projects, projectId, setProjectId } = useProject();
  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      className="transition-all duration-300 z-30 w-[260px]"
    >
      <SidebarHeader className="font-bold text-xl text-primary p-4 h-10">
        <div className="flex items-center justify-center gap-2">
          {open && <Link href="/dasboard">GITVECTOR</Link>}
          <span className="ml-auto">
            <SidebarTrigger />
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="mt-4">
        {/* Rest of your sidebar content remains the same */}
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.href}
                      className={cn("flex items-center gap-2", {
                        "bg-primary text-white": pathname === item.href,
                      })}
                    >
                      <item.icon className="w-8 h-8" />
                      <span className="text-md">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Projects group */}
        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects?.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <div onClick={() => setProjectId(item.id)}>
                      <div
                        className={cn(
                          "w-fit  rounded-sm border size-6 flex items-center justify-center text-sm",
                          { "bg-primary text-white": item.id === projectId }
                        )}
                      >
                        {item.name[0].toLocaleUpperCase()}
                      </div>
                      <span>{item.name}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Link href="/create" className="w-fit mx-auto">
          {open ? (
            <Button variant="outline">
              <PlusIcon />
              Create Project
            </Button>
          ) : (
            <Button variant="outline">
              <PlusIcon />
            </Button>
          )}
        </Link>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSideBar;
