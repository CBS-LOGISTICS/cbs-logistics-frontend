"use client";
import boxImg from "@/assets/images/box.png";
import radio from "@/assets/images/radio.png";
import Landing from "@/components/Auth/Landing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignInFormData, signInSchema } from "@/lib/validations/authSchemas";
import { useLoginUserMutation } from "@/store/slices/usersApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginUserMutation, { isLoading }] = useLoginUserMutation();
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const IconComponent = showPassword ? EyeOff : Eye;

  console.log(isLoading, "IS LOADING");

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

  const handleSignIn = (data: SignInFormData) => {
    console.log("Signing in with:", data);
    loginUserMutation(data).unwrap().then(async (res) => {
      console.log("Login successful:", res);

      // Check if user must change password
      if (res.user.mustChangePassword) {
        // Logout to clear the session
        await fetch('/api/auth/logout', { method: 'POST' });

        // Redirect to change password page with email
        router.push(`/auth/change-password?email=${encodeURIComponent(res.user.email)}`);
        return;
      }

      // Route based on role
      switch (res.user.role) {
        case 'agent':
          router.push('/agent/dashboard');
          break;
        case 'admin':
        case 'super_admin':
          router.push('/admin/dashboard');
          break;
        case 'customer':
          router.push('/customer/dashboard');
          break;
        case 'supplier':
          router.push('/supplier/dashboard');
          break;
        default:
          router.push('/');
      }
      toast.success('Login successful!');
    }).catch((err) => {
      console.error("Login failed:", err);
      toast.error(err?.data?.error || 'Login failed. Please check your credentials.');
    });
  };

  const handleRequestService = (sectionName: string) => {
    console.log(`Requesting service: ${sectionName}`);
    if (sectionName === "signup") {
      // Handle sign-up routing based on selected section
      if (selectedSection === "Customer") {
        router.push("/signup/customer");
      } else if (selectedSection === "Agent") {
        router.push("/signup/agent");
      } else if (selectedSection === "Supplier") {
        // Show coming soon modal for supplier
        setShowComingSoonModal(true);
      }
    } else if (sectionName === "Next") {
      // Show coming soon for Google Sign In
      setShowComingSoonModal(true);
    }
  };

  return (
    <Landing>
      {(selectedAuth) => (
        <>
          {selectedAuth === "signin" ? (
            <form onSubmit={handleSubmit(handleSignIn)} className="space-y-6 max-w-md mx-auto">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700"
                >
                  Email Address
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#F63915] transition-colors" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="pl-12 h-12 text-base border-gray-300 focus:border-[#F63915] focus:ring-[#F63915] rounded-xl transition-all"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">●</span> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Password
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400 group-focus-within:text-[#F63915] transition-colors" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="pl-12 pr-12 h-12 text-base border-gray-300 focus:border-[#F63915] focus:ring-[#F63915] rounded-xl transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-[#F63915] transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <IconComponent className="h-5 w-5" />
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">●</span> {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="rememberMe"
                    type="checkbox"
                    className="w-4 h-4 text-[#F63915] border-gray-300 rounded focus:ring-[#F63915]"
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm text-gray-700 cursor-pointer select-none font-medium"
                  >
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm text-[#F63915] hover:text-[#d42e0f] font-semibold transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#F63915] to-[#d42e0f] hover:from-[#d42e0f] hover:to-[#F63915] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base"
                disabled={isLoading}
                loading={isLoading}
              >
                Sign In
              </Button>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                onClick={() => handleRequestService("Next")}
                className="w-full h-12 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl font-semibold transition-all duration-300 text-base"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </Button>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {onboardingSections.map((section, index) => (
                <Card
                  key={index}
                  onClick={() => setSelectedSection(section.title)}
                  className={`relative group cursor-pointer transition-all duration-300 overflow-hidden border-2 ${selectedSection === section.title
                    ? "border-[#F63915] bg-gradient-to-br from-red-50 to-white shadow-xl scale-105"
                    : "border-gray-200 hover:border-[#F63915]/50 hover:shadow-lg hover:scale-102 bg-white"
                    }`}
                >
                  {/* Gradient Overlay */}
                  {selectedSection === section.title && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#F63915]/10 to-transparent rounded-bl-full" />
                  )}

                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${selectedSection === section.title
                        ? "bg-gradient-to-br from-[#F63915] to-[#d42e0f] shadow-lg"
                        : "bg-gray-100 group-hover:bg-red-50"
                        }`}>
                        <Image
                          src={selectedSection === section.title ? radio : boxImg}
                          alt={section.title}
                          className="w-6 h-6"
                        />
                      </div>
                      {selectedSection === section.title && (
                        <div className="flex items-center gap-1 text-[#F63915] text-sm font-semibold">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Selected
                        </div>
                      )}
                    </div>
                    <h3 className={`text-xl font-bold mb-3 transition-colors ${selectedSection === section.title ? "text-[#F63915]" : "text-gray-900 group-hover:text-[#F63915]"
                      }`}>
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {section.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Button Section */}
          <div className="mt-6 sm:mt-8 space-y-4 px-4 sm:px-0">
            {selectedAuth !== "signin" && (

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto sm:mx-auto">
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto sm:min-w-[200px] sm:px-8 h-12 sm:h-11 text-base font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                  disabled={selectedAuth === "signup" && !selectedSection}
                  onClick={() => handleRequestService(selectedAuth)}
                  loading={isLoading}
                >
                  {"Next"}
                </Button>
              </div>
            )
            }



            {/* {selectedAuth === "signin" && (
              <>
                <div className="flex items-center justify-center my-4 sm:my-6 gap-3 sm:gap-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-sm sm:text-base text-gray-500 font-medium px-2">
                    Or
                  </span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto sm:mx-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto sm:min-w-[200px] sm:px-8 h-12 sm:h-11 text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-2 hover:border-gray-300 hover:bg-gray-50"
                    onClick={() => handleRequestService("Next")}
                  >
                    Sign In with Google
                  </Button>
                </div>
              </>
            )} */}
          </div>

          {/* Coming Soon Modal */}
          <Dialog open={showComingSoonModal} onOpenChange={setShowComingSoonModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Coming Soon</DialogTitle>
                <DialogDescription>
                  This feature is currently under development. Please check back later!
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end">
                <Button onClick={() => setShowComingSoonModal(false)}>
                  Got it
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )
      }
    </Landing >
  );
}
