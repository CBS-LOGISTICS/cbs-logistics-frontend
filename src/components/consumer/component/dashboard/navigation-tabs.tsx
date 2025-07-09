"use client"

import { LayoutGrid, Sparkles, RotateCcw, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Refresh } from "@/components/atoms/icons"

interface NavigationTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <div className="flex items-center bg-white p-3 rounded-[10px] shadow-md transition-shadow justify-between mb-6">
      {/* Left side - Tabs */}
      <div className="flex items-center gap-1">
        <Button
          variant={activeTab === "overview" ? "secondary" : "ghost"}
          className={`flex items-center gap-2 px-4 py-2 ${
            activeTab === "overview" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => onTabChange("overview")}
        >
          <LayoutGrid className="h-4 w-4" />
          Overview
        </Button>
        <Button
          variant={activeTab === "order-tracking" ? "secondary" : "ghost"}
          className={`flex items-center gap-2 px-4 py-2 ${
            activeTab === "order-tracking" ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => onTabChange("order-tracking")}
        >
          <Sparkles className="h-4 w-4" />
          Order Tracking
        </Button>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent">
          <Refresh className="h-4 w-4" />
        </Button>
        <Button className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2">
          <Download className="h-4 w-4" />
          Fund Wallet
        </Button>
      </div>
    </div>
  )
}
