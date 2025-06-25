import { useGameContext } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PreparationGuide() {
  const { currentPhase, players, dispatch, createPhase } = useGameContext();

  if (!currentPhase || currentPhase.type !== "preparation") return null;

  const currentStepIndex = currentPhase.currentStepIndex;
  const hasPlayers = players.length > 0;

  const handleNextStep = () => {
    if (currentStepIndex < currentPhase.steps.length - 1) {
      dispatch({ type: "NEXT_STEP" });
    } else {
      // Start the game - go to night phase
      const nightPhase = createPhase("night", 1);
      dispatch({ type: "SET_PHASE", payload: nightPhase });
    }
  };

  const canProceed = () => {
    switch (currentStepIndex) {
      case 0: // Setup players
        return hasPlayers; // Need at least one player
      case 1: // Role distribution
        return true; // Always allow proceeding from role distribution
      case 2: // Start game
        return true;
      default:
        return true;
    }
  };

  const getStepMessage = () => {
    switch (currentStepIndex) {
      case 0:
        return hasPlayers 
          ? `${players.length} joueur(s) ajouté(s). Cliquez sur "Étape Suivante" pour continuer.`
          : "Ajoutez au moins un joueur pour continuer vers la distribution des rôles.";
      case 1:
        return "Distribuez maintenant les cartes de rôles physiques aux joueurs. Les rôles seront révélés progressivement dans l'application pendant la partie.";
      case 2:
        return "Tous les joueurs ont leurs cartes ! Prêt à commencer la première nuit.";
      default:
        return "";
    }
  };

  return (
    <Card className="bg-blue-900 bg-opacity-30 border border-blue-700 mt-4">
      <CardHeader>
        <CardTitle className="text-blue-300 text-sm">Guide de préparation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-blue-200 text-sm">{getStepMessage()}</p>
          
          {currentStepIndex === 1 && (
            <div className="text-xs text-blue-300 bg-blue-800 bg-opacity-50 p-2 rounded">
              <p><strong>Conseil :</strong> Les rôles seront révélés progressivement pendant la partie. 
              Vous n'avez pas besoin de les saisir maintenant.</p>
            </div>
          )}

          <Button
            size="sm"
            onClick={handleNextStep}
            disabled={!canProceed()}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {currentStepIndex === currentPhase.steps.length - 1 
              ? "Commencer la Nuit 1" 
              : "Étape Suivante"}
            <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}