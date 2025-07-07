# Financial Dashboard Application

## Overview

This is a modern financial dashboard web application built to replace a traditional spreadsheet system. The application provides a comprehensive view of personal finances with income tracking, expense categorization, and visual analytics. It's designed as a full-stack application with a React frontend and Express backend, featuring a clean, dark-themed UI inspired by modern design systems.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Recharts for data visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Build Tool**: esbuild for production builds

## Key Components

### Database Schema
The application uses a PostgreSQL database with the following key tables:
- `financial_data`: Stores monthly financial records including income sources and expense categories
- Schema includes fields for mid-month and end-month income, planned vs actual expenses across four categories

### Frontend Components
- **Dashboard**: Main view displaying financial overview
- **Income Balance Block**: Shows salary, benefits, and total income
- **Expense Categories Block**: Displays spending by category with status indicators
- **Charts Block**: Visual representations using pie charts and bar charts
- **Summary Stats**: Overview of total planned vs actual spending

### API Endpoints
- `GET /api/financial-data`: Retrieves current financial dashboard data
- `POST /api/refresh-data`: Triggers data refresh (placeholder for future implementation)

## Data Flow

1. **Data Storage**: Financial data is stored in PostgreSQL database with structured schema
2. **API Layer**: Express server provides REST endpoints for data access
3. **Frontend Queries**: React components use TanStack Query to fetch and cache data
4. **UI Rendering**: Components render financial information with status indicators and charts
5. **Real-time Updates**: Refresh mechanism allows for data synchronization

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM with PostgreSQL support
- **@tanstack/react-query**: Data fetching and state management
- **recharts**: Chart library for financial visualizations
- **@radix-ui/***: Headless UI components for accessibility

### Development Tools
- **drizzle-kit**: Database schema management and migrations
- **tsx**: TypeScript execution for development
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Development
- Uses Vite dev server with HMR for fast development
- TypeScript compilation with strict type checking
- Environment variables for database configuration

### Production
- Frontend: Vite build output served as static files
- Backend: esbuild bundle for optimized Node.js deployment
- Database: Neon serverless PostgreSQL for scalable data storage

### Configuration
- Database migrations handled through Drizzle Kit
- Environment-based configuration for different deployment stages
- Replit-specific optimizations for cloud deployment

## Changelog
- July 07, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.