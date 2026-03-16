# TripMate Travel Website

TripMate is a simple travel website with user authentication built using **Node.js, Express, and MongoDB**.
It allows users to register and log in securely using hashed passwords.

## 🚀 Features

* User Registration
* User Login Authentication
* Secure Password Hashing using bcrypt
* MongoDB Database Integration
* REST API for authentication
* Static frontend served using Express

## 🛠️ Tech Stack

**Frontend**

* HTML
* CSS
* JavaScript

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB
* Mongoose

**Other Tools**

* bcryptjs
* body-parser
* cors

## 📂 Project Structure

```
travel_website
│
├── public
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   └── css/js files
│
├── server
│   ├── models
│   │   └── User.js
│   └── server.js
│
├── package.json
└── README.md
```

## ⚙️ Installation and Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/YOUR_USERNAME/tripmate-travel-website.git
```

### 2️⃣ Navigate into the project folder

```
cd tripmate-travel-website
```

### 3️⃣ Install dependencies

```
npm install
```

### 4️⃣ Start MongoDB

Make sure MongoDB is running locally:

```
mongodb://127.0.0.1:27017/tripmate
```

### 5️⃣ Run the server

```
node server/server.js
```

### 6️⃣ Open the website

Open in your browser:

```
http://localhost:3000
```

## 🔐 API Endpoints

### Register User

POST `/api/auth/register`

Example request body:

```
{
  "username": "exampleuser",
  "password": "password123"
}
```

### Login User

POST `/api/auth/login`

Example request body:

```
{
  "username": "exampleuser",
  "password": "password123"
}
```

## 📌 Future Improvements

* Add travel destination search
* Booking system
* User dashboard
* JWT authentication
* Deployment to cloud

## 👩‍💻 Author

**Manshita Agarwal**
B.Tech CSE (IT) – MIT Manipal

---

⭐ If you found this project useful, feel free to star the repository!
