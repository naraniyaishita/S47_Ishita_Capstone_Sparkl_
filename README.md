# Sparkl✨

Introducing "Sparkl" — your all-in-one personal hub designed to simplify and enrich your digital lifestyle.

Sparkl is a private space where everything you love lives in one place. It’s built to help you stay organized, entertained, and creatively expressive without juggling multiple apps or platforms.

With Sparkl, you can:

Curate your go-to apps — Keep quick access to your essentials like Spotify from a single dashboard.

Build your personal bookshelf — Track the books you’ve read, the ones you’re reading, and the ones you can’t wait to start.

Organize your watchlist — Keep a tidy list of movies, shows, or series you plan to enjoy.

Write and store personal blogs — Capture your thoughts, reflections, and memories through text and photos, creating a digital diary that’s completely yours.

Currently, Sparkl is for personal use only — your lists, blogs, and preferences are visible only to you.

In future updates, we plan to introduce selective sharing features so you can connect and exchange recommendations with others, while keeping control over your privacy.

In essence: Sparkl is your private, streamlined digital sanctuary — a place to keep your entertainment lists, reading goals, and personal writings in one beautifully simple space

## 📌 Features
- **User Authentication** – Secure signup/login with JWT-based authentication.
- **Personal App Shortcuts** – Pin your most-used applications (e.g., Spotify) for quick access.
- **Bookshelf** – Track books you’ve read, are reading, and plan to read.
- **Watchlist** – Keep a list of movies, shows, or series to watch.
- **Personal Blog** – Write and save posts with text and images for private journaling.
- **Image Uploads** – Upload and manage images using Cloudinary.
- **Protected Routes** – Keep your content private with authenticated access.
## Deployed Link:-

Frontend Deployed Link :- [https://sparkl.pages.dev]

## 🛠️ Tech Stack
1. Frontend: React.js, Axios, React Router
2. Backend: Node.js, Express.js
3. Database: MongoDB with Mongoose
4. Other Tools: Multer, Cloudinary, bcrypt.js, JWT


# 🚀 Getting Started
## Prerequisites
- Node.js (>= 16.x)
- npm or yarn
- MongoDB (local or cloud instance)

## Installation
### Clone the repo

```
git clone https://github.com/kalviumcommunity/S47_Ishita_Capstone_Sparkl_.git
cd S47_Ishita_Capstone_Sparkl_
```


### Install frontend dependencies
```
cd client
npm install
```

### Install backend dependencies
```
cd server
npm install
```

## Environment setup
Create .env files in both /client and /server with the following variables:


### server/.env
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
## Run the app

### Start backend
```
cd server
npm start
```

### Start frontend
```
cd client
npm start
```
