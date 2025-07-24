"use client"

import { useState } from "react"
import { User, Mail, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AccountData {
  fullName: string
  email: string
  phoneNumber: string
}

export function AccountSettings() {
  const [accountData, setAccountData] = useState<AccountData>({
    fullName: "Solomon Edem",
    email: "solomonemmanuel21@gmail.com",
    phoneNumber: "+234 (000) 000 000",
  })

  const [isModified, setIsModified] = useState(false)

  const handleInputChange = (field: keyof AccountData, value: string) => {
    setAccountData((prev) => ({ ...prev, [field]: value }))
    setIsModified(true)
  }

  const handleSave = () => {
    console.log("Saving account data:", accountData)
    setIsModified(false)
    // TODO: Implement save functionality
  }

  const handleGoBack = () => {
    console.log("Going back")
    // TODO: Implement navigation back
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-[#F9F9FB] p-2">
          <CardHeader className="border-b bg-white p-2 py-0 rounded-[10px] w-full border-gray-100">
            <CardTitle className="text-2xl  font-semibold text-gray-900">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white rounded-[10px]">
            <div className="flex w-full gap-2">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Account setting</h3>
              <p className="text-gray-600">View and update your account details, profile, and more.</p>
            </div>

            <div className="flex-1">
            <div className="space-y-8">
              {/* Full Name Field */}
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-2 block">
                  Full name
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="fullName"
                    type="text"
                    value={accountData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="pl-10 h-12 text-base"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                  Email
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={accountData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 h-12 text-base"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Phone Number Field */}
              <div>
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 mb-2 block">
                  Phone number (Optional)
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={accountData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className="pl-10 h-12 text-base"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>
            </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-100">
              <Button variant="outline" onClick={handleGoBack} className="px-6 bg-transparent">
                Go Back
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isModified}
                className="bg-red-500 hover:bg-red-600 text-white px-6"
              >
                Save Change
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
