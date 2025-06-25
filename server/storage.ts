import { users, games, players, type User, type InsertUser, type Game, type InsertGame, type UpdateGame, type Player, type InsertPlayer, type UpdatePlayer } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Game methods
  createGame(game: InsertGame): Promise<Game>;
  getGame(id: number): Promise<Game | undefined>;
  updateGame(id: number, updates: UpdateGame): Promise<Game | undefined>;
  getGamesByUser(userId: number): Promise<Game[]>;
  deleteGame(id: number): Promise<boolean>;

  // Player methods
  createPlayer(player: InsertPlayer): Promise<Player>;
  getPlayer(id: number): Promise<Player | undefined>;
  updatePlayer(id: number, updates: UpdatePlayer): Promise<Player | undefined>;
  getPlayersByGame(gameId: number): Promise<Player[]>;
  deletePlayer(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private players: Map<number, Player>;
  private currentUserId: number;
  private currentGameId: number;
  private currentPlayerId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.players = new Map();
    this.currentUserId = 1;
    this.currentGameId = 1;
    this.currentPlayerId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Game methods
  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = this.currentGameId++;
    const now = new Date();
    const game: Game = {
      ...insertGame,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.games.set(id, game);
    return game;
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async updateGame(id: number, updates: UpdateGame): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;

    const updatedGame: Game = {
      ...game,
      ...updates,
      updatedAt: new Date(),
    };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  async getGamesByUser(userId: number): Promise<Game[]> {
    return Array.from(this.games.values()).filter(
      (game) => game.userId === userId,
    );
  }

  async deleteGame(id: number): Promise<boolean> {
    return this.games.delete(id);
  }

  // Player methods
  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = this.currentPlayerId++;
    const now = new Date();
    const player: Player = {
      ...insertPlayer,
      id,
      createdAt: now,
    };
    this.players.set(id, player);
    return player;
  }

  async getPlayer(id: number): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async updatePlayer(id: number, updates: UpdatePlayer): Promise<Player | undefined> {
    const player = this.players.get(id);
    if (!player) return undefined;

    const updatedPlayer: Player = {
      ...player,
      ...updates,
    };
    this.players.set(id, updatedPlayer);
    return updatedPlayer;
  }

  async getPlayersByGame(gameId: number): Promise<Player[]> {
    return Array.from(this.players.values())
      .filter((player) => player.gameId === gameId)
      .sort((a, b) => a.position - b.position);
  }

  async deletePlayer(id: number): Promise<boolean> {
    return this.players.delete(id);
  }
}

export const storage = new MemStorage();
