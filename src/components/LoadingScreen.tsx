// Grudge Warlords - Loading Screen with Progress

import { useEffect, useState } from 'react';
import type { LoadProgress } from '../services/assetManager';
import './LoadingScreen.css';

interface LoadingScreenProps {
  progress: LoadProgress;
  onComplete?: () => void;
}

export default function LoadingScreen({ progress, onComplete }: LoadingScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (progress.percentage >= 100 && progress.phase === 'complete') {
      // Start fade out animation
      setTimeout(() => {
        setFadeOut(true);
        // Call onComplete after fade animation
        setTimeout(() => {
          onComplete?.();
        }, 500);
      }, 500);
    }
  }, [progress.percentage, progress.phase, onComplete]);

  const getPhaseLabel = (phase: LoadProgress['phase']) => {
    switch (phase) {
      case 'models':
        return 'Loading 3D Models';
      case 'textures':
        return 'Loading Textures';
      case 'audio':
        return 'Loading Audio';
      case 'complete':
        return 'Complete';
      default:
        return 'Loading';
    }
  };

  const getPhaseIcon = (phase: LoadProgress['phase']) => {
    switch (phase) {
      case 'models':
        return '🎨';
      case 'textures':
        return '🖼️';
      case 'audio':
        return '🔊';
      case 'complete':
        return '✓';
      default:
        return '⏳';
    }
  };

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      {/* Background with animated gradient */}
      <div className="loading-background">
        <div className="loading-gradient" />
      </div>

      {/* Main content */}
      <div className="loading-content">
        {/* Logo/Title */}
        <div className="loading-title">
          <h1>⚔️ Grudge Warlords</h1>
          <p className="loading-subtitle">Prepare for Battle</p>
        </div>

        {/* Progress section */}
        <div className="loading-progress-container">
          {/* Phase indicator */}
          <div className="loading-phase">
            <span className="phase-icon">{getPhaseIcon(progress.phase)}</span>
            <span className="phase-label">{getPhaseLabel(progress.phase)}</span>
          </div>

          {/* Progress bar */}
          <div className="loading-bar-container">
            <div className="loading-bar-background">
              <div 
                className="loading-bar-fill"
                style={{ width: `${progress.percentage}%` }}
              >
                <div className="loading-bar-shimmer" />
              </div>
            </div>
            <div className="loading-percentage">{progress.percentage}%</div>
          </div>

          {/* Current asset being loaded */}
          <div className="loading-current-asset">
            <span className="asset-label">Loading:</span>
            <span className="asset-name">{progress.currentAsset || '...'}</span>
          </div>

          {/* Stats */}
          <div className="loading-stats">
            <span>{progress.loaded} / {progress.total} assets</span>
          </div>
        </div>

        {/* Loading tips (optional) */}
        <div className="loading-tips">
          <div className="tip-content">
            <span className="tip-icon">💡</span>
            <span>Tip: Use WASD to navigate in the world</span>
          </div>
        </div>
      </div>

      {/* Animated particles */}
      <div className="loading-particles">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
