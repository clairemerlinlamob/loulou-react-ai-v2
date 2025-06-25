import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlayerCard } from "./PlayerCard";
import { useGame } from "@/hooks/useGame";
import { useGameContext } from "@/contexts/GameContext";

interface PlayersGridProps {
  gameId: number;
}

export function PlayersGrid({ gameId }: PlayersGridProps) {
  const { players, createPlayer } = useGame(gameId);
  const { currentGame, currentPhase } = useGameContext();
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");

  const handleAddPlayer = async () => {
    if (!newPlayerName.trim() || !currentGame) return;

    await createPlayer({
      gameId: currentGame.id,
      playerData: {
        name: newPlayerName.trim(),
        position: players.length + 1,
        status: "alive",
        isInLove: false,
      }
    });

    setNewPlayerName("");
    setShowAddPlayer(false);
  };

  const handleEndGame = () => {
    // TODO: Implement end game logic
    console.log("End game clicked");
  };

  return (
    <div className="lg:col-span-3">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Gestion des Joueurs</h2>
        <div className="flex space-x-2">
          {currentPhase?.type === "preparation" && (
            <Dialog open={showAddPlayer} onOpenChange={setShowAddPlayer}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <i className="fas fa-plus mr-2"></i>
                  Ajouter Joueur
                </Button>
              </DialogTrigger>
            <DialogContent className="bg-game-surface border-gray-700">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau joueur</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Nom du joueur
                  </label>
                  <Input
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Entrez le nom du joueur"
                    onKeyDown={(e) => e.key === "Enter" && handleAddPlayer()}
                    className="bg-game-bg border-gray-600"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddPlayer(false)}
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleAddPlayer}
                    disabled={!newPlayerName.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Ajouter
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          )}

          <Button 
            variant="destructive"
            onClick={handleEndGame}
          >
            <i className="fas fa-skull mr-2"></i>
            Fin de Partie
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {players.map((player: any) => (
          <PlayerCard 
            key={player.id} 
            player={player} 
            gameId={gameId}
          />
        ))}
      </div>

      {players.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <i className="fas fa-users text-4xl mb-4"></i>
          <p className="text-lg mb-2">Aucun joueur ajouté</p>
          <p className="text-sm">Commencez par ajouter des joueurs à votre partie</p>
        </div>
      )}
    </div>
  );
}
