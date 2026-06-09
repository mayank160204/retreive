// Email verification instruction page — VaultFlow/Duolingo style
'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AuthForm } from '@/components/AuthForm';

function EmailVerificationContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email';

  return (
    <AuthForm
      title="Check Your Email 📬"
      subtitle="Almost there — one quick step left."
      onSubmit={(e) => e.preventDefault()}
      isLoading={false}
      submitButtonText=""
      footer={
        <Link
          href="/auth/signin"
          className="btn-3d w-full py-3.5 bg-[#58CC02] border-b-4 border-[#2B6C00] text-white font-extrabold rounded-2xl hover:bg-[#62e002] active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm font-bold">login</span>
          Go to Login
        </Link>
      }
    >
      {/* Icon */}
      <div className="flex justify-center py-2">
        <div className="w-20 h-20 rounded-full bg-[#E0F5FF] border-2 border-[#B3E5FF] flex items-center justify-center shadow-[0_4px_0_0_#B3E5FF]">
          <span className="material-symbols-outlined text-[#006590] text-4xl font-bold">
            mark_email_unread
          </span>
        </div>
      </div>

      {/* Message */}
      <div className="bg-[#E8F9DB] border-2 border-[#B7EB8F] rounded-2xl p-4 text-center shadow-[0_4px_0_0_#B7EB8F]">
        <p className="text-sm font-bold text-[#2B6C00] leading-relaxed">
          We have sent you a verification email to{' '}
          <span className="font-extrabold text-[#1A1C1C] break-all">{email}</span>.
          <br />
          Please verify it and log in.
        </p>
      </div>

      {/* Tips */}
      <div className="bg-[#FFF9E0] border-2 border-[#FFE894] rounded-xl p-3">
        <p className="text-xs font-bold text-[#755B00]">💡 Don't see it? Check your spam/junk folder.</p>
      </div>
    </AuthForm>
  );
}

export default function EmailVerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="text-center">
          <svg className="w-12 h-12 animate-spin text-[#58CC02] mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-[#5F6A59] font-bold">Loading verification page...</p>
        </div>
      </div>
    }>
      <EmailVerificationContent />
    </Suspense>
  );
}
