# Financial Dashboard Application

## Overview

This is a full-stack financial dashboard application built with React and Express.js that tracks monthly income, expenses, and investments. The application provides a comprehensive view of financial data with visual analytics including charts and budget tracking across different expense categories.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints
- **Development**: Hot reload with Vite middleware integration
- **Error Handling**: Centralized error middleware with structured responses

### Data Storage Solutions
- **Database**: PostgreSQL (configured via Drizzle)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Connection**: Neon Database serverless connection
- **Migrations**: Drizzle Kit for schema management
- **Fallback**: In-memory storage implementation for development

## Key Components

### Financial Data Management
- **Income Tracking**: Monthly salary, FGTS, and bonuses
- **Expense Categories**: Essential (70%), Non-essential (8%), Investments (17%), Leisure (5%)
- **Budget Status**: Under/over/exact budget tracking with variance calculations
- **Monthly Summary**: Total planned vs actual spending with percentage variance

### UI Components
- **Dashboard**: Main financial overview with multiple sections
- **Revenue & Balance**: Income tracking and remaining balance display
- **Expense Categories**: Budget allocation and spending status
- **Visual Analysis**: Pie charts and bar charts for spending breakdown
- **Monthly Summary**: Comprehensive financial performance metrics

### Data Visualization
- **Pie Charts**: Expense category distribution by percentage
- **Bar Charts**: Planned vs actual spending comparison
- **Progress Indicators**: Budget utilization with color-coded status
- **Currency Formatting**: Brazilian Real (BRL) formatting throughout

## Data Flow

1. **Client Request**: React components use TanStack Query to fetch data
2. **API Layer**: Express routes handle HTTP requests to `/api/dashboard`
3. **Storage Layer**: Data retrieved from PostgreSQL via Drizzle ORM or in-memory fallback
4. **Response**: Structured JSON response with financial data, expense categories, and monthly summary
5. **UI Update**: React components re-render with updated financial information
6. **Visual Rendering**: Charts and progress indicators update based on data changes

## External Dependencies

### Database & ORM
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-zod**: Schema validation integration

### UI & Styling
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **recharts**: React charting library for data visualization
- **lucide-react**: Icon library

### State & Forms
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **@hookform/resolvers**: Form validation resolvers

### Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: JavaScript bundler for production builds

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR on client directory
- **Backend**: Express server with tsx for TypeScript execution
- **Database**: PostgreSQL connection via environment variables
- **Hot Reload**: Integrated Vite middleware for seamless development

### Production Build
- **Frontend**: Vite build output to `dist/public`
- **Backend**: esbuild bundle to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Environment**: Production mode with optimized builds

### Configuration Management
- **Database URL**: Required environment variable for PostgreSQL connection
- **TypeScript**: Strict mode with path mapping for imports
- **Build Scripts**: Separate development and production workflows

## Changelog
- July 07, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.