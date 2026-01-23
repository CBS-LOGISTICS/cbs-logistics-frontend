"use client";

import CustomInputPin from "@/components/customInput";
import { Button } from '@/components/ui/button';
import { useFormik } from "formik";
import { Package } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { toast } from 'sonner';

export default function ResetPassword() {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      code: "",
    },
    onSubmit: (values: { code: any }) => {
      toast.success("Password changed successfully");
      console.log('code:', values.code)
      router.push('/setnewpassword');
    },
  });


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
            Reset Password
          </h1>
          <p className="text-gray-600 text-lg"> Please enter the 4-digit code that was sent to your email address{" "}
            {/* <span>{getCookieFromStorage(Constants.USER_EMAIL)}</span> */}
          </p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="py-6">
           
            <CustomInputPin className="flex items-center justify-center" value={formik.values.code} valueLength={4} onChange={(digit) => formik.setFieldValue("code", digit)} />
            {formik.touched.code && formik.errors.code ? <div className=" ">{formik.errors.code as any}</div> : null}
          </div>

         
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-[#F63915] to-[#d42e0f] hover:from-[#d42e0f] hover:to-[#F63915] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base"
          // disabled={isLoading}
          // loading={isLoading}
          >
            Reset
          </Button>
        </form>
      </div>
    </div>
  );
}
