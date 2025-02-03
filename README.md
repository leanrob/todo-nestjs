![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/next.js-%23000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
![Jest](https://img.shields.io/badge/jest-%23C21325.svg?style=for-the-badge&logo=jest&logoColor=white)
![Cypress](https://img.shields.io/badge/cypress-%2317202C.svg?style=for-the-badge&logo=cypress&logoColor=white)

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen)

# Todo App with NestJS and Next.js

A modern, full-stack todo application built with NestJS (backend) and Next.js (frontend).

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Testing](#testing)
  - [Running All Tests](#running-all-tests)
  - [Backend E2E Tests](#backend-e2e-tests)
  - [Frontend E2E Tests](#frontend-e2e-tests)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
  - [Todo Data Structure](#todo-data-structure)
  - [Frontend Architecture](#frontend-architecture)
  - [Backend Architecture](#backend-architecture)
- [Future Development Roadmap](#future-development-roadmap)
  - [Code Quality & Standards](#code-quality-standards)
  - [Production Configuration](#production-configuration)
  - [CI/CD Pipeline](#ci-cd-pipeline)
  - [Security Implementation](#security-implementation)
  - [Performance Optimization](#performance-optimization)
  - [Monitoring & Observability](#monitoring-observability)
  - [Scaling Strategy](#scaling-strategy)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

```bash

# Install dependencies
yarn

# Install client dependencies
cd client && yarn
```

### Running the App

```bash
# Start both frontend and backend in development mode
yarn dev

# The app will be available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

## Testing

### Running All Tests

```bash
# Run all tests (frontend and backend) concurrently
yarn test

# Run tests in watch mode
yarn test:watch
```

### Backend E2E Tests

```bash
# Run NestJS E2E tests
yarn test:e2e:server
```

The backend E2E tests use Jest and Supertest to test the API endpoints. Tests are located in the `test` directory.

### Frontend E2E Tests

```bash
# Start the development servers first
yarn dev

# In a separate terminal, run Cypress tests
yarn test:e2e:client
```

Cypress tests are located in `client/cypress/e2e` and test the full user interaction flow.

## Technology Stack

### Backend

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications
- **TypeScript**: For type-safe code and better developer experience
- **Jest**: For unit and integration testing

### Frontend

- **Next.js 14**: React framework with server-side rendering and routing
- **TypeScript**: For type safety and better IDE support
- **Styled Components**: For component-level styling with CSS-in-JS
- **Jest & React Testing Library**: For component testing
- **Cypress**: For end-to-end testing

## Architecture

### Todo Data Structure

Todos are structured with the following properties:

```typescript
interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  starred: boolean;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  created: Date;
  updated: Date;
}
```

This structure was chosen to:

- Support rich todo items with descriptions and metadata
- Enable sorting and filtering by priority and status
- Allow organization through tags
- Track creation and modification times

### Frontend Architecture

The frontend is built with a component-based architecture:

#### Key Components

- **TodoItem**: The main component for displaying and editing individual todos
  - Supports inline editing
  - Handles priority visualization
  - Manages completion status
  - Provides delete functionality

- **FloatingAddButton**: A fixed-position button for adding new todos
  - Always accessible to users
  - Smooth animations for better UX

#### User Interaction Flow

1. **Viewing Todos**
   - Todos are displayed in a list format
   - Each todo shows its title, description, priority, and tags
   - Completed todos are visually distinguished

2. **Creating Todos**
   - Click the floating "+" button
   - Fill in title and description
   - Select priority level
   - Add optional tags

3. **Editing Todos**
   - Click "Edit" on any todo
   - Modify fields inline
   - Save changes or cancel
   - Click outside to save automatically

4. **Managing Todos**
   - Toggle completion with checkbox
   - Delete todos with delete button
   - Edit priority and tags as needed

#### Accessibility Features

1. **Keyboard Navigation**
   - Tab Order: Follows a logical flow through todo items
     1. Todo checkbox
     2. Todo title/description
     3. Edit button
     4. Priority selector (when editing)
     5. Save/Cancel buttons (when editing)
     6. Delete button
   - Keyboard Shortcuts:
     - `Enter` or `Space`: Toggle checkbox, activate buttons
     - `Enter`: Save changes in edit mode
     - `Escape`: Cancel editing
     - `Shift + Enter`: Add new line in description field
   - Focus Management:
     - Clear visual focus indicators
     - Focus trap in edit mode
     - Focus returns to logical position after actions

2. **Screen Reader Support**
   - ARIA labels for all interactive elements
   - Status announcements for actions
   - Clear heading hierarchy
   - Descriptive button labels
   - Priority level announcements
   - Completion status announcements

3. **Visual Assistance**
   - High contrast mode support
   - Clear focus indicators
   - Color-blind friendly priority indicators
   - Large click/touch targets
   - Consistent spacing and alignment
   - Error messages are clearly visible

4. **Quick Add Feature**
   - "Save and Add Another" button in edit mode
   - Maintains focus for rapid task entry
   - Keyboard shortcut: `Ctrl/Cmd + Enter`
   - Clear success/error feedback
   - Retains last used priority setting

The frontend communicates with the backend through a RESTful API, handling all CRUD operations for todos.

### Backend Architecture

The backend is built with NestJS following a modular, domain-driven design:

#### Module Structure

```typescript
// Core modules
- AppModule          // Root module, coordinates all other modules
- TodoModule         // Handles todo-related functionality

// Key components per module
- Controller         // Handles HTTP requests
- Service           // Contains business logic
- DTOs              // Defines data transfer objects
- Interfaces        // Defines TypeScript interfaces
```

#### Design Decisions

1. **Modular Architecture**
   - Each domain feature (e.g., todos) has its own module
   - Modules are self-contained with their own controllers and services
   - Makes the application easy to extend and maintain
   - Enables feature-based scaling

2. **Data Transfer Objects (DTOs)**
   - Strict validation using class-validator
   - Separate DTOs for creation and updates
   - Ensures data integrity and type safety
   - Example:

     ```typescript
     export class CreateTodoDto {
       @IsString()
       @IsNotEmpty()
       title: string;

       @IsString()
       description: string;

       @IsEnum(['low', 'medium', 'high'])
       priority: 'low' | 'medium' | 'high';
     }
     ```

3. **RESTful API Design**
   - Clean, resource-based URLs
   - Standard HTTP methods for CRUD operations:

    GET    /todos         // List all todos
    POST   /todos         // Create new todo
    GET    /todos/:id     // Get specific todo
    PUT    /todos/:id     // Update todo
    DELETE /todos/:id     // Delete todo

   - Proper HTTP status codes for different scenarios

4. **Service Layer Pattern**
   - Business logic isolated in service classes
   - Makes code more testable and maintainable
   - Enables easy swapping of data sources
   - Example:

     ```typescript
     @Injectable()
     export class TodoService {
       private todos: Todo[] = [];

       async create(createTodoDto: CreateTodoDto): Promise<Todo> {
         const todo = {
           id: uuid(),
           ...createTodoDto,
           completed: false,
           created: new Date(),
           updated: new Date()
         };
         this.todos.push(todo);
         return todo;
       }
     }
     ```

5. **Error Handling**
   - Global exception filter for consistent error responses
   - Custom exceptions for specific error cases
   - Proper error messages and status codes
   - Example response:

     ```json
     {
       "statusCode": 404,
       "message": "Todo not found",
       "error": "Not Found"
     }
     ```

6. **Validation Pipeline**
   - Automatic request validation using DTOs
   - Transforms and validates incoming data
   - Reduces boilerplate code in controllers
   - Example controller:

     ```typescript
     @Post()
     create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
       return this.todoService.create(createTodoDto);
     }
     ```

7. **Testing Strategy**
   - Unit tests for services
   - Integration tests for controllers
   - E2E tests for full API flows
   - Separate test database configuration
   - Example test:

     ```typescript
     describe('TodoService', () => {
       it('should create a todo', async () => {
         const todo = await service.create({
           title: 'Test Todo',
           description: 'Test Description',
           priority: 'medium'
         });
         expect(todo.id).toBeDefined();
         expect(todo.title).toBe('Test Todo');
       });
     });
     ```

8. **CORS Configuration**
   - The backend API implements CORS (Cross-Origin Resource Sharing) protection
   - Currently configured to accept requests only from `http://localhost:3000`
   - Important Note: While the frontend can be accessed from `http://192.168.1.76:3000`, API requests from this origin will fail due to CORS restrictions
   - This is a security measure to prevent unauthorized access to the API
   - Example CORS configuration:

     ```typescript
     {
       origin: 'http://localhost:3000',
       methods: ['GET', 'POST', 'PUT', 'DELETE'],
       credentials: true
     }
     ```

   If you need to access the API from `http://192.168.1.76:3000`, you'll need to add this origin to the allowed origins list in your backend configuration.

This architecture provides:

- Clear separation of concerns
- Easy testing and maintenance
- Scalable and modular design
- Type safety throughout the application
- Consistent error handling
- Robust validation

## Future Development Roadmap

### Code Quality & Standards

```bash
# Planned tooling
├── .husky/                    # Git hooks for pre-commit checks
├── .github/                   # GitHub Actions workflows
├── shared/                    # Shared types between frontend and backend
└── docs/                      # API documentation and development guides
```

1. **Code Standards Implementation**
   - Strict TypeScript configuration
   - Shared ESLint rules across frontend and backend
   - Prettier configuration for consistent formatting
   - Git commit message conventions (Conventional Commits)
   - Code review guidelines
   - Documentation requirements

2. **Quality Assurance**
   - Minimum test coverage requirements (85%)
   - Performance benchmarking standards
   - Accessibility compliance (WCAG 2.1)
   - Browser compatibility requirements
   - Error boundary implementation

### Production Configuration

1. **Environment Setup**

   ```typescript
   // Environment configuration structure
   interface Environment {
     database: {
       host: string;
       port: number;
       name: string;
       // ... other DB configs
     };
     redis: {
       host: string;
       port: number;
       // ... cache configs
     };
     security: {
       corsOrigins: string[];
       rateLimit: {
         windowMs: number;
         max: number;
       };
       // ... security configs
     };
   }
   ```

2. **Infrastructure Requirements**
   - PostgreSQL database setup
   - Redis caching layer
   - CDN configuration
   - Load balancer setup
   - Backup and recovery procedures
   - Monitoring and alerting (Datadog/New Relic)

### CI/CD Pipeline

```yaml
# Planned GitHub Actions workflow
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality:
    # Code quality checks
    - Linting
    - Type checking
    - Unit tests
    - Integration tests
    - E2E tests
    - Code coverage

  security:
    # Security checks
    - Dependency scanning
    - SAST analysis
    - Container scanning
    - License compliance

  deploy:
    # Deployment stages
    - Staging deployment
    - Production deployment
    - Smoke tests
    - Rollback procedures
```

### Security Implementation

1. **Authentication & Authorization**
   - JWT implementation
   - Role-based access control
   - OAuth 2.0 integration
   - API key management
   - Rate limiting

2. **Security Measures**

   ```typescript
   // Security middleware configuration
   const securityConfig = {
     helmet: {
       contentSecurityPolicy: true,
       xssFilter: true,
       // ... other security headers
     },
     rateLimit: {
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 100 // limit each IP to 100 requests per windowMs
     },
     cors: {
       origin: process.env.ALLOWED_ORIGINS.split(','),
       methods: ['GET', 'POST', 'PUT', 'DELETE'],
       credentials: true
     }
   };
   ```

### Performance Optimization

1. **Backend Optimization**
   - Query optimization
   - Caching strategies
   - Database indexing
   - Connection pooling
   - Load balancing

2. **Frontend Optimization**
   - Code splitting
   - Image optimization
   - Bundle size reduction
   - Service Worker implementation
   - Progressive Web App features

### Monitoring & Observability

1. **Logging Strategy**

   ```typescript
   // Logging configuration
   const loggingConfig = {
     level: process.env.LOG_LEVEL || 'info',
     format: winston.format.combine(
       winston.format.timestamp(),
       winston.format.json()
     ),
     transports: [
       new winston.transports.Console(),
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   };
   ```

2. **Monitoring Setup**
   - Application metrics
   - Error tracking
   - Performance monitoring
   - User analytics
   - Resource utilization

### Scaling Strategy

1. **Horizontal Scaling**
   - Containerization with Docker
   - Kubernetes orchestration
   - Microservices architecture consideration
   - Database sharding strategy
   - Cache distribution

2. **Vertical Scaling**
   - Resource optimization
   - Memory management
   - CPU utilization
   - Database optimization
   - Query performance

This roadmap provides a comprehensive path for:

- Production readiness
- Scalability
- Security
- Performance optimization
- Quality assurance
- Continuous deployment