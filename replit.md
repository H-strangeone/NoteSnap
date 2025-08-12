# Overview

GoalSync is a goal tracking and social accountability application built with a modern full-stack architecture. The application enables users to set personal and team goals, track progress through milestones, perform daily check-ins, and collaborate with others. It features a React-based frontend with TypeScript, an Express.js backend, and PostgreSQL database with Drizzle ORM for type-safe database operations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built using React with TypeScript and modern tooling:
- **Component Library**: Radix UI with shadcn/ui components for consistent, accessible UI elements
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
The server follows a RESTful API pattern with Express.js:
- **Framework**: Express.js with TypeScript for type safety
- **Authentication**: Replit Auth with OIDC integration and session-based authentication
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **API Structure**: Route-based organization with middleware for authentication and logging
- **Error Handling**: Centralized error handling with proper HTTP status codes

## Database Design
PostgreSQL database with Drizzle ORM providing type-safe database operations:
- **Schema Management**: Drizzle migrations with TypeScript schema definitions
- **Core Entities**: Users, goals, milestones, progress entries, daily check-ins, and activities
- **Relationships**: Foreign key relationships between users, goals, and associated data
- **Session Storage**: Dedicated sessions table for authentication state

## Authentication & Authorization
- **Provider**: Replit Auth integration with OIDC
- **Session Management**: Server-side sessions with PostgreSQL storage
- **Middleware**: Route-level authentication guards
- **User Management**: Automatic user creation and profile management

## Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Type Safety**: Generated TypeScript types from schema definitions
- **Validation**: Zod schemas for request validation and type coercion
- **Storage Interface**: Abstracted storage layer for database operations

## Development Environment
- **Monorepo Structure**: Shared types and schemas between client and server
- **Hot Reload**: Vite HMR for frontend, tsx for backend development
- **Build Process**: Separate build steps for client (Vite) and server (esbuild)
- **Path Aliases**: TypeScript path mapping for clean imports

# External Dependencies

## Database
- **PostgreSQL**: Primary database with connection via DATABASE_URL environment variable
- **Neon Database**: Serverless PostgreSQL provider (@neondatabase/serverless)

## Authentication
- **Replit Auth**: OIDC-based authentication system
- **Session Store**: PostgreSQL-backed session management

## UI/UX Libraries
- **Radix UI**: Headless UI components for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Icon library for consistent iconography
- **Date-fns**: Date manipulation and formatting

## Development Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across the entire stack
- **Drizzle Kit**: Database migration and schema management
- **ESBuild**: Server-side bundling for production

## Runtime Dependencies
- **TanStack React Query**: Server state management and caching
- **Wouter**: Lightweight routing for React
- **Zod**: Schema validation for type safety
- **Express.js**: Web application framework for Node.js