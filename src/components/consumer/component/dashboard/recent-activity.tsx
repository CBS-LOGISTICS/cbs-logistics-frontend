import { Card, CardContent } from "@/components/ui/card"

const activityData = [
  {
    title: "Office Supplies",
    status: "Quote Ready",
    category: "Warehousing",
    priority: "High Priority",
    time: "2 days ago",
    amount: "$245",
  },
  {
    title: "Office Supplies",
    status: "Quote Ready",
    category: "Warehousing",
    priority: "High Priority",
    time: "2 days ago",
    amount: "$245",
  },
  {
    title: "Office Supplies",
    status: "Quote Ready",
    category: "Warehousing",
    priority: "High Priority",
    time: "2 days ago",
    amount: "$245",
  },
  {
    title: "Office Supplies",
    status: "Quote Ready",
    category: "Warehousing",
    priority: "High Priority",
    time: "2 days ago",
    amount: "$245",
  },
]

export function RecentActivity() {
  return (
    <div>
      <h2 className="text-lg font-semibold  bg-white p-4 rounded-[10px] shadow-md transition-shadow text-gray-900 mb-4">Recent Activity</h2>
      <Card>
        <CardContent className="p-0">
          {activityData.map((item, index) => (
            <div key={index} className={`p-6 ${index !== activityData.length - 1 ? "border-b border-gray-100" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      {item.status}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                      {item.category}
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
                <div className="text-lg font-semibold text-gray-900">{item.amount}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
