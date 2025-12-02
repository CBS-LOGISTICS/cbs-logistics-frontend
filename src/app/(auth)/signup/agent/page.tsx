'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AgentRegistrationFormData, agentRegistrationSchema } from '@/lib/validations/authSchemas';
import { useRegisterAgentMutation } from '@/store/slices/usersApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, Package } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function AgentSignupPage() {
    const router = useRouter();
    const [registerAgent, { isLoading, isSuccess }] = useRegisterAgentMutation();

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<AgentRegistrationFormData>({
        resolver: zodResolver(agentRegistrationSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            phone: '',
            dateOfBirth: '',
            gender: 'male',
            address: '',
            nationalId: '',
            passportNumber: '',
            taxIdentificationNumber: '',
            businessLicense: '',
            bankName: '',
            bankAccountNumber: '',
            bankAccountName: '',
            emergencyContact: {
                name: '',
                relationship: '',
                phone: '',
                email: '',
            },
            businessAddress: '',
            agreeToTerms: false,
            agreeToCommissionStructure: false,
        },
    });

    const onSubmit = async (data: AgentRegistrationFormData) => {
        try {
            const result = await registerAgent(data as any).unwrap();
            console.log('Registration successful:', result);
        } catch (err: any) {
            console.error('Registration error:', err);
        }
    };

    const agreeToTerms = watch('agreeToTerms');
    const agreeToCommissionStructure = watch('agreeToCommissionStructure');

    if (isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
                <Card className="w-full max-w-md shadow-2xl border-2 border-gray-100">
                    <CardHeader className="text-center pt-12 pb-6">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg animate-bounce">
                            <Check className="h-10 w-10 text-white" strokeWidth={3} />
                        </div>
                        <CardTitle className="text-3xl font-bold text-gray-900 mb-3">Registration Successful!</CardTitle>
                        <CardDescription className="text-gray-600 leading-relaxed px-4 text-base">
                            Your agent application has been submitted for admin review. You'll receive your referral code once approved.
                        </CardDescription>
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F63915] to-[#d42e0f] bg-clip-text text-transparent mb-2">
                        Agent Registration
                    </h1>
                    <p className="text-gray-600 text-lg">Join our network of agents and start earning commissions</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <CardTitle className="text-2xl flex items-center gap-2 text-gray-900">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#F63915]/20 to-[#F63915]/10 rounded-lg flex items-center justify-center">
                                    <span className="text-[#F63915] font-bold">1</span>
                                </div>
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name *</Label>
                                    <Input id="firstName" {...register('firstName')} />
                                    {errors.firstName && <p className="text-sm text-red-600">{errors.firstName.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name *</Label>
                                    <Input id="lastName" {...register('lastName')} />
                                    {errors.lastName && <p className="text-sm text-red-600">{errors.lastName.message}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input id="email" type="email" {...register('email')} />
                                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input id="phone" type="tel" {...register('phone')} />
                                    {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                                    <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
                                    {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender *</Label>
                                    <select
                                        id="gender"
                                        {...register('gender')}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.gender && <p className="text-sm text-red-600">{errors.gender.message}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Residential Address *</Label>
                                <Input id="address" {...register('address')} />
                                {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Identification & Business */}
                    <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <CardTitle className="text-2xl flex items-center gap-2 text-gray-900">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#F63915]/20 to-[#F63915]/10 rounded-lg flex items-center justify-center">
                                    <span className="text-[#F63915] font-bold">2</span>
                                </div>
                                Identification & Business Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nationalId">National ID Number *</Label>
                                    <Input id="nationalId" {...register('nationalId')} />
                                    {errors.nationalId && <p className="text-sm text-red-600">{errors.nationalId.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="passportNumber">Passport Number</Label>
                                    <Input id="passportNumber" {...register('passportNumber')} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="taxIdentificationNumber">Tax ID (TIN)</Label>
                                    <Input id="taxIdentificationNumber" {...register('taxIdentificationNumber')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="businessLicense">Business License Number</Label>
                                    <Input id="businessLicense" {...register('businessLicense')} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="businessAddress">Business Address</Label>
                                <Input id="businessAddress" {...register('businessAddress')} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bank Details */}
                    <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <CardTitle className="text-2xl flex items-center gap-2 text-gray-900">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#F63915]/20 to-[#F63915]/10 rounded-lg flex items-center justify-center">
                                    <span className="text-[#F63915] font-bold">3</span>
                                </div>
                                Bank Details
                            </CardTitle>
                            <CardDescription className="text-gray-600 mt-2">For commission payouts</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="bankName">Bank Name *</Label>
                                <Input id="bankName" {...register('bankName')} />
                                {errors.bankName && <p className="text-sm text-red-600">{errors.bankName.message}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bankAccountName">Account Holder Name *</Label>
                                    <Input id="bankAccountName" {...register('bankAccountName')} />
                                    {errors.bankAccountName && <p className="text-sm text-red-600">{errors.bankAccountName.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bankAccountNumber">Account Number *</Label>
                                    <Input id="bankAccountNumber" {...register('bankAccountNumber')} />
                                    {errors.bankAccountNumber && <p className="text-sm text-red-600">{errors.bankAccountNumber.message}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Emergency Contact */}
                    <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <CardTitle className="text-2xl flex items-center gap-2 text-gray-900">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#F63915]/20 to-[#F63915]/10 rounded-lg flex items-center justify-center">
                                    <span className="text-[#F63915] font-bold">4</span>
                                </div>
                                Emergency Contact
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="emergencyContactName">Full Name *</Label>
                                    <Input id="emergencyContactName" {...register('emergencyContact.name')} />
                                    {errors.emergencyContact?.name && <p className="text-sm text-red-600">{errors.emergencyContact.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="emergencyContactRelationship">Relationship *</Label>
                                    <Input id="emergencyContactRelationship" {...register('emergencyContact.relationship')} />
                                    {errors.emergencyContact?.relationship && <p className="text-sm text-red-600">{errors.emergencyContact.relationship.message}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="emergencyContactPhone">Phone Number *</Label>
                                    <Input id="emergencyContactPhone" type="tel" {...register('emergencyContact.phone')} />
                                    {errors.emergencyContact?.phone && <p className="text-sm text-red-600">{errors.emergencyContact.phone.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="emergencyContactEmail">Email</Label>
                                    <Input id="emergencyContactEmail" type="email" {...register('emergencyContact.email')} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security */}
                    <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <CardTitle className="text-2xl flex items-center gap-2 text-gray-900">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#F63915]/20 to-[#F63915]/10 rounded-lg flex items-center justify-center">
                                    <span className="text-[#F63915] font-bold">5</span>
                                </div>
                                Security
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
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

                    {/* Terms & Agreements */}
                    <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <CardTitle className="text-2xl flex items-center gap-2 text-gray-900">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#F63915]/20 to-[#F63915]/10 rounded-lg flex items-center justify-center">
                                    <span className="text-[#F63915] font-bold">6</span>
                                </div>
                                Terms & Agreements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="agreeToTerms"
                                    checked={agreeToTerms}
                                    onCheckedChange={(checked) => setValue('agreeToTerms', checked as boolean)}
                                />
                                <label htmlFor="agreeToTerms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    I agree to the Terms and Conditions *
                                </label>
                            </div>
                            {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms.message}</p>}

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="agreeToCommissionStructure"
                                    checked={agreeToCommissionStructure}
                                    onCheckedChange={(checked) => setValue('agreeToCommissionStructure', checked as boolean)}
                                />
                                <label htmlFor="agreeToCommissionStructure" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    I agree to the Commission Structure *
                                </label>
                            </div>
                            {errors.agreeToCommissionStructure && <p className="text-sm text-red-600">{errors.agreeToCommissionStructure.message}</p>}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || !agreeToTerms || !agreeToCommissionStructure}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Register as Agent
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
