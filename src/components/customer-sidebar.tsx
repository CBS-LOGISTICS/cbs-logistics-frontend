"use client"

import {
  Building2,
  History,
  Home,
  LogOut,
  Settings,
  Wallet,
} from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"


import { LogoutModal } from '@/components/logout-modal'
import { useLogoutUserMutation } from '@/store/slices/usersApi'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function CustomerSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  
  const router = useRouter();
    const [logoutUser, { isLoading }] = useLogoutUserMutation();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
    const handleLogout = async () => {
      try {
        await logoutUser().unwrap();
        router.push('/');
      } catch (error) {
        console.error('Logout failed', error);
      }
    };

  return (
    <>
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/customer/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">My Account</span>
                  <span className="">Customer</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/customer/dashboard">
                    <Home />
                    <span>Overview</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/customer/services">
                    <Building2 />
                    <span>Services</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/customer/wallet">
                    <Wallet />
                    <span>Wallet</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/customer/history">
                    <History />
                    <span>History</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/customer/settings">
                    <Settings />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton asChild>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setIsLogoutModalOpen(true)}>
                  <LogOut />
                  <span>Logout</span>
                </Button>
             </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
     <LogoutModal
            open={isLogoutModalOpen}
            onOpenChange={setIsLogoutModalOpen}
            onConfirm={handleLogout}
            isLoading={isLoading}
          />
        </>
  )
}
