# VAWD Image Search

VAWD Image is a powerful, next-generation image search engine that leverages a Retrieval-Augmented Generation (RAG) pipeline to understand and find images based on their visual content rather than just relying on text labels.

## Why VAWD Image?

Traditional image search systems primarily work by matching search queries against manually entered tags, file titles, and descriptions. This approach is prone to returning irrelevant results or missing the right images if they lack exhaustive text metadata.

**VAWD Image** solves this problem by using the power of RAG and advanced AI. Instead of looking for keyword matches, it 'looks' at the images themselves, mapping visual concepts to search queries to provide the user with highly accurate and desired results.

---

## Architecture Overview

VAWD Image follows a **microservices architecture** with three distinct services communicating through an event-driven pipeline:

```
┌─────────────────┐       HTTP        ┌──────────────────┐      Kafka       ┌──────────────────────┐
│   vawd_client   │ ◄──────────────► │    vawd_auth     │ ◄─────────────► │   Model Backend      │
│   (Next.js)     │                   │   (Go / Gin)     │                  │   (Python / FastAPI)  │
│   Port: 3000    │                   │   API Gateway     │                  │   CLIP + Pinecone    │
└─────────────────┘                   └──────┬───────────┘                  └──────────────────────┘
                                             │                                        │
                                             ▼                                        ▼
                                      ┌──────────────┐                        ┌──────────────┐
                                      │  PostgreSQL  │                        │   Pinecone   │
                                      │  (Users/DB)  │                        │ (Vector DB)  │
                                      └──────────────┘                        └──────────────┘
                                             │
                                             ▼
                                      ┌──────────────┐
                                      │   AWS S3     │
                                      │ (Image Store)│
                                      └──────────────┘
```

---

## Services

### `vawd_client` — Frontend (Next.js)

The user-facing application built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

| Detail      | Value                              |
| ----------- | ---------------------------------- |
| Framework   | Next.js 16.2.2                     |
| Language    | TypeScript 5                       |
| Styling     | Tailwind CSS v4 (PostCSS plugin)   |
| React       | React 19.2.4                       |
| Dev Server  | `localhost:3000`                   |

**Key Pages & Components:**

- **`/` — Landing Page** — Hero section with animated CLIP/Pinecone badge, feature grid (Visual Understanding, Blazing Fast, RAG Pipeline, 512-D Embeddings, Natural Language, Secure & Private), stats bar, "How it works" steps, and CTA.
- **`/login` — Login Page** — Authentication form connected to the auth service.
- **`/signup` — Signup Page** — User registration form (first name, last name, username, email, password).
- **Theme System** — Dark/light mode toggle via React Context (`ThemeProvider`), persisted across sessions.
- **`Navbar`** — Shared navigation component with theme toggle.

**Running the client:**

```bash
cd vawd_client
npm install
npm run dev
```

---

### `vawd_auth` — API Gateway & Auth Service (Go / Gin)

The backend gateway and authentication layer built with **Go** and the **Gin** web framework. It serves as the single entry point for the frontend, handling user management, authentication, and proxying requests to the model backend.

| Detail      | Value                                |
| ----------- | ------------------------------------ |
| Language    | Go 1.26                             |
| Framework   | Gin (gin-gonic/gin v1.12)            |
| ORM         | GORM v1.31 (PostgreSQL driver)       |
| Database    | PostgreSQL (via `pgx` driver)        |
| Auth        | bcrypt password hashing (`golang.org/x/crypto`) |
| Config      | godotenv + envconfig                 |
| CORS        | gin-contrib/cors (allows `localhost:3000`) |

**Database Models:**

- **`User`** — Core identity, uses UUID primary keys with auto-generation (`gen_random_uuid()`). Has cascading one-to-one relationship with `Profile` and one-to-many with `Image`.
- **`Profile`** — User details: email (unique), first name, last name, username (unique), profile pic URL, and bcrypt-hashed password.
- **`Image`** — Uploaded image metadata: name, URL (unique), linked to a user.

**API Routes:**

| Method | Endpoint        | Handler            | Description                      |
| ------ | --------------- | -------------------|--------------------------------- |
| GET    | `/`             | inline             | Health check                     |
| POST   | `/auth/create`  | `user.CreateUser`  | Register a new user + profile    |

**Running the auth service:**

```bash
cd vawd_auth
# Ensure .env is configured (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, APP_PORT)
go run .
```

---

### Model Backend — CLIP Inference Service (Python / FastAPI)

The ML inference service responsible for generating image embeddings and performing vector similarity search.

| Detail       | Value                              |
| ------------ | ---------------------------------- |
| Language     | Python 3.x                         |
| Framework    | FastAPI                            |
| Model        | OpenAI CLIP                        |
| Vector DB    | Pinecone                           |
| Pkg Manager  | uv                                 |

**API Routes:**

| Prefix   | Description                                       |
| -------- | ------------------------------------------------- |
| `/model` | CLIP model inference — embedding generation       |
| `/user`  | Client-facing endpoints for search & upload       |
| `/check` | Test endpoint for image upload validation         |

---

## Under the Hood

### OpenAI CLIP Model

At the core of the RAG pipeline is the **CLIP** (Contrastive Language-Image Pre-training) model by OpenAI. CLIP is uniquely capable of understanding the relationship between visual content and natural language. When processing images, the model extracts deep semantic features and produces a dense vector embedding with a precise `(1, 512)` shape dimension. This consistently sized, rich 512-dimensional array perfectly captures the visual essence of the image.

### Pinecone Vector Database

To manage and search through these complex mathematical representations, VAWD uses **Pinecone**, a purpose-built vector database. Pinecone is designed to store and index high-dimensional machine learning embeddings efficiently. By saving our `(1, 512)` CLIP embeddings directly in Pinecone, we achieve massive scalability and lightning-fast similarity search performance, ensuring queries return visual matches almost instantly.

---

## Infrastructure

### AWS S3 — Image Storage

All user-uploaded images are stored in **Amazon S3** buckets. This provides:

- **Durability** — S3 offers 99.999999999% (11 nines) durability, ensuring images are never lost.
- **Scalability** — Seamlessly handles storage from a handful of images to billions without provisioning.
- **CDN-ready** — S3 objects can be served directly via CloudFront for low-latency delivery to the frontend.
- **Decoupled storage** — Keeps binary image data out of PostgreSQL. The database only stores the S3 object URL, keeping queries fast and the database lean.

**Flow:** Client uploads an image → `vawd_auth` stores the file in S3 → the S3 URL is saved to the `Image` table → the URL is passed to the model backend for embedding generation.

### Apache Kafka — Event Streaming

Kafka acts as the **asynchronous communication backbone** between the Go auth service and the Python model backend. Instead of the auth service making synchronous HTTP calls to the model backend (which would block on potentially slow ML inference), it publishes events to Kafka topics.

**Why Kafka?**

| Benefit                    | Description                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **No LLM Overload**       | The model backend consumes messages at its own pace. Burst traffic from the frontend doesn't flood the GPU. |
| **Backpressure Handling**  | If the inference service is busy or down, messages queue in Kafka and are processed when capacity is available. |
| **Decoupled Services**     | The auth service doesn't need to know the model backend's address, health, or response time.                |
| **Reliability**            | Kafka persists messages to disk. Even if the model backend crashes, no upload events are lost.              |
| **Horizontal Scaling**     | Multiple model backend instances can share a Kafka consumer group, parallelising embedding generation.      |
| **Event Replay**           | Re-process historical uploads (e.g., after a model upgrade) by replaying the topic from an offset.          |

**Event Flow:**

```
  User uploads image
        │
        ▼
  vawd_auth (Go/Gin)
    1. Validates auth token
    2. Uploads image binary to S3
    3. Saves Image record (S3 URL) in PostgreSQL
    4. Publishes "image.uploaded" event to Kafka
        │
        ▼
  ┌───────────────┐
  │  Kafka Topic   │   ──►  "image.uploaded"
  │  (persistent)  │        { userId, imageId, s3Url }
  └───────────────┘
        │
        ▼
  Model Backend (Python/FastAPI)
    1. Consumes "image.uploaded" event
    2. Downloads image from S3
    3. Runs CLIP inference → 512-d embedding
    4. Upserts embedding into Pinecone
    5. (Optional) Publishes "embedding.ready" event
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 and **npm**
- **Go** ≥ 1.26
- **Python** ≥ 3.11 with **uv**
- **PostgreSQL** instance
- **Pinecone** API key
- **AWS** credentials (S3 access)
- **Kafka** broker (local or managed)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/abhishek-Rj/vawd-image.git
cd vawd-image

# 2. Start the model backend
uv sync
uv run fastapi dev app/main.py

# 3. Start the auth service
cd vawd_auth
cp .env.example .env   # Configure database + S3 + Kafka settings
go run .

# 4. Start the frontend
cd vawd_client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the application.

---

## Tech Stack Summary

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Frontend     | Next.js 16, React 19, Tailwind v4, TypeScript |
| API Gateway  | Go 1.26, Gin, GORM, PostgreSQL     |
| ML Backend   | Python, FastAPI, OpenAI CLIP        |
| Vector DB    | Pinecone                            |
| Object Store | AWS S3                              |
| Streaming    | Apache Kafka                        |
| Auth         | bcrypt, JWT (planned)               |

---

## License

© 2026 VAWD Image. All rights reserved.
