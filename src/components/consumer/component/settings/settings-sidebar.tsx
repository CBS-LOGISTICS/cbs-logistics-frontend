"use client"

import { Button } from "@/components/ui/button"

interface SettingsSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const settingsTabs = [
  { id: "account", label: "Account" },
  { id: "password", label: "Password" },
  { id: "notifications", label: "Push Notifications" },
]

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <div className="w-48 bg-white border-r h-[calc(100vh-4rem)] border-gray-200 p-4">
      <nav className="space-y-2">
        {settingsTabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "secondary" : "ghost"}
            className={`w-full justify-start text-left font-normal ${
              activeTab === tab.id ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </nav>
    </div>
  )
}
