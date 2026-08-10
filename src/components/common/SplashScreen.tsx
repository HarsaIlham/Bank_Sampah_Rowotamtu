import React, { useState, useEffect } from 'react';
import logoBank from '../../assets/logo-bank.png';
import bgImage from '../../assets/bg_splash_screen.avif';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fade-out after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500);

    // Remove splash after fade-out animation completes (0.45s)
    const removeTimer = setTimeout(() => {
      onComplete();
    }, 2950);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden ${
        isFadingOut ? 'splash-fade-out' : ''
      }`}
      style={{ pointerEvents: isFadingOut ? 'none' : 'auto' }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
      </div>

      {/* Green Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(5, 46, 22, 0.82) 0%, rgba(20, 83, 45, 0.75) 40%, rgba(6, 78, 59, 0.88) 100%)',
        }}
      />

      {/* Subtle Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-sm">

        {/* Logo */}
        <div className="splash-scale-in splash-delay-200 mb-6">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 p-4 flex items-center justify-center shadow-2xl shadow-black/20">
            <img
              src={logoBank}
              alt="Logo RESIK Bank Sampah"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {/* App Name — RESIK */}
        <h1 className="splash-slide-up splash-delay-400 text-5xl sm:text-6xl font-black text-white tracking-wider drop-shadow-lg mb-1"
            style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '0.15em' }}
        >
          RESIK
        </h1>

        {/* Subtitle */}
        <p className="splash-slide-up splash-delay-600 text-sm sm:text-base font-bold text-emerald-200 tracking-[0.25em] uppercase mb-5">
          Bank Sampah Digital
        </p>

        {/* Decorative Line Divider */}
        <div className="splash-fade-in splash-delay-800 w-full flex items-center justify-center gap-2 mb-5">
          <span className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-emerald-400/60" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
          <span className="h-px flex-1 max-w-12 bg-gradient-to-l from-transparent to-emerald-400/60" />
        </div>

        {/* Tagline */}
        <p className="splash-slide-up splash-delay-800 text-sm sm:text-base text-white/80 font-medium italic tracking-wide">
          Kelola Sampah, Ciptakan Nilai
        </p>

        {/* Loading Progress Line */}
        <div className="mt-10 w-full flex justify-center">
          <div className="h-0.5 rounded-full bg-white/10 w-48 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-300 splash-line-grow" />
          </div>
        </div>

        {/* Powered by text */}
        <p className="splash-fade-in splash-delay-1200 mt-4 text-[10px] text-white/30 font-medium tracking-widest uppercase">
          KKN-K Rowotamtu 2025
        </p>
      </div>
    </div>
  );
};
