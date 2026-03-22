# 💸 Secure Money Transfer & Chat System

A full-stack web application that allows users to securely transfer money between accounts and communicate through an integrated real-time chat system. This project simulates a simplified digital wallet environment


## 📌 Features

- **JWT Authentication** — Secure user registration and login
- **Role-Based Authorization** — Separate permissions for Users and Admins
- **Money Transfers** — Send funds to other users with balance validation and atomic transaction handling
- **Transaction History** — View sent and received transactions with filtering
- **Chat System** — Real-time or API-based messaging between registered users
- **Input Validation & Error Handling** — Proper validation across all endpoints
- **Clean Backend Architecture** — Routes, Controllers, and Services separation
- **RESTful API** — Integrated with frontend

---

## 👥 Roles & Permissions

### User
- Register and log in securely
- View account balance
- Transfer money to other users (self-transfer is prevented)
- View transaction history (sent & received)
- Send and receive chat messages
- Update profile information

### Admin
- View all registered users
- Block or activate user accounts
- Adjust user balances
- View all transactions in the system
- Monitor user activity

---

## 🏗️ System Architecture

### Frontend
- Login & Registration pages
- Dashboard with balance display
- Transfer money interface
- Transaction history page
- Chat interface
- Role-based UI rendering

### Backend
- REST API with modular structure
- Authentication & Authorization middleware
- Business logic services
- Database models with relationships:
  - One-to-Many: User → Transactions
  - Many-to-Many: Users ↔ Messages
- Environment variable configuration

### Database
- `Users`
- `Transactions`
- `Messages`

---

## 🚀 Development Plan (Scrum)

| Sprint | Goal |
|--------|------|
| Sprint 1 | Project setup & Authentication |
| Sprint 2 | Authorization & User management |
| Sprint 3 | Money transfer core logic |
| Sprint 4 | Chat system implementation |
| Sprint 5 | Testing, security improvements & deployment |

---

## 🔐 Security Considerations

- JWT-based stateless authentication
- Role-based access control on all restricted endpoints
- Balance validation before any transfer
- Atomic transaction handling to prevent race conditions
- Self-transfer prevention

---

## 📄 License

This project is intended for portfolio and educational purposes.
