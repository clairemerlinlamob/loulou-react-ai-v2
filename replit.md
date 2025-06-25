# LOULOU - Loup-Garou Game Master Assistant

## Overview

LOULOU is a modern web application designed to assist game masters in conducting physical Loup-Garou (Werewolf) games. The application provides progressive role revelation, phase management, and complete game state tracking to enhance the traditional board game experience.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom game-specific color variables
- **State Management**: React Context API with useReducer for game state
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API endpoints
- **Development Server**: Custom Vite integration for SSR-like development experience
- **Request Logging**: Custom middleware for API request/response logging

### Data Storage Solutions
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless integration
- **Schema Management**: Drizzle migrations with shared schema definitions
- **Development Storage**: In-memory storage class for development/testing
- **Session Management**: PostgreSQL session store integration ready

## Key Components

### Game Management System
- **Game Sessions**: Complete game lifecycle management from preparation to completion
- **Player Management**: Dynamic player addition, role assignment, and status tracking
- **Phase Control**: Structured night/day cycle management with customizable steps
- **Win Condition Detection**: Automatic game end detection based on faction survival

### Role System
- **Role Definitions**: Comprehensive role catalog with unique abilities and win conditions
- **Progressive Revelation**: Controlled role disclosure during gameplay
- **Camp-based Logic**: Village, Wolves, and Neutral faction management
- **Special Abilities**: Night actions, passive abilities, and death triggers

### Phase Management
- **Preparation Phase**: Player setup and role distribution
- **Night Phases**: Sequential role-based actions with guided prompts
- **Day Phases**: Discussion, voting, and elimination mechanics
- **Dynamic Steps**: Context-aware phase steps based on alive roles

### UI/UX Design
- **Dark Theme**: Game-optimized dark color scheme
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Real-time Updates**: Live game state synchronization
- **Accessibility**: Screen reader support and keyboard navigation

## Data Flow

1. **Game Creation**: User creates new game session via Home page
2. **Player Setup**: Dynamic player addition during preparation phase
3. **Role Assignment**: Manual role revelation through guided interface
4. **Phase Progression**: Sequential phase advancement with step-by-step guidance
5. **State Persistence**: Automatic game state saving to database
6. **Real-time Updates**: Context-based state updates across components

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@radix-ui/***: Headless UI component primitives
- **@tanstack/react-query**: Server state management
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight React router

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **vite**: Frontend build tool and development server
- **drizzle-kit**: Database migration and introspection tools

### Replit Integration
- **@replit/vite-plugin-cartographer**: Development environment integration
- **@replit/vite-plugin-runtime-error-modal**: Enhanced error reporting

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev` - Runs TypeScript server with hot reload
- **Port**: 5000 (configured in .replit)
- **Database**: PostgreSQL 16 module in Replit environment
- **Hot Reload**: Vite middleware integration for frontend changes

### Production Build
- **Build Command**: `npm run build` - Compiles both frontend and backend
- **Frontend**: Vite build to `dist/public`
- **Backend**: esbuild bundle to `dist/index.js`
- **Start Command**: `npm run start` - Runs production bundle

### Database Management
- **Push Schema**: `npm run db:push` - Applies schema changes to database
- **Environment**: DATABASE_URL environment variable required
- **Migrations**: Located in `./migrations` directory

## Changelog
- June 25, 2025. Initial setup and complete LOULOU application implementation
- June 25, 2025. Added role setup system with automatic suggestions
- June 25, 2025. Implemented progressive role revelation during gameplay
- June 25, 2025. Added phase-specific UI controls and navigation

## User Preferences

Preferred communication style: Simple, everyday language.