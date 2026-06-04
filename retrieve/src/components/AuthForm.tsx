// Auth form wrapper component with Premium Motion gamified styling
'use client';

import React from 'react';
import Image from 'next/image';

interface AuthFormProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  readonly children: React.ReactNode;
  readonly isLoading?: boolean;
  readonly submitButtonText?: string;
}

export function AuthForm({
  title,
  subtitle,
  onSubmit,
  children,
  isLoading = false,
  submitButtonText = 'Continue',
}: AuthFormProps) {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden">
      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center px-margin-mobile py-xl">
        <div className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
          
          {/* Left Side: Mascot & Brand Welcome */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-md animate-slide-up-entrance stagger-1">
            <div className="relative w-[320px] h-[320px] animate-subtle-float">
              {/* Fallback to regular img tag for external src if next/image domain isn't configured, but try standard img */}
              <img 
                alt="RETREIVE Mascot" 
                className="w-full h-full object-contain" 
                src="https://lh3.googleusercontent.com/aida/ADBb0ugjwJWgWB7sBrXY5WSwAbvVekEyBuxlUqoKlPSHRjW-3ieGsaFlUpmpSxO453frBmkobK3Hr5XRWlukleiRpwbu4YHrxdWR2_Ia4akgXt0-J2-_fTFN4ubbldKw4p8TsPqtnw0B3KH0o6HKQX-xGooGMB-Yi1o6ctvsCGfURG64OLc6UeUXWP_200zdpMUcwcJ6id3jXBb-QylxS_Uxcc3YIUM_PMRq4qpT0M6xD1qEsHa8GcWNrxGuQ_-d"
              />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-6 bg-surface-container-highest rounded-full blur-xl opacity-40"></div>
            </div>
            <div className="text-center space-y-sm px-md animate-slide-up-entrance stagger-2">
              <h1 className="text-headline-xl font-headline-xl text-primary tracking-tighter uppercase">RETREIVE</h1>
              <p className="text-body-lg font-body-lg text-on-surface-variant max-w-sm mx-auto">
                Welcome! Ready to dive into your next research adventure?
              </p>
            </div>
          </div>

          {/* Right Side: Form Card */}
          <div className="bg-surface-container-lowest p-md md:p-lg rounded-xl border-2 border-surface-container-high shadow-sm animate-slide-up-entrance stagger-2 card-lift">
            
            {/* Mobile Logo (Visible only on small screens) */}
            <div className="lg:hidden flex flex-col items-center mb-lg space-y-sm">
              <div className="w-24 h-24 mb-xs animate-subtle-float">
                <img 
                  alt="RETREIVE Mascot" 
                  className="w-full h-full object-contain" 
                  src="https://lh3.googleusercontent.com/aida/ADBb0ugjwJWgWB7sBrXY5WSwAbvVekEyBuxlUqoKlPSHRjW-3ieGsaFlUpmpSxO453frBmkobK3Hr5XRWlukleiRpwbu4YHrxdWR2_Ia4akgXt0-J2-_fTFN4ubbldKw4p8TsPqtnw0B3KH0o6HKQX-xGooGMB-Yi1o6ctvsCGfURG64OLc6UeUXWP_200zdpMUcwcJ6id3jXBb-QylxS_Uxcc3YIUM_PMRq4qpT0M6xD1qEsHa8GcWNrxGuQ_-d"
                />
              </div>
              <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-primary tracking-tighter uppercase">RETREIVE</h1>
            </div>

            <header className="mb-lg animate-slide-up-entrance stagger-3">
              <h2 className="text-headline-md font-headline-md text-on-surface mb-xs">{title}</h2>
              {subtitle && <p className="text-body-md font-body-md text-on-surface-variant">{subtitle}</p>}
            </header>

            <form onSubmit={onSubmit} className="space-y-md animate-slide-up-entrance stagger-4">
              {children}

              {/* Form Actions */}
              <button
                type="submit"
                disabled={isLoading}
                className={`btn-premium w-full h-[56px] font-label-bold rounded-xl border-b-[4px] transition-all mt-sm ${
                  isLoading 
                    ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed border-b-surface-variant' 
                    : 'bg-primary text-on-primary border-b-on-primary-fixed-variant hover:bg-primary-container hover:text-on-primary-container'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  submitButtonText
                )}
              </button>
            </form>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary dark:bg-on-primary-fixed w-full rounded-t-xl mt-auto animate-slide-up-entrance stagger-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-lg px-gutter py-xl max-w-[1200px] mx-auto">
          <div className="col-span-2">
            <span className="text-headline-md font-headline-md font-black text-on-primary dark:text-primary-fixed">RETREIVE</span>
            <p className="text-on-primary opacity-80 mt-sm text-body-md font-body-md max-w-xs">Science for everyone. Empowering research through gamified engagement.</p>
          </div>
        </div>
        <div className="px-gutter pb-md max-w-[1200px] mx-auto border-t border-on-primary/10 pt-md">
          <p className="text-on-primary opacity-60 text-body-md font-body-md text-center md:text-left">
            © {new Date().getFullYear()} RETREIVE Health. Science for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
}
