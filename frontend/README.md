# Frontend

## Overview

The frontend is a React single-page application for creating, viewing, searching, sharing, and continuing AI chats. It provides authentication screens, a protected chat workspace, streamed AI response rendering, light/dark theme support, client-side form validation, and responsive UI components.

## Technologies

- React 19 and React DOM
- Vite 8 with the React plugin
- React Router DOM 7
- Redux Toolkit and React Redux
- Tailwind CSS 4, Tailwind Typography, and `tw-animate-css`
- shadcn/ui components built with Base UI primitives
- Lucide React icons
- React Hook Form, Zod, and `@hookform/resolvers`
- Axios for HTTP requests and Socket.IO Client for real-time chat
- `react-markdown`, `remark-gfm`, and `rehype-highlight`
- `next-themes` for system, light, and dark themes
- Sonner for toast notifications

## Folder Structure for Frontend

```text
frontend/
+-- public/                       # Static assets served unchanged by Vite
|   `-- favicon.ico
+-- src/
|   +-- api/                      # Focused API helper functions
|   +-- components/               # Application components, icons, and UI primitives
|   |   +-- icon/                 # Custom GitHub and LinkedIn icons
|   |   `-- ui/                   # shadcn/ui-style reusable components
|   +-- config/                   # Axios client and authentication interceptors
|   +-- hooks/                    # Reusable React hooks
|   +-- layouts/                  # Route layouts for app, auth, and shared screens
|   +-- lib/                      # Shared utilities
|   +-- pages/                    # Route-level page components
|   +-- Routes/                   # Route definitions and access guards
|   +-- schema/                   # Zod validation schemas
|   +-- socket/                   # Socket.IO client factory
|   +-- store/                    # Redux store, slices, and async actions
|   +-- App.jsx                   # Application-level providers/UI shell
|   +-- index.css                 # Tailwind imports, global styles, and theme tokens
|   `-- main.jsx                  # React entry point
+-- components.json               # shadcn/ui configuration and aliases
+-- vite.config.js                # Vite, React, Tailwind, and @ alias configuration
`-- package.json
```

## Installation

```bash
cd frontend
npm install
```

## Run

Start the Vite development server:

```bash
npm run dev
```

Vite prints the local development URL after startup.

## Build

Create an optimized production build:

```bash
npm run build
```

Optionally serve the generated build locally:

```bash
npm run preview
```

Run the configured ESLint checks with:

```bash
npm run lint
```

## Environment Variables

Create `frontend/.env` with the backend origin used by Axios and Socket.IO. Values must begin with `VITE_` to be exposed to the browser by Vite.

```env
VITE_BACKEND_URL=<backend_origin>
```

For example, the value should be the server origin only, without `/api`, because the Axios instance appends `/api` itself. This value is public client configuration; never place secrets in a `VITE_` variable.

## State Management

Redux Toolkit provides a single store, mounted through React Redux's `Provider` in `main.jsx`.

| Slice | Stored state | Main responsibilities |
| --- | --- | --- |
| `auth` | Access token, authentication flag, auth error | Stores access tokens after login/register/refresh and clears session state on logout or refresh failure. |
| `user` | User profile, profile visibility, error | Holds the signed-in user's profile and controls the profile panel. |
| `chat` | Conversation list, active chat ID, initial message, loading, error | Loads, creates, deletes, and tracks chats; preserves the first prompt so it can be sent after navigation to a new chat. |

Async Redux actions use Axios to authenticate, fetch chats, create chats, and delete chats. The Axios request interceptor attaches the Redux access token as a Bearer token. Its response interceptor refreshes expired access tokens, queues concurrent failed requests during a refresh, retries them with the renewed token, and redirects to `/login` if session restoration fails.

## Routing

The app uses `BrowserRouter`, nested layouts, lazy-loaded route components, and access guards.

| Route | Access | Component / purpose |
| --- | --- | --- |
| `/login` | Public only | Login form; authenticated users are redirected to `/`. |
| `/register` | Public only | Registration form; authenticated users are redirected to `/`. |
| `/share/:shareToken` | Public | Displays a shared conversation without requiring a session. |
| `/` | Protected | Home screen for starting a chat. |
| `/search` | Protected | Filters loaded chats by title in the browser. |
| `/chat/:id` | Protected | Chat interface, message history, streaming controls, and token metadata. |

`ProtectedRoute` and `PublicRoute` restore the session using the refresh-cookie flow before rendering their nested routes. `AppLayout` supplies the sidebar and protected application header; `AuthLayout` centers authentication pages; `UnAuthLayout` wraps public shared-chat content.

## UI Libraries

The visual layer uses Tailwind CSS for utility classes and theme tokens. `@tailwindcss/typography` styles rendered Markdown via the `prose` classes, and `tw-animate-css` supplies animation utilities.

Reusable controls under `src/components/ui/` follow the shadcn/ui component pattern and are configured by `components.json`. They include buttons, fields, inputs, dialogs/dropdowns, sidebar primitives, select controls, switches, tooltips, toast UI, and more. The project uses Base UI as a primitive dependency and Lucide React for interface icons.

`ThemeProvider` wraps `next-themes`, applies theme state through the document `class` attribute, uses the system preference by default, and supports dark-mode Tailwind classes. Sonner displays toast notifications, while `ResponseInfo` provides copy-to-clipboard and token-usage controls for model answers.

## Markdown Rendering

`MarkdownRender` renders model output with `react-markdown`.

- `remark-gfm` enables GitHub Flavored Markdown features such as tables, task lists, strikethrough, and autolink literals.
- `rehype-highlight` applies syntax highlighting to code blocks.
- Tailwind Typography provides readable default formatting through `prose dark:prose-invert`.
- User-authored messages are rendered as plain text; only messages with the `model` role are interpreted as Markdown.

## Folder Explanation

### `src/api`

Contains small API-oriented functions for refreshing a session, logging out, loading messages or shared chats, and sharing chats. Redux async actions make their own API calls for authentication and chat-list operations.

### `src/components`

Contains components shared across pages: the navigation sidebar, profile display, response metadata, toast helper, Markdown renderer, theme provider, and custom social icons. `components/ui` contains the reusable design-system controls used to compose these features.

### `src/config`

Defines the shared Axios instance. `axiosConfig.js` sets the backend API base URL and sends cookies; `interceptorConfig.js` injects the Redux store, adds the access-token header, refreshes expired sessions, and retries queued requests.

### `src/hooks`

Holds reusable hooks. `usePageTitle` updates the browser tab title for pages and chats; `useIsMobile` tracks the responsive breakpoint used by UI components.

### `src/layouts`

Provides nested route shells. The application layout includes the sidebar, application actions, and content outlet. Authentication and unauthenticated layouts provide minimal page wrappers for their respective route groups.

### `src/lib`

Contains low-level shared helpers, currently `cn`, which safely combines conditional class names with Tailwind class conflict resolution.

### `src/pages`

Contains route-level React components: Home starts a new chat, Chat manages live conversation UI, Login and Register manage authentication forms, Search filters conversations, and Share shows a public shared chat.

### `src/Routes`

Defines all client routes and their lazy imports. `ProtectedRoute` prevents access without a restored session, and `PublicRoute` sends signed-in users away from login/register pages.

### `src/schema`

Defines Zod schemas used with React Hook Form. They validate login, registration, initial chat prompts, and message payloads before client submission.

### `src/socket`

Creates authenticated Socket.IO clients. The chat page opens a socket for a submitted prompt, receives optional streamed chunks, handles the final response or error, and closes the socket after completion.

### `src/store`

Defines the Redux store and feature folders for `auth`, `user`, and `chat`. Each feature includes a slice for synchronous state transitions; auth and chat also include thunk-style async action creators.

### `public`

Contains static files copied directly into Vite's output, currently the application favicon.
