# Collaborative Travel Planner

A production-grade full-stack application for planning trips, collaborating on itineraries, and splitting expenses with an optimized Min Cash Flow algorithm.

## Technologies Used

**Backend:**
- Java 17
- Spring Boot 3.x
- Spring Security (JWT Stateless Authentication)
- PostgreSQL & Spring Data JPA
- WebSocket (STOMP) for Real-time Updates

**Frontend:**
- React Native (Expo)
- Redux Toolkit
- React Navigation
- Axios

## Features Implemented

1. **Authentication System** (JWT + BCrypt)
2. **Trip Management** (Create, Join via code, Roles)
3. **Itinerary Collaboration** (Day-wise timeline, CRUD)
4. **Expense Splitting System** (Equal, Exact, Percentage, Shares)
5. **Debt Simplification Engine** (Min Cash Flow algorithm in Java)
6. **Document Vault** (File upload logic)
7. **Voting/Poll System** (Single/Multi-choice polls)
8. **Offline Caching & State Management** (Redux + AsyncStorage)

## Running the Application

### Backend (Spring Boot)
1. Ensure PostgreSQL is running on `localhost:5432` with username `postgres` and password `postgres`, and an empty database named `travel_planner`.
2. Navigate to `backend/`
3. Run using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
*(Note: If the Maven wrapper is missing or corrupt, you can install Maven globally and run `mvn spring-boot:run`)*

### Frontend (React Native / Expo)
1. Navigate to `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npx expo start
   ```

## Architecture Details

- **Expense Splitting Algorithm:** The backend implements a greedy Minimum Cash Flow algorithm to simplify debts. Time Complexity: O(N log N) for sorting members by balance, Space Complexity: O(N).
- **Offline First Frontend:** The React Native app uses Redux Toolkit for state management and `AsyncStorage` for token persistence. 
- **Security:** Fully protected REST APIs via `JwtAuthenticationFilter`, returning standard JSON errors for unauthorized or invalid requests.
