"use client"

import { RotateCcw, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ServicesHeaderProps {
  onFundWallet: () => void
}

export function ServicesHeader({ onFundWallet }: ServicesHeaderProps) {
  return (
    <div className="flex bg-white p-2 rounded-[10px] items-start justify-between mb-8">
      {/* Left side - Description */}
      <div className="flex-1 max-w-2xl">
        <p className="text-gray-700 leading-relaxed">
          Choose from our comprehensive logistics services to meet your business needs.
          <br />
          Each service is designed to provide maximum efficiency and reliability.
        </p>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3 ml-8">
        <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2" onClick={onFundWallet}>
          <Download className="h-4 w-4" />
          Fund Wallet
        </Button>
      </div>
    </div>
  )
}
