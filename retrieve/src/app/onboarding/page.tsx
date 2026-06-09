'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { updateUserDocument } from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';
import Mascot3D from '@/components/Mascot3D';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState('regular');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (user.id !== 'demo-user') {
        // Save daily goal to firestore if it's a real user
        await updateUserDocument(user.id, {
          // @ts-ignore - daily_goal is a custom dynamic property
          daily_goal: selectedGoal,
          onboarding_completed: true
        });
      }
      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to save onboarding data:', err);
      router.push('/dashboard');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <svg className="w-12 h-12 animate-spin text-[#58CC02]" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        </svg>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1A1C1C] flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#E8F9DB] opacity-30 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#E0F5FF] opacity-30 blur-3xl rounded-full"></div>
      </div>

      {/* Main card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-4xl bg-white border-4 border-[#E5E5E5] rounded-3xl shadow-[0_8px_0_0_#E5E5E5] overflow-hidden flex flex-col md:flex-row min-h-[550px] transition-all"
      >
        
        {/* Left Side: Mascot Art */}
        <div className="w-full md:w-1/2 bg-[#FAFAF9] border-b-4 md:border-b-0 md:border-r-4 border-[#E5E5E5] p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* Pulsing background circle */}
            <div className="absolute inset-0 bg-[#E8F9DB] rounded-full scale-110 animate-pulse"></div>
            
            {/* Mascot Icon */}
            <Mascot3D 
              emotion={step === 3 ? "celebrating" : "idle"}
              className="w-40 h-40 relative z-10 select-none"
            />
            
            {/* Talk bubble */}
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-white border-2 border-[#58CC02] p-2 rounded-xl font-extrabold text-xs text-[#58CC02] shadow-[0_2px_0_0_#E5E5E5]"
            >
              Welcome! 🗣️
            </motion.div>
          </div>
          <div className="mt-4 text-center">
            <span className="px-3 py-1 bg-[#E8F9DB] text-[#2B6C00] font-extrabold rounded-full text-xs uppercase tracking-wider border border-[#B7EB8F]">
              StudySpark Mascot
            </span>
          </div>
        </div>

        {/* Right Side: Step Content */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          
          {/* Progress Indicators */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-1.5">
              <div className={`h-3 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-[#58CC02]' : 'w-3 bg-[#E5E5E5]'}`} />
              <div className={`h-3 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-[#58CC02]' : 'w-3 bg-[#E5E5E5]'}`} />
              <div className={`h-3 rounded-full transition-all duration-300 ${step === 3 ? 'w-8 bg-[#58CC02]' : 'w-3 bg-[#E5E5E5]'}`} />
            </div>
            {step < 3 && (
              <button 
                onClick={handleSkip}
                className="text-xs font-extrabold text-[#5F6A59] hover:text-[#1A1C1C] transition-colors"
              >
                Skip
              </button>
            )}
          </div>

          {/* Animating step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-grow flex flex-col justify-center"
            >
              {/* STEP 1: Welcome science */}
              {step === 1 && (
                <div>
                  <span className="text-xxs font-extrabold uppercase tracking-widest text-[#58CC02] mb-1.5 block">Proven Cognitive Science</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1C1C] leading-tight mb-3">
                    Study at the Speed of Light
                  </h2>
                  <p className="text-sm font-medium text-[#5F6A59] leading-relaxed mb-6">
                    Active vocalization engages three brain regions simultaneously, boosting retention by <span className="text-[#58CC02] font-extrabold">40%</span>. Ready to harness the Production Effect?
                  </p>

                  <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                      <div className="w-9 h-9 rounded-full bg-[#E0F5FF] flex items-center justify-center text-lg flex-shrink-0">🎙️</div>
                      <div>
                        <h4 className="text-sm font-extrabold text-[#1A1C1C]">The Production Effect</h4>
                        <p className="text-xs font-bold text-[#5F6A59]">Reading aloud converts passive recognition into active long-term memories.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-9 h-9 rounded-full bg-[#E8F9DB] flex items-center justify-center text-lg flex-shrink-0">⚡</div>
                      <div>
                        <h4 className="text-sm font-extrabold text-[#1A1C1C]">Triple Activation</h4>
                        <p className="text-xs font-bold text-[#5F6A59]">Visual, motor, and auditory systems fire together to build stronger neural pathways.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Goal selection */}
              {step === 2 && (
                <div>
                  <span className="text-xxs font-extrabold uppercase tracking-widest text-[#58CC02] mb-1.5 block">Adaptive Learning</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1C1C] leading-tight mb-3">
                    Pick Your MCAT Goal
                  </h2>
                  <p className="text-sm font-medium text-[#5F6A59] mb-5">
                    Set a daily commitment target. You can adjust this anytime in your profile settings.
                  </p>

                  <div className="space-y-3">
                    {[
                      { id: 'casual', label: 'Casual', desc: '10 mins / day', xp: '+50 XP target' },
                      { id: 'regular', label: 'Regular', desc: '20 mins / day', xp: '+100 XP target' },
                      { id: 'serious', label: 'Serious', desc: '30 mins / day', xp: '+150 XP target' },
                      { id: 'insane', label: 'Insane', desc: '60 mins / day', xp: '+300 XP target' }
                    ].map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setSelectedGoal(g.id)}
                        className={`w-full p-3 text-left border-2 rounded-xl flex items-center justify-between font-bold transition-all shadow-[0_2px_0_0_#E5E5E5] ${
                          selectedGoal === g.id
                            ? 'border-[#58CC02] bg-[#E8F9DB] text-[#2B6C00] shadow-[0_2px_0_0_#58CC02]'
                            : 'border-[#E5E5E5] bg-white text-[#1A1C1C] hover:bg-[#FAFAF9]'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-extrabold">{g.label}</p>
                          <p className="text-xs font-medium opacity-85">{g.desc}</p>
                        </div>
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-white border border-[#E5E5E5]">
                          {g.xp}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Complete / Ready */}
              {step === 3 && (
                <div className="flex flex-col justify-center items-center text-center">
                  <span className="text-5xl mb-4 animate-bounce">🏆</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1C1C] leading-tight mb-2">
                    You're All Set!
                  </h2>
                  <p className="text-sm font-bold text-[#5F6A59] max-w-sm mb-6 leading-relaxed">
                    Your study goals have been configured. Daily study multipliers are now unlocked. Let's make this study session count!
                  </p>
                  
                  <div className="w-full bg-[#FFF9E0] border-2 border-[#FFE894] p-4 rounded-2xl flex items-center justify-center gap-3 max-w-sm mb-4">
                    <span className="text-2xl animate-pulse">🎁</span>
                    <div className="text-left font-bold">
                      <p className="text-xs text-[#755B00] uppercase tracking-wider">Newbie Bonus</p>
                      <p className="text-sm text-[#1A1C1C] font-extrabold">First-Session XP Multiplier: Unlocked!</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Action Button */}
          <div className="mt-8">
            <button
              onClick={handleNext}
              disabled={saving}
              className="btn-3d w-full py-4 bg-[#58CC02] border-b-4 border-[#2B6C00] text-white rounded-xl font-extrabold text-base hover:bg-[#62e002] active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-1.5"
            >
              {saving ? (
                <span>Saving...</span>
              ) : step === 3 ? (
                <>
                  <span>Start Your First Session</span>
                  <span className="material-symbols-outlined font-bold">arrow_forward</span>
                </>
              ) : (
                <>
                  <span>Next Step</span>
                  <span className="material-symbols-outlined font-bold">arrow_forward</span>
                </>
              )}
            </button>
          </div>

        </div>

      </motion.div>
      
    </div>
  );
}
