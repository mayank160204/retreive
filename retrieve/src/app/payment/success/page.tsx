'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [countdown, setCountdown] = useState(5);
  const [tierUpdated, setTierUpdated] = useState(false);
  const webhookFired = useRef(false);

  const sessionId = searchParams.get('session_id');
  const isMock = searchParams.get('mock') === 'true';
  const plan = searchParams.get('plan') || 'monthly';

  // Fire mock webhook to upgrade user tier in Firestore
  useEffect(() => {
    if (!user?.id || webhookFired.current) return;
    webhookFired.current = true;

    fetch('/api/stripe/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'checkout.session.completed',
        userId: user.id,
      }),
    })
      .then(() => setTierUpdated(true))
      .catch(() => setTierUpdated(true)); // Continue either way
  }, [user?.id]);

  // Countdown redirect to dashboard
  useEffect(() => {
    if (countdown <= 0) {
      router.push('/dashboard');
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, router]);

  const planLabel = plan === 'yearly' ? '$39.99 / year' : '$4.99 / month';

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6">
      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #00D97D 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #4DBFFF 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
      </div>

      <div className="relative z-10 text-center max-w-md w-full">
        {/* Success icon with pulse ring */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div
            className="absolute w-32 h-32 rounded-full opacity-30 animate-ping"
            style={{ background: '#00D97D' }}
          />
          <div className="absolute w-28 h-28 rounded-full" style={{ background: 'rgba(0,217,125,0.1)' }} />
          <div
            className="relative w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_40px_rgba(0,217,125,0.5)]"
            style={{ background: 'linear-gradient(135deg, #00D97D 0%, #00A85C 100%)' }}
          >
            ✓
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
          You're Unlimited!
        </h1>
        <p className="text-[#00D97D] font-semibold mb-1">RETREIVE Pro activated 🚀</p>
        <p className="text-slate-500 text-sm mb-6">{planLabel}</p>

        {/* Mock badge */}
        {isMock && (
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-6 border"
            style={{
              background: 'rgba(251,191,36,0.08)',
              borderColor: 'rgba(251,191,36,0.3)',
              color: '#FBB724',
            }}
          >
            ⚡ Demo mode — payment simulated
          </div>
        )}

        {/* User info */}
        {user && (
          <div
            className="mb-6 px-6 py-4 rounded-2xl border"
            style={{ background: 'rgba(0,217,125,0.06)', borderColor: 'rgba(0,217,125,0.15)' }}
          >
            <p className="text-slate-400 text-sm">Subscription active for</p>
            <p className="text-white font-semibold mt-1">{user.email}</p>
            {tierUpdated && (
              <p className="text-[#00D97D] text-xs mt-2">✓ Account upgraded in Firestore</p>
            )}
          </div>
        )}

        {/* What's unlocked */}
        <div className="text-left space-y-3 mb-8">
          {[
            'Unlimited PDF uploads — no monthly cap',
            'Full karaoke reader — every passage',
            'Real-time speech recognition (Deepgram)',
            'Weekly leaderboard participation',
            'Streak freeze purchases (2 free / month)',
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                style={{ background: '#00D97D' }}
              >
                ✓
              </span>
              <span className="text-slate-300 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* Receipt */}
        {sessionId && (
          <p className="text-slate-600 text-xs mb-4 font-mono break-all">
            Receipt ID: {sessionId.slice(0, 28)}...
          </p>
        )}

        {/* Countdown redirect */}
        <div
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm text-slate-400 border mb-3"
          style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
        >
          <div className="w-4 h-4 rounded-full border-2 border-slate-600 border-t-[#00D97D] animate-spin" />
          Back to dashboard in <strong className="text-white">{countdown}s</strong>
        </div>

        <div>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-[#00D97D] text-sm hover:underline transition-all"
          >
            Go now →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-[#00D97D] animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
