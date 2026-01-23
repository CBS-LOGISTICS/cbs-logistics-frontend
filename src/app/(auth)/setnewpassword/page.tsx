"use client";

import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";



export default function SetNewPassword() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleTogglePasswordVisibility = (
    value: "password" | "confirmPassword"
  ) => {
    if (value === "password") {
      return setIsShowPassword((prev) => !prev);
    }

    return setIsShowConfirmPassword((prev) => !prev);
  };

  const onSubmit = (value: {
    password: string;
    confirmPassword: string;
  }) => {
   toast.success('Password resetted successfully.');
    router.push('/');
  };
  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Logo Navigation */}
        <Link href="/" className="group">
          <div className="flex items-center gap-3 w-fit mx-auto mb-4 px-6 py-3 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#F63915]/30">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#F63915] to-[#d42e0f] rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#F63915] to-[#d42e0f] bg-clip-text text-transparent">
                CBS Logistics
              </h2>
              <p className="text-xs text-gray-600 font-medium">Back to SignIn</p>
            </div>
          </div>
        </Link>

        {/* Header */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#F63915] to-[#d42e0f] rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F63915] to-[#d42e0f] bg-clip-text text-transparent mb-2">
            Set New Password
          </h1>
          <p className="text-gray-600 text-lg"> Must be at least 8 characters.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} >
          <div className="gap-4 w-xl max-w-md mx-auto space-y-4">
            <div className="py-4 space-y-2">
              <Label htmlFor="password">New Password *</Label>
              <div className="flex items-center justify-between border border-gray-300 rounded-lg pr-2">
                <Input id="password" className="border-0 mr-2"
                  type={isShowPassword ? "text" : "password"}
                  {...register('password')} />
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                <Eye
                  onClick={() =>
                    handleTogglePasswordVisibility("password")
                  }
                />
              </div>

            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password *</Label>
              <div className="flex items-center justify-between border border-gray-300 rounded-lg pr-2">
                <Input id="confirmPassword" className="border-0 mr-2" type={isShowPassword ? "text" : "password"} {...register('confirmPassword')} />
                <Eye onClick={() => handleTogglePasswordVisibility("confirmPassword")} />
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>



            <Button
              type="submit"
              className="w-full mt-4 h-12 bg-gradient-to-r from-[#F63915] to-[#d42e0f] hover:from-[#d42e0f] hover:to-[#F63915] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base"
            // disabled={isLoading}
            // loading={isLoading}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

