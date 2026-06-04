'use client';

import React, { useState, useEffect } from 'react';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormInput } from '@/components/FormInput';
import { AuthForm } from '@/components/AuthForm';
import { PasswordStrength } from '@/components/PasswordStrength';
import { ValidationMessage } from '@/components/ValidationMessage';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  form?: string;
}

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [resetCode, setResetCode] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const oobCode = searchParams.get('oobCode');
    const actionCode = code || oobCode;

    if (!actionCode) {
      setTokenValid(false);
      return;
    }

    setResetCode(actionCode);

    const validateCode = async () => {
      try {
        if (!auth) {
          setTokenValid(false);
          return;
        }

        await verifyPasswordResetCode(auth, actionCode);
        setTokenValid(true);
      } catch {
        setTokenValid(false);
      }
    };

    void validateCode();
  }, [searchParams]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain an uppercase letter';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain a number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      if (!resetCode || !auth) {
        throw new Error('Invalid reset link');
      }

      await confirmPasswordReset(auth, resetCode, formData.password);

      setTimeout(() => {
        router.push('/auth/signin?message=Password%20reset%20successful');
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';

      if (errorMessage.includes('expired') || errorMessage.includes('invalid')) {
        setErrors({
          form: 'Password reset link has expired. Please request a new one.',
        });
      } else {
        setErrors({ form: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-background">
        <div className="text-center">
          <svg className="w-12 h-12 animate-spin text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-on-surface-variant font-label-bold">Validating link...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <AuthForm
        title="Invalid Reset Link"
        subtitle="This password reset link is invalid or has expired"
        onSubmit={(e) => e.preventDefault()}
        submitButtonText="Return to Login"
      >
        <ValidationMessage
          message="The password reset link is no longer valid. Please request a new one."
          type="error"
        />

        <div className="mt-lg pt-lg border-t border-surface-container-high text-center">
          <p className="text-body-md font-body-md text-on-surface-variant">
            Need a new reset link?{' '}
            <Link href="/auth/forgot-password" className="text-label-bold font-label-bold text-primary hover:text-primary-container transition-colors ml-xs inline-block">
              Request one here
            </Link>
          </p>
        </div>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Set New Password"
      subtitle="Enter your new password to secure your account."
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitButtonText={isLoading ? 'Updating...' : 'Update Password'}
    >
      {errors.form && <ValidationMessage message={errors.form} type="error" />}

      <div className="space-y-md">
        <div className="space-y-sm">
          <FormInput
            label="New Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange('password')}
            error={errors.password}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />

          {formData.password && <PasswordStrength password={formData.password} />}
        </div>

        <FormInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
          error={errors.confirmPassword}
          placeholder="••••••••"
          required
          autoComplete="new-password"
        />
      </div>

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
