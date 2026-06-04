'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function LandingPage() {
  const mascotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Setup intersection observer for fade-up animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('fade-up')) {
            entry.target.classList.add('visible');
          }
          
          const progressBars = entry.target.querySelectorAll('.progress-fill');
          progressBars.forEach(bar => bar.classList.add('animate'));
          
          if (entry.target.classList.contains('progress-fill')) {
            entry.target.classList.add('animate');
          }

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .progress-fill').forEach(el => {
      observer.observe(el);
    });

    // Mouse move effect for mascot
    const handleMouseMove = (e: MouseEvent) => {
      if (!mascotRef.current?.parentElement) return;
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 15;
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 15;
      mascotRef.current.parentElement.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      mascotRef.current.parentElement.style.transition = 'transform 0.2s cubic-bezier(0, 0, 0.2, 1)';
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased overflow-x-hidden">
      <style jsx>{`
        :root {
          --spring-easing: cubic-bezier(0.34, 1.56, 0.64, 1);
          --linear-out: cubic-bezier(0, 0, 0.2, 1);
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up, .hover-card, .primary-btn, .secondary-btn, .mascot-float, .progress-fill {
            transition: none !important;
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }

        .primary-btn {
          background-color: #58cc02;
          box-shadow: 0 4px 0 0 #2b6c00;
          transition: transform 0.2s var(--spring-easing), box-shadow 0.2s var(--spring-easing);
        }
        
        .primary-btn:hover {
          transform: scale(1.03);
          box-shadow: 0 6px 0 0 #2b6c00;
        }

        .primary-btn:active {
          transform: translateY(4px) scale(0.97);
          box-shadow: 0 0 0 0 #2b6c00;
        }

        .secondary-btn {
          background-color: #ffffff;
          border: 2px solid #e3e2e2;
          box-shadow: 0 4px 0 0 #e3e2e2;
          transition: transform 0.2s var(--spring-easing), box-shadow 0.2s var(--spring-easing);
        }

        .secondary-btn:hover {
          transform: scale(1.03);
          box-shadow: 0 6px 0 0 #e3e2e2;
        }

        .secondary-btn:active {
          transform: translateY(4px) scale(0.97);
          box-shadow: 0 0 0 0 #e3e2e2;
        }

        .hover-card {
          transition: transform 0.4s var(--spring-easing), box-shadow 0.4s var(--spring-easing), border-color 0.3s ease;
        }

        .hover-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
          border-color: #58cc02;
        }

        .fade-up {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s var(--linear-out), transform 0.8s var(--linear-out);
        }

        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }

        .mascot-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .progress-fill {
          width: 0;
          transition: width 1.5s cubic-bezier(0.65, 0, 0.35, 1);
        }

        .progress-fill.animate {
          width: var(--target-width);
        }

        .nav-link {
          position: relative;
          transition: color 0.3s ease;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #58cc02;
          transition: width 0.3s var(--spring-easing);
        }

        .nav-link:hover::after {
          width: 100%;
        }
      `}</style>

      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <nav className="flex justify-between items-center h-20 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-2xl font-extrabold text-green-500 cursor-pointer hover:opacity-80 transition-opacity">
            RETREIVE
          </div>
          <div className="hidden md:flex gap-6 items-center">
            <a className="nav-link text-gray-600 font-medium hover:text-green-500" href="#science">
              Science
            </a>
            <a className="nav-link text-gray-600 font-medium hover:text-green-500" href="#features">
              Features
            </a>
            <a className="nav-link text-gray-600 font-medium hover:text-green-500" href="#testimonials">
              Testimonials
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/auth/signin" className="px-4 py-2 text-gray-900 hover:text-green-500 transition-colors font-medium">
              Log In
            </Link>
            <Link href="/auth/signup" className="primary-btn px-6 py-3 rounded-xl font-bold text-white uppercase tracking-wider">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center min-h-[90vh]">
        <div className="fade-up order-2 md:order-1">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
            The fun, free, and effective way to <span className="text-green-500">master medical science.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
            Stop passive reading. Upload your study PDFs and master MCAT concepts by speaking them aloud with our intelligent AI coach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/signup" className="primary-btn px-8 py-4 rounded-xl text-white font-bold uppercase tracking-widest text-center">
              Start Free Trial
            </Link>
            <Link href="/auth/signin" className="secondary-btn px-8 py-4 rounded-xl text-gray-600 font-bold uppercase tracking-widest text-center">
              Returning User
            </Link>
          </div>
        </div>
        <div className="order-1 md:order-2 flex justify-center fade-up delay-100">
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            <div ref={mascotRef} className="mascot-float w-full h-full">
              <img
                alt="Mascot Celebrating"
                className="w-full h-full object-contain drop-shadow-2xl"
                src="https://lh3.googleusercontent.com/aida/ADBb0ugjwJWgWB7sBrXY5WSwAbvVekEyBuxlUqoKlPSHRjW-3ieGsaFlUpmpSxO453frBmkobK3Hr5XRWlukleiRpwbu4YHrxdWR2_Ia4akgXt0-J2-_fTFN4ubbldKw4p8TsPqtnw0B3KH0o6HKQX-xGooGMB-Yi1o6ctvsCGfURG64OLc6UeUXWP_200zdpMUcwcJ6id3jXBb-QylxS_Uxcc3YIUM_PMRq4qpT0M6xD1qEsHa8GcWNrxGuQ_-d"
              />
            </div>
            <div className="absolute -z-10 w-[120%] h-[120%] bg-green-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="bg-gray-50 py-20 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 fade-up text-gray-900">Tired of passive reading?</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="hover-card fade-up delay-100 bg-white p-8 rounded-lg border-2 border-gray-200">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 font-bold text-lg">
                📉
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">The Reading Trap</h3>
              <p className="text-gray-600">
                Silent reading creates an "illusion of competence." You think you know it, but your brain hasn't truly encoded the complex pathways of biochemistry or physics.
              </p>
            </div>
            <div className="hover-card fade-up delay-200 bg-white p-8 rounded-lg border-2 border-gray-200">
              <div className="w-12 h-12 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center mb-4 font-bold text-lg">
                🧠
              </div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Memory Decay</h3>
              <p className="text-gray-600">
                Without active retrieval, you lose up to 70% of new medical information within 24 hours. Passive highlighters are the enemy of an MCAT score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution/Science Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto overflow-hidden" id="science">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="fade-up">
            <div className="relative group">
              <img
                alt="High-tech glowing brain"
                className="w-full h-auto rounded-xl drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida/ADBb0uj3GgKs2_A4EUI4coepLXBgLSHSRYW1dfAeTf7icTZZXRoidNQu9Q97UOvBsaM6-tHxplh9PFNCmrziG9mio0Z7pvfbnsCmqwtXQXx0ZawaXJ_9LOErIvAfPQ_2Ee5ixIT2uJ4-ZmciMz94H3T3Qx3lajv3w10nqmt98VWHHl044NsFptkfnsDWLrVuhCASfL-sJQfyA0FVao7HKlhH-W9XJzPwLuT8nnK9b_xcW5v-PFhThBRuqQPqKO3y"
              />
              <div className="absolute -inset-4 bg-green-500/20 blur-2xl -z-10 group-hover:bg-green-500/30 transition-all"></div>
            </div>
          </div>
          <div className="fade-up delay-200">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 leading-tight">
              Backed by science. <br />
              <span className="text-green-500">Powered by your voice.</span>
            </h2>
            <div className="space-y-8">
              <div className="flex gap-4 group cursor-default">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white group-hover:rotate-12 transition-transform text-lg font-bold">
                  🎤
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">The Production Effect</h4>
                  <p className="text-gray-600 mt-2">
                    Speaking concepts aloud increases long-term retention by 40% compared to silent study. Your brain treats your voice as a high-priority signal.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 group cursor-default">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white group-hover:rotate-12 transition-transform text-lg font-bold">
                  ✨
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Active Encoding</h4>
                  <p className="text-gray-600 mt-2">
                    RETREIVE forces your brain to transform visual data into oral motor patterns, creating a dual-coding memory trace that's harder to forget.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 px-4 overflow-hidden" id="features">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold fade-up text-gray-900">Master every detail</h2>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="hover-card fade-up bg-white p-8 rounded-lg border-2 border-gray-200 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-4xl">
              📚
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Karaoke Reader</h3>
            <p className="text-gray-600 mb-6">
              Our intelligent highlighter follows your voice. Speak the text, and RETREIVE tracks your progress in real-time, keeping you focused.
            </p>
            <div className="mt-auto w-full h-4 bg-gray-100 rounded-full relative overflow-hidden">
              <div
                className="progress-fill absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                style={{ '--target-width': '66%' } as React.CSSProperties}
              ></div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="hover-card fade-up delay-100 bg-white p-8 rounded-lg border-2 border-gray-200 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-4xl">
              ❓
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Adaptive Quizzes</h3>
            <p className="text-gray-600 mb-6">
              Pause at critical junctures for AI-generated MCQs. We test your understanding of what you just spoke, not just what you read.
            </p>
            <div className="mt-auto w-full h-4 bg-gray-100 rounded-full relative overflow-hidden">
              <div
                className="progress-fill absolute top-0 left-0 h-full bg-green-500 rounded-full"
                style={{ '--target-width': '50%' } as React.CSSProperties}
              ></div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="hover-card fade-up delay-200 bg-white p-8 rounded-lg border-2 border-gray-200 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6 text-4xl">
              🏆
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Gamified Progress</h3>
            <p className="text-gray-600 mb-6">
              Maintain your streak, earn badges, and climb the Med-School leaderboard. Studying becomes an addiction you actually want.
            </p>
            <div className="mt-auto w-full h-4 bg-gray-100 rounded-full relative overflow-hidden">
              <div
                className="progress-fill absolute top-0 left-0 h-full bg-yellow-500 rounded-full"
                style={{ '--target-width': '75%' } as React.CSSProperties}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 max-w-7xl mx-auto overflow-hidden">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 fade-up text-gray-900">Upload. Recite. Conquer.</h2>
        <div className="grid md:grid-cols-3 gap-20 relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-1/3 left-1/4 right-1/4 h-1 border-t-4 border-dashed border-gray-300 -z-10"></div>

          <div className="flex flex-col items-center text-center fade-up group">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center font-bold text-2xl mb-4 border-4 border-white shadow-lg transition-transform group-hover:scale-110 text-gray-900">
              1
            </div>
            <h4 className="text-2xl font-bold mb-2 text-gray-900">Upload PDF</h4>
            <p className="text-gray-600">Drop your notes or textbook chapters into our secure portal.</p>
          </div>

          <div className="flex flex-col items-center text-center fade-up delay-100 group">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center font-bold text-2xl text-white mb-4 border-4 border-white shadow-lg transition-transform group-hover:scale-110">
              2
            </div>
            <h4 className="text-2xl font-bold mb-2 text-gray-900">Recite Content</h4>
            <p className="text-gray-600">Read aloud as the AI highlights keywords and checks your pronunciation.</p>
          </div>

          <div className="flex flex-col items-center text-center fade-up delay-200 group">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center font-bold text-2xl text-white mb-4 border-4 border-white shadow-lg transition-transform group-hover:scale-110">
              3
            </div>
            <h4 className="text-2xl font-bold mb-2 text-gray-900">Conquer MCAT</h4>
            <p className="text-gray-600">Review your analytics and ace the exam with superior memory retention.</p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-gray-50 py-20 px-4 overflow-hidden" id="testimonials">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="hover-card bg-white p-8 rounded-lg border-2 border-gray-200 fade-up">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-2xl">⭐</span>
              ))}
            </div>
            <p className="text-lg italic mb-6 text-gray-700">
              "I used to spend 10 hours a day reading silently. With RETREIVE, I study for 6 hours but remember way more. The voice feedback is a game changer for Organic Chem."
            </p>
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full object-cover"
                alt="A portrait of a smiling female medical student"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVklSrauTVlKUK8vYdEULet8a62mgCIQgLUvAqccGn1zW_QOcld1EJVEoNVfASfQLJzeySE2hykVCsNTvF8jqyUjg_BN-0mkJm6vmjXc34nMbmFB_E0JXeJ-7v2pfYqOglFgoXcmKjVFMXVSpK36HBuWztszHtbEV6ExPVoW8gS3R8-iE8Og7rMqu4V0bzQqumptbOxANSfN6ufFqihg8tOuF7-ARji9MIZRhtsDdcq8NZgk-o9grUZ1Mu7W5H5qRqqcfzjmkliQnT"
              />
              <div>
                <h5 className="font-bold text-gray-900">Sarah K.</h5>
                <p className="text-xs text-gray-600">MS-1, Harvard Medical School</p>
              </div>
            </div>
          </div>

          <div className="hover-card bg-white p-8 rounded-lg border-2 border-gray-200 fade-up delay-100">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-2xl">⭐</span>
              ))}
            </div>
            <p className="text-lg italic mb-6 text-gray-700">
              "The gamification keeps me coming back. I have a 45-day streak now. My practice scores went from 505 to 518 in just two months using the voice recital method."
            </p>
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full object-cover"
                alt="A portrait of a determined male pre-med student"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjIN-IjFiMirIlN7vKx8K7dmXrW-IYmyDTlr3b5EF5Lta5_62Z4-VkBb8pQRyN6zvIPfKR5hbdlOjrM-8BVFVGnW_YK-C5nT1btuCNZ8-AYOUtRXGGh7AHsJ_BvkRn-3TGAlPFehhWIF7EC6jOxPyoEWk_siAepAGbJMvvQSSklAGkQSnFAV-5sp2pSO0wjN3a2HfWDNF_xDRb5K10tpSAKBDsFDc5GwSMLhi6ytcJDSIV1Cc8RvMKDzIGk6HiuWrQSibLGjDxY3Iv"
              />
              <div>
                <h5 className="font-bold text-gray-900">James L.</h5>
                <p className="text-xs text-gray-600">Pre-med, Johns Hopkins</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 text-center overflow-hidden">
        <div className="fade-up max-w-4xl mx-auto py-20 px-8 bg-green-500/5 rounded-xl border-4 border-dashed border-green-500/20 hover:bg-green-500/10 transition-colors duration-500">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Ready to study smarter?</h2>
          <p className="text-lg text-gray-600 mb-8">Join 10,000+ medical students who are crushing the MCAT using their voice.</p>
          <Link href="/auth/signup" className="primary-btn px-8 py-5 rounded-xl text-white font-bold text-xl uppercase tracking-widest inline-block">
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-20 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 md:px-6 max-w-7xl mx-auto mb-12">
          <div className="md:col-span-1">
            <div className="text-2xl font-bold text-green-500 mb-4">RETREIVE</div>
            <p className="text-gray-600">Master your mind, master your future. The ultimate vocal learning platform for elite students.</p>
          </div>
          <div>
            <h6 className="font-bold uppercase text-gray-900 mb-4">Product</h6>
            <ul className="space-y-2">
              <li><a className="nav-link inline-block text-gray-600 hover:text-green-500" href="#">Pricing</a></li>
              <li><a className="nav-link inline-block text-gray-600 hover:text-green-500" href="#">Enterprise</a></li>
              <li><a className="nav-link inline-block text-gray-600 hover:text-green-500" href="#">Success Stories</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold uppercase text-gray-900 mb-4">Resources</h6>
            <ul className="space-y-2">
              <li><a className="nav-link inline-block text-gray-600 hover:text-green-500" href="#">MCAT Guides</a></li>
              <li><a className="nav-link inline-block text-gray-600 hover:text-green-500" href="#">Study Hacks</a></li>
              <li><a className="nav-link inline-block text-gray-600 hover:text-green-500" href="#">Community</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold uppercase text-gray-900 mb-4">Legal</h6>
            <ul className="space-y-2">
              <li><a className="nav-link inline-block text-gray-600 hover:text-green-500" href="#">Terms</a></li>
              <li><a className="nav-link inline-block text-gray-600 hover:text-green-500" href="#">Privacy</a></li>
              <li><a className="nav-link inline-block text-gray-600 hover:text-green-500" href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-12 text-center md:text-left text-gray-600 text-sm border-t border-gray-200">
          © 2024 RETREIVE. Master your mind.
        </div>
      </footer>
    </div>
  );
}
