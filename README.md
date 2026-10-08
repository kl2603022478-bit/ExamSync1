# ExamSync

## Project structure

```
examsync/
├── server.js              # App entry point: global middleware, mounts routes, starts server
├── config/
│   └── db.js              # MySQL connection pool + startup connection test
├── routes/                # URL -> controller mapping (+ per-route middleware)
│   ├── index.js           # Mounts every router under /api
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── courseRoutes.js
│   ├── venueRoutes.js
│   ├── examinationRoutes.js
│   ├── resultRoutes.js
│   └── registrationRoutes.js
├── controllers/           # Request handling + SQL queries
│   ├── authController.js
│   ├── userController.js
│   ├── courseController.js
│   ├── venueController.js
│   ├── examinationController.js
│   ├── resultController.js
│   └── registrationController.js
├── middleware/
│   ├── validateId.js      # Checks :id is numeric
│   ├── requireFields.js   # Checks required body fields
│   └── errorHandler.js    # 404 + catch-all error handler
└── index.html             # Frontend
```

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in your MySQL details
3. `npm start`
