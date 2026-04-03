MindX Service AI
A full-stack customer support system built as part of the MindX Digital Softwares internship assignment. It simulates a real SaaS support workflow:
Customer Query → AI Response → Ticket Creation → Admin Management

-------------------------------------------------------------------------------------------------------------------------------------------------------------------
Tech Stack
Backend

Java + Spring Boot
Spring Data JPA
PostgreSQL

Frontend

React.js (Vite)
CSS

-------------------------------------------------------------------------------------------------------------------------------------------------------------------
Project Overview
A simplified AI-powered support system where:

Users send queries through a chat interface
AI generates instant responses (mock AI)
Each query creates a support ticket
Admin can view, manage, and update ticket statuses

-------------------------------------------------------------------------------------------------------------------------------------------------------------------
Day-wise Implementation
Day 1 – Backend Setup
Set up the Spring Boot backend with database design and core APIs.
Entities created: User, Ticket, Message
APIs implemented:
Method            Endpoint            Description
POST              /tickets            Create a new ticket
GET               /tickets            Get all tickets
GET               /tickets/{id}       Get ticket + messages
PostgreSQL connected and verified — data stored and retrieved successfully.

-------------------------------------------------------------------------------------------------------------------------------------------------------------------
Day 2 – AI Integration
Added AI-based response handling with a fallback mechanism.
Flow:

Create ticket
Save user message
Generate AI response (OpenAI or mock fallback)
Save AI message
Return full response

Mock AI Logic:

"order" → asks for order ID
"refund" → connects to support
Default → general response

Full conversation persisted in DB per ticket.

-------------------------------------------------------------------------------------------------------------------------------------------------------------------
Day 3 – Customer Chat UI
Built a customer-facing chat interface using React.js.
Features:

Input box + send button
Chat message display (user right, AI left)
API integration with POST /tickets
Dark, clean chat UI with smooth message flow

-------------------------------------------------------------------------------------------------------------------------------------------------------------------
Day 4 – Admin Dashboard
Built a complete admin control panel for ticket management.
Dashboard:

View all tickets — query, status, created time
Clickable cards to open ticket details
Filter by: All / Open / Resolved / Needs Human

Ticket Detail:

Full conversation view (USER + AI messages)
Status update via PUT /tickets/{id}/status
UI updates instantly on change

-------------------------------------------------------------------------------------------------------------------------------------------------------------------
API Endpoints
Method         Endpoint                Description
POST           /tickets                Create ticket + AI response
GET            /tickets                Get all tickets
GET            /tickets/{id}           Get ticket + messages
PUT            /tickets/{id}/status    Update ticket status

-------------------------------------------------------------------------------------------------------------------------------------------------------------------
Project Structure
Backend (Spring Boot)
systemsupport/
└── src/main/java/com/example/systemsupport/
    ├── controller/
    │   └── TicketController.java
    ├── entity/
    │   ├── User.java
    │   ├── Ticket.java
    │   └── Message.java
    ├── repository/
    │   ├── UserRepository.java
    │   ├── TicketRepository.java
    │   └── MessageRepository.java
    ├── service/
    │   ├── AIService.java
    │   └── TicketService.java
    └── SystemsupportApplication.java
Frontend (React)
frontend/src/
├── components/
│   ├── ChatBox.jsx
│   └── MessageBubble.jsx
├── pages/
│   ├── ChatPage.jsx
│   ├── AdminDashboard.jsx
│   └── TicketDetail.jsx
├── services/
│   └── api.js
├── App.jsx
└── main.jsx
-------------------------------------------------------------------------------------------------------------------------------------------------------------------
Setup Instructions
Backend
bash# Create the database
CREATE DATABASE mindx;

# Configure application.properties with your DB credentials

# Run the server
./mvnw spring-boot:run
Frontend
bashcd frontend
npm install
npm run dev

-------------------------------------------------------------------------------------------------------------------------------------------------------------------
Features Built

Ticket creation with AI response
Full message persistence (user + AI)
Customer chat UI
Admin dashboard with ticket filtering
Ticket status management

-------------------------------------------------------------------------------------------------------------------------------------------------------------------
Future Enhancements

Authentication (Login / Signup)
Real AI integration (OpenAI API)
User-specific ticket views
Real-time chat (WebSockets)
Analytics dashboard

-------------------------------------------------------------------------------------------------------------------------------------------------------------------
Status
Days 1–4 complete  |   Day 5 in progress

Author: Muthiah Kasi
