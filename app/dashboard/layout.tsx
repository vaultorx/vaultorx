"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Folder,
  CreditCard,
  TrendingUp,
  Image,
  Gavel,
  FileText,
  Shield,
  LogOut,
  Settings,
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
// import { signOut } from "@/auth";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Collection", href: "/dashboard/collection", icon: Folder },
  { name: "Transactions", href: "/dashboard/transactions", icon: CreditCard },
  { name: "Sales", href: "/dashboard/sales", icon: TrendingUp },
  { name: "Exhibitions", href: "/dashboard/exhibitions", icon: Image },
  { name: "Auctions", href: "/dashboard/auctions", icon: Gavel },
  { name: "Settings", href: "/dashboard/settings", icon: Settings }, // Add this line
  { name: "Privacy Policy", href: "/dashboard/privacy-policy", icon: Shield },
  {
    name: "Terms Of Service",
    href: "/dashboard/terms-of-service",
    icon: FileText,
  },
];

// Custom sidebar component
function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const handleSignOut = async () => await signOut();

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center px-4 py-4 border-b bg-white">
        <h1 className="text-xl font-bold text-sidebar-foreground">Vaultorx</h1>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t bg-gray-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="cursor-pointer"
            >
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

// Main layout component
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="relative w-full flex min-h-screen bg-background">
        <AppSidebar />

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          <div className="sticky top-0 z-10 bg-white border-b border-b-gray-600 p-4 md:hidden">
            <SidebarTrigger />
          </div>
            <div className="flex-1 p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
