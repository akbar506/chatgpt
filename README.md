# ChatGPT Clone

A full-stack AI chat application with authenticated conversations, real-time streamed responses, persistent chat history, public sharing links, and semantic memory. The React client communicates with an Express and Socket.IO server, which stores data in MongoDB and uses Gemini and Pinecone to generate context-aware responses.

## Screenshot

> Placeholder — replace this image with an application screenshot.

![ChatGPT Clone screenshot placeholder](https://placehold.co/1200x675/18181b/ffffff?text=ChatGPT+Clone+Screenshot)

## Features

- Account registration, login, logout, and refresh-token session restoration
- Protected chat workspace with a collapsible conversation sidebar
- New chat creation with AI-generated titles
- Persistent chat and message history
- Real-time AI responses over Socket.IO, with optional word-level streaming
- Configurable response thinking level: Minimal, Low, Medium, or High
- Conversation context from recent chat history and semantic vector memory
- Markdown, GitHub Flavored Markdown, and syntax-highlighted code rendering for AI responses
- Token-usage metadata and one-click response copying
- Search conversations by title
- Public, shareable conversation links
- Responsive UI with system-aware light and dark themes
- Client-side form validation and automatic access-token refresh/retry handling

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Redux Toolkit, Axios, Socket.IO Client |
| UI | Tailwind CSS, shadcn/ui, Base UI, Lucide React, Sonner, next-themes |
| Forms and content | React Hook Form, Zod, React Markdown, remark-gfm, rehype-highlight |
| Backend | Node.js, Express, Socket.IO, JWT, bcrypt, cookie-parser |
| Data | MongoDB with Mongoose, Pinecone vector database |
| AI | Google Gen AI: Gemini generation and embeddings |

## Project Structure

```text
chatgpt/
+-- frontend/                    # React single-page application
|   +-- src/
|   |   +-- api/                 # HTTP API helpers
|   |   +-- components/          # App components and UI primitives
|   |   +-- config/              # Axios and authentication interceptors
|   |   +-- layouts/             # Nested route shells
|   |   +-- pages/               # Login, register, home, chat, search, and share pages
|   |   +-- Routes/              # Routing and route guards
|   |   +-- socket/              # Socket.IO client factory
|   |   `-- store/               # Redux slices and async actions
|   +-- README.md                # Frontend-specific documentation
|   `-- package.json
`-- backend/                     # Express API and real-time AI server
    +-- src/
    |   +-- controllers/         # REST handlers
    |   +-- db/                  # MongoDB connection
    |   +-- middlewares/         # JWT authentication middleware
    |   +-- models/              # User, Chat, and Message schemas
    |   +-- routes/              # Auth, chat, and message endpoints
    |   +-- services/            # Gemini and Pinecone services
    |   `-- sockets/             # Socket.IO AI-message handling
    +-- README.md                # Backend-specific documentation
    `-- server.js                # Server entry point
```

For detailed component documentation, see [frontend/README.md](frontend/README.md). For API endpoints, models, Socket.IO events, and backend security notes, see [backend/README.md](backend/README.md).

## Getting Started

### Prerequisites

- Node.js (current LTS recommended)
- npm
- A MongoDB database
- A Google Gen AI API key
- A Pinecone account and an index compatible with the embedding configuration

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment files

Create `backend/.env` and `frontend/.env` using the variable names in the next section. Do not commit either file.

### 3. Run the backend

```bash
cd backend
npm run dev
```

The backend defaults to port `8000` if `PORT` is not set.

### 4. Run the frontend

In another terminal:

```bash
cd frontend
npm run dev
```

Open the local URL printed by Vite. Ensure the configured frontend and backend origins match so CORS, cookies, REST calls, and Socket.IO can connect.

### Production frontend build

```bash
cd frontend
npm run build
```

## Environment Variables

Use placeholders only; do not place actual credentials in documentation or source control.

### `backend/.env`

```env
PORT=<server_port>
MONGO_URI=<mongodb_connection_string>
FRONTEND_URL=<allowed_frontend_origin>
JWT_SECRET=<long_random_jwt_signing_secret>
GEMINI_API_KEY=<google_genai_api_key>
PINECONE_API_KEY=<pinecone_api_key>
PINECONE_INDEX_NAME=<pinecone_index_name>
```

### `frontend/.env`

```env
VITE_BACKEND_URL=<backend_origin>
```

`VITE_BACKEND_URL` is a public browser-side value and must contain the backend origin without `/api`. The Axios client appends `/api` to it. Never expose secrets through `VITE_` variables.

## Text Streaming Flow

```text
React Chat page                 Socket.IO server                    AI and data services
----------------                ----------------                    --------------------
User submits prompt
      |
      | connect with access token, then emit `ai-message`
      | { chat, content, thinkingLevel, stream }
      +------------------------->| Verify JWT and load user
                                 | Save user message to MongoDB
                                 | Create embedding
                                 +-------------------------------> Gemini embeddings
                                 | Query vector memory
                                 +-------------------------------> Pinecone
                                 | Load recent chat history
                                 | Generate response stream
                                 +-------------------------------> Gemini generation
                                 |
      |<------------------------+ emit `ai-chunk` for each text fragment
      | append fragment to live UI
      |
      |<------------------------+ emit `ai-response` with full content and token counts
      | render final Markdown, reset form, disconnect
                                 | Save model message and embedding
                                 +-------------------------------> MongoDB + Pinecone
```

When streaming is disabled, the same process generates a complete response first and the client receives only the final `ai-response` event. Failures are returned as `ai-response-error`.

## Author

Created by **Akber Ali**.

- GitHub: [akbar506](https://github.com/akbar506)
- LinkedIn: [Akber Ali](https://www.linkedin.com/in/akber-ali-dev/)
