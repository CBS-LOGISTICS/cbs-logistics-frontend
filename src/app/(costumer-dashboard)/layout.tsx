import { ConsumerHeader } from "@/components/consumer/layout/consumerHeader";
import { ConsumerSidebar } from "@/components/consumer/layout/consumerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CBS consumer",
  description: "consumer section",
};

export default function ConsumerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gray-50">
        <div className="flex h-screen  overflow-hidden">
          {/* Sidebar */}
          <div className="hidden md:flex">
            <ConsumerSidebar />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
              <ConsumerHeader />
            </header>
            
            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-46 md:p-0">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}