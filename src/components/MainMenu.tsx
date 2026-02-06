import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export default function MainMenu() {
  const { setScreen, character, playerProfile, characterMetadata, resetGame, connectWalletToProfile } = useGameStore();
  const [showWalletInput, setShowWalletInput] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleNewGame = () => {
    resetGame();
    setScreen('character_creation');
  };

  const handleContinue = () => {
    if (character) {
      setScreen('game');
    }
  };

  const handleConnectWallet = async () => {
    if (!walletAddress.trim() || isConnecting) return;
    
    setIsConnecting(true);
    try {
      const success = await connectWalletToProfile(walletAddress.trim());
      if (success) {
        setShowWalletInput(false);
        setWalletAddress('');
        alert('Wallet connected successfully! ✨');
      } else {
        alert('Failed to connect wallet. Please try again.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Error connecting wallet.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="main-menu">
      <h1>⚔️ Grudge Warlords</h1>
      <p className="subtitle">The Ultimate Battle Awaits</p>
      
      <div className="menu-buttons">
        <button className="btn btn-primary" onClick={handleNewGame}>
          New Game
        </button>
        
        {character && (
          <button className="btn btn-secondary" onClick={handleContinue}>
            Continue ({character.name} - Lvl {character.level})
          </button>
        )}
        
        <button className="btn btn-secondary" disabled>
          Settings
        </button>
      </div>

      {/* Player Profile Info */}
      {playerProfile && (
        <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <div style={{ fontSize: '0.75rem', color: '#8b5cf6', marginBottom: '8px' }}>PLAYER PROFILE</div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            <div>Grudge ID: <span style={{ color: '#e2e8f0' }}>{playerProfile.grudgeId.slice(0, 16)}...</span></div>
            <div style={{ marginTop: '4px' }}>
              Status: <span style={{ color: playerProfile.isGuest ? '#f59e0b' : '#22c55e' }}>
                {playerProfile.isGuest ? '👤 Guest' : '✨ Wallet Connected'}
              </span>
            </div>
            {characterMetadata && (
              <div style={{ marginTop: '4px' }}>
                Storage: <span style={{ color: characterMetadata.isNFT ? '#a78bfa' : '#60a5fa' }}>
                  {characterMetadata.isNFT ? '✨ Solana NFT' : '💾 Database'}
                </span>
              </div>
            )}
          </div>
          
          {playerProfile.isGuest && !showWalletInput && (
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowWalletInput(true)}
              style={{ marginTop: '12px', width: '100%', fontSize: '0.85rem' }}
            >
              Connect Wallet for NFT Minting
            </button>
          )}
          
          {showWalletInput && (
            <div style={{ marginTop: '12px' }}>
              <input
                type="text"
                placeholder="Enter Solana wallet address..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  background: '#0f172a', 
                  border: '1px solid #334155',
                  borderRadius: '4px',
                  color: '#e2e8f0',
                  fontSize: '0.85rem'
                }}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  className="btn btn-primary"
                  onClick={handleConnectWallet}
                  disabled={!walletAddress.trim() || isConnecting}
                  style={{ flex: 1, fontSize: '0.85rem' }}
                >
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => { setShowWalletInput(false); setWalletAddress(''); }}
                  style={{ flex: 1, fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '40px', textAlign: 'center', color: '#64748b' }}>
        <p>4 Classes • 6 Races • 126 Weapons</p>
        <p>Complete Skill Trees • AI Combat</p>
        <p style={{ marginTop: '20px', fontSize: '0.75rem' }}>
          Built with Grudge Studio Data
        </p>
      </div>
    </div>
  );
}
