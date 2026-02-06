import { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import MainMenu from './components/MainMenu';
import CharacterCreation from './components/CharacterCreation';
import GameHUD from './components/GameHUD';
import CombatScreen from './components/CombatScreen';
import SkillTreeScreen from './components/SkillTreeScreen';
import WorldMap from './components/WorldMap';
import InventoryScreen from './components/InventoryScreen';
import './App.css';

function App() {
  const screen = useGameStore((state) => state.screen);
  const playerProfile = useGameStore((state) => state.playerProfile);
  const initializePlayerProfile = useGameStore((state) => state.initializePlayerProfile);

  // Initialize player profile on first load
  useEffect(() => {
    if (!playerProfile) {
      initializePlayerProfile();
    }
  }, [playerProfile, initializePlayerProfile]);

  return (
    <div className="app">
      {screen === 'main_menu' && <MainMenu />}
      {screen === 'character_creation' && <CharacterCreation />}
      {screen === 'game' && <GameHUD />}
      {screen === 'combat' && <CombatScreen />}
      {screen === 'skills' && <SkillTreeScreen />}
      {screen === 'world_map' && <WorldMap />}
      {screen === 'inventory' && <InventoryScreen />}
    </div>
  );
}

export default App;
