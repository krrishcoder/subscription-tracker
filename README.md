# 📊 Subscription Tracker

A Node.js & Express backend application to **manage subscriptions**, **track users**, and **send email notifications**.  
This project is designed to help users keep track of their active subscriptions, automate reminders, and manage workflows.

![Demo](https://github.com/krrishcoder/subscription-tracker/blob/main/Screen%20Recording%202025-08-16%20at%208.57.54%20PM%20(2).gif)



---

## ✨ Features
- 🔐 **User Authentication** (JWT-based login/signup)
- 📦 **Subscription Management** (Add, update, delete, and fetch subscriptions)
- 📧 **Email Notifications** (via Nodemailer with custom templates)
- 🗂 **Workflow Automation** for subscription reminders
- ☁️ **Database**: MongoDB integration
- ⚡ **Performance & Security** with Arcjet and Upstash
- 🛠 **Modular Architecture** (Controllers, Routes, Middleware, Models)

---

## 🛠 Tech Stack
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Email Service**: Nodemailer  
- **Cache / Rate-limiting**: Upstash  
- **Security & Monitoring**: Arcjet  
- **Others**: ESLint, dotenv

---

## 📂 Project Structure
```
subscription-tracker-main/
├── app.js                 # Main entry point
├── config/                # Environment, DB, Email, Arcjet, Upstash configs
├── controllers/           # Business logic (auth, subscription, user, workflow)
├── database/              # MongoDB connection
├── middlewares/           # Auth, error handling, arcjet protection
├── models/                # Mongoose models (User, Subscription)
├── routes/                # API routes
├── utils/                 # Email templates, helpers
├── package.json           # Dependencies
└── .gitignore
```

---

## 🚀 Getting Started

### 1️⃣ Clone the repo
```bash
git clone https://github.com/krrishcoder/subcription-tracker.git
cd subscription-tracker
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Set up environment variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
UPSTASH_REDIS_URL=your_upstash_url
ARCJET_API_KEY=your_arcjet_key
```

### 4️⃣ Run the server
```bash
npm start
```

---

## 📌 API Endpoints

### Auth
- `POST /api/auth/register` → Register new user  
- `POST /api/auth/login` → Login user  

### Subscriptions
- `GET /api/subscriptions` → Get all subscriptions  
- `POST /api/subscriptions` → Add new subscription  
- `PUT /api/subscriptions/:id` → Update subscription  
- `DELETE /api/subscriptions/:id` → Delete subscription  

### Users
- `GET /api/users/:id` → Get user profile  

### Workflow
- `POST /api/workflow/run` → Trigger workflow  

---

## 📧 Email Notifications
Uses **Nodemailer** with customizable templates in `utils/email-template.js`.

---

## 🤝 Contributing
1. Fork the repo  
2. Create your feature branch (`git checkout -b feature/awesome-feature`)  
3. Commit changes (`git commit -m 'Add some feature'`)  
4. Push to branch (`git push origin feature/awesome-feature`)  
5. Open a Pull Request  

---

## 📜 License
This project is licensed under the MIT License.

---

## 🙌 Acknowledgements
- [Express.js](https://expressjs.com/)  
- [MongoDB](https://www.mongodb.com/)  
- [Nodemailer](https://nodemailer.com/)  
- [Upstash](https://upstash.com/)  
- [Arcjet](https://arcjet.com/)  
