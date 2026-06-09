// Password strength meter — VaultFlow/Duolingo-style matching the dashboard
'use client';

import React from 'react';

interface PasswordStrengthProps {
  readonly password: string;
  readonly showFeedback?: boolean;
}

export function PasswordStrength({ password, showFeedback = true }: PasswordStrengthProps) {
  const calculateStrength = (pwd: string): { score: number; label: string; barColor: string; textColor: string } => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) score += 1;

    if (score >= 6) return { score, label: 'Strong 💪', barColor: 'bg-[#58CC02]', textColor: 'text-[#2B6C00]' };
    if (score >= 4) return { score, label: 'Good 👍', barColor: 'bg-[#FBB724]', textColor: 'text-[#755B00]' };
    if (score >= 2) return { score, label: 'Fair ⚡', barColor: 'bg-[#FF9500]', textColor: 'text-[#855200]' };
    return { score, label: 'Weak ❌', barColor: 'bg-[#BA1A1A]', textColor: 'text-[#BA1A1A]' };
  };

  const strength = calculateStrength(password);
  const strengthPercentage = (strength.score / 7) * 100;

  const requirements = [
    { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
    { id: 'uppercase', label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { id: 'lowercase', label: 'Lowercase letter', met: /[a-z]/.test(password) },
    { id: 'number', label: 'Number', met: /\d/.test(password) },
    { id: 'special', label: 'Special character (!@#...)', met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="w-full space-y-2">
      {/* Strength bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-[#E5E5E5] rounded-full h-2.5 overflow-hidden border border-[#E5E5E5]">
          <div
            className={`h-full rounded-full transition-all duration-300 ${strength.barColor}`}
            style={{ width: `${Math.max(15, strengthPercentage)}%` }}
          />
        </div>
        <span className={`text-xs font-extrabold min-w-fit ${strength.textColor}`}>
          {strength.label}
        </span>
      </div>

      {/* Requirements */}
      {showFeedback && (
        <div className="grid grid-cols-2 gap-1">
          {requirements.map((req) => (
            <div key={req.id} className="flex items-center gap-1.5 text-xs">
              <span className={`flex-shrink-0 font-bold ${req.met ? 'text-[#58CC02]' : 'text-[#A6A6A6]'}`}>
                {req.met ? '✓' : '○'}
              </span>
              <span className={`font-semibold ${req.met ? 'text-[#2B6C00]' : 'text-[#5F6A59]'}`}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
