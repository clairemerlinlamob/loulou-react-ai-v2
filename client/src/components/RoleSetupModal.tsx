import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROLES_ARRAY } from "@/constants/roles";

interface RoleSetupModalProps {
  open: boolean;
  onClose: () => void;
  playerCount: number;
  onRoleSetupComplete: (selectedRoles: Record<string, number>) => void;
}

export function RoleSetupModal({ 
  open, 
  onClose, 
  playerCount,
  onRoleSetupComplete 
}: RoleSetupModalProps) {
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
    if (open && playerCount > 0) {
      const suggested = getSuggestedComposition(playerCount);
      setSelectedRoles(suggested);
    }
  }, [open, playerCount]);

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
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-game-surface border-gray-700 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Configuration des Rôles</span>
            <Badge variant={isValidComposition ? "default" : "destructive"}>
              {totalSelected}/{playerCount} joueurs
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
            <h3 className="text-blue-300 font-medium mb-2">
              Composition suggérée pour {playerCount} joueurs
            </h3>
            <p className="text-blue-200 text-sm">
              Cette composition est équilibrée selon les règles classiques du Loup-Garou.
              Vous pouvez la modifier selon vos préférences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROLES_ARRAY.map((role) => {
              const count = selectedRoles[role.id] || 0;
              return (
                <div
                  key={role.id}
                  className={`${role.colorClass} bg-opacity-20 border ${role.borderClass} rounded-lg p-4`}
                >
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
                      <span className="w-8 text-center font-medium">{count}</span>
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
                  <p className="text-xs opacity-75">{role.description}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isValidComposition}
              className="bg-wolf-purple hover:bg-purple-600"
            >
              Confirmer la composition
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}