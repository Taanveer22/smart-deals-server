# ⚙️ Smart Deals Server

Alhamdulillah, **Smart Deals Server** is the backend service for the Smart Deals marketplace platform. It provides secure APIs for user management, product listings, and bidding operations. The server integrates Firebase Admin SDK for authentication, MongoDB for data persistence, and Express.js for routing, ensuring scalability and reliability.

---

## ✨ Key Features

### 🔐 Authentication & Security

- **Firebase Admin SDK** setup for verified token management.
- **Firebase token verification** implemented for secure API access.
- Gmail login issue resolved (June 4, 2026).
- Environment encoding issue fixed for deployment stability.

### 📦 Data Management

- **Users collection CRUD operations** completed.
- **Bids collection CRUD operations** implemented.
- **Bidders list API** created and working perfectly.
- MongoDB operators (`sort`, `limit`, `skip`, `project`) used for efficient queries.
- All three collections integrated and functioning correctly.

### 🚀 Deployment & Testing

- Deployment settings configured for production.
- Tested with **Thunder Client** inside VS Code.
- Server-side setup completed and verified.

---

## 🛠️ Tech Stack

| **Category**                      | **Tools & Packages**                                                        |
| --------------------------------- | --------------------------------------------------------------------------- |
| **Server Framework**              | [Express](ca://s?q=Express_JS_overview)                                     |
| **Database**                      | [MongoDB](ca://s?q=MongoDB_overview)                                        |
| **Authentication**                | [Firebase Admin SDK](ca://s?q=Firebase_Admin_SDK)                           |
| **Environment Management**        | [dotenv](ca://s?q=dotenv_package)                                           |
| **Cross-Origin Resource Sharing** | [CORS](ca://s?q=CORS_in_Express)                                            |
| **Deployment**                    | [Render](ca://s?q=Render_server_hosting), [Vercel](ca://s?q=Vercel_hosting) |

---

## 📅 Development Timeline

- **May 25, 2026:** Server-side setup, Thunder Client testing with MongoDB.
- **May 26, 2026:** Basic CRUD operations, bids collection CRUD, users create operation.
- **June 1, 2026:** Bidders list API created, all collections working correctly.
- **June 3, 2026:** Firebase Admin SDK setup, token verification, deployment settings added, env encoding issue solved.
- **June 4, 2026:** Gmail login issue resolved ✅

---

## 📖 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/taanveer22/smart-deals-server.git
cd smart-deals-server
```
