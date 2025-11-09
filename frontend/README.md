# SlotSwapper

SlotSwapper is a peer-to-peer time-slot swapping application that allows users to create, manage, and exchange calendar events with others. The concept is simple: users can mark any of their busy time slots as swappable, browse other users’ available swappable slots, and request a swap. If the other user accepts, both events are automatically exchanged in the database and reflected instantly in their respective calendars. This project was designed with a focus on practical full-stack skills, efficient data modeling, secure API handling, and smooth frontend state management. The system follows a clean REST architecture, ensuring modular backend logic and seamless UI updates without page reloads. Design choices include the use of React.js for a dynamic and component-based frontend, Express.js with Node.js for handling REST APIs, Prisma ORM for interacting with a MySQL database, and JWT for authentication and session security. SweetAlert2 was used to enhance user experience through modern and responsive alert popups, while CSS ensures a minimalist and mobile-friendly interface.  

To run the project locally, first clone the repository using `git clone https://github.com/NagaOmSriKosana/SwapSync.git` and navigate into it using `cd SlotSwapper`. Inside the `backend` folder, install dependencies with `npm install`. Then create a `.env` file with the following variables:  
`DATABASE_URL="mysql://root:yourpassword@localhost:3306/slotswapper"`  
`JWT_SECRET="yoursecretkey"`  
`PORT=4000`  
After saving, initialize the Prisma schema by running `npx prisma generate` followed by `npx prisma migrate dev --name init`. Start the backend with `npm run dev`, which runs the API on `http://localhost:4000`. Then move to the frontend using `cd ../frontend`, install dependencies with `npm install`, and start the React development server using `npm start`. The application will open on `http://localhost:3000`. You can now sign up as a new user, log in, and begin creating events.  

Once logged in, each user can create events with a title, start time, and end time. Events are initially created with a status of BUSY. A user can mark any event as SWAPPABLE, making it visible to others in the marketplace. The marketplace displays swappable events from all other users, excluding the logged-in user’s own slots. Clicking “Request Swap” allows a user to select one of their swappable events as an offer. The backend verifies that both slots exist and are marked as swappable before creating a swap request and updating both slots to SWAP_PENDING to prevent multiple requests. The recipient of the request can view it in their Requests section and either Accept or Reject it. Accepting swaps the ownership of both events and marks them as BUSY again, while rejecting resets both slots to SWAPPABLE. All actions trigger instant UI updates with success or error popups, ensuring a smooth user experience.

The available API endpoints include:  
`POST /api/auth/signup` — create a new user (body: `{name, email, password}`)  
`POST /api/auth/login` — authenticate user and return a JWT token  
`GET /api/events` — get the logged-in user’s events  
`POST /api/events` — create a new event (body: `{title, startTime, endTime}`)  
`PUT /api/events/:id` — update event status (body: `{status}`)  
`GET /api/swappable-slots` — get swappable slots from other users  
`POST /api/swap-request` — create a swap request (body: `{mySlotId, theirSlotId}`)  
`GET /api/swap-requests` — fetch both incoming and outgoing requests  
`POST /api/swap-response/:requestId` — accept or reject a swap request (body: `{accept: true|false}`)  
All protected routes require a header: `Authorization: Bearer <token>`. The backend ensures that swap transactions are atomic, meaning both event records are updated together to maintain data consistency.  

Assumptions made during development include storing timestamps as UTC ISO strings and managing event ownership via foreign key relationships in Prisma. Event statuses follow a strict lifecycle — BUSY → SWAPPABLE → SWAP_PENDING → BUSY — preventing logical conflicts. Each request can only be accepted or rejected once to avoid duplicate state changes. Client-side validation ensures proper email formatting (must include “@” and “.com”) and strong passwords (minimum six characters, one uppercase letter, and one number). Challenges faced included implementing atomic swap logic to ensure consistent updates across both users’ calendars, avoiding race conditions during simultaneous swap requests, and maintaining a reactive user interface without page reloads. These were resolved by using Prisma transactions, Axios state updates, and React hooks for dynamic UI refresh.  

This project successfully demonstrates full-stack development using a secure authentication system, structured backend logic, efficient database schema, and responsive user interface. It combines practical CRUD operations, relational modeling, API design, and front-end state management into a cohesive, production-ready workflow.
