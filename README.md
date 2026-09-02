<div align="center">

# 💬 ChatBit Support

### Real-time customer support platform — WhatsApp-style chat between clients and agents

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)
[![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)](https://sequelize.org/)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](#-license)

**REST for business logic. Socket.IO for real time. PostgreSQL for truth.**

[Overview](#-overview) •
[Architecture](#-architecture) •
[Tech Stack](#-tech-stack) •
[Getting Started](#-getting-started) •
[API](#-rest-api) •
[Socket Events](#-socketio-events) •
[Database](#-database-schema) •
[Security](#-security) •
[Roadmap](#-roadmap)

</div>

---

> ### 🖼️ Add your screenshots here
> This README reserves image slots below (`docs/screenshots/*.png`) for a client chat view, an agent dashboard, typing indicators, and presence status. Drop your own screenshots or GIFs into a `docs/screenshots/` folder and they'll render automatically — placeholders are marked throughout with `<!-- screenshot -->`.

<p align="center">
  <img src="docs/screenshots/client-chat.png" alt="Client chat view" width="45%">
  <img src="docs/screenshots/agent-dashboard.png" alt="Agent dashboard" width="45%">
</p>

---

## 📖 Overview

**ChatBit Support** is a real-time customer support application, similar to a simplified WhatsApp-style support system. It connects **clients** who need help with **support agents** who provide it — with live messaging, typing indicators, and online/offline presence, all backed by a persistent PostgreSQL database.

| Client can... | Agent can... |
|---|---|
| ✅ Create a support conversation | ✅ View pending conversations |
| ✅ View their conversations | ✅ Join a pending conversation |
| ✅ Send & receive messages in real time | ✅ Chat with the client in real time |
| ✅ See typing indicators | ✅ See typing indicators |
| ✅ See agent online/offline presence | ✅ See client online/offline presence |
| ✅ View message history | ✅ Close a conversation |

<!-- screenshot: docs/screenshots/typing-indicator.png -->
<!-- screenshot: docs/screenshots/presence-status.png -->

---

## 🏗 Architecture

ChatBit combines a **traditional REST API** (for persistent business operations) with **Socket.IO** (for real-time communication) on a single HTTP server.

```
                            ChatBit Backend
                                  │
                 ┌────────────────┴────────────────┐
                 │                                  │
             REST API                           Socket.IO
                 │                                  │
           Business Logic                    Real-Time Logic
                 │                                  │
             PostgreSQL                    Client Connections
                 │                                  │
             Sequelize                       Rooms / Events
```

```mermaid
flowchart TB
    subgraph Frontend
        FE[Web / Mobile Client]
    end

    subgraph Backend["ChatBit Backend (single HTTP server)"]
        REST[Express REST API]
        IO[Socket.IO Engine]
        SVC[Service Layer]
        ORM[Sequelize ORM]
    end

    DB[(PostgreSQL)]

    FE -- "HTTP + JWT" --> REST
    FE -- "WebSocket + JWT" --> IO
    REST --> SVC
    IO --> SVC
    SVC --> ORM
    ORM --> DB
```

**Golden rule of the codebase:**

> 🔑 **REST manages persistent business data and operations. Socket.IO manages real-time communication.** That separation is the foundation of the entire backend.

| Concern | REST | Socket.IO |
|---|---|---|
| Create conversation | ✅ | — |
| Assign / join conversation | ✅ (DB write) | ✅ (room join, notify) |
| Send / persist message | — | ✅ (validate → save → broadcast) |
| Message history / pagination | ✅ | — |
| Typing indicator | — | ✅ (ephemeral, not stored) |
| Presence (online/offline) | — | ✅ (updates `is_online`) |
| Close conversation | ✅ | ✅ (broadcast update) |

---

## 🧰 Tech Stack

<div align="center">

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Web framework** | Express.js |
| **Real-time engine** | Socket.IO |
| **Database** | PostgreSQL |
| **ORM** | Sequelize |
| **Auth** | JWT (JSON Web Tokens) |
| **Password hashing** | bcrypt |
| **Validation** | Zod |
| **API docs** | OpenAPI + Scalar (served at `/docs`) |
| **Dev tooling** | Nodemon, dotenv |

</div>

---

## 📂 Project Structure

```text
src/
├── controllers/           # HTTP request/response handling
├── services/               # Business logic
├── models/                 # Sequelize models (User, Conversation, Message)
├── middlewares/             # Auth, error handling, validation
├── routes/                  # REST route definitions
├── sockets/
│   ├── socket.js            # Central Socket.IO wiring
│   ├── socket.io.js          # Server/adapter setup
│   ├── auth.socket.js         # Handshake JWT verification
│   ├── conversation.socket.js  # Room join/leave, conversation:updated
│   ├── message.socket.js        # message:send / message:new
│   ├── typing.socket.js          # typing:start / typing:stop
│   └── presence.socket.js         # online/offline tracking
├── docs/
│   └── openapi.yaml         # REST API specification (served via Scalar)
└── app.js / server.js       # Express + HTTP server + Socket.IO bootstrap
```

> Splitting `sockets/` by responsibility keeps the real-time layer from collapsing into one giant `socket.js` file.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/chatbit-support.git
cd chatbit-support

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
```

### Environment Variables

```env
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/chatbit
JWT_SECRET=your-super-secret-key
NODE_ENV=development
```

### Run

```bash
# Run database migrations
npx sequelize-cli db:migrate

# Start in development mode (with Nodemon)
npm run dev

# Or start in production
npm start
```

Once running:

- REST API → `http://localhost:3000/api`
- Interactive docs (Scalar) → `http://localhost:3000/docs`
- Socket.IO endpoint → `ws://localhost:3000`

<!-- screenshot: docs/screenshots/api-docs-scalar.png -->

---

## 🔐 Authentication

Authentication is JWT-based and shared between REST and Socket.IO.

```mermaid
sequenceDiagram
    participant U as User
    participant API as REST API
    participant DB as PostgreSQL

    U->>API: POST /api/auth/login (email, password)
    API->>DB: Find user by email
    DB-->>API: User record
    API->>API: bcrypt.compare(password, hash)
    API->>API: Sign JWT { id, role }
    API-->>U: { token }
```

JWT payload:

```json
{
  "id": 1,
  "role": "client"
}
```

**REST requests** authenticate via header:

```http
GET /api/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Socket.IO connections** authenticate at handshake:

```js
const socket = io("http://localhost:3000", {
  auth: { token: JWT }
});
```

```mermaid
flowchart LR
    A[Client connects] --> B[Handshake sends JWT]
    B --> C{verifyToken}
    C -- valid --> D[socket.user set]
    D --> E[Connection accepted]
    C -- invalid --> F[Connection rejected]
```

---

## 🌐 REST API

Full interactive documentation is generated from `openapi.yaml` and served by **Scalar** at `/docs`.

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new client or agent | ❌ |
| `POST` | `/api/auth/login` | Login and receive a JWT | ❌ |
| `GET` | `/api/users/me` | Get current user profile | ✅ |
| `POST` | `/api/conversations` | Create a new conversation (client) | ✅ |
| `GET` | `/api/conversations` | List conversations (own / available) | ✅ |
| `POST` | `/api/conversations/:id/join` | Agent joins a pending conversation | ✅ (agent) |
| `POST` | `/api/conversations/:id/close` | Agent closes a conversation | ✅ (agent) |
| `GET` | `/api/conversations/:id/messages` | Paginated message history | ✅ |

Example — creating a conversation:

```http
POST /api/conversations
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "subject": "I need help"
}
```

Example — paginated history:

```http
GET /api/conversations/1/messages?page=1&limit=20
```

```json
{
  "messages": [ /* ... */ ],
  "pagination": { "page": 1, "limit": 20, "total": 57 }
}
```

---

## ⚡ Socket.IO Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `conversation:join` | client → server | `{ conversationId }` | Join a conversation's Socket.IO room |
| `conversation:updated` | server → clients | `{ conversation }` | Broadcast when status/agent changes |
| `message:send` | client → server | `{ conversationId, content }` | Send a new message |
| `message:new` | server → room | `{ message }` | Broadcast a persisted message |
| `typing:start` | client → server → room | `{ conversationId }` | User started typing |
| `typing:stop` | client → server → room | `{ conversationId }` | User stopped typing |
| `disconnect` | client → server | — | Triggers presence update to offline |

### Message send flow

```mermaid
sequenceDiagram
    participant C as Client Socket
    participant S as Socket.IO Server
    participant SVC as Message Service
    participant DB as PostgreSQL
    participant A as Agent Socket

    C->>S: emit("message:send", { conversationId, content })
    S->>S: Get socket.user (authenticated)
    S->>SVC: validate + authorize
    SVC->>DB: Message.create()
    DB-->>SVC: saved message
    S->>S: io.to("conversation:ID")
    S-->>C: emit("message:new", message)
    S-->>A: emit("message:new", message)
```

### Conversation rooms

Each conversation gets its own Socket.IO room (`conversation:<id>`), so messages only reach participants of that conversation:

```js
io.to(`conversation:${conversationId}`).emit("message:new", message);
```

> **REST vs Socket room** — `POST /api/conversations/:id/join` changes **business state** in the database (the agent is officially assigned). `conversation:join` over Socket.IO changes **real-time room membership** (this connection now receives live events). They are related but distinct.

<!-- screenshot: docs/screenshots/conversation-room.png -->

---

## 🗄 Database Schema

```mermaid
erDiagram
    USER ||--o{ CONVERSATION : "creates (client)"
    USER ||--o{ CONVERSATION : "handles (agent)"
    CONVERSATION ||--o{ MESSAGE : contains
    USER ||--o{ MESSAGE : sends

    USER {
        int id PK
        string full_name
        string email
        string password_hash
        string role "client | agent"
        bool is_online
        datetime created_at
    }

    CONVERSATION {
        int id PK
        string subject
        int client_id FK
        int agent_id FK
        string status "pending | in_progress | closed"
        datetime closed_at
        datetime created_at
    }

    MESSAGE {
        int id PK
        int conversation_id FK
        int sender_id FK
        string content
        bool is_read
        datetime sent_at
    }
```

### Conversation lifecycle

```mermaid
stateDiagram-v2
    [*] --> pending: client creates conversation
    pending --> in_progress: agent joins
    in_progress --> closed: agent closes
    closed --> [*]
```

---

## 🧩 Request Lifecycle (Layered Architecture)

Controllers handle HTTP, services hold business rules, models define structure — kept strictly separate for maintainability.

```mermaid
flowchart LR
    Req[HTTP Request] --> Ctrl[Controller]
    Ctrl --> Svc[Service]
    Svc --> Model[Sequelize Model]
    Model --> DB[(PostgreSQL)]
    DB --> Model --> Svc --> Ctrl --> Res[HTTP Response]

    Ctrl -.error.-> Mid[Error Middleware]
    Mid -.-> Res
```

```js
// Controllers stay thin:
try {
  const result = await conversationService.joinConversation(req.user, req.params.id);
  res.json(result);
} catch (error) {
  next(error); // centralized error handling
}
```

---

## 🛡 Security

- 🔒 Passwords hashed with **bcrypt** — never stored in plain text
- 🔑 JWTs signed with a secret (`JWT_SECRET`) and verified on every protected request
- 🚪 Every protected REST endpoint requires a valid `Authorization: Bearer` token
- 🔌 Every Socket.IO connection is authenticated at handshake
- 👥 Users can only access conversations they're authorized to see
- 🧑‍💼 Only users with the `agent` role can join or close conversations
- ✋ Only the **assigned** agent can close a conversation
- ✍️ Every message is tied to an authenticated sender
- ✅ Conversation access is verified before reading message history

---

## 🧪 Typing & Presence

Typing indicators are **ephemeral** — never persisted to PostgreSQL, purely in-memory Socket.IO events:

```
Client types  →  typing:start  →  Server  →  Agent receives indicator
Client stops  →  typing:stop   →  Server  →  Agent receives indicator
```

Presence is tracked on connect/disconnect:

```
socket connects     → is_online = true
socket disconnects  → is_online = false
```

<!-- screenshot: docs/screenshots/presence-online.png -->

---

## 🗺 Complete Flow (End to End)

```mermaid
flowchart TD
    A[Client creates conversation] -->|POST /api/conversations| B[status: pending]
    B --> C[Agent joins]
    C -->|POST /api/conversations/:id/join| D[status: in_progress]
    D --> E[Real-time messaging]
    E --> F[Typing indicators]
    E --> G[Presence updates]
    D --> H[Agent closes conversation]
    H -->|POST /api/conversations/:id/close| I[status: closed]
```

---

## 📌 Roadmap

- [ ] File & image attachments in messages
- [ ] Push notifications for offline users
- [ ] Agent-to-agent conversation transfer
- [ ] Read receipts (`is_read`) surfaced in UI
- [ ] Admin dashboard & analytics
- [ ] Rate limiting on message sending
- [ ] Multi-language support

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

Built with ❤️ using Node.js, Express, PostgreSQL & Socket.IO

**REST for state. Sockets for speed. PostgreSQL for truth.**

</div>