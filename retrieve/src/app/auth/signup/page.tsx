// Sign up page
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { FormInput } from '@/components/FormInput';
import { AuthForm } from '@/components/AuthForm';
import { PasswordStrength } from '@/components/PasswordStrength';
import { ValidationMessage } from '@/components/ValidationMessage';
import Link from 'next/link';

interface FormErrors {
  email?: string;
  name?: string;
  password?: string;
  form?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { signup, user, loading: authLoading, signout } = useAuth();
  const [isRedirectingToVerification, setIsRedirectingToVerification] = useState(false);

  useEffect(() => {
    if (!authLoading && user && !isRedirectingToVerification) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router, isRedirectingToVerification]);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain an uppercase letter';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (fieldName: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    if (errors[fieldName as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      setIsRedirectingToVerification(true);
      await signup(formData.email, formData.password, formData.name);
      await signout();
      setSuccessMessage('Account created successfully! Redirecting to email verification...');

      // Redirect to email verification page
      setTimeout(() => {
        router.push('/auth/email-verification');
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';

      if (errorMessage.includes('already')) {
        setErrors({ email: 'Email is already registered' });
      } else {
        setErrors({ form: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Join RETREIVE"
      subtitle="Start your journey to medical precision."
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitButtonText={isLoading ? 'Creating Account...' : 'Create Account'}
    >
      {/* Social Logins */}
      <div className="w-full flex flex-col gap-sm mb-lg">
        <button 
          type="button" 
          className="btn-3d w-full flex items-center justify-center gap-sm bg-surface text-on-surface border-2 border-surface-container-high border-b-[4px] border-b-surface-variant rounded-xl h-[56px] font-label-bold text-label-bold"
          onClick={() => alert("Google OAuth not fully configured yet. Please use email/password for the demo.")}
        >
          <span className="material-symbols-outlined text-[#DB4437]">mail</span>
          Continue with Google
        </button>
      </div>

      {/* Divider */}
      <div className="w-full flex items-center gap-sm mb-lg">
        <div className="h-[2px] bg-surface-container-high flex-1"></div>
        <span className="font-label-bold text-[10px] text-outline uppercase tracking-widest">OR</span>
        <div className="h-[2px] bg-surface-container-high flex-1"></div>
      </div>

      {/* Messages */}
      {successMessage && <ValidationMessage message={successMessage} type="success" />}
      {errors.form && <ValidationMessage message={errors.form} type="error" />}

      {/* Form fields */}
      <div className="space-y-md">
        <FormInput
          label="Full Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange('name')}
          error={errors.name}
          placeholder="Jane Doe"
          required
          autoComplete="name"
        />

        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={errors.email}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />

        <div className="space-y-sm">
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange('password')}
            error={errors.password}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />

          {/* Password strength meter */}
          {formData.password && <PasswordStrength password={formData.password} />}
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-lg text-center font-body-md text-body-md text-on-surface-variant">
        By signing up, you agree to our <a className="text-primary font-bold hover:underline" href="#">Terms</a> and <a className="text-primary font-bold hover:underline" href="#">Privacy Policy</a>.
      </div>
      <div className="mt-sm pt-md border-t border-surface-container-high text-center">
        <Link href="/auth/signin" className="text-label-bold font-label-bold text-secondary hover:text-on-secondary-container transition-colors">
          Already have an account? Log in
        </Link>
      </div>
    </AuthForm>
  );
}
