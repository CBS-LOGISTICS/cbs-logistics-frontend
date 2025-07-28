"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
interface ILandingConstant {
  children: (selectedAuth: string) => React.ReactNode;
}

export default function Landing({ children }: ILandingConstant) {
  const [selectedAuth, setSelectedAuth] = useState<string>("signin");
  return (
    <div className="bg-white min-h-screen p-4">
      <div className="border border-[#DFE1E6] w-full bg-[#F9F9FB] p-3 rounded-[10px]">
        <div className="border border-[#DFE1E6] bg-white p-3 rounded-[10px] shadow-md transition-shadow mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Welcome back</h3>
          <p className="text-sm text-gray-700">
            Glad to see you again. Log in to your account.
          </p>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant={selectedAuth === "signin" ? "ghost" : "outline"}
            className={`px-12 ${
              selectedAuth === "signin" ? "text-black" : "text-[#666D80]"
            }`}
            onClick={() => setSelectedAuth("signin")}
          >
            Sign In
          </Button>
          <Button
            variant={selectedAuth === "signup" ? "ghost" : "outline"}
            className={`px-12 
              ${selectedAuth === "signup" ? "text-black" : "text-[#666D80]"}`}
            onClick={() => setSelectedAuth("signup")}
          >
            Sign Up
          </Button>
        </div>

        <div className="border border-[#DFE1E6] bg-white p-3 rounded-[10px]">
          {children(selectedAuth)}
        </div>
      </div>
    </div>
  );
}
