import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGame } from "@/hooks/useGame";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showNewGame, setShowNewGame] = useState(false);
  const [gameName, setGameName] = useState("");
  const { createGame, isCreating } = useGame();

  const handleCreateGame = async () => {
    if (!gameName.trim()) return;

    try {
      const newGame = await createGame({
        status: "preparation",
        currentPhase: "preparation",
        phaseNumber: 1,
        currentStep: 0,
        gameData: {},
      });

      setLocation(`/game/${newGame.id}`);
    } catch (error) {
      console.error("Failed to create game:", error);
    }
  };

  return (
    <div className="min-h-screen bg-game-bg text-white">
      {/* Header */}
      <header className="bg-game-surface border-b border-gray-700 px-4 py-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-wolf-purple mb-2">
            🐺 LOULOU
          </h1>
          <p className="text-gray-400 text-lg">
            Assistant Game Master pour Loup-Garou
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Quick Start */}
          <Card className="bg-game-surface border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <i className="fas fa-play text-green-400"></i>
                <span>Nouvelle Partie</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-6">
                Créez une nouvelle partie de Loup-Garou et gérez vos joueurs en temps réel.
              </p>
              
              <Dialog open={showNewGame} onOpenChange={setShowNewGame}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-wolf-purple hover:bg-purple-600">
                    <i className="fas fa-plus mr-2"></i>
                    Créer une partie
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-game-surface border-gray-700">
                  <DialogHeader>
                    <DialogTitle>Nouvelle partie</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Nom de la partie (optionnel)
                      </label>
                      <Input
                        value={gameName}
                        onChange={(e) => setGameName(e.target.value)}
                        placeholder="Ma partie de Loup-Garou"
                        onKeyDown={(e) => e.key === "Enter" && handleCreateGame()}
                        className="bg-game-bg border-gray-600"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowNewGame(false)}
                      >
                        Annuler
                      </Button>
                      <Button 
                        onClick={handleCreateGame}
                        disabled={isCreating}
                        className="bg-wolf-purple hover:bg-purple-600"
                      >
                        {isCreating ? "Création..." : "Créer"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="bg-game-surface border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <i className="fas fa-star text-yellow-400"></i>
                <span>Fonctionnalités</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <i className="fas fa-eye text-wolf-purple mt-1"></i>
                  <div>
                    <h4 className="font-medium">Révélation progressive</h4>
                    <p className="text-sm text-gray-400">
                      Saisissez les rôles au fur et à mesure de leur découverte
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <i className="fas fa-compass text-blue-400 mt-1"></i>
                  <div>
                    <h4 className="font-medium">Guide étape par étape</h4>
                    <p className="text-sm text-gray-400">
                      Instructions contextuelles pour chaque phase
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <i className="fas fa-users text-green-400 mt-1"></i>
                  <div>
                    <h4 className="font-medium">Gestion des joueurs</h4>
                    <p className="text-sm text-gray-400">
                      Suivi des statuts et rôles en temps réel
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <i className="fas fa-trophy text-yellow-400 mt-1"></i>
                  <div>
                    <h4 className="font-medium">Détection automatique</h4>
                    <p className="text-sm text-gray-400">
                      Conditions de victoire calculées automatiquement
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rules Reference */}
        <Card className="bg-game-surface border-gray-700 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <i className="fas fa-book text-blue-400"></i>
              <span>Référence des Rôles</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">🐺</div>
                <div className="text-sm font-medium">Loup-Garou</div>
                <div className="text-xs text-red-400">Loups-Garous</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🔮</div>
                <div className="text-sm font-medium">Voyante</div>
                <div className="text-xs text-blue-400">Village</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🧪</div>
                <div className="text-sm font-medium">Sorcière</div>
                <div className="text-xs text-green-400">Village</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🏹</div>
                <div className="text-sm font-medium">Chasseur</div>
                <div className="text-xs text-yellow-400">Village</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💘</div>
                <div className="text-sm font-medium">Cupidon</div>
                <div className="text-xs text-pink-400">Neutre</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">👧</div>
                <div className="text-sm font-medium">Petite Fille</div>
                <div className="text-xs text-purple-400">Village</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🎭</div>
                <div className="text-sm font-medium">Voleur</div>
                <div className="text-xs text-orange-400">Variable</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">👨‍🌾</div>
                <div className="text-sm font-medium">Villageois</div>
                <div className="text-xs text-gray-400">Village</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
