"use client"

import { useState } from "react"
import { NavigationTabs } from "./component/dashboard/navigation-tabs"
import { AnalyticsCards } from "./component/dashboard/analytics-cards"
import { QuickActions } from "./component/dashboard/quick-actions"
import { RecentActivity } from "./component/dashboard/recent-activity"


export function DashboardContent() {
  const [activeTab, setActiveTab] = useState("overview")

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === "order-tracking") {
      // Navigate to order tracking page
      console.log("Navigate to order tracking page")
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <NavigationTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab === "overview" && (
          <>
            <AnalyticsCards />
            <QuickActions />
            <RecentActivity />
          </>
        )}

        {activeTab === "order-tracking" && (
          <div className="text-center py-12">
            <p className="text-gray-600">Order Tracking page content would go here</p>
          </div>
        )}
      </div>
    </div>
  )
}
