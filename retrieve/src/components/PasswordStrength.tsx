// Password strength meter component
'use client';

import React from 'react';

interface PasswordStrengthProps {
  readonly password: string;
  readonly showFeedback?: boolean;
}

export function PasswordStrength({ password, showFeedback = true }: PasswordStrengthProps) {
  const calculateStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;

    // Length check
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;

    // Uppercase check
    if (/[A-Z]/.test(pwd)) score += 1;

    // Lowercase check
    if (/[a-z]/.test(pwd)) score += 1;

    // Number check
    if (/\d/.test(pwd)) score += 1;

    // Special character check
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) score += 1;

    // Determine label and color
    let label = 'Weak';
    let color = 'bg-error-red';

    if (score >= 6) {
      label = 'Strong';
      color = 'bg-accent-green';
    } else if (score >= 4) {
      label = 'Good';
      color = 'bg-warning-orange';
    } else if (score >= 2) {
      label = 'Fair';
      color = 'bg-warning-yellow';
    }

    return { score, label, color };
  };

  const strength = calculateStrength(password);
  const strengthPercentage = (strength.score / 7) * 100;

  const requirements = [
    { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
    { id: 'uppercase', label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { id: 'lowercase', label: 'Lowercase letter', met: /[a-z]/.test(password) },
    { id: 'number', label: 'Number', met: /\d/.test(password) },
    { id: 'special', label: 'Special character', met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="w-full space-y-3">
      {/* Strength bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-surface rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strength.color}`}
            // eslint-disable-next-line react/no-unknown-property
            aria-hidden="true"
            style={{
              width: `${Math.max(20, strengthPercentage)}%`,
            }}
          ></div>
        </div>
        <span className="text-sm font-medium text-text-secondary min-w-fit">{strength.label}</span>
      </div>

      {/* Requirements checklist */}
      {showFeedback && (
        <div className="space-y-2">
          {requirements.map((req) => (
            <div key={req.id} className="flex items-center gap-2 text-sm">
              <svg
                className={`w-4 h-4 flex-shrink-0 ${
                  req.met ? 'text-accent-green' : 'text-text-secondary'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className={req.met ? 'text-accent-green' : 'text-text-secondary'}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
