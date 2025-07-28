"use client";
import React, { useState } from "react";
import { Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import { UsersList } from "../components/UsersList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import boxImg from "@/assets/images/box.png";
import radio from "@/assets/images/radio.png";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Landing from "@/components/Auth/Landing";
// import router
interface AuthDataProps {
  email: string;
  password: string;
}

export default function Home() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authData, setAuthData] = useState<AuthDataProps>({
    email: "",
    password: "",
  });
  const IconComponent = showPassword ? EyeOff : Eye;
  const onboardingSections = [
    {
      title: "Customer",
      description:
        "Access procurement services, track shipments, and manage deliveries.",
    },
    {
      title: "Agent",
      description:
        "Manage client logistics, coordinate services, and track performance.",
    },
    {
      title: "Supplier",
      description:
        "List services, manage warehouse operations, and fulfill orders.",
    },
  ];

  const handleRequestService = (sectionName: string) => {
    console.log(`Requesting service: ${sectionName}`);
    if (sectionName === "signin") {
      // Handle sign-in logic here
      console.log("Signing in with:", authData);
    } else {
      // Handle sign-up logic here
      console.log("Proceeding to next step for:", sectionName);
    }
  };

  const handleInputChange = (field: keyof AuthDataProps, value: string) => {
    setAuthData((prev) => ({ ...prev, [field]: value }));
  };
 
  return (
    <Landing>
      {(selectedAuth) => (
        <>
          {selectedAuth === "signin" ? (
            <div className="space-y-6 md:w-[600px] md:mx-auto">
              <div>
                <Label
                  htmlFor="fullName"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Email
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 border-r border-gray-400 pr-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="text"
                    value={authData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-16 h-12 text-base"
                    placeholder="Johndoe@cbs.com"
                  />
                </div>
              </div>
              {/* Password Field */}
              <div>
                <Label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 border-r border-gray-400 pr-4 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={authData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="pl-16 h-12 text-base"
                    placeholder="**********"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <IconComponent className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Input id="checkbox" type="checkbox" className="size-4" />
                  <p>Keep me logged in</p>
                </div>
                <p className="text-destructive">Forgot password</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {onboardingSections.map((section, index) => (
                <Card
                  key={index}
                  className={`h-full flex flex-col cursor-pointer hover:border-2 hover:border-[#F63915] 
              ${
                selectedSection === section.title
                  ? "border-2 border-[#F63915]"
                  : ""
              }
              `}
                  onClick={() => setSelectedSection(section.title)}
                >
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {section.title}
                      </h3>
                      <Image
                        src={selectedSection === section.title ? radio : boxImg}
                        alt="radio button"
                        className="w-4 h-4 border rounded-lg"
                      />
                    </div>
                    <p>{section.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-6 md:flex md:justify-center">
            <Button
              variant="destructive"
              className="w-full cursor-pointer md:w-[40%]"
              disabled={!selectedSection}
              onClick={() => handleRequestService(selectedAuth)}
            >
              {selectedAuth === "signin" ? "Sign In" : "Next"}
            </Button>
            {selectedAuth === "signin" && (
              <>
                <div className="flex items-center justify-center my-2 space-x-2">
                  <hr className="w-[50%]" />
                  <span>Or</span>
                  <hr className="w-[50%]" />
                </div>
                <Button
                  variant="outline"
                  className="w-full cursor-pointer md:w-[40%]"
                  onClick={() => handleRequestService("Next")}
                >
                  Sign In with Google
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </Landing>
  );
}
