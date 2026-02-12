# 🌿 WildGuard Backend

WildGuard is a platform built to assist in wildlife rescue efforts by connecting people with the most suitable NGOs, shelters & volunteers. This repository contains the backend codebase, built using **Node.js (Express)**, **TypeScript**, and **PostgreSQL**, with support for **AI-powered image analysis** via **Google Gemini API** and **Google Cloud Vision**.

---

## 🚀 Features

- 🔐 **Secure REST APIs** for authentication, NGO & volunteer management
- 📸 **AI-Powered Image Recognition** using:
  - Google Gemini API (for multimodal image + prompt understanding)
  - Google Cloud Vision (for object detection and classification)
- 🗃️ **PostgreSQL Database** for scalable & relational data management
- ⚙️ **Prisma ORM** with Supabase for local development
- 🌍 **Google Maps integration support** for organization lookups & location handling
- 🔄 **Firebase Admin SDK** for verifying users authenticated via Firebase

---

## 🏗️ Tech Stack

| Category        | Tech                         |
|----------------|------------------------------|
| Runtime         | Node.js (Express)            |
| Language        | TypeScript                   |
| Database        | PostgreSQL                   |
| ORM             | Prisma                       |
| Auth Handling   | Firebase Admin SDK           |
| AI Integration  | Google Gemini API, Cloud Vision |
| File Uploads    | Multer, Google Cloud Storage |
| Environment     | Supabase (Dev), GCP (Prod)   |

---

## ⚙️ Installation

### Prerequisites

- 🦊 Node.js (Latest LTS recommended)
- 🐘 PostgreSQL or Supabase account
- 🔑 Google Cloud API Key (Gemini + Vision enabled)
- 🔥 Firebase Project & Service Account credentials

---

### 🧪 Setup Steps

1. **Clone the repository**  
   ```bash
   git clone https://github.com/x15sr71/wildguard-backend.git
   cd wildguard-backend
   ```
2. **Install dependencies**    
     ```bash
   npm install
   ```
3. **Set up environment variables**    
     ```bash
   DATABASE_URL=your_postgres_or_supabase_url
   GEMINI_API_KEY=your_google_gemini_api_key
   FIREBASE_PROJECT_ID=firebase_project_id
   FIREBASE_PRIVATE_KEY=firebase_private_key
   FIREBASE_CLIENT_EMAIL=firebase_client_email
   FIREBASE_SERVICE_ACCOUNT=firebase_service_account
   GOOGLE_APPLICATION_CREDENTIALS=path_to_your_firebase_service_account.json
   GCP_BUCKET_NAME=your_google_cloud_storage_bucket
   GCP_PROJECT_ID=your_gcp_project_id

   ```   
4. **Run Prisma database migration & seed**    
     ```bash
   npx prisma migrate dev
   npm run seed
5. **Start the server in development mode**    
     ```bash
   npm run dev

🛠️ Scripts   

| Command         | Purpose                     |
| --------------- | --------------------------- |
| `npm run dev`   | Start server with Nodemon   |
| `npm run build` | Build TypeScript project    |
| `npm start`     | Run compiled server         |
| `npm run seed`  | Seed DB using Prisma script |

📁 Project Structure
```bash
wildguard-backend/
├── node_modules/               # Dependencies installed via npm
├── prisma/                     # Prisma schema & migrations
├── src/                        # Source code
│   ├── auth/                   # Authentication-related logic (e.g., JWT, login/signup)
│   ├── LLM/                    # Code related to large language model or AI API integration
│   ├── middlewares/           # Express or custom middlewares (e.g., auth, error handling)
│   ├── services/              # Core service/business logic (e.g., user, NGO, image)
│   ├── util/                  # Utility functions (e.g., formatters, helpers)
│   ├── firebase.ts            # Firebase Admin SDK setup & helper functions
│   └── server.ts              # Entry point – Express server setup
├── .dockerignore              # Files/directories ignored by Docker builds
├── .env                       # Environment variables
├── .gitignore                 # Files ignored by Git
├── alien-array-...json        # Google Cloud service account JSON key (used by Vision API)
├── deleteFirebaseAccount.ts   # Script to delete Firebase user accounts
├── Dockerfile                 # Docker image definition
├── fetchOrg.ts                # Likely a standalone script for fetching org data
├── package-lock.json          # Lockfile for npm dependencies
├── package.json               # Project metadata and dependencies
├── regen.js                   # Possibly regenerates Prisma types or other data
├── supabase_backup.sql        # SQL dump of Supabase PostgreSQL database
└── tsconfig.json              # TypeScript configuration

````

## Contributing

We welcome contributions! Whether you’re fixing a bug, improving documentation, or adding a new feature, your help is greatly appreciated!

✨ Here’s how you can contribute:
- 🐛 **Report Issues** → Open an issue if you find bugs, have questions, or want to request new features.  
- 🔧 **Submit Pull Requests** → Fork the repo, create a feature/bugfix branch and submit a PR with clear descriptions.  
- 📖 **Improve Documentation** → Help us make setup, usage and contribution guidelines clearer.  
- 💡 **Suggest Enhancements** → Share ideas on how the platform can be more useful for wildlife rescue efforts.  

Please ensure your code follows the project’s conventions & add tests or documentation where relevant. Contributions of all sizes are welcome!
