import { Card, CardContent } from "@/components/ui/card"
import { Box, TruckFast, WalletAdd } from "@/components/atoms/icons"

const quickActions = [
  {
    title: "Request Services",
    description: "Procurement warehousing and D...",
    icon: Box,
    iconColor: "text-red-500",
  },
  {
    title: "Track Shipments",
    description: "Monitor deliveries in real time.",
    icon: TruckFast,
    iconColor: "text-blue-500",
  },
  {
    title: "Manage wallet",
    description: "Add Funds and view transactions.",
    icon: WalletAdd,
    iconColor: "text-green-500",
  },
]

export function QuickActions() {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold bg-white p-4 rounded-[10px] shadow-md transition-shadow text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 rounded-full">
                  <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
