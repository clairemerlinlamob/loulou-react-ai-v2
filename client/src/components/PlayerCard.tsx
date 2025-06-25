import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RoleSelectionModal } from "./RoleSelectionModal";
import { useGame } from "@/hooks/useGame";
import type { PlayerStatus } from "@/types";
import { ROLES } from "@/constants/roles";

interface PlayerCardProps {
  player: PlayerStatus;
  gameId: number;
}

export function PlayerCard({ player, gameId }: PlayerCardProps) {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const { killPlayer, resurrectPlayer, revealRole, toggleLove } = useGame(gameId);

  const role = player.role ? ROLES[player.role] : null;
  const isAlive = player.status === "alive";
  const hasRole = !!player.role;

  const handleKill = async () => {
    await killPlayer(player.id);
  };

  const handleResurrect = async () => {
    await resurrectPlayer(player.id);
  };

  const handleRevealRole = (roleId: string) => {
    revealRole(player.id, roleId);
    setShowRoleModal(false);
  };

  const handleToggleLove = async () => {
    await toggleLove(player.id);
  };

  const statusColor = isAlive ? "status-alive" : "status-dead";
  const cardOpacity = isAlive ? "" : "opacity-60";
  const nameStyle = isAlive ? "" : "line-through";
  const loveIndicator = player.isInLove ? (
    <i className="fas fa-heart text-status-love text-xs animate-pulse ml-2"></i>
  ) : null;

  return (
    <>
      <Card className={`bg-game-surface border border-gray-700 hover:border-gray-600 transition-all ${cardOpacity} ${
        player.isInLove ? "border-status-love hover:border-pink-400" : ""
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 bg-${statusColor} rounded-full ${isAlive ? "animate-pulse" : ""}`}></div>
              <h3 className={`font-semibold ${nameStyle}`}>
                {player.name}
                {loveIndicator}
              </h3>
            </div>
            <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              Joueur #{player.position}
            </div>
          </div>

          <div className="bg-game-bg rounded-lg p-3 mb-4 min-h-[60px] flex items-center">
            {hasRole && role ? (
              <div className={`${role.colorClass} bg-opacity-30 border ${role.borderClass} rounded-lg p-2 w-full`}>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{role.emoji}</span>
                  <div>
                    <div className={`font-semibold ${role.textClass}`}>{role.name}</div>
                    <div className={`text-xs opacity-75`}>Camp: {role.camp}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-400 w-full">
                <i className="fas fa-question-circle"></i>
                <span className="text-sm">Rôle non révélé</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              className={`${hasRole ? "bg-gray-700 hover:bg-gray-600" : "bg-wolf-purple hover:bg-purple-600"} text-white`}
              onClick={() => setShowRoleModal(true)}
            >
              <i className={`${hasRole ? "fas fa-edit" : "fas fa-eye"} mr-1`}></i>
              {hasRole ? "Modifier" : "Révéler"}
            </Button>

            {isAlive ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleKill}
              >
                <i className="fas fa-skull mr-1"></i>
                Mort
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleResurrect}
              >
                <i className="fas fa-heart mr-1"></i>
                Ressusciter
              </Button>
            )}
          </div>

          {isAlive && (
            <div className="mt-2">
              <Button
                size="sm"
                variant="outline"
                className={`w-full ${player.isInLove ? "bg-status-love hover:bg-pink-600" : "bg-gray-700 hover:bg-gray-600"} text-white text-xs`}
                onClick={handleToggleLove}
              >
                <i className="fas fa-heart mr-1"></i>
                {player.isInLove ? "Retirer Amour" : "Amour"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <RoleSelectionModal
        open={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onSelectRole={handleRevealRole}
        playerName={player.name}
        currentRole={player.role}
      />
    </>
  );
}
