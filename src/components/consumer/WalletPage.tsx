"use client"

import { useState } from "react"
import { WalletHeader } from "./component/wallet/wallet-header"
import { BalanceCards } from "./component/wallet/balance-card"
import { HowWalletWorks } from "./component/wallet/how-wallet-works"
import { TransactionHistory } from "./component/wallet/transaction-history"

export function WalletContent() {
  const [showFundModal, setShowFundModal] = useState(false)

  const handleFundWallet = () => {
    setShowFundModal(true)
    // TODO: Implement fund wallet modal
    console.log("Open fund wallet modal")
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#DFE1E6] p-2 rounded-[10px]">
          <WalletHeader onFundWallet={handleFundWallet} />
          <BalanceCards />
          <HowWalletWorks />
        </div>
        <div className="bg-[#DFE1E6] p-2 mt-6 rounded-[10px]">
          <TransactionHistory />
        </div>
      </div>
    </div>
  )
}
