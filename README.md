# 🚀 Next.js 15 Professional Starter

A **production-ready, opinionated full-stack starter template** built with **Next.js 16.1.1 (App Router)**.

Pre-configured with the best modern tools for **Developer Experience (DX)** and **Performance**.

**Perfect for:**
SaaS • Dashboards • Scalable Web Applications

---

## ✨ Features

- **Framework:** Next.js 15 (App Router) with TurboPack
- **Language:** TypeScript for strict type safety
- **Styling:** Tailwind CSS v3.4 + Shadcn UI (Radix Primitives)
- **Authentication:** Ready for Better Auth (via `jr-auth-cli`)
- **Database:** Prisma ORM (Pre-configured for MongoDB)
- **Formatting:**
  - Prettier
  - `prettier-plugin-tailwindcss`
  - Automatic Import Sorting

- **Git Hooks:** Husky & Lint-Staged (auto-format on commit)
- **Theming:** Dark / Light mode (`next-themes`)
- **Icons:** Lucide React

---

## 🛠️ Tech Stack

| Category                 | Technology                                        |
| ------------------------ | ------------------------------------------------- |
| **Core**                 | Next.js 15, React 19, TypeScript                  |
| **Styling**              | Tailwind CSS, Shadcn UI, Class Variance Authority |
| **Database**             | Prisma ORM, MongoDB (Default)                     |
| **Auth**                 | Better Auth                                       |
| **Linting & Formatting** | ESLint, Prettier, Husky                           |

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1️⃣ Clone the repository

```bash
git https://github.com/JuwelRana34/My-Starter-App
cd My-Starter-App
```

### 2️⃣ Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3️⃣ Setup Environment Variables

Rename the example file and add your secrets:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

- MongoDB connection string
- Authentication secrets

---

### 4️⃣ Setup Database (Prisma)

This template uses **MongoDB**, so migrations are not required.

```bash
npx prisma generate
```

> **Note:** Generating the Prisma Client is enough for MongoDB.

---

## 🔄 Switching to PostgreSQL

By default, this template uses **MongoDB**. If you prefer PostgreSQL:

1. Update `.env.local` with your PostgreSQL URL.
2. Open `prisma/schema.prisma`:
   - Change datasource provider to `"postgresql"`.
   - Remove all `@db.ObjectId` and `@map("_id")` annotations.
   - Change `@default(auto())` to `@default(cuid())` for IDs.
3. Run migration:
   ```bash
   npx prisma migrate dev --name init
   ```

### 5️⃣ Run the development server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📂 Project Structure

```plaintext
.
├── app/                  # Next.js App Router
│   ├── (auth)/           # Authentication Routes
│   ├── api/              # API Routes
│   ├── layout.tsx        # Root Layout
│   └── page.tsx          # Home Page
├── components/
│   ├── ui/               # Shadcn UI Components
│   └── theme-provider.tsx
├── lib/
│   ├── db.ts             # Global Prisma Client
│   ├── utils.ts          # Tailwind Class Merger
│   └── auth.ts           # Auth Configuration
├── prisma/
│   └── schema.prisma     # Database Schema (MongoDB)
├── public/               # Static assets
└── ...config files
```

---

## 🔐 Authentication

This project is pre-configured for **Better Auth**.

To add or modify authentication features, use the integrated CLI:

```bash
npx jr-auth-cli add
```

---

## 💅 Code Quality & Formatting

We use **Husky** and **Lint-Staged** to ensure consistent code quality.

On every `git commit`, the following run automatically:

- Prettier – Code formatting
- Import Sorting
- Tailwind Class Sorting
- ESLint – Error checking

You can also run linting manually:

```bash
npm run lint
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch

   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. Commit your changes

   ```bash
   git commit -m "Add some AmazingFeature"
   ```

4. Push to the branch

   ```bash
   git push origin feature/AmazingFeature
   ```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.
See the `LICENSE` file for details.

---

**Happy Coding! 💙**
