# InnovHub - SIESGST Innovation Platform

## Overview

InnovHub is a comprehensive web platform designed for SIESGST college to foster innovation and collaboration among 200+ IT students and 20+ faculty/mentors. The platform integrates AI-powered project idea generation, mentor matching, and project showcase capabilities to transform repetitive student projects into creative, collaborative endeavors.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with Material Design guidelines
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Updates**: React Query with polling intervals for activity feeds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **API Design**: RESTful API with JSON responses

### Data Storage Architecture
- **Primary Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Schema**: Shared TypeScript schemas with Zod validation
- **Session Storage**: PostgreSQL-backed sessions for authentication

## Key Components

### 1. AI-Powered Idea Generator
- **Purpose**: Generate tailored project ideas based on user-selected technologies and difficulty levels
- **Implementation**: Google Gemini API integration for natural language processing
- **Features**: 
  - Technology tag selection
  - Difficulty level filtering (beginner, intermediate, advanced)
  - Real-time idea generation with architectural suggestions
  - Idea persistence for user reference
  - Campus-relevant project suggestions

### 2. Skill-to-Project Matchmaking
- **Purpose**: Match students' skills with projects needing their expertise
- **Implementation**: AI-powered compatibility scoring and project recommendations
- **Features**:
  - Skill tag input system
  - Project compatibility scoring
  - Match reasoning and explanations
  - Real-time project suggestions based on skill overlap

### 3. Live Project Help Board
- **Purpose**: Real-time assistance platform for students seeking project help
- **Implementation**: Live request system with categorization and urgency levels
- **Features**:
  - Help request creation with skill requirements
  - Urgency levels (low, medium, high)
  - Request categorization (frontend, backend, mobile, design, data)
  - Real-time response tracking
  - Offer assistance functionality

### 4. Mentor Matching Engine
- **Purpose**: Connect students with appropriate mentors based on expertise and interests
- **Implementation**: AI-powered matching using Gemini API recommendations
- **Features**:
  - Skill-based mentor recommendations
  - Connection request management
  - Mentor rating and feedback system
  - Match score calculation with reasoning

### 5. Google Tech Badges System
- **Purpose**: Encourage adoption of Google technologies through achievement badges
- **Implementation**: Automatic badge detection based on project technologies
- **Features**:
  - Firebase Master badge (Auth, Firestore, Functions)
  - Gemini Innovator badge (AI integration)
  - Vertex AI Pioneer badge (ML implementation)
  - GCP Architect badge (Cloud Platform usage)
  - Visual badge display on projects

### 6. Project Showcase & Collaboration
- **Purpose**: Platform for students to share, discover, and collaborate on projects
- **Features**:
  - Project creation and management
  - Team member collaboration
  - Project starring and bookmarking
  - Technology and tag-based filtering
  - Google Tech Badges integration
  - Repository integration support

### 7. Real-time Activity Feed
- **Purpose**: Keep users engaged with platform activities and updates
- **Implementation**: Polling-based real-time updates using React Query
- **Features**:
  - Project creation notifications
  - Team joining activities
  - Mentorship requests
  - Help request postings
  - Project starring activities

### 8. User Management System
- **Purpose**: Handle user authentication, profiles, and role management
- **Features**:
  - Role-based access (student, mentor, faculty)
  - User profiles with expertise tracking
  - Statistics dashboard (projects, collaborations, mentorships)

## Data Flow

### User Authentication Flow
1. User registration with role selection (student/mentor/faculty)
2. Profile creation with expertise and bio information
3. Session-based authentication using PostgreSQL session store
4. Role-based UI component rendering

### Project Creation Flow
1. User accesses AI idea generator or creates custom project
2. Project details stored with author relationship
3. Real-time activity feed update for new project creation
4. Project becomes available in showcase for collaboration

### Mentor Matching Flow
1. Student selects interest tags and expertise areas
2. AI analyzes mentor database for compatibility
3. Matching scores calculated based on expertise overlap
4. Top matches presented with connection options

### Real-time Updates Flow
1. React Query polls API endpoints at configured intervals
2. Activity feed updates automatically on new data
3. UI components re-render with fresh information
4. WebSocket-ready architecture for future real-time enhancements

## External Dependencies

### AI Services
- **Google Gemini API**: Project idea generation and natural language processing
- **Vertex AI**: Advanced mentor matching and recommendation algorithms

### Database & Infrastructure
- **PostgreSQL**: Primary database with PostgreSQL session storage
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations and migrations

### Firebase Integration
- **Firebase SDK**: Client-side authentication and real-time features
- **Firebase Admin SDK**: Server-side authentication and Firestore operations
- **Firebase Auth**: User authentication with email/password and OAuth providers
- **Firestore**: Real-time database for live updates and notifications
- **Firebase Cloud Messaging**: Push notifications for user engagement

### UI & Development
- **Shadcn/ui**: Pre-built accessible UI components
- **Radix UI**: Headless UI primitives for complex interactions
- **Tailwind CSS**: Utility-first CSS framework
- **Material Design**: Design system implementation

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Local PostgreSQL or Neon Database connection
- **Environment Variables**: `.env` file for API keys and database URLs

### Production Deployment
- **Build Process**: 
  1. Vite builds optimized client bundle
  2. ESBuild creates server bundle with external dependencies
  3. Static assets served from `dist/public` directory
- **Server**: Node.js Express server serving both API and static files
- **Database**: Neon Database with connection pooling
- **Environment**: Production environment variables for API keys

### Database Management
- **Migrations**: Drizzle Kit for schema migrations
- **Schema Sync**: `db:push` command for development schema updates
- **Type Generation**: Automatic TypeScript types from database schema

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### January 03, 2025 - Enhanced InnovHub Platform
- ✓ Added Skill-to-Project Matchmaking system with AI-powered compatibility scoring
- ✓ Implemented Live Project Help Board with real-time assistance requests
- ✓ Created Google Tech Badges System to encourage Google technology adoption
- ✓ Enhanced dashboard with tabbed interface for better feature organization
- ✓ Integrated Google Gemini API for advanced AI-powered features
- ✓ Added comprehensive sample data for realistic demo experience
- ✓ Improved project showcase with technology badge visualization
- ✓ Added Firebase SDK integration with authentication demo
- ✓ Implemented Firebase Admin SDK for server-side operations
- ✓ Created Firebase demonstration tab with authentication showcase

### Key Accomplishments
- **5 Core Features**: AI Ideas, Skill Matching, Help Board, Mentor Matching, Tech Badges
- **Real-time Updates**: Live activity feed and help request system
- **AI Integration**: Gemini API powering idea generation and mentor matching
- **Google Tech Focus**: Badge system promoting Firebase, Gemini, Vertex AI usage
- **Material Design**: Consistent UI following Google's design guidelines

## Changelog

Changelog:
- January 03, 2025: Major feature enhancement - Added 5 comprehensive features for GDG review
- July 02, 2025: Initial setup