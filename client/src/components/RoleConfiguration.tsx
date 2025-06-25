import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLES_ARRAY } from "@/constants/roles";

interface RoleConfigurationProps {
  playerCount: number;
  onRoleSetupComplete: (selectedRoles: Record<string, number>) => void;
  onBack: () => void;
}

export function RoleConfiguration({ 
  playerCount,
  onRoleSetupComplete,
  onBack
}: RoleConfigurationProps) {
  const [selectedRoles, setSelectedRoles] = useState<Record<string, number>>({});

  // Suggestions de composition selon le nombre de joueurs
  const getSuggestedComposition = (count: number): Record<string, number> => {
    if (count <= 4) {
      return {
        "loup-garou": 1,
        "voyante": 1,
        "simple-villageois": count - 2,
      };
    } else if (count <= 6) {
      return {
        "loup-garou": 1,
        "voyante": 1,
        "sorciere": 1,
        "simple-villageois": count - 3,
      };
    } else if (count <= 8) {
      return {
        "loup-garou": 2,
        "voyante": 1,
        "sorciere": 1,
        "chasseur": 1,
        "simple-villageois": count - 5,
      };
    } else if (count <= 12) {
      return {
        "loup-garou": 2,
        "voyante": 1,
        "sorciere": 1,
        "chasseur": 1,
        "cupidon": 1,
        "simple-villageois": count - 6,
      };
    } else {
      return {
        "loup-garou": 3,
        "voyante": 1,
        "sorciere": 1,
        "chasseur": 1,
        "cupidon": 1,
        "petite-fille": 1,
        "simple-villageois": count - 8,
      };
    }
  };

  useEffect(() => {
    if (playerCount > 0) {
      const suggested = getSuggestedComposition(playerCount);
      setSelectedRoles(suggested);
    }
  }, [playerCount]);

  const updateRoleCount = (roleId: string, change: number) => {
    setSelectedRoles(prev => {
      const newCount = Math.max(0, (prev[roleId] || 0) + change);
      if (newCount === 0) {
        const { [roleId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [roleId]: newCount };
    });
  };

  const totalSelected = Object.values(selectedRoles).reduce((sum, count) => sum + count, 0);
  const isValidComposition = totalSelected === playerCount;

  const handleConfirm = () => {
    if (isValidComposition) {
      onRoleSetupComplete(selectedRoles);
    }
  };

  return (
    <div className="lg:col-span-3">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <i className="fas fa-arrow-left mr-2"></i>
            Retour aux Joueurs
          </Button>
          <h2 className="text-xl font-semibold">Configuration des Rôles</h2>
        </div>
        <Badge variant={isValidComposition ? "default" : "destructive"} className="text-sm">
          {totalSelected}/{playerCount} joueurs
        </Badge>
      </div>

      <Card className="bg-game-surface mb-6">
        <CardHeader>
          <CardTitle className="text-blue-300">
            Composition suggérée pour {playerCount} joueurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-200 text-sm">
            Cette composition est équilibrée selon les règles classiques du Loup-Garou.
            Vous pouvez la modifier selon vos préférences en utilisant les boutons + et -.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {ROLES_ARRAY.map((role) => {
          const count = selectedRoles[role.id] || 0;
          return (
            <Card
              key={role.id}
              className={`${role.colorClass} bg-opacity-20 border ${role.borderClass} transition-all ${
                count > 0 ? "ring-2 ring-blue-400" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{role.emoji}</span>
                    <div>
                      <div className={`font-semibold ${role.textClass}`}>
                        {role.name}
                      </div>
                      <div className="text-xs opacity-75">
                        Camp: {role.camp === "village" ? "Village" : 
                              role.camp === "wolves" ? "Loups-Garous" : "Neutre"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateRoleCount(role.id, -1)}
                      disabled={count === 0}
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-medium text-lg">{count}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateRoleCount(role.id, 1)}
                      disabled={totalSelected >= playerCount}
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <p className="text-xs opacity-75 line-clamp-2">{role.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleConfirm}
          disabled={!isValidComposition}
          className="bg-wolf-purple hover:bg-purple-600 px-8"
        >
          <i className="fas fa-check mr-2"></i>
          Confirmer la composition
        </Button>
      </div>
    </div>
  );
}