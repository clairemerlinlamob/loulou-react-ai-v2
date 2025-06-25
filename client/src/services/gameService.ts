import { apiRequest } from "@/lib/queryClient";
import type { Game, Player, InsertGame, InsertPlayer, UpdateGame, UpdatePlayer } from "@shared/schema";

export const gameService = {
  // Game methods
  async createGame(gameData: InsertGame): Promise<Game> {
    const res = await apiRequest("POST", "/api/games", gameData);
    return await res.json();
  },

  async getGame(id: number): Promise<Game> {
    const res = await apiRequest("GET", `/api/games/${id}`);
    return await res.json();
  },

  async updateGame(id: number, updates: UpdateGame): Promise<Game> {
    const res = await apiRequest("PATCH", `/api/games/${id}`, updates);
    return await res.json();
  },

  async deleteGame(id: number): Promise<void> {
    await apiRequest("DELETE", `/api/games/${id}`);
  },

  // Player methods
  async createPlayer(gameId: number, playerData: InsertPlayer): Promise<Player> {
    const res = await apiRequest("POST", `/api/games/${gameId}/players`, playerData);
    return await res.json();
  },

  async getPlayers(gameId: number): Promise<Player[]> {
    const res = await apiRequest("GET", `/api/games/${gameId}/players`);
    return await res.json();
  },

  async updatePlayer(id: number, updates: UpdatePlayer): Promise<Player> {
    const res = await apiRequest("PATCH", `/api/players/${id}`, updates);
    return await res.json();
  },

  async deletePlayer(id: number): Promise<void> {
    await apiRequest("DELETE", `/api/players/${id}`);
  },
};
