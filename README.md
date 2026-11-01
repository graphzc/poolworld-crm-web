# Poolworld Pattaya Web

Frontend web application for Poolworld Pattaya CRM built with React, HeroUI, and TanStack Router.

## Features

- JWT Authentication
- Customer Management (CRUD)
- Responsive Design
- Type-safe Routing
- Clean Architecture

## Prerequisites

- Node.js 18+ or higher
- pnpm package manager

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Copy the environment file:

```bash
cp .env.example .env
```

3. Update the API URL in `.env` if needed (default: http://localhost:8080)

4. Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## Build for Production

```bash
pnpm build
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── customers/   # Customer-specific components
│   └── layouts/     # Layout components
├── config/          # Configuration files
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries
├── routes/          # TanStack Router routes
├── services/        # API service layer
└── types/           # TypeScript type definitions
```

## Key Technologies

- **React 18** - UI library
- **HeroUI** - Component library
- **Tailwind CSS 4** - Styling
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **TypeScript** - Type safety

## Default Credentials

Use these credentials to login (must be configured in backend):

- Username: `poolworld`
- Password: `poolworldadmin`
