# Vector Flow API

## Project Setup Guide

This guide outlines the steps to set up and run the project locally.

### Prerequisites

Ensure you have the following installed:
- **Node.js** (optional, for compatibility): v18 or higher.
- **Git**: For cloning the repository.

## Setup Instructions

1.. **Install dependencies**: Run in the terminal:

```bash
npm install
```

2. **Set up the environment variables**:Add them in the .env file(you can find them in the .env.example file as well):
  
```
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY_HERE>
PORT=<YOUR_PORT_HERE>(default is 3000)
```

3. **Build the Project**:: Run in the terminal

```bash
npm run build
# or for development
npm run build:watch
```

4. **Start the Server**: Run the server:

```bash
npm run start
# or for development
npm run start:dev
```


## Structure

- **README.md**: Project overview and setup instructions.
- **package.json**: Project metadata and dependencies.
- **src/**: Source code directory.
  - **app.ts**: Main application entry point.
  - **configs/**: Configuration files.
  - **constants/**: Constant definitions.
  - **middlewares/**: Middleware functions.
  - **modules/**: Feature modules.
    - **ask/**: Handles ask-related functionality.
    - **health/**: Health check endpoints (handler, router).
    - **ingest/**: Data ingestion functionality.
  - **server.ts**: Server initialization and setup.
  - **services/**: Shared services.
  - **types/**: TypeScript type definitions.
    - **modules/**: Module-specific types.
    - **shared/**: Shared types.
- **tsconfig.json**: TypeScript configuration.