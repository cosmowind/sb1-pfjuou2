import React, { useEffect, useState } from 'react';
import { DollarSign, Users } from 'lucide-react';
import { getGameState } from '../utils/storage';

interface PlayerData {
  name: string;
  avatarPath: string;
}

interface GameState {
  playerBalance: number;
  followers: number;
}

const Profile: React.FC = () => {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playerResponse = await fetch('/src/data/player.json');
        if (!playerResponse.ok) {
          throw new Error(`HTTP error! status: ${playerResponse.status}`);
        }
        const playerData = await playerResponse.json();
        setPlayerData(playerData);

        const gameState = getGameState();
        setGameState(gameState);
      } catch (error) {
        console.error('Error fetching player data:', error);
      }
    };

    fetchData();
  }, []);

  if (!playerData || !gameState) {
    return <div>加载中...</div>;
  }

  return (
    <div className="flex-1 p-4">
      <h1 className="text-2xl font-bold mb-6">我的信息</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img 
              src={playerData.avatarPath} 
              alt={playerData.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/src/assets/default-avatar.png';
              }}
            />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-center mb-6">{playerData.name}</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <DollarSign className="text-green-500 mr-2" size={24} />
            <span className="font-semibold">余额:</span>
            <span className="ml-2">¥{gameState.playerBalance}</span>
          </div>
          <div className="flex items-center">
            <Users className="text-blue-500 mr-2" size={24} />
            <span className="font-semibold">信众:</span>
            <span className="ml-2">{gameState.followers}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;