"use client"

import { useState } from "react"
import { AccountSettings } from "./component/settings/account-settings"
import { PasswordSettings } from "./component/settings/password-settings"
import { NotificationSettings } from "./component/settings/notification-settings"
import { SettingsSidebar } from "./component/settings/settings-sidebar"


export function SettingsContent() {
  const [activeTab, setActiveTab] = useState("account")

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountSettings />
      case "password":
        return <PasswordSettings />
      case "notifications":
        return <NotificationSettings />
      default:
        return <AccountSettings />
    }
  }

  return (
    <div className="flex h-full w-full  bg-gray-50">
      <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  )
}
