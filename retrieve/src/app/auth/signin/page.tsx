// Sign in page — VaultFlow/Duolingo style
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

function SigninContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') || '/dashboard';

  const { signin, signinWithGoogle, user, loading: authLoading, error: contextError } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      window.location.href = redirect;
    }
  }, [user, authLoading, redirect]);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrors({});
    try {
      await signinWithGoogle();
      window.location.href = redirect;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Google sign in failed';
      setErrors({ form: msg });
    } finally {
      setGoogleLoading(false);
    }
  };

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

  const handleInputChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await signin(formData.email, formData.password);
      window.location.href = redirect;
    } catch (error) {
      const msg = error instanceof Error ? error.message : '';
      if (msg === 'email-not-verified') {
        router.push(`/auth/email-verification?email=${encodeURIComponent(formData.email)}`);
      } else {
        setErrors({ form: 'Email or password is incorrect' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Welcome back! 👋"
      subtitle="Sign in to continue your MCAT prep."
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitButtonText={isLoading ? 'Signing in...' : 'Log In'}
      footer={
        <div className="pt-4 border-t border-[#E5E5E5] text-center">
          <p className="text-sm font-semibold text-[#5F6A59]">
            Don't have an account?{' '}
            <Link
              href={redirect ? `/auth/signup?redirect=${encodeURIComponent(redirect)}` : "/auth/signup"}
              className="font-extrabold text-[#58CC02] hover:text-[#2B6C00] transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      }
    >
      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="btn-3d w-full py-3 bg-white border-2 border-[#E5E5E5] border-b-4 border-b-[#C9C9C9] text-[#1A1C1C] font-extrabold rounded-2xl hover:bg-[#FAFAF9] flex items-center justify-center gap-2 transition-all disabled:opacity-60"
      >
        {googleLoading ? (
          <svg className="w-5 h-5 animate-spin text-[#5F6A59]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        )}
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px bg-[#E5E5E5] flex-grow" />
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5F6A59]">or email</span>
        <div className="h-px bg-[#E5E5E5] flex-grow" />
      </div>

      {/* Error */}
      {(errors.form || contextError) && (
        <ValidationMessage message={errors.form || contextError || ''} type="error" />
      )}

      {/* Fields */}
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
            className="text-xs font-extrabold text-[#58CC02] hover:text-[#2B6C00] transition-colors"
          >
            Forgot?
          </Link>
        }
      />
    </AuthForm>
  );
}

export default function SigninPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="text-center">
          <svg className="w-12 h-12 animate-spin text-[#58CC02] mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-[#5F6A59] font-bold">Loading sign in...</p>
        </div>
      </div>
    }>
      <SigninContent />
    </Suspense>
  );
}
