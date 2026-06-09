// Form input component — VaultFlow/Duolingo-style matching the dashboard
'use client';

import React from 'react';

interface FormInputProps {
  readonly label: string;
  readonly type: 'text' | 'email' | 'password';
  readonly name: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly error?: string;
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly autoComplete?: string;
  readonly rightElement?: React.ReactNode;
}

export function FormInput({
  label,
  type,
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  autoComplete,
  rightElement,
}: FormInputProps) {
  return (
    <div className="w-full">
      {/* Label row */}
      <div className="flex justify-between items-center mb-1.5">
        <label
          htmlFor={name}
          className="text-xs font-extrabold uppercase tracking-wider text-[#5F6A59]"
        >
          {label}
          {required && <span className="text-[#BA1A1A] ml-1">*</span>}
        </label>
        {rightElement && <div>{rightElement}</div>}
      </div>

      {/* Input */}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={`w-full border-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors outline-none focus:border-[#58CC02] bg-white text-[#1A1C1C] placeholder:text-[#A6A6A6] ${
          error ? 'border-[#BA1A1A] bg-[#FFDAD6]/30' : 'border-[#E5E5E5]'
        }`}
      />

      {/* Error message */}
      {error && (
        <p className="mt-1 text-xs font-bold text-[#BA1A1A]">⚠️ {error}</p>
      )}
    </div>
  );
}
