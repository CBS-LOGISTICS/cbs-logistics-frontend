"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Refresh } from "@/components/atoms/icons"

interface WalletHeaderProps {
  onFundWallet: () => void
}

export function WalletHeader({ onFundWallet }: WalletHeaderProps) {
  return (
    <div className="flex items-center bg-white p-2 rounded-[10px] justify-between mb-2">
      {/* Left side - Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fund Wallet</h1>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent">
          <Refresh className="h-4 w-4" />
        </Button>
        <Button className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2" onClick={onFundWallet}>
          <Download className="h-4 w-4" />
          Fund Wallet
        </Button>
      </div>
    </div>
  )
}
