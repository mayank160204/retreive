'use client';

import React from 'react';
import Link from 'next/link';

interface AuthFormProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  readonly children: React.ReactNode;
  readonly footer?: React.ReactNode;
  readonly isLoading?: boolean;
  readonly submitButtonText?: string;
}

export function AuthForm({
  title,
  subtitle,
  onSubmit,
  children,
  footer,
  isLoading = false,
  submitButtonText = 'Continue',
}: AuthFormProps) {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col">
      {/* Top Header — matches AppShell */}
      <header className="w-full bg-white border-b-4 border-[#E5E5E5] sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 px-6 h-16 max-w-6xl mx-auto cursor-pointer hover:opacity-90">
          <div className="w-8 h-8 rounded-lg bg-[#58CC02] border-b-2 border-[#2B6C00] flex items-center justify-center font-bold text-white text-sm">
            R
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#58CC02]">RETREIVE</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white border-2 border-[#E5E5E5] rounded-3xl p-8 shadow-[0_6px_0_0_#E5E5E5]">
            {/* Title */}
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-[#1A1C1C] tracking-tight">{title}</h1>
              {subtitle && (
                <p className="text-sm font-semibold text-[#5F6A59] mt-1">{subtitle}</p>
              )}
            </div>

            {/* Form — only contains form fields + submit button */}
            <form onSubmit={onSubmit} className="space-y-4">
              {children}

              {/* Submit button */}
              {submitButtonText && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-3d w-full py-3.5 bg-[#58CC02] border-b-4 border-[#2B6C00] text-white font-extrabold rounded-2xl hover:bg-[#62e002] active:translate-y-1 active:border-b-0 transition-all disabled:bg-[#E5E5E5] disabled:border-[#becbb1] disabled:text-[#5F6A59] disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Loading...
                    </>
                  ) : (
                    submitButtonText
                  )}
                </button>
              )}
            </form>

            {/* Footer links — OUTSIDE the form so clicks don't submit */}
            {footer && (
              <div className="mt-5">
                {footer}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Page footer */}
      <footer className="text-center py-4 text-xs font-bold text-[#5F6A59]/60">
        © {new Date().getFullYear()} RETREIVE Health. Science for everyone.
      </footer>
    </div>
  );
}
