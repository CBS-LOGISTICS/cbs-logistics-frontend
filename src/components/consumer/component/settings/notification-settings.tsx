"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  orderUpdates: boolean
  promotionalEmails: boolean
  securityAlerts: boolean
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotionalEmails: false,
    securityAlerts: true,
  })

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    console.log("Saving notification settings:", settings)
    // TODO: Implement save functionality
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-2xl font-semibold text-gray-900">Push Notifications</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Notification Preferences</h3>
              <p className="text-gray-600">Manage how you receive notifications and updates.</p>
            </div>

            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <Label htmlFor="email-notifications" className="text-base font-medium text-gray-900">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleToggle("emailNotifications")}
                />
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <Label htmlFor="push-notifications" className="text-base font-medium text-gray-900">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={() => handleToggle("pushNotifications")}
                />
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <Label htmlFor="sms-notifications" className="text-base font-medium text-gray-900">
                    SMS Notifications
                  </Label>
                  <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={() => handleToggle("smsNotifications")}
                />
              </div>

              {/* Order Updates */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <Label htmlFor="order-updates" className="text-base font-medium text-gray-900">
                    Order Updates
                  </Label>
                  <p className="text-sm text-gray-600">Get notified about order status changes</p>
                </div>
                <Switch
                  id="order-updates"
                  checked={settings.orderUpdates}
                  onCheckedChange={() => handleToggle("orderUpdates")}
                />
              </div>

              {/* Promotional Emails */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <Label htmlFor="promotional-emails" className="text-base font-medium text-gray-900">
                    Promotional Emails
                  </Label>
                  <p className="text-sm text-gray-600">Receive promotional offers and updates</p>
                </div>
                <Switch
                  id="promotional-emails"
                  checked={settings.promotionalEmails}
                  onCheckedChange={() => handleToggle("promotionalEmails")}
                />
              </div>

              {/* Security Alerts */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <Label htmlFor="security-alerts" className="text-base font-medium text-gray-900">
                    Security Alerts
                  </Label>
                  <p className="text-sm text-gray-600">Important security notifications</p>
                </div>
                <Switch
                  id="security-alerts"
                  checked={settings.securityAlerts}
                  onCheckedChange={() => handleToggle("securityAlerts")}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-100">
              <Button variant="outline" className="px-6 bg-transparent">
                Go Back
              </Button>
              <Button onClick={handleSave} className="bg-red-500 hover:bg-red-600 text-white px-6">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
