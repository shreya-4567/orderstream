# Real-Time Order Management System

## Overview

This is a full-stack order management system built with React frontend, Node.js/Express backend, and PostgreSQL database using Drizzle ORM. The application provides a modern, responsive interface for managing orders with features including order creation, tracking, analytics, and file upload capabilities. It's designed to be a comprehensive solution for businesses to handle their order workflows efficiently.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui design system for consistent, accessible components
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Form Handling**: React Hook Form with Zod validation for robust form management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API
- **Language**: TypeScript for type safety across the entire stack
- **Database ORM**: Drizzle ORM for type-safe database operations and migrations
- **API Design**: REST endpoints following conventional patterns (/api/orders)
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Development**: Hot reload with tsx for rapid development cycles

### Database Design
- **Primary Database**: PostgreSQL configured through Drizzle
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Tables**: 
  - Orders table with fields for orderId, customerName, orderAmount, orderDate, invoiceFileUrl, status, and timestamps
  - Users table for authentication (prepared for future implementation)
- **Data Validation**: Zod schemas shared between frontend and backend for consistency

### Component Architecture
- **Layout System**: Responsive sidebar navigation with mobile-first design
- **Page Structure**: Dashboard, Create Order, Order Detail, and Analytics pages
- **Reusable Components**: Modular UI components from shadcn/ui library
- **State Patterns**: React Query for server state, local state for UI interactions

### Development Environment
- **Monorepo Structure**: Shared types and schemas between client and server
- **Path Aliases**: Configured for clean imports (@/, @shared/, etc.)
- **Hot Reload**: Vite dev server with Express backend integration
- **Type Checking**: Strict TypeScript configuration across all packages

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: PostgreSQL database connection (configured for Neon)
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React router
- **react-hook-form**: Form state management and validation
- **zod**: Runtime type validation and schema definition

### UI and Styling
- **@radix-ui/***: Accessible UI primitives (40+ components)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variants
- **lucide-react**: Modern icon system

### File Handling
- **Mock S3 Integration**: Placeholder for AWS S3 file uploads (invoice PDFs)
- **File Upload**: Prepared infrastructure for PDF invoice handling

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **vite**: Modern build tool and dev server
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

### Future AWS Integration (Prepared)
- **DynamoDB**: Document database for order storage (alternative to PostgreSQL)
- **S3**: File storage for invoice PDFs
- **SNS**: Push notifications for order events
- **Lambda**: Serverless functions for background processing