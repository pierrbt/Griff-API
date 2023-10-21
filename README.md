# Griff's API

Welcome to the Griff's API, a backend service for a game launcher application. This API provides various endpoints to handle user authentication, user management, game-related operations, and more.

## Routes

- **POST /login**
    - Authenticate user and generate access token.

- **GET /user/verify**
    - Verify user authentication.

- **GET /user/:id**
    - Get user details by ID.

- **POST /user**
    - Create a new user.

- **PUT /user**
    - Update user information.

- **DELETE /user**
    - Delete user account.

- **GET /game/:id**
    - Get game details by ID.

- **GET /**
    - Welcome message and API overview.

## Setup

1. Install dependencies: `npm install`
2. Set up your environment variables by creating a `.env` file. Refer to `.env.example` for required variables.
3. Run the development server: `npm run dev`

## Usage

1. **Authentication**
    - Use the `/login` endpoint to authenticate users and obtain an access token. Include the token in the Authorization header for authenticated requests.

2. **User Management**
    - Create, update, or delete user accounts using the respective endpoints.
    - Verify user authentication status using `/user/verify`.

3. **Game Operations**
    - Retrieve game details by ID using `/game/:id`.

## Dependencies

- **express**: Web framework for Node.js.
- **bcrypt**: Library for hashing passwords.
- **jsonwebtoken**: JSON Web Token implementation for authentication.
- **cors**: Middleware for enabling CORS in Express.
- **helmet**: Security middleware to set various HTTP headers.
- **express-rate-limit**: Rate limiting middleware for Express.
- **dotenv**: Module for loading environment variables from a `.env` file.
- **prisma**: Database ORM for SQLite.

## Scripts

- `npm run dev`: Start the development server using `ts-node`.
- `npm run format`: Format code using Prettier.
- `npm run build`: Build the TypeScript source files.
- `npm run setup`: Generate Prisma client and set up the database.
- `npm run serve`: Start the server using compiled JavaScript files.

## Todo

- [ ] Enhance routes naming convention.
- [ ] Add Zod for request validation.
- [ ] Add admin endpoints for admin user management.
- [ ] Add endpoint for game creation and update operations.
- [ ] Implement admin authentication middleware for protected routes.
- [ ] Enhance API documentation and generate API specifications.
- [ ] Implement logging and monitoring for better error tracking.

Feel free to contribute to the development of this API! If you have any questions or need further assistance, please don't hesitate to reach out. Happy coding!