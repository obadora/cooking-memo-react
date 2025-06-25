# CLAUDE.md

必ず日本語で回答してください。
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands

- `npm run dev` - Start development server with Vite hot reload
- `npm run build` - TypeScript compilation + production build
- `npm run lint` - Run ESLint code quality checks
- `npm run preview` - Preview production build locally

### Backend Integration

The application requires a backend API server running at `http://localhost:8000`. Key endpoints:

- `POST /recipe/scrape` - Recipe URL scraping functionality

## Architecture Overview

### Application Structure

This is a React 19 + TypeScript cooking memo application built with Vite. The app follows a calendar-based recipe viewing pattern.

**Routing Structure:**

- `/` → CalendarPage (main calendar interface)
- `/recipe/:date` → RecipeList (recipes for specific date)
- `/recipe/:date/detail` → RecipeDetail (detailed recipe view)

### Key Components Architecture

**Calendar System:**

- `CalendarPage.tsx` - Main calendar wrapper with date selection logic
- `Calendar.tsx` - Interactive monthly calendar component with navigation
- Dates are formatted as YYYY-MM-DD for URL parameters

**Recipe System:**

- `RecipeList.tsx` & `RecipeDetail.tsx` - Handle recipe data fetching and display
- Both components support URL input for recipe scraping via backend API
- Display recipe ingredients, steps, and photos

### Type System Organization

The codebase uses a comprehensive TypeScript type system organized in `/src/types/`:

**Core Type Exports** (via `/src/types/index.ts`):

- Entity types: `source`, `category`, `tag`, `recipe`
- API types: `api` (ApiResponse, PaginatedResponse, ApiError)
- Form and search types: `form`, `search`
- Statistics types: `stats`

**Key Types:**

- `Recipe` - Core recipe entity
- `RecipeWithRelations` - Recipe with related data
- `RecipePhoto`, `Ingredient`, `Step`, `CookingRecord` - Recipe components

### Technical Stack

- **Build Tool:** Vite with SWC for fast compilation
- **Styling:** Tailwind CSS with utility-first approach
- **Icons:** lucide-react (ChevronLeft, ChevronRight used in Calendar)
- **Routing:** React Router DOM 7.6.1
- **State Management:** React built-in state (useState, useEffect)

## Development Guidelines

### Code Organization

- Components are flat in `/src/` (no nested component directories)
- Type definitions are well-organized by domain in `/src/types/`
- Follow the existing barrel export pattern for types

### API Integration

- All API calls should handle proper error responses
- Use the existing backend endpoint structure at `localhost:8000`
- Recipe scraping expects URL input via POST requests

### Styling Conventions

- Use Tailwind CSS utility classes
- Follow responsive design patterns (mobile-first)
- Maintain consistent spacing and color schemes

### TypeScript Standards

- Strict TypeScript configuration is enabled
- Use proper type imports and exports
- Follow the existing type organization patterns in `/src/types/`
