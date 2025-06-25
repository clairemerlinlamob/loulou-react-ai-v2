import type { PlayerStatus, WinCondition } from "@/types";
import { ROLES } from "@/constants/roles";

export function checkWinConditions(players: PlayerStatus[]): WinCondition | null {
  const alivePlayers = players.filter(p => p.status === "alive");
  const aliveWolves = alivePlayers.filter(p => p.role && ROLES[p.role]?.camp === "wolves");
  const aliveVillagers = alivePlayers.filter(p => p.role && ROLES[p.role]?.camp === "village");
  const aliveLovers = alivePlayers.filter(p => p.isInLove);

  // Lovers win condition
  if (aliveLovers.length === 2 && alivePlayers.length === 2) {
    return {
      type: "lovers",
      description: "Les amoureux ont survécu jusqu'à la fin !",
      winners: aliveLovers,
    };
  }

  // Wolves win condition
  if (aliveWolves.length >= aliveVillagers.length && aliveWolves.length > 0) {
    return {
      type: "wolves",
      description: "Les Loups-Garous ont pris le contrôle du village !",
      winners: aliveWolves,
    };
  }

  // Village win condition
  if (aliveWolves.length === 0 && aliveVillagers.length > 0) {
    return {
      type: "village",
      description: "Le village a éliminé tous les Loups-Garous !",
      winners: aliveVillagers,
    };
  }

  // Tie condition
  if (alivePlayers.length === 0) {
    return {
      type: "tie",
      description: "Égalité parfaite - plus personne ne survit !",
      winners: [],
    };
  }

  return null;
}

export function getPlayersByRole(players: PlayerStatus[], roleId: string): PlayerStatus[] {
  return players.filter(p => p.role === roleId);
}

export function getAlivePlayers(players: PlayerStatus[]): PlayerStatus[] {
  return players.filter(p => p.status === "alive");
}

export function getDeadPlayers(players: PlayerStatus[]): PlayerStatus[] {
  return players.filter(p => p.status === "dead");
}

export function getPlayersInLove(players: PlayerStatus[]): PlayerStatus[] {
  return players.filter(p => p.isInLove);
}

export function canPlayerUseNightAction(player: PlayerStatus, phaseNumber: number): boolean {
  if (!player.role || player.status === "dead") return false;
  
  const role = ROLES[player.role];
  if (!role?.nightAction) return false;
  
  if (role.firstNightOnly && phaseNumber > 1) return false;
  
  return true;
}

export function killPlayer(players: PlayerStatus[], playerId: number): PlayerStatus[] {
  return players.map(player => {
    if (player.id === playerId) {
      const updatedPlayer = { ...player, status: "dead" as const, diedAt: new Date() };
      
      // If player is in love, kill partner too
      if (player.isInLove && player.lovePartnerId) {
        const partnerIndex = players.findIndex(p => p.id === player.lovePartnerId);
        if (partnerIndex !== -1 && players[partnerIndex].status === "alive") {
          players[partnerIndex] = { 
            ...players[partnerIndex], 
            status: "dead", 
            diedAt: new Date() 
          };
        }
      }
      
      return updatedPlayer;
    }
    return player;
  });
}

export function createLoveLink(players: PlayerStatus[], player1Id: number, player2Id: number): PlayerStatus[] {
  return players.map(player => {
    if (player.id === player1Id) {
      return { ...player, isInLove: true, lovePartnerId: player2Id };
    }
    if (player.id === player2Id) {
      return { ...player, isInLove: true, lovePartnerId: player1Id };
    }
    return player;
  });
}

export function removeLoveLink(players: PlayerStatus[], playerId: number): PlayerStatus[] {
  const player = players.find(p => p.id === playerId);
  if (!player?.lovePartnerId) return players;

  return players.map(p => {
    if (p.id === playerId || p.id === player.lovePartnerId) {
      return { ...p, isInLove: false, lovePartnerId: undefined };
    }
    return p;
  });
}
