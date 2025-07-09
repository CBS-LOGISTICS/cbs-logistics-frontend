import { Wallet } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Graph, Icon, Truck } from "@/components/atoms/icons"

const analyticsData = [
  {
    title: "Active Requests",
    value: "5",
    change: "+5%",
    changeType: "positive",
    icon: Graph,
    iconColor: "bg-[#40C4AA] text-[#40C4AA]",
    cardBg: "bg-green-50",
  },
  {
    title: "Completed",
    value: "47",
    change: "+4.5%",
    changeType: "positive",
    icon: Icon,
    iconColor: "bg-[#7047EB] text-[#7047EB]",
    cardBg: "bg-purple-50",
  },
  {
    title: "In Transit",
    value: "3",
    change: "-5%",
    changeType: "negative",
    icon: Truck,
    iconColor: "bg-[#DF1C41] text-[#DF1C41]",
    cardBg: "bg-red-50",
  },
  {
    title: "Balance",
    value: "$500,000",
    change: "",
    changeType: "neutral",
    icon: Wallet,
    iconColor: "bg-[#54B6ED] text-white",
    cardBg: "bg-blue-50",
  },
]

export function AnalyticsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {analyticsData.map((item, index) => (
        <Card key={index} className={`${item.cardBg} border-0`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">{item.title}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-gray-900">{item.value}</span>
                  {item.change && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.changeType === "positive" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.change}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span
                    className={`${
                      item.changeType === "positive"
                        ? "text-green-600"
                        : item.changeType === "negative"
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {item.change && `${item.change} `}
                  </span>
                  <span>From last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${item.iconColor}`}>
                <item.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
