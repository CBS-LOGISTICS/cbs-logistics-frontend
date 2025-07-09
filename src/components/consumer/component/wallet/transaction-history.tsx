import { DollarSign, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Transaction {
  id: string
  type: "deposit" | "locked" | "refund" | "payment"
  title: string
  date: string
  reference: string
  amount: number
  status: "Completed" | "Locked" | "Pending"
}

const transactions: Transaction[] = [
  {
    id: "1",
    type: "deposit",
    title: "Wallet Top-up Via Bank Transfer",
    date: "2025-06-30",
    reference: "REF12345",
    amount: 500.0,
    status: "Completed",
  },
  {
    id: "2",
    type: "locked",
    title: "Funds locked for REQ001 - Office Supplies",
    date: "2025-06-30",
    reference: "REF12345",
    amount: -245.0,
    status: "Locked",
  },
  {
    id: "3",
    type: "refund",
    title: "Refund Order ORD 2023-99",
    date: "2025-06-30",
    reference: "REF12345R",
    amount: 245.0,
    status: "Completed",
  },
  {
    id: "4",
    type: "payment",
    title: "Service Fee - Warehousing",
    date: "2025-06-30",
    reference: "REF12345",
    amount: -245.0,
    status: "Completed",
  },
  {
    id: "5",
    type: "payment",
    title: "Payment to Supplier A",
    date: "2025-06-30",
    reference: "REF12345",
    amount: -245.0,
    status: "Pending",
  },
]

function getTransactionIcon(type: string) {
  switch (type) {
    case "deposit":
      return { icon: DollarSign, color: "bg-green-100 text-green-600" }
    case "refund":
      return { icon: DollarSign, color: "bg-green-100 text-green-600" }
    default:
      return { icon: Lock, color: "bg-orange-100 text-orange-600" }
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700"
    case "Locked":
      return "bg-blue-100 text-blue-700"
    case "Pending":
      return "bg-orange-100 text-orange-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

export function TransactionHistory() {
  return (
    <div>
      <h2 className="text-lg  bg-white p-2 rounded-[10px] font-semibold text-gray-900 mb-4">Transaction History</h2>
      <Card>
        <CardContent className="p-0">
          {transactions.map((transaction, index) => {
            const iconConfig = getTransactionIcon(transaction.type)
            const isPositive = transaction.amount > 0

            return (
              <div
                key={transaction.id}
                className={`p-6 ${index !== transactions.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${iconConfig.color}`}>
                      <iconConfig.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{transaction.title}</h3>
                      <p className="text-sm text-gray-500">
                        {transaction.date} • {transaction.reference}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold mb-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
                      {isPositive ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(transaction.status)}`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
