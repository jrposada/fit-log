# Project Architecture Guide

## Tech Stack
- **Backend**: Node.js with TypeScript
- **Frontend**: React with TypeScript
- **Database**: MongoDB
- **Shared Code**: `shared/` and `shared-react/` directories

## Code Organization

### API Endpoints
- **Location**: `backend/src/api/<model-name>/*.ts`
- **Convention**: RESTful API design
- **Pattern**: Each model has its own directory with route handlers

### Database Models
- **Location**: `backend/src/models/<model-name>.ts`
- **Pattern**: Mongoose schemas and models
- **Naming**: PascalCase for model names

### API Public Types
- **Location**: `shared/models/<model-name>.ts`
- **Tests**: Type validations in `shared/models/<model-name>.test.ts`
- **Purpose**: Shared TypeScript interfaces/types between frontend and backend

### React API Hooks
- **Location**: `shared-react/api/<model-name>/*.ts`
- **Pattern**: Custom React hooks for API interactions
- **Naming**: Use hooks prefix (e.g., `useGetClimbs`, `useCreateLocation`)

## Development Workflow

### Adding a New Feature
1. Define types in `shared/models/<model-name>.ts`
2. Create DB model in `backend/src/models/<model-name>.ts`
3. Implement API routes in `backend/src/api/<model-name>/*.ts`
4. Create React hooks in `shared-react/api/<model-name>/*.ts`
5. Add tests as needed

### Key Conventions
- Follow RESTful conventions for API endpoints
- Maintain type safety across frontend/backend boundary
- Keep shared types in `shared/` directory
- Validate types with tests in `*.test.ts` files
