"use client"

import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
  onRequestService: () => void
}

export function ServiceCard({ icon: Icon, title, description, features, onRequestService }: ServiceCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-6 flex-1 flex flex-col">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>

        {/* Features List */}
        <div className="flex-1 mb-6">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Request Service Button */}
        <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium" onClick={onRequestService}>
          Request Service
        </Button>
      </CardContent>
    </Card>
  )
}
