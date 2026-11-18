# Backend Web Development Tutorial – Node.js, Express & MongoDB

This project is a complete backend implementation built by following the **Intro to Backend Web Development** tutorial (freeCodeCamp / Hack Club). It demonstrates how to build a scalable RESTful API with user authentication and full CRUD (Create, Read, Update, Delete) operations using Node.js, Express.js, and MongoDB Atlas.

---

## 📌 Project Overview & Tech Stack

- **Runtime Environment:** [Node.js](https://nodejs.org/) (JavaScript runtime)
- **Web Framework:** [Express.js](https://expressjs.com/) (Routing & Middleware)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloud NoSQL Database)
- **ODM (Object Data Modeling):** [Mongoose](https://mongoosejs.com/)
- **Security:** [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) (Password hashing)
- **CORS Management:** [Cors](https://www.npmjs.com/package/cors)
- **Environment Management:** [Dotenv](https://www.npmjs.com/package/dotenv)
- **Dev Tooling:** [Nodemon](https://nodemon.io/) (Hot-reloading during development)
- **API Testing:** [Postman Desktop App](https://www.postman.com/)

---

## 📁 Project Architecture & Folder Structure

This project follows the industry-standard **Model-Route-Controller (MVC)** architectural pattern:

```text
intro-to-backend/
├── .env                     # Private environment variables (ignored by git)
├── .env.example             # Example environment variable template
├── .gitignore               # Ignored files (node_modules, .env)
├── package.json             # Dependencies and scripts (ES Modules enabled)
├── Postman_Collection.json  # Exported Postman collection for 1-click testing
├── README.md                # Documentation and evaluation guide
└── src/
    ├── app.js               # Express application configuration & middleware
    ├── constants.js         # App-wide constants (DB name, etc.)
    ├── database.js          # MongoDB connection handler via Mongoose
    ├── index.js             # Entry point (connects DB and starts server)
    ├── controllers/         # Business logic
    │   ├── post.controller.js
    │   └── user.controller.js
    ├── models/              # Mongoose schemas & data definitions
    │   ├── post.model.js
    │   └── user.model.js
    └── routes/              # Express API route endpoints
        ├── post.routes.js
        └── user.routes.js
```

---

## 🚀 Step-by-Step Implementation Guide

### a) Create Node Project & Add to GitHub

1. **Install Prerequisites on your laptop:**
   - [Node.js (LTS Version)](https://nodejs.org/)
   - [Git for Windows](https://git-scm.com/download/win)
2. **Install Project Dependencies:**
   ```bash
   npm install
   ```
3. **Initialize Git and Push to your GitHub Repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Complete Backend CRUD API with Express and MongoDB"
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
   git push -u origin main
   ```

---

### b) Setup Online MongoDB Account & Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. **Create a Free Cluster:** Select the **M0 Free Tier** (AWS or Google Cloud provider) and click **Create Deployment**.
3. **Set Up Security & Credentials:**
   - **Database User:** Create a username and password (e.g., `admin` and `password123`). Make sure to save the password!
   - **Network Access (IP Whitelist):** Go to *Network Access* -> *Add IP Address* -> Select **Allow Access From Anywhere (`0.0.0.0/0`)** for development.
4. **Get Connection String:**
   - Click **Connect** -> **Drivers** (Node.js).
   - Copy the connection string format:
     ```text
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
5. **Configure `.env` file:**
   Open `.env` in the project root and paste your connection string:
   ```env
   PORT=8000
   MONGODB_URI=mongodb+srv://admin:password123@cluster0.xxxxx.mongodb.net
   CORS_ORIGIN=*
   ```

---

### c) Database Models (Mongoose)

#### 1. User Model (`src/models/user.model.js`)
Handles user accounts and secure password storage:
- `username` (String, required, unique, lowercase, trimmed)
- `email` (String, required, unique, lowercase, trimmed)
- `password` (String, hashed using `bcrypt` pre-save hook)
- `timestamps` (`createdAt`, `updatedAt`)

#### 2. Post Model (`src/models/post.model.js`)
Handles posts/articles:
- `title` (String, required)
- `description` (String, required)
- `author` (String, required)
- `category` (String, default: "General")
- `timestamps` (`createdAt`, `updatedAt`)

---

### d) Express APIs (Controllers & Routes)

All routes are prefixed with `/api/v1`.

#### 1. User Endpoints (`/api/v1/users`)
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/users/register` | Register a new user (hashes password) | `201 Created` |
| **POST** | `/api/v1/users/login` | Authenticate user & verify password | `200 OK` |
| **GET** | `/api/v1/users` | Retrieve all registered users | `200 OK` |
| **POST** | `/api/v1/users/logout` | User logout endpoint | `200 OK` |

#### 2. Posts CRUD Endpoints (`/api/v1/posts`)
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/posts` | **CREATE** a new post | `201 Created` |
| **GET** | `/api/v1/posts` | **READ** all posts (sorted newest first) | `200 OK` |
| **GET** | `/api/v1/posts/:id` | **READ** single post by MongoDB `_id` | `200 OK` / `404` |
| **PUT** | `/api/v1/posts/:id` | **UPDATE** post title, description, etc. | `200 OK` / `404` |
| **DELETE**| `/api/v1/posts/:id` | **DELETE** post by MongoDB `_id` | `200 OK` / `404` |

---

### e) API Testing via Postman Desktop App

A pre-configured Postman Collection file `Postman_Collection.json` is provided in the repository root.

#### Quick Import into Postman:
1. Open the **Postman Desktop App**.
2. Click the **Import** button in the top left.
3. Drag & drop or select `Postman_Collection.json` from this project folder.
4. You will see two folders: **1. User Authentication** and **2. Posts CRUD Operations**.

#### Testing Sequence:
1. **Health Check:** `GET http://localhost:8000/` (Returns 200 OK)
2. **Register User:**
   ```json
   {
     "username": "johndoe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```
3. **Login User:**
   ```json
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```
4. **Create Post:**
   ```json
   {
     "title": "Learning Express & MongoDB",
     "description": "Building full CRUD APIs following the tutorial.",
     "author": "johndoe",
     "category": "Education"
   }
   ```
   *Copy the returned `_id` from the response.*
5. **Get All Posts:** `GET http://localhost:8000/api/v1/posts`
6. **Get Single Post:** `GET http://localhost:8000/api/v1/posts/<COPIED_ID>`
7. **Update Post:** `PUT http://localhost:8000/api/v1/posts/<COPIED_ID>` with updated JSON.
8. **Delete Post:** `DELETE http://localhost:8000/api/v1/posts/<COPIED_ID>`

---

## 🏃 Running the Application Locally

```bash
# Start server in development mode with hot-reloading:
npm run dev

# Or start in standard mode:
npm start
```

When connected successfully, your console will display:
```text
✅ MongoDB connected successfully! DB Host: cluster0-shard-00-00.xxxxx.mongodb.net
⚙️  Server is running at: http://localhost:8000
📡 Health Check URL:   http://localhost:8000/
👥 Users API URL:      http://localhost:8000/api/v1/users
📝 Posts API URL:      http://localhost:8000/api/v1/posts
```

---

## 🎓 3rd Evaluation / Viva Preparation Questions & Answers

Be prepared to answer these questions during your college evaluation:

1. **What is the difference between SQL and NoSQL databases?**
   - *SQL (e.g. MySQL, PostgreSQL):* Relational, uses fixed schemas and structured tables with rows and columns.
   - *NoSQL (e.g. MongoDB):* Non-relational, document-based, stores data in flexible JSON/BSON documents.
2. **What is the role of Mongoose?**
   - Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js. It provides schema validation, type casting, middleware (hooks), and an easy API to query the database.
3. **Why do we use the MVC (Model-View-Controller) pattern?**
   - Separation of concerns:
     - **Model:** Defines the data structure and schema.
     - **Route:** Maps HTTP verbs and endpoints to functions.
     - **Controller:** Implements the core business logic and database operations.
4. **Why do we never store plain text passwords in the database?**
   - Storing plaintext passwords exposes user accounts to severe security breaches. We use `bcryptjs` with salt hashing so passwords cannot be reversed or read even if the database is exposed.
5. **What do the HTTP status codes 200, 201, 400, 404, and 500 mean?**
   - `200 OK`: Request succeeded.
   - `201 Created`: Resource successfully created.
   - `400 Bad Request`: Client sent invalid or missing data.
   - `404 Not Found`: Requested resource does not exist.
   - `500 Internal Server Error`: Server encountered an unexpected error.
