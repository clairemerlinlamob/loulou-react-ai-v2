import { Button } from "@/components/ui/button";
import { useGameContext } from "@/contexts/GameContext";
import { useTimer } from "@/hooks/useTimer";
import { formatPhaseDisplay, getNextPhase } from "@/utils/phaseHelpers";

interface BottomNavigationProps {
  onPauseGame?: () => void;
  onNextPhase?: () => void;
}

export function BottomNavigation({ onPauseGame, onNextPhase }: BottomNavigationProps) {
  const { currentPhase, dispatch } = useGameContext();
  const { formattedTime, isRunning, pause, start } = useTimer({ autoStart: true });

  const phaseDisplay = currentPhase 
    ? formatPhaseDisplay(currentPhase.type, currentPhase.number)
    : "Préparation";

  const handlePause = () => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
    onPauseGame?.();
  };

  const handleNextPhase = () => {
    if (currentPhase) {
      const nextPhaseType = getNextPhase(currentPhase.type);
      if (nextPhaseType !== currentPhase.type) {
        // Transition to next phase
        const nextNumber = nextPhaseType === "day" 
          ? currentPhase.number 
          : nextPhaseType === "night" 
          ? currentPhase.number + 1 
          : currentPhase.number;

        // This would need to be implemented with proper phase creation logic
        onNextPhase?.();
      }
    }
  };

  const getNextPhaseLabel = () => {
    if (!currentPhase) return "Commencer";
    
    switch (currentPhase.type) {
      case "preparation":
        return "Commencer la Nuit";
      case "night":
        return "Passer au Jour";
      case "day":
        return "Passer à la Nuit";
      case "finished":
        return "Partie terminée";
      default:
        return "Suivant";
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-game-surface border-t border-gray-700 p-4 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Phase: <span className="text-white font-medium">{phaseDisplay}</span>
          </div>
          <div className="text-sm text-gray-400">
            Durée: <span className="text-white font-medium">{formattedTime}</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handlePause}
          >
            <i className={`fas ${isRunning ? "fa-pause" : "fa-play"} mr-2`}></i>
            {isRunning ? "Pause" : "Reprendre"}
          </Button>
          <Button
            onClick={handleNextPhase}
            disabled={currentPhase?.type === "finished"}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {getNextPhaseLabel()}
            <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
