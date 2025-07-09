import { Package, Warehouse, Truck } from "lucide-react"
import { ServiceCard } from "./service-card"

const servicesData = [
  {
    icon: Package,
    title: "Procurement Services",
    description: "Source products and materials from verified suppliers worldwide",
    features: ["Global supplier network", "Quality assurance", "Competitive pricing", "Bulk ordering discounts"],
  },
  {
    icon: Warehouse,
    title: "Warehousing Solution",
    description: "Secure storage and inventory management for your products",
    features: [
      "Climate controlled storage",
      "Real-time inventory tracking",
      "Pick and pack services",
      "Flexible storage terms",
    ],
  },
  {
    icon: Truck,
    title: "Distribution Network",
    description: "Fast and reliable delivery to customers nationwide",
    features: ["Same-day delivery options", "Real-time tracking", "Multiple delivery partners", "Insurance Coverage"],
  },
]

export function ServicesGrid() {
  const handleRequestService = (serviceName: string) => {
    console.log(`Requesting service: ${serviceName}`)
    // TODO: Implement service request functionality
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {servicesData.map((service, index) => (
        <ServiceCard
          key={index}
          icon={service.icon}
          title={service.title}
          description={service.description}
          features={service.features}
          onRequestService={() => handleRequestService(service.title)}
        />
      ))}
    </div>
  )
}
