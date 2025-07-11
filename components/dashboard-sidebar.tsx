"use client";
import {
  User,
  Calendar,
  BookOpen,
  Settings,
  Sun,
  Moon,
  LogOut,
  Calendar1,
  LogOutIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "./ui/button";
import { logout } from "@/lib/auth"; // Adjust the import path as necessary

// Mock user data - replace with actual user data from Firebase
const userData = {
  name: "John Doe",
  email: "john.doe@university.edu",
  school: "University of California, Berkeley",
  major: "Computer Science",
  avatar: "/placeholder.svg?height=32&width=32",
};

const navigationItems = [
  {
    title: "Account",
    url: "/dashboard/account",
    icon: User,
  },
  {
    title: "Classes",
    url: "/dashboard/classes",
    icon: Calendar,
  },
  {
    title: "Notes",
    url: "/dashboard/notes",
    icon: BookOpen,
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: Calendar1,
  },
];

export function DashboardSidebar() {
  const { theme, setTheme } = useTheme();

  const onLogoutClick = async () => {
    await logout();
    window.location.href = "/"; // Redirect to home after logout
  };
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={userData.avatar || "/placeholder.svg"}
                      alt={userData.name}
                    />
                    <AvatarFallback className="rounded-lg">
                      {userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {userData.name}
                    </span>
                    <span className="truncate text-xs">{userData.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={userData.avatar || "/placeholder.svg"}
                        alt={userData.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {userData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userData.name}
                      </span>
                      <span className="truncate text-xs">
                        {userData.school}
                      </span>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/account" className="gap-2 p-2">
                    <User className="h-4 w-4" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2 text-red-600">
                  <Button
                    onClick={onLogoutClick}
                    className="w-full"
                    variant={"ghost"}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
