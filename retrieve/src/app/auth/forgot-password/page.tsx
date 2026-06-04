// Forgot password page
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { FormInput } from '@/components/FormInput';
import { AuthForm } from '@/components/AuthForm';
import { ValidationMessage } from '@/components/ValidationMessage';
import Link from 'next/link';

interface FormErrors {
  email?: string;
  form?: string;
}

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (value: string) => {
    setEmail(value);
    if (errors.email) {
      setErrors((prev) => ({
        ...prev,
        email: undefined,
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
      await resetPassword(email);

      setSuccessMessage(
        'Password reset email sent! Check your inbox for instructions (valid for 1 hour).',
      );

      // Clear form
      setEmail('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';

      if (errorMessage.includes('not found')) {
        setErrors({ email: 'This email is not registered' });
      } else {
        setErrors({ form: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Forgot Password"
      subtitle="Enter your email to receive password reset instructions"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitButtonText={isLoading ? 'Sending...' : 'Send Reset Link'}
    >
      {/* Messages */}
      {successMessage && <ValidationMessage message={successMessage} type="success" />}
      {errors.form && <ValidationMessage message={errors.form} type="error" />}

      {/* Form field */}
      <div className="space-y-md">
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          error={errors.email}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />

        <div className="p-sm rounded-lg bg-surface-variant/30 text-body-sm font-body-md text-on-surface-variant flex items-start gap-2 border border-outline-variant/30">
          <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">info</span>
          <p>
            We'll send you an email with instructions to reset your password. The link will expire in
            1 hour.
          </p>
        </div>
      </div>

      {/* Back to sign in link */}
      <div className="mt-lg pt-lg border-t border-surface-container-high text-center">
        <p className="text-body-md font-body-md text-on-surface-variant">
          Remember your password?{' '}
          <Link href="/auth/signin" className="text-label-bold font-label-bold text-secondary hover:text-on-secondary-container transition-colors ml-xs inline-block">
            Sign in
          </Link>
        </p>
      </div>
    </AuthForm>
  );
}
