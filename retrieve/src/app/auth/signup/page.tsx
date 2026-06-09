// Sign up page — VaultFlow/Duolingo style
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') || '/dashboard';

  const { signup, signinWithGoogle, user, loading: authLoading, error: contextError } = useAuth();
  const [isSuccessRedirect, setIsSuccessRedirect] = useState(false);

  useEffect(() => {
    if (!authLoading && user && !isSuccessRedirect) {
      window.location.href = redirect;
    }
  }, [user, authLoading, isSuccessRedirect, redirect]);

  const [formData, setFormData] = useState({ email: '', name: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrors({});
    try {
      await signinWithGoogle();
      window.location.href = redirect;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Google sign up failed';
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
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
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
    setSuccessMessage('');

    try {
      setIsSuccessRedirect(true);
      await signup(formData.email, formData.password, formData.name);
      
      const isDev = process.env.NODE_ENV === 'development';
      if (isDev) {
        setSuccessMessage('Account created! Logging in...');
        setTimeout(() => {
          window.location.href = redirect;
        }, 1500);
      } else {
        setSuccessMessage('Account created! Redirecting to email verification...');
        setTimeout(() => {
          router.push(`/auth/email-verification?email=${encodeURIComponent(formData.email)}`);
        }, 1500);
      }
    } catch (error) {
      setIsSuccessRedirect(false);
      const msg = error instanceof Error ? error.message : 'Failed to create account';
      if (msg.includes('already') || msg.includes('in-use') || msg.includes('email-already-in-use')) {
        setErrors({ form: 'User already exists. Please sign in' });
      } else {
        setErrors({ form: msg });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Join RETREIVE 🚀"
      subtitle="Create your account and start mastering the MCAT."
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitButtonText={isLoading ? 'Creating Account...' : 'Create Account'}
      footer={
        <div className="space-y-2 pt-4 border-t border-[#E5E5E5] text-center">
          <p className="text-xs font-semibold text-[#5F6A59]">
            By signing up, you agree to our{' '}
            <a className="font-extrabold text-[#58CC02] hover:underline" href="#">Terms</a>{' '}
            and{' '}
            <a className="font-extrabold text-[#58CC02] hover:underline" href="#">Privacy Policy</a>.
          </p>
          <p className="text-sm font-semibold text-[#5F6A59]">
            Already have an account?{' '}
            <Link
              href={redirect ? `/auth/signin?redirect=${encodeURIComponent(redirect)}` : "/auth/signin"}
              className="font-extrabold text-[#58CC02] hover:text-[#2B6C00] transition-colors"
            >
              Log in
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

      {/* Messages */}
      {successMessage && <ValidationMessage message={successMessage} type="success" />}
      {(errors.form || contextError) && (
        <ValidationMessage message={errors.form || contextError || ''} type="error" />
      )}

      {/* Fields */}
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

      <div>
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
        {formData.password && (
          <div className="mt-2">
            <PasswordStrength password={formData.password} />
          </div>
        )}
      </div>
    </AuthForm>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="text-center">
          <svg className="w-12 h-12 animate-spin text-[#58CC02] mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-[#5F6A59] font-bold">Loading registration...</p>
        </div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
