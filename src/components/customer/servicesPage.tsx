"use client"

import { useState } from "react"
import { ServicesHeader } from "./component/service/services-header"
import { ServicesGrid } from "./component/service/services-grid"

export function ServicesContent() {
  const [showFundModal, setShowFundModal] = useState(false)

  const handleFundWallet = () => {
    setShowFundModal(true)
    // TODO: Implement fund wallet modal
    console.log("Open fund wallet modal")
  }

  return (
    <div className="w-full  min-h-screen">
      <div className="max-w-6xl bg-[#F9F9FB] border-[#DFE1E6] border p-2 rounded-[10px] mx-auto">
        <ServicesHeader onFundWallet={handleFundWallet} />
        <ServicesGrid />
      </div>
    </div>
  )
}
