// Form input component with gamified premium styling
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
    <div className="space-y-xs w-full">
      <div className="flex justify-between items-center ml-xs">
        <label
          htmlFor={name}
          className="text-label-bold font-label-bold text-on-surface"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
        {rightElement && <div>{rightElement}</div>}
      </div>

      <div className="relative">
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={`input-gamified w-full h-[56px] px-md rounded-xl border-2 transition-all focus:scale-[1.01] bg-surface-container-lowest
            ${
              error
                ? 'border-error text-error focus:ring-0 focus:border-error focus:bg-error-container/10'
                : 'border-surface-container-high focus:border-secondary focus:ring-0 text-on-surface placeholder:text-outline-variant'
            }
            font-body-md text-body-md
          `}
        />
      </div>

      <div className={`validation-message font-label-bold text-[12px] px-base text-error ${error ? 'show' : ''}`}>
        {error}
      </div>
    </div>
  );
}
