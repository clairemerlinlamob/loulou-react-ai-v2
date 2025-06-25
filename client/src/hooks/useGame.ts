import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useGameContext } from "@/contexts/GameContext";
import type { Game, Player, UpdateGame, UpdatePlayer } from "@shared/schema";
import type { GameSession, PlayerStatus } from "@/types";

export function useGame(gameId?: number) {
  const { dispatch } = useGameContext();
  const queryClient = useQueryClient();

  const gameQuery = useQuery({
    queryKey: ["/api/games", gameId],
    enabled: !!gameId,
  });

  const playersQuery = useQuery({
    queryKey: ["/api/games", gameId, "players"],
    enabled: !!gameId,
  });

  const createGameMutation = useMutation({
    mutationFn: async (gameData: Partial<Game>) => {
      const res = await apiRequest("POST", "/api/games", gameData);
      return await res.json();
    },
    onSuccess: (newGame) => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      dispatch({ type: "SET_GAME", payload: newGame });
    },
  });

  const updateGameMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: UpdateGame }) => {
      const res = await apiRequest("PATCH", `/api/games/${id}`, updates);
      return await res.json();
    },
    onSuccess: (updatedGame) => {
      queryClient.invalidateQueries({ queryKey: ["/api/games", updatedGame.id] });
      dispatch({ type: "SET_GAME", payload: updatedGame });
    },
  });

  const createPlayerMutation = useMutation({
    mutationFn: async ({ gameId, playerData }: { gameId: number; playerData: Partial<Player> }) => {
      const res = await apiRequest("POST", `/api/games/${gameId}/players`, playerData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games", gameId, "players"] });
    },
  });

  const updatePlayerMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: UpdatePlayer }) => {
      const res = await apiRequest("PATCH", `/api/players/${id}`, updates);
      return await res.json();
    },
    onSuccess: (updatedPlayer) => {
      queryClient.invalidateQueries({ queryKey: ["/api/games", gameId, "players"] });
      dispatch({ 
        type: "UPDATE_PLAYER", 
        payload: { id: updatedPlayer.id, updates: updatedPlayer }
      });
    },
  });

  const revealRole = async (playerId: number, role: string) => {
    await updatePlayerMutation.mutateAsync({
      id: playerId,
      updates: { 
        role, 
        revealedAt: new Date().toISOString() as any
      }
    });
  };

  const killPlayer = async (playerId: number) => {
    await updatePlayerMutation.mutateAsync({
      id: playerId,
      updates: { 
        status: "dead", 
        diedAt: new Date().toISOString() as any
      }
    });
  };

  const resurrectPlayer = async (playerId: number) => {
    await updatePlayerMutation.mutateAsync({
      id: playerId,
      updates: { 
        status: "alive", 
        diedAt: null
      }
    });
  };

  const toggleLove = async (playerId: number, partnerId?: number) => {
    await updatePlayerMutation.mutateAsync({
      id: playerId,
      updates: { 
        isInLove: !playersQuery.data?.find((p: Player) => p.id === playerId)?.isInLove,
        lovePartnerId: partnerId || null
      }
    });
  };

  return {
    game: gameQuery.data,
    players: playersQuery.data || [],
    isLoading: gameQuery.isLoading || playersQuery.isLoading,
    createGame: createGameMutation.mutateAsync,
    updateGame: updateGameMutation.mutateAsync,
    createPlayer: createPlayerMutation.mutateAsync,
    updatePlayer: updatePlayerMutation.mutateAsync,
    revealRole,
    killPlayer,
    resurrectPlayer,
    toggleLove,
    isCreating: createGameMutation.isPending,
    isUpdating: updateGameMutation.isPending || updatePlayerMutation.isPending,
  };
}
