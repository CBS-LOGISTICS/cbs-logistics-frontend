import { Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Dollar, Wallet } from "@/components/atoms/icons"

const balanceData = [
  {
    title: "Available Balance",
    amount: "$83,302",
    badge: "Ready to use",
    badgeColor: "bg-green-600 text-white",
    icon: Dollar,
    iconColor: "bg-green-100 text-green-600",
    cardBg: "bg-green-50",
  },
  {
    title: "Total Balance",
    amount: "$83,302",
    badge: "Available + Locked",
    badgeColor: "bg-[#220E5C] text-white",
    icon: Wallet,
    iconColor: "bg-[#CCBDF8] text-purple-600",
    cardBg: "bg-purple-50",
  },
  {
    title: "Locked Funds",
    amount: "$83,302",
    badge: "Pending Requests",
    badgeColor: "bg-orange-600 text-white",
    icon: Lock,
    iconColor: "bg-orange-100 text-orange-600",
    cardBg: "bg-orange-50",
  },
]

export function BalanceCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
      {balanceData.map((item, index) => (
        <Card key={index} className="border-0 py-0 overflow-hidden">
          {/* Top colored section */}
          <div className={`${item.cardBg} p-6`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-3">
                  <span className="text-3xl font-bold text-gray-900">{item.amount}</span>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${item.badgeColor}`}>{item.badge}</span>
              </div>
              <div className={`p-3 rounded-lg ${item.iconColor}`}>
                <item.icon className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Bottom white section */}
          <CardContent className="p-6 pt-4 bg-white">
            <p className="text-sm font-medium text-gray-600">{item.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
