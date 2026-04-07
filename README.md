# 🌿 WildGuard Backend

WildGuard is a platform built to assist in wildlife rescue efforts by connecting people with the most suitable NGOs, shelters & volunteers. This repository contains the backend codebase, built using **Node.js (Express)**, **TypeScript**, and **PostgreSQL**, with support for **AI-powered image analysis** via **Google Gemini API** and **Google Cloud Vision**.

---

## 🚀 Features

- 🔐 **Secure REST APIs** for authentication, NGO and volunteer management
- 📸 **AI-Powered Image Recognition** using:
  - Google Gemini API (for multimodal image + prompt understanding)
  - Google Cloud Vision (for object detection and classification)
- 🗃️ **PostgreSQL Database** for scalable and relational data management
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
4. **Run Prisma database migration and seed**    
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

The backend follows a modular service-oriented architecture, integrating AI-based image analysis, geolocation services, and real-time coordination between volunteers and organizations.

```text
WildGuard-Backend/
├── assets/
│   └── screenshots/            # UI preview images used in README/demo
├── prisma/
│   ├── migrations/             # Database migration history
│   ├── schema.prisma           # Prisma schema (DB models)
│   ├── prisma.ts               # Prisma client setup
│   └── seed.ts                 # Seed script for development
├── src/
│   ├── firebase.ts             # Firebase Admin SDK setup
│   ├── LLM/                    # AI/ML logic (image analysis & summaries)
│   ├── middlewares/            # Express middlewares (routes, search, validation)
│   ├── services/               # Core business logic
│   │   ├── concernPost.ts
│   │   ├── imageResponse.ts
│   │   ├── postRequestHandler.ts
│   │   ├── userService.ts
│   │   ├── visionService.ts
│   │   └── volunteerProfileHandler.ts
│   ├── util/                   # Utility helpers (location, uploads, org data)
│   └── server.ts               # Express server entry point
├── deleteFirebaseAccount.ts    # Script to remove Firebase users
├── fetchOrg.ts                 # Script to fetch NGO/org data
├── regen.js                    # Utility script (e.g., regenerate data/types)
├── Dockerfile                  # Container configuration
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```


## Contributing

We welcome contributions! Whether you’re fixing a bug, improving documentation, or adding a new feature, your help is greatly appreciated!

✨ Here’s how you can contribute:
- 🐛 **Report Issues** → Open an issue if you find bugs, have questions, or want to request new features.  
- 🔧 **Submit Pull Requests** → Fork the repo, create a feature/bugfix branch and submit a PR with clear descriptions.  
- 📖 **Improve Documentation** → Help us make setup, usage and contribution guidelines clearer.  
- 💡 **Suggest Enhancements** → Share ideas on how the platform can be more useful for wildlife rescue efforts.  

Please ensure your code follows the project’s conventions & add tests or documentation where relevant. Contributions of all sizes are welcome!
