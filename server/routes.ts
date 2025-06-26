import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSchema, updateGameSchema, insertPlayerSchema, updatePlayerSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Game routes
  app.post("/api/games", async (req, res) => {
    try {
      const gameData = insertGameSchema.parse(req.body);
      const game = await storage.createGame(gameData);
      res.json(game);
    } catch (error) {
      res.status(400).json({ error: "Invalid game data" });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const game = await storage.getGame(id);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      res.status(400).json({ error: "Invalid game ID" });
    }
  });

  app.patch("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = updateGameSchema.parse(req.body);
      const game = await storage.updateGame(id, updates);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  app.delete("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteGame(id);
      if (!deleted) {
        return res.status(404).json({ error: "Game not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Invalid game ID" });
    }
  });

  // Player routes
  app.post("/api/games/:gameId/players", async (req, res) => {
    try {
      const gameId = parseInt(req.params.gameId);
      const playerData = insertPlayerSchema.parse({
        ...req.body,
        gameId,
      });
      const player = await storage.createPlayer(playerData);
      res.json(player);
    } catch (error) {
      res.status(400).json({ error: "Invalid player data" });
    }
  });

  app.get("/api/games/:gameId/players", async (req, res) => {
    try {
      const gameId = parseInt(req.params.gameId);
      const players = await storage.getPlayersByGame(gameId);
      res.json(players);
    } catch (error) {
      res.status(400).json({ error: "Invalid game ID" });
    }
  });

  app.patch("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log("Update player request:", req.body);
      const updates = updatePlayerSchema.parse(req.body);
      console.log("Parsed updates:", updates);
      const player = await storage.updatePlayer(id, updates);
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      res.json(player);
    } catch (error) {
      console.error("Player update error:", error);
      res.status(400).json({ error: "Invalid update data", details: error.message });
    }
  });

  app.delete("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePlayer(id);
      if (!deleted) {
        return res.status(404).json({ error: "Player not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Invalid player ID" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
