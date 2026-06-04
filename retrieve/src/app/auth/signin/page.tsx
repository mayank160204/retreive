// Sign in page
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { FormInput } from '@/components/FormInput';
import { AuthForm } from '@/components/AuthForm';
import { ValidationMessage } from '@/components/ValidationMessage';
import Link from 'next/link';

interface FormErrors {
  email?: string;
  password?: string;
  form?: string;
}

export default function SigninPage() {
  const router = useRouter();
  const { signin, user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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

    try {
      await signin(formData.email, formData.password);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';

      if (errorMessage.includes('not found') || errorMessage.includes('invalid')) {
        setErrors({ form: 'Invalid email or password' });
      } else if (errorMessage.includes('disabled')) {
        setErrors({ form: 'This account has been disabled' });
      } else {
        setErrors({ form: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Login"
      subtitle="Sign in to access your research dashboard."
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitButtonText={isLoading ? 'Logging in...' : 'Log In'}
    >
      {/* Primary Action: Google OAuth (Visual mockup based on Stitch) */}
      <div className="space-y-md mb-md">
        <button 
          type="button" 
          className="btn-premium w-full h-[56px] flex items-center justify-center gap-sm bg-surface-container-lowest border-2 border-surface-container-high border-b-[4px] border-b-surface-container-highest rounded-full text-on-surface font-label-bold hover:bg-surface-container-low transition-all"
          onClick={() => alert("Google OAuth not fully configured yet. Please use email/password for the demo.")}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"></path>
          </svg>
          Continue with Google
        </button>
      </div>

      <div className="flex items-center gap-sm py-xs mb-md">
        <div className="h-px bg-surface-container-high flex-grow"></div>
        <span className="font-label-bold text-outline uppercase tracking-widest text-[10px]">or email</span>
        <div className="h-px bg-surface-container-high flex-grow"></div>
      </div>

      {/* Error message */}
      {errors.form && <ValidationMessage message={errors.form} type="error" />}

      {/* Form fields */}
      <div className="space-y-md">
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={errors.email}
          placeholder="name@example.com"
          required
          autoComplete="email"
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          error={errors.password}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          rightElement={
            <Link
              href="/auth/reset-password"
              className="text-label-bold font-label-bold text-secondary hover:text-on-secondary-container transition-colors"
            >
              Forgot?
            </Link>
          }
        />
      </div>

      {/* Sign up link Footer */}
      <div className="mt-lg pt-lg border-t border-surface-container-high text-center">
        <p className="text-body-md font-body-md text-on-surface-variant">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-label-bold font-label-bold text-primary hover:text-primary-container transition-colors ml-xs inline-block hover:scale-105 active:scale-95">
            Create Account
          </Link>
        </p>
      </div>
    </AuthForm>
  );
}
