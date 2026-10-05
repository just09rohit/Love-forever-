/**
 * Forever Yours - Pure 3D Animation Romance
 * Proposing Rohit with:
 * - Full-screen particle rain of hundreds of varying-sized 3D tumbling hearts
 * - Romantic Entrance Portal
 * - Heart cursor & touch sparkles
 * - 9 Pure Visual Differential Animated Scenes
 * - Continuous Real Love Music
 */

import React, { useState } from 'react';
import { LoveStoryConfig, PageStep } from './types';
import { ThreeBackground } from './components/ThreeBackground';
import { HeartRainCanvas } from './components/HeartRainCanvas';
import { HeartCursorTrail } from './components/HeartCursorTrail';
import { EntrancePortal } from './components/EntrancePortal';
import { HeaderNav } from './components/HeaderNav';
import { IntroPage } from './components/pages/IntroPage';
import { BalloonPopPage } from './components/pages/BalloonPopPage';
import { DigitalLoveLetterPage } from './components/pages/DigitalLoveLetterPage';
import { ScratchCardPage } from './components/pages/ScratchCardPage';
import { PopUpCardPage } from './components/pages/PopUpCardPage';
import { HeartKeyPage } from './components/pages/HeartKeyPage';
import { ConstellationPage } from './components/pages/ConstellationPage';
import { ProposalPage } from './components/pages/ProposalPage';
import { CelebrationPage } from './components/pages/CelebrationPage';

export default function App() {
  const [config] = useState<LoveStoryConfig>({
    partnerName: 'My Love',
    senderName: 'Rohit',
    proposalQuestion: 'Will you be Rohit\'s forever?',
    reasonsToLove: [],
  });

  const [currentStep, setCurrentStep] = useState<PageStep>('intro');
  const [hasEntered, setHasEntered] = useState(false);

  const handleNavigate = (step: PageStep) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#fff0f5] text-[#4a1228] font-sans selection:bg-rose-400 selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* 3D WebGL Three.js Ambient Backdrop */}
      <ThreeBackground />

      {/* FULL-SCREEN PARTICLE SYSTEM: Hundreds of 3D Tumbling Hearts Across All Pages */}
      <HeartRainCanvas />

      {/* Sparkling Heart Cursor & Touch Trail */}
      <HeartCursorTrail />

      {/* Romantic Entrance Portal on Initial Entry */}
      {!hasEntered && (
        <EntrancePortal onEnter={() => setHasEntered(true)} />
      )}

      {/* Clean Icon Navigation & Real Audio Player */}
      <HeaderNav
        currentStep={currentStep}
        onNavigate={handleNavigate}
        partnerName={config.partnerName}
        onOpenSettings={() => {}}
      />

      {/* Main Pure Animation Canvas (9 Differential Scenes) */}
      <main className="relative z-10 flex-1 flex flex-col justify-center">
        {currentStep === 'intro' && (
          <IntroPage
            config={config}
            onNext={() => handleNavigate('balloons')}
          />
        )}

        {currentStep === 'balloons' && (
          <BalloonPopPage
            config={config}
            onNext={() => handleNavigate('love_letter')}
          />
        )}

        {currentStep === 'love_letter' && (
          <DigitalLoveLetterPage
            config={config}
            onNext={() => handleNavigate('scratch')}
          />
        )}

        {currentStep === 'scratch' && (
          <ScratchCardPage
            config={config}
            onNext={() => handleNavigate('popup_card')}
          />
        )}

        {currentStep === 'popup_card' && (
          <PopUpCardPage
            config={config}
            onNext={() => handleNavigate('heart_key')}
          />
        )}

        {currentStep === 'heart_key' && (
          <HeartKeyPage
            config={config}
            onNext={() => handleNavigate('constellation')}
          />
        )}

        {currentStep === 'constellation' && (
          <ConstellationPage
            config={config}
            onNext={() => handleNavigate('proposal')}
          />
        )}

        {currentStep === 'proposal' && (
          <ProposalPage
            config={config}
            onYes={() => handleNavigate('celebration')}
          />
        )}

        {currentStep === 'celebration' && (
          <CelebrationPage
            config={config}
            onRestart={() => handleNavigate('intro')}
          />
        )}
      </main>

      {/* Ultra-Clean Glowing Footer */}
      <footer className="relative z-10 py-2 px-4 text-center text-rose-400 font-sans flex items-center justify-center gap-3">
        <span className="text-sm">💖</span>
        <span className="text-xs font-cursive text-rose-500 font-bold">Rohit</span>
        <span className="text-sm">💍</span>
      </footer>
    </div>
  );
}
