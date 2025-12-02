'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomerRegistrationFormData, customerRegistrationSchema } from '@/lib/validations/authSchemas';
import { useRegisterCustomerMutation } from '@/store/slices/usersApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, Package } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function CustomerSignupPage() {
    const router = useRouter();
    const [registerCustomer, { isLoading, isSuccess }] = useRegisterCustomerMutation();

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CustomerRegistrationFormData>({
        resolver: zodResolver(customerRegistrationSchema),
        defaultValues: {
            title: '',
            fullName: '',
            dateOfBirth: '',
            phone: '',
            email: '',
            maritalStatus: 'single',
            occupation: '',
            nationality: 'Nigeria',
            stateOfOrigin: '',
            localGovernmentArea: '',
            residentialAddress: '',
            postalAddress: '',
            nextOfKin: {
                fullName: '',
                relationship: '',
                phone: '',
                email: '',
                contactAddress: '',
            },
            requiredDocuments: {
                idImage: '',
                passportPhoto: '',
                proofOfPayment: '',
            },
            referralCode: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: CustomerRegistrationFormData) => {
        try {
            const result = await registerCustomer(data).unwrap();
            // Success is handled by isSuccess state
            console.log('Registration successful:', result);
        } catch (err: any) {
            console.error('Registration error:', err);
            // Error handling can be added here if needed
        }
    };

    if (isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
                <Card className="w-full max-w-md shadow-2xl border-2 border-gray-100">
                    <CardHeader className="text-center pt-12 pb-6">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg animate-bounce">
                            <Check className="h-10 w-10 text-white" strokeWidth={3} />
                        </div>
                        <CardTitle className="text-3xl font-bold text-gray-900 mb-3">Registration Successful!</CardTitle>
                        <p className="text-gray-600 leading-relaxed px-4">
                            Your application has been submitted for review. You'll receive a welcome email with next steps once your account is approved.
                        </p>
                    </CardHeader>
                    <CardContent className="pb-8">
                        <Button
                            onClick={() => router.push('/')}
                            className="w-full h-12 bg-gradient-to-r from-[#F63915] to-[#d42e0f] hover:from-[#d42e0f] hover:to-[#F63915] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Go to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
                            <p className="text-xs text-gray-600 font-medium">Back to Home</p>
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
                        Customer Registration
                    </h1>
                    <p className="text-gray-600 text-lg">Complete the form below to create your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <CardTitle className="text-2xl flex items-center gap-2 text-gray-900">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#F63915]/20 to-[#F63915]/10 rounded-lg flex items-center justify-center">
                                    <span className="text-[#F63915] font-bold">1</span>
                                </div>
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <select
                                        id="title"
                                        {...register('title')}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Select</option>
                                        <option value="Mr">Mr</option>
                                        <option value="Mrs">Mrs</option>
                                        <option value="Ms">Ms</option>
                                        <option value="Dr">Dr</option>
                                    </select>
                                    {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="fullName">Full Name *</Label>
                                    <Input id="fullName" {...register('fullName')} />
                                    {errors.fullName && <p className="text-sm text-red-600">{errors.fullName.message}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                                    <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
                                    {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maritalStatus">Marital Status *</Label>
                                    <select
                                        id="maritalStatus"
                                        {...register('maritalStatus')}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="single">Single</option>
                                        <option value="married">Married</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.maritalStatus && <p className="text-sm text-red-600">{errors.maritalStatus.message}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="occupation">Occupation *</Label>
                                    <Input id="occupation" {...register('occupation')} />
                                    {errors.occupation && <p className="text-sm text-red-600">{errors.occupation.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nationality">Nationality *</Label>
                                    <Input id="nationality" {...register('nationality')} />
                                    {errors.nationality && <p className="text-sm text-red-600">{errors.nationality.message}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="stateOfOrigin">State of Origin *</Label>
                                    <Input id="stateOfOrigin" {...register('stateOfOrigin')} />
                                    {errors.stateOfOrigin && <p className="text-sm text-red-600">{errors.stateOfOrigin.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="localGovernmentArea">Local Government Area *</Label>
                                    <Input id="localGovernmentArea" {...register('localGovernmentArea')} />
                                    {errors.localGovernmentArea && <p className="text-sm text-red-600">{errors.localGovernmentArea.message}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <CardTitle className="text-2xl flex items-center gap-2 text-gray-900">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#F63915]/20 to-[#F63915]/10 rounded-lg flex items-center justify-center">
                                    <span className="text-[#F63915] font-bold">2</span>
                                </div>
                                Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input id="phone" type="tel" {...register('phone')} />
                                    {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input id="email" type="email" {...register('email')} />
                                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="residentialAddress">Residential Address *</Label>
                                <Input id="residentialAddress" {...register('residentialAddress')} />
                                {errors.residentialAddress && <p className="text-sm text-red-600">{errors.residentialAddress.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="postalAddress">Postal Address</Label>
                                <Input id="postalAddress" {...register('postalAddress')} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Next of Kin */}
                    <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <CardTitle className="text-2xl flex items-center gap-2 text-gray-900">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#F63915]/20 to-[#F63915]/10 rounded-lg flex items-center justify-center">
                                    <span className="text-[#F63915] font-bold">3</span>
                                </div>
                                Next of Kin
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nokFullName">Full Name *</Label>
                                    <Input id="nokFullName" {...register('nextOfKin.fullName')} />
                                    {errors.nextOfKin?.fullName && <p className="text-sm text-red-600">{errors.nextOfKin.fullName.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nokRelationship">Relationship *</Label>
                                    <Input id="nokRelationship" {...register('nextOfKin.relationship')} />
                                    {errors.nextOfKin?.relationship && <p className="text-sm text-red-600">{errors.nextOfKin.relationship.message}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nokPhone">Phone Number *</Label>
                                    <Input id="nokPhone" type="tel" {...register('nextOfKin.phone')} />
                                    {errors.nextOfKin?.phone && <p className="text-sm text-red-600">{errors.nextOfKin.phone.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nokEmail">Email</Label>
                                    <Input id="nokEmail" type="email" {...register('nextOfKin.email')} />
                                    {errors.nextOfKin?.email && <p className="text-sm text-red-600">{errors.nextOfKin.email.message}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Required Documents */}
                    <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <CardTitle className="text-2xl flex items-center gap-2 text-gray-900">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#F63915]/20 to-[#F63915]/10 rounded-lg flex items-center justify-center">
                                    <span className="text-[#F63915] font-bold">4</span>
                                </div>
                                Required Documents
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="idImage">ID Image URL *</Label>
                                <Input id="idImage" {...register('requiredDocuments.idImage')} placeholder="Enter image URL" />
                                {errors.requiredDocuments?.idImage && <p className="text-sm text-red-600">{errors.requiredDocuments.idImage.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="passportPhoto">Passport Photo URL *</Label>
                                <Input id="passportPhoto" {...register('requiredDocuments.passportPhoto')} placeholder="Enter image URL" />
                                {errors.requiredDocuments?.passportPhoto && <p className="text-sm text-red-600">{errors.requiredDocuments.passportPhoto.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="proofOfPayment">Proof of Payment URL *</Label>
                                <Input id="proofOfPayment" {...register('requiredDocuments.proofOfPayment')} placeholder="Enter image URL" />
                                {errors.requiredDocuments?.proofOfPayment && <p className="text-sm text-red-600">{errors.requiredDocuments.proofOfPayment.message}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Referral & Security */}
                    <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <CardTitle className="text-2xl flex items-center gap-2 text-gray-900">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#F63915]/20 to-[#F63915]/10 rounded-lg flex items-center justify-center">
                                    <span className="text-[#F63915] font-bold">5</span>
                                </div>
                                Referral & Security
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                                <Input id="referralCode" {...register('referralCode')} placeholder="Enter agent referral code" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password *</Label>
                                    <Input id="password" type="password" {...register('password')} />
                                    {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                    <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
                                    {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Register
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
