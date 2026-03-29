# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brain Code is a cognitive training platform for children, featuring 5 brain-region-based mini-games. The project is a full-stack app with a **Next.js frontend** and a **Spring Boot backend**.

## Commands

### Frontend (`braincode/frontend/`)
```bash
npm run dev      # Dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
npm start        # Production server
```

### Backend (`braincode/backend/`)
IntelliJ에서 `BrainCoderApplication.java`의 `main()` 직접 실행 권장.

터미널에서 실행할 경우:
```bash
mvn spring-boot:run     # Dev server at http://localhost:8080
mvn clean package       # Build JAR
mvn test                # Run tests
```

H2 console available at `http://localhost:8080/h2-console` during development.

## Architecture

### Stack
- **Frontend:** Next.js 16.2, React 19, JavaScript (App Router)
- **Backend:** Spring Boot 3.2, Java 17, Spring Security 6, JPA/Hibernate
- **DB:** H2 in-memory (dev) — resets on restart; Redis for token storage
- **Auth:** JWT (JJWT) + OAuth2 (Kakao, Google)

### Backend Package Structure (`com/braincoder/`)
- `controller/` — REST endpoints: `AuthController`, `GameSessionController`, `KidController`, `UserController`
- `service/` — Business logic: `AuthService`, `GameSessionService`, `TokenService`, `CustomOAuth2UserService`
- `entity/` — JPA entities: `User`, `GameSession`, `BrainRegion` (enum), `SessionStatus` (enum)
- `security/` — `JwtTokenProvider`, `JwtAuthenticationFilter`, OAuth2 success/failure handlers
- `dto/` — Request/response DTOs
- `repository/` — Spring Data JPA interfaces

### Frontend App Router Structure (`app/`)
- `game/page.js` + `game/gameData.js` — Main game interface with all 5 brain region games
- `progress/page.js` — Stats dashboard
- `login/page.js`, `signup/page.js` — Auth pages
- `avatar/page.js`, `kid/page.js` — Child profile management

### Auth Flow
1. **Local:** `POST /api/auth/login` → returns `accessToken` (30 min) + sets `refreshToken` as HttpOnly cookie (14 days)
2. **OAuth2:** `/oauth2/authorization/{provider}` → `OAuth2AuthenticationSuccessHandler` → redirects to `http://localhost:5173/oauth2/redirect?token=<TOKEN>`
3. `JwtAuthenticationFilter` intercepts all `/api/**` requests, validates tokens, and checks Redis blacklist
4. Token refresh via `POST /api/auth/refresh`; logout blacklists access token in Redis and deletes refresh token

### Key API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Register |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Rotate tokens |
| POST | `/api/auth/logout` | Blacklist token |
| POST | `/api/sessions/start` | Begin game session |
| POST | `/api/sessions/{id}/end` | Save session result |
| GET | `/api/sessions/stats` | Aggregate stats by brain region |
| GET | `/api/users/me` | Current user profile |

### Brain Regions (Games)
- `FRONTAL` — Number memory (memorize 4-digit number)
- `PARIETAL` — Location finding (3×3 grid, star position)
- `TEMPORAL` — Word memory (pick 3 words from 8 choices)
- `OCCIPITAL` — Shape matching (find all matching shapes)
- `CEREBELLUM` — Reaction time (click on color change)

## Known Limitations
- **Frontend–backend integration is incomplete:** Game results are stored in `localStorage` only; the backend game session endpoints exist but the frontend does not call them.
- **Auth state** is tracked via `localStorage` (`isLoggedIn`, `userEmail`) without backend validation on the frontend side.
- **CORS** is configured for both `localhost:5173` (Vite) and `localhost:3000` (Next.js); OAuth2 redirect URIs point to `localhost:5173`.
- **H2 database** is `create-drop` — all data is lost on restart. Production would require a persistent DB.
- **Kakao OAuth2 credentials** are hardcoded in `application.yml`; Google credentials use `${GOOGLE_CLIENT_ID}` env variable.
