"use client";
import { Box, Package, TruckIcon } from "lucide-react";
import React, { useState } from "react";

interface ILandingConstant {
  children: (selectedAuth: string) => React.ReactNode;
}

export default function Landing({ children }: ILandingConstant) {
  const [selectedAuth, setSelectedAuth] = useState<string>("signin");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with Logo */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#F63915] to-[#d42e0f] rounded-xl shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F63915] to-[#d42e0f] bg-clip-text text-transparent">
                CBS Logistics
              </h1>
              <p className="text-sm text-gray-600 font-medium">Your Trusted Logistics Partner</p>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-[#F63915] to-[#d42e0f] p-8 md:p-10 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">
                    Welcome Back
                  </h2>
                  <p className="text-white/90 text-lg max-w-2xl">
                    {selectedAuth === "signin"
                      ? "Sign in to access your logistics dashboard and manage your shipments."
                      : "Join our network and experience seamless logistics solutions."}
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <TruckIcon className="w-8 h-8 text-white/80" />
                    </div>
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Box className="w-8 h-8 text-white/80" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Selection */}
            <div className="px-6 md:px-10 pt-6">
              <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl max-w-md">
                <button
                  onClick={() => setSelectedAuth("signin")}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 ${selectedAuth === "signin"
                      ? "bg-white text-[#F63915] shadow-md scale-105"
                      : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setSelectedAuth("signup")}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 ${selectedAuth === "signup"
                      ? "bg-white text-[#F63915] shadow-md scale-105"
                      : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-10">
              {children(selectedAuth)}
            </div>

            {/* Footer */}
            <div className="px-6 md:px-10 pb-8 pt-4 border-t border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
                <p>© 2024 CBS Logistics. All rights reserved.</p>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-[#F63915] transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-[#F63915] transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-[#F63915] transition-colors">Help Center</a>
                </div>
              </div>
            </div>
          </div>

          {/* Features Below Card */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F63915]/10 to-[#F63915]/5 rounded-xl flex items-center justify-center mb-4">
                <TruckIcon className="w-6 h-6 text-[#F63915]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Express shipping across Nigeria with real-time tracking</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F63915]/10 to-[#F63915]/5 rounded-xl flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-[#F63915]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Secure Handling</h3>
              <p className="text-sm text-gray-600">Your packages are safe with our professional handling</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F63915]/10 to-[#F63915]/5 rounded-xl flex items-center justify-center mb-4">
                <Box className="w-6 h-6 text-[#F63915]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Easy Management</h3>
              <p className="text-sm text-gray-600">Simple dashboard to manage all your logistics needs</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
