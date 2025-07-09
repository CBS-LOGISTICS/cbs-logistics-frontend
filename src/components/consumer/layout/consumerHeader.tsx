"use client"
import { Mail, Bell, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

// Map routes to their corresponding titles
const routeTitles: Record<string, string> = {
  "/consumer/dashboard": "Dashboard",
  "/consumer/wallet": "Wallet",
  "/consumer/order-tracking": "Order Tracking",
  "/consumer/services": "Services",
  "/consumer/documents": "Documents",
  "/consumer/settings": "Settings"
}

export function ConsumerHeader() {
  const pathname = usePathname()
  // Get the title from the mapping, default to "Dashboard" if route not found
  const title = routeTitles[pathname] || "Dashboard"
  
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {/* Left side - Page title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>

      {/* Right side - Icons section */}
      <div className="flex items-center gap-3">
        {/* Message Icon */}
        <Button variant="outline" size="icon" className="h-10 w-10 border border-gray-200 bg-white hover:bg-gray-50">
          <Mail className="h-5 w-5 text-gray-600" />
        </Button>

        {/* Notification Icon */}
        <Button variant="outline" size="icon" className="h-10 w-10 border border-gray-200 bg-white hover:bg-gray-50">
          <Bell className="h-5 w-5 text-gray-600" />
        </Button>

        {/* Profile Section */}
        <Button
          variant="outline"
          className="h-10 px-3 border border-gray-200 bg-white hover:bg-gray-50 flex items-center gap-2"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Profile" />
            <AvatarFallback className="text-xs bg-blue-500 text-white">JD</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    </header>
  )
}
