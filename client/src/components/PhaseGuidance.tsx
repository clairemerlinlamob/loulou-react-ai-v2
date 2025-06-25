import { useGameContext } from "@/contexts/GameContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStepAnnouncement } from "@/utils/phaseHelpers";

export function PhaseGuidance() {
  const { currentPhase, dispatch } = useGameContext();

  if (!currentPhase) {
    return (
      <Card className="bg-game-surface">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-compass text-wolf-purple"></i>
            <span>Guide de Phase</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Aucune phase active</p>
        </CardContent>
      </Card>
    );
  }

  const currentStep = currentPhase.steps[currentPhase.currentStepIndex];
  const canGoNext = currentPhase.currentStepIndex < currentPhase.steps.length - 1;
  const canGoPrevious = currentPhase.currentStepIndex > 0;

  const handleNext = () => {
    dispatch({ type: "NEXT_STEP" });
  };

  const handlePrevious = () => {
    dispatch({ type: "PREVIOUS_STEP" });
  };

  return (
    <Card className="bg-game-surface sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <i className="fas fa-compass text-wolf-purple"></i>
          <span>Guide de Phase</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {currentPhase.steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border-l-4 ${
                step.completed
                  ? "bg-game-surface-light border-green-500"
                  : step.active
                  ? "bg-wolf-purple bg-opacity-20 border-wolf-purple"
                  : "bg-game-surface-light opacity-60 border-gray-500"
              }`}
            >
              <i className={`${step.icon} ${
                step.completed 
                  ? "text-green-500 fas fa-check-circle" 
                  : step.active 
                  ? "text-wolf-purple" 
                  : "text-gray-500 fas fa-circle"
              }`}></i>
              <span className={`text-sm ${step.active ? "font-medium" : ""}`}>
                {index + 1}. {step.name} {step.completed ? "(fait)" : ""}
              </span>
            </div>
          ))}
        </div>

        {currentStep && (
          <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <i className="fas fa-info-circle text-blue-400 mt-0.5"></i>
              <div className="text-sm">
                <p className="font-medium text-blue-300 mb-1">{currentStep.name}</p>
                <p className="text-blue-200">
                  {getStepAnnouncement(currentStep)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className="flex-1"
          >
            <i className="fas fa-arrow-left mr-1"></i>
            Précédent
          </Button>
          <Button
            size="sm"
            onClick={handleNext}
            disabled={!canGoNext}
            className="flex-1 bg-wolf-purple hover:bg-purple-600"
          >
            Suivant
            <i className="fas fa-arrow-right ml-1"></i>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
