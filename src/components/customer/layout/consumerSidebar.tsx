'use client'
import { Home, Wallet, Package, Grid3X3, FileText, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function CustomerSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  // Menu items
const items = [
    {
      title: "Dashboard",
      url: "/customer/dashboard",
      icon: Home,
      isActive: pathname === "/customer/dashboard",
    },
    {
      title: "Wallet",
      url: "/customer/wallet",
      icon: Wallet,
      isActive: pathname === "/customer/wallet",
    },
    {
      title: "Order Tracking",
      url: "#",
      icon: Package,
      isActive: false,
    },
    {
      title: "Services",
      url: "/customer/services",
      icon: Grid3X3,
      isActive: pathname === "/customer/services",
    },
    {
      title: "Documents",
      url: "#",
      icon: FileText,
      isActive: false,
    },
    {
      title: "Settings",
      url: "/customer/settings",
      icon: Settings,
      isActive: pathname === "/customer/settings",
    },
  ]

  
  return (
    <Sidebar className="border-r-0">
      <SidebarContent className="bg-gray-50">
        <SidebarGroup className="pt-8">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    className={`
                      relative h-12 px-4 text-gray-700 cursor-pointer hover:bg-orange-50 hover:text-orange-600
                      ${
                        item.isActive
                          ? "bg-[#FEEAE6] text-orange-600 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-orange-500"
                          : ""
                      }
                    `}
                  >
                    <a onClick={() => router.push(item.url)} className="flex  items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-gray-50 border-t-0">
        <div className="px-4 py-4">
          <p className="text-sm text-gray-500">Powered by bridgetech</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
