// Validation message component — VaultFlow/Duolingo-style matching the dashboard
'use client';

import React from 'react';

interface ValidationMessageProps {
  readonly message: string;
  readonly type?: 'error' | 'success' | 'warning' | 'info';
  readonly onDismiss?: () => void;
}

export function ValidationMessage({
  message,
  type = 'error',
  onDismiss,
}: ValidationMessageProps) {
  const styles = {
    error: {
      container: 'bg-[#FFDAD6] border-[#BA1A1A] text-[#BA1A1A]',
      icon: '⚠️',
    },
    success: {
      container: 'bg-[#E8F9DB] border-[#58CC02] text-[#2B6C00]',
      icon: '✅',
    },
    warning: {
      container: 'bg-[#FFF9E0] border-[#FBB724] text-[#755B00]',
      icon: '⚡',
    },
    info: {
      container: 'bg-[#E0F5FF] border-[#006590] text-[#006590]',
      icon: 'ℹ️',
    },
  };

  const s = styles[type];

  return (
    <div
      className={`w-full p-3 rounded-xl border-2 flex items-start gap-2 ${s.container}`}
      role="alert"
    >
      <span className="text-sm flex-shrink-0">{s.icon}</span>
      <p className="text-sm font-bold flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity font-extrabold text-lg leading-none"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}
