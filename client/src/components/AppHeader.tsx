import { useGameContext } from "@/contexts/GameContext";
import { useTimer } from "@/hooks/useTimer";
import { formatPhaseDisplay, getPhaseIcon, getPhaseColorClass } from "@/utils/phaseHelpers";

interface AppHeaderProps {
  onMenuClick?: () => void;
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { currentGame, players, currentPhase } = useGameContext();
  const { formattedTime } = useTimer({ autoStart: true });

  const alivePlayers = players.filter(p => p.status === "alive");
  const totalPlayers = players.length;

  const phaseDisplay = currentPhase 
    ? formatPhaseDisplay(currentPhase.type, currentPhase.number)
    : "Préparation";

  const phaseIcon = currentPhase 
    ? getPhaseIcon(currentPhase.type)
    : "fas fa-cog";

  const phaseColorClass = currentPhase 
    ? getPhaseColorClass(currentPhase.type)
    : "bg-gray-700";

  return (
    <header className="bg-game-surface border-b border-gray-700 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-wolf-purple">🐺 LOULOU</h1>
          <div className="h-6 w-px bg-gray-600"></div>
          <div className={`flex items-center space-x-2 ${phaseColorClass} px-3 py-2 rounded-lg`}>
            <i className={`${phaseIcon} text-blue-400`}></i>
            <span className="font-semibold">{phaseDisplay}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <i className="fas fa-clock"></i>
            <span>{formattedTime}</span>
          </div>
          
          <div className="flex items-center space-x-1 text-sm">
            <span className="text-status-alive">
              <i className="fas fa-heart"></i> {alivePlayers.length}
            </span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-400">{totalPlayers}</span>
          </div>

          <button 
            onClick={onMenuClick}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
