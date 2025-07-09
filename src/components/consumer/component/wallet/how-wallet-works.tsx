import { AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const walletRules = [
  "Fund your wallet before confirming any requests",
  "Funds are locked when you submit a request",
  "Payment is only released after you confirm delivery",
  "Unused funds remain available for future requests",
]

export function HowWalletWorks() {
  return (
    <Card className="bg-red-50 border-red-100 ">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">How Wallet Works</h3>
            <ul className="space-y-2">
              {walletRules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
