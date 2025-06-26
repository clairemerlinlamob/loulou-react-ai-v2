import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  status: text("status").notNull().default("preparation"), // preparation, night, day, finished, abandoned
  currentPhase: text("current_phase").notNull().default("preparation"),
  phaseNumber: integer("phase_number").notNull().default(1),
  currentStep: integer("current_step").notNull().default(0),
  startedAt: timestamp("started_at"),
  finishedAt: timestamp("finished_at"),
  winner: text("winner"), // village, wolves, lovers
  gameData: jsonb("game_data"), // Store game state as JSON
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").references(() => games.id).notNull(),
  name: text("name").notNull(),
  position: integer("position").notNull(),
  status: text("status").notNull().default("alive"), // alive, dead
  role: text("role"), // null until revealed
  isInLove: boolean("is_in_love").default(false),
  lovePartnerId: integer("love_partner_id"),
  revealedAt: timestamp("revealed_at"),
  diedAt: timestamp("died_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
});

export const updateGameSchema = createInsertSchema(games).omit({
  id: true,
  userId: true,
  createdAt: true,
}).partial();

export const updatePlayerSchema = createInsertSchema(players).omit({
  id: true,
  gameId: true,
  createdAt: true,
}).partial().extend({
  revealedAt: z.union([z.date(), z.string().transform((str) => new Date(str))]).optional(),
  diedAt: z.union([z.date(), z.string().transform((str) => new Date(str))]).optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type UpdateGame = z.infer<typeof updateGameSchema>;

export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type UpdatePlayer = z.infer<typeof updatePlayerSchema>;

// Game state types
export interface GameState {
  phase: "preparation" | "night" | "day" | "finished";
  phaseNumber: number;
  currentStep: number;
  nightActions: Record<string, any>;
  dayActions: Record<string, any>;
  announcements: string[];
  timer?: {
    startTime: number;
    duration?: number;
  };
}
