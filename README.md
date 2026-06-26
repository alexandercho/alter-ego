# alter-ego

A TypeScript monorepo for a personal AI chatbot trained on your knowledge base and communication style — so conversations feel like talking to you.

The chatbot uses a RAG (Retrieval-Augmented Generation) pipeline backed by your own writing, notes, and conversational data to produce responses that reflect how you actually think and communicate. The goal is a digital persona that scales: useful as a personal assistant proxy, a portfolio piece, or a shareable artifact of how you work.

## Two Interfaces

**Chat** — the public-facing side. Visitors open a conversation and interact with the chatbot as a stand-in for you: same knowledge, same communication style, same perspective on the things you know about.

**Admin** — password-protected and only for you. Two ways to build the knowledge base:

- **Direct entry** — paste in text, facts, opinions, links, or anything else you want the chatbot to know. Good for structured content you've already written.
- **Profile builder** — a guided interview mode where a second chatbot asks you questions designed to surface the right kind of knowledge: how you think about your work, what you care about, how you'd phrase things. Your answers are embedded directly into the knowledge base. Good for personality, voice, and the kinds of things that are hard to write down without a prompt.

## What's Here

```text
.
├── frontend/   # Expo app (iOS, Android, web)
└── backend/    # Node.js API
```

Database and Terraform config will be added as the infrastructure layer takes shape.

## Stack

- **Language** — TypeScript throughout
- **Frontend** — Expo Router (iOS, Android, web from one codebase)
- **Backend** — Node.js API serving the RAG pipeline and chat endpoints
- **Knowledge base** — ChromaDB vector store populated through conversational intake
- **AI** — OpenAI or Ollama (swappable)
- **Orchestration** — LangChain

## Quick Start

```bash
pnpm install:all
pnpm dev
```

This starts the backend in watch mode and the Expo dev server with Fast Refresh.

You can also run each side independently:

```bash
pnpm start:backend
pnpm start:frontend
```

## Docker

Build and run both apps locally:

```bash
docker compose up --build
```

The backend is available at `http://localhost:3001`, and the exported frontend web app is available at `http://localhost:8080`.

To build the images without starting containers:

```bash
docker compose build
```

## Runtime

- `Node.js 26.x` required
- `pnpm` is the package manager

## Environment

```text
frontend/.env.development   # EXPO_PUBLIC_API_BASE_URL
backend/.env.development    # PORT and API config
```

When testing on a physical device, use your machine's local network IP in `frontend/.env.development`.

## Roadmap

- [ ] Database layer
- [x] Docker configuration
- [ ] Terraform infrastructure
- [ ] Admin auth and access controls
- [ ] Production deployment

## License

MIT
