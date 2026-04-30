# Project Codebase Architecture & Structure

This document outlines the in-depth architecture and code structure of the Full-Stack Next.js 16 Application, integrated with PostgreSQL and Python-based AI models via Docker. It functions as an AI-Adaptive Onboarding Engine / Test Conduction and Assessment Software (TCAS).

## 1. The Frontend Routing Layer (`/src/app`)
The application uses Next.js Route Groups (`(...)` syntax) to enforce specific layouts across different sections without affecting the URL structure.

*   **Public/Landing Pages**: Located directly in `/app` (e.g., `/how-it-works`, `/features`, `/analysis-preview`).
*   **Authentication Hub (`/src/app/(auth)`)**: Contains the `/login` and `/signup` routes.
*   **Authenticated Dashboard (`/src/app/(main)`)**: Contains the private experiences for logged-in users.
    *   `/home`: The main user dashboard.
    *   `/history`: A log of previously taken tests and scores.
    *   `/analysis`: Detailed, AI-driven feedback reports on taken tests.
    *   `/profile`: User settings.
*   **Test Conduction Pages**: Top-level routes like `/test-generator` and `/test` handle the heavily interactive workflows of creating and participating in a live assessment.

## 2. Next.js API Layer (`/src/app/api`)
The backend is a segmented REST architecture built via Next.js Route Handlers, cleanly separated into distinct domains:
*   `/api/auth`: Handles Better-Auth session management.
*   `/api/generate-test`: Interface for prompting the Question Paper AI Model (Model 1).
*   `/api/test-init` & `/api/ongoing-tests`: Manages the state and security of tests right before and while they are being taken.
*   `/api/analyze` & `/api/test-results`: Pushes test submissions to Model 2 and retrieves the processed results.

## 3. Server Actions (`/src/actions`)
React Server Actions are used to safely handle sensitive database mutations without exposing endpoints.
*   `submit-test.ts`: Securely packages and submits a finalized test to the database.
*   `update-test-response.ts`: A real-time action meant to autosave a student's answer as they toggle options.
*   `get-current-time.ts`: Used to enforce strict time limits and prevent users from tampering with their system clocks during a test.

## 4. Database Schema Structure (`/src/db/schema`)
The database schema is highly normalized and modularized into distinct domains:
*   **User/Identity Layer**: `auth-schema.ts` (Handles Users, Sessions, Accounts).
*   **Assessment Layer**: `questionPapers.ts` (The test itself) and `questions.ts` (Individual questions inside the test).
*   **Session/Action Layer**: As a user takes a test, records are saved in `testSession.ts`, `responses.ts`, and optionally tracked dynamically in `responsesHistory.ts`.
*   **Evaluation Layer**: Upon finishing, data flows into `testResults.ts` and general `results.ts`.
*   **Categorization/Taxonomy**: The `tags.ts`, `tagsQp.ts`, and `tagsQuestion.ts` relationships provide a powerful many-to-many tagging mechanism, allowing categorization of questions by difficulty, subject, or AI-generated metadata.

## 5. Dockerized Microservices Architecture
The infrastructure defined in `docker-compose.yaml` links the full stack via a custom bridge network (`se_project_network`), allowing seamless internal communication. It establishes 3 main continuous services:
1.  **`next-app` (Port 3000)**: React frontend and Node backend.
2.  **`postgres` (Port 5432)**: Automatically provisions a Postgres database directly mapped to an external docker volume (`postgres-data`) for persistent storage.
3.  **`model2-service` (Port 8002)**: Python-based AI Performance Analyzer (`models/model2_analyzer`). It is built from its own internal `Dockerfile` and runs as a REST API that the Next.js app queries internally.

*(The separate `docker-compose-feature-qp.yaml` allows spinning up the Question Paper Generator AI alongside these core services).*

## 6. Shared Utilities & State Management (`/src/lib`)
*   **`modify-test-state.ts`**: Contains critical state management logic needed for conducting live assessments (e.g., timers, navigation, autosaves).
*   **`auth.ts` / `auth-client.ts`**: Implements `better-auth/drizzle-adapter` over Auth.js or Clerk. This manages authentication tokens directly inside the Postgres database for complete data ownership.
