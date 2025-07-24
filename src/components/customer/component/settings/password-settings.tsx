"use client"

import { useState } from "react"
import { Lock, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PasswordSettings() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handlePasswordChange = (field: keyof typeof passwords, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log("Updating password")
    // TODO: Implement password update functionality
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-[#F9F9FB] p-2">
          <CardHeader className="border-b bg-white p-2 py-0 rounded-[10px] w-full border-gray-100">
            <CardTitle className="text-2xl  font-semibold text-gray-900">Password Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white rounded-[10px]">
            <div className="flex gap-2">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Change Password</h3>
              <p className="text-gray-600">Update your password to keep your account secure.</p>
            </div>

        
          <div className="flex-1">
          <div className="space-y-6">
              {/* Current Password */}
              <div>
                <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 mb-2 block">
                  Current Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) => handlePasswordChange("current", e.target.value)}
                    className="pl-10 pr-10 h-12"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 mb-2 block">
                  New Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwords.new}
                    onChange={(e) => handlePasswordChange("new", e.target.value)}
                    className="pl-10 pr-10 h-12"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mb-2 block">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwords.confirm}
                    onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                    className="pl-10 pr-10 h-12"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
 

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-100">
              <Button variant="outline" className="px-6 bg-transparent">
                Go Back
              </Button>
              <Button onClick={handleSave} className="bg-red-500 hover:bg-red-600 text-white px-6">
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
