import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { AppHeader } from "@/components/AppHeader";
import { PhaseGuidance } from "@/components/PhaseGuidance";
import { PlayersGrid } from "@/components/PlayersGrid";
import { BottomNavigation } from "@/components/BottomNavigation";
import { RoleConfiguration } from "@/components/RoleConfiguration";
import { useGame } from "@/hooks/useGame";
import { useGameContext } from "@/contexts/GameContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function Game() {
  const { id } = useParams();
  const gameId = parseInt(id as string);
  const { game, players, isLoading } = useGame(gameId);
  const { dispatch, createPhase, currentPhase } = useGameContext();
  const [showRoleConfiguration, setShowRoleConfiguration] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, number>>({});

  useEffect(() => {
    if (game) {
      dispatch({ type: "SET_GAME", payload: game });
      
      // Create initial phase based on game status only once
      const phase = createPhase(
        game.currentPhase as any, 
        game.phaseNumber || 1
      );
      dispatch({ type: "SET_PHASE", payload: phase });
    }
  }, [game?.id]);

  useEffect(() => {
    if (players && Array.isArray(players)) {
      dispatch({ type: "SET_PLAYERS", payload: players });
    }
  }, [players?.length]);

  const handleRoleSetupComplete = (roles: Record<string, number>) => {
    setSelectedRoles(roles);
    setShowRoleConfiguration(false);
    // Move to step 1 (role distribution) in preparation
    dispatch({ type: "NEXT_STEP" });
  };

  const handleShowRoleConfiguration = () => {
    setShowRoleConfiguration(true);
  };

  const handleBackFromRoleConfiguration = () => {
    setShowRoleConfiguration(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-game-bg text-white">
        <AppHeader />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Skeleton className="h-96 bg-game-surface" />
            </div>
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-64 bg-game-surface" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="h-20" /> {/* Space for bottom navigation */}
      </div>
    );
  }

  if (!isLoading && !game) {
    return (
      <div className="min-h-screen bg-game-bg text-white flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-yellow-400 mb-4"></i>
          <h2 className="text-2xl font-bold mb-2">Partie non trouvée</h2>
          <p className="text-gray-400">La partie demandée n'existe pas ou a été supprimée.</p>
          <p className="text-sm text-gray-500 mt-2">ID de partie: {gameId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-game-bg text-white">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {showRoleConfiguration ? (
            <RoleConfiguration
              playerCount={players.length}
              onRoleSetupComplete={handleRoleSetupComplete}
              onBack={handleBackFromRoleConfiguration}
            />
          ) : (
            <>
              <PhaseGuidance 
                onShowRoleConfiguration={handleShowRoleConfiguration}
                selectedRoles={selectedRoles}
              />
              <PlayersGrid gameId={gameId} />
            </>
          )}
        </div>
      </div>

      {/* Only show bottom navigation during active game phases */}
      {currentPhase && currentPhase.type !== "preparation" && (
        <>
          <div className="h-20" /> {/* Space for bottom navigation */}
          <BottomNavigation />
        </>
      )}
    </div>
  );
}
