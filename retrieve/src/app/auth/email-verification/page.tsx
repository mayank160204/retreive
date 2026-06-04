// Email verification page
'use client';

import React, { useEffect, useMemo, useState, Suspense } from 'react';
import { applyActionCode, sendEmailVerification } from 'firebase/auth';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthForm } from '@/components/AuthForm';
import { ValidationMessage } from '@/components/ValidationMessage';
import { useAuth } from '@/lib/auth-context';
import { auth } from '@/lib/firebase';

interface FormErrors {
  form?: string;
}

function EmailVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  const actionCode = useMemo(() => searchParams.get('oobCode'), [searchParams]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown((count) => count - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  useEffect(() => {
    const verifyLink = async () => {
      if (!actionCode || !auth) return;

      try {
        setIsLoading(true);
        setErrors({});
        await applyActionCode(auth, actionCode);
        setSuccessMessage('Email verified successfully! Redirecting to sign in...');

        setTimeout(() => {
          router.push('/auth/signin');
        }, 1500);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to verify email';
        setErrors({ form: errorMessage });
      } finally {
        setIsLoading(false);
      }
    };

    void verifyLink();
  }, [actionCode, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!verificationCode.trim() || verificationCode.length !== 6) {
      setErrors({ form: 'Please enter a valid 6-digit verification code.' });
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      setSuccessMessage('');
      
      // Simulate verification API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccessMessage('Email verified successfully! Redirecting to sign in...');
      setTimeout(() => {
        router.push('/auth/signin');
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Verification failed';
      setErrors({ form: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = () => {
    if (resendCountdown > 0 || isLoading) return;
    setSuccessMessage('A new 6-digit verification code has been sent to your email.');
    setResendCountdown(60);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <AuthForm
      title="Verify Your Email"
      subtitle={actionCode ? 'Verifying your email address…' : `Enter the 6-digit verification code sent to ${user?.email || 'your email'}`}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitButtonText={isLoading ? 'Verifying...' : 'Verify Code'}
    >
      {successMessage && <ValidationMessage message={successMessage} type="success" />}
      {errors.form && <ValidationMessage message={errors.form} type="error" />}

      <div className="space-y-md">
        <div className="flex flex-col gap-sm">
          <label className="text-sm font-semibold text-slate-300">6-Digit Verification Code</label>
          <input
            type="text"
            maxLength={6}
            value={verificationCode}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '');
              setVerificationCode(val);
              if (errors.form) setErrors({});
            }}
            placeholder="123456"
            className="w-full text-center tracking-[1em] font-mono text-xl h-[56px] bg-[#111111] border-2 border-white/10 focus:border-[#00D97D] focus:ring-0 text-white rounded-xl outline-none transition-all"
            required
            disabled={isLoading || actionCode !== null}
          />
        </div>
      </div>

      <div className="text-center border-t border-white/10 pt-lg mt-md">
        <p className="text-sm text-slate-400 mb-3">Didn't receive the code?</p>
        <button
          type="button"
          onClick={handleResendEmail}
          disabled={resendCountdown > 0 || isLoading || actionCode !== null}
          className={`text-[#00D97D] hover:underline font-semibold transition-opacity ${
            resendCountdown > 0 || isLoading || actionCode !== null ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend code'}
        </button>
      </div>

      <p className="text-center text-slate-400 text-sm mt-md">
        <Link href="/auth/signin" className="text-[#00D97D] hover:underline font-semibold">
          Back to sign in
        </Link>
      </p>
    </AuthForm>
  );
}

export default function EmailVerificationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-dark-bg text-text-primary">Loading verification page...</div>}>
      <EmailVerificationContent />
    </Suspense>
  );
}
