# ⚡ Zvelkit

**The Modern SvelteKit Boilerplate for Production-Ready Applications.**

Zvelkit is a comprehensive, battle-tested starter kit for building modern web applications with SvelteKit 2 and Svelte 5. It comes pre-configured with everything you need to ship faster, from authentication to modular architecture.

## 🚀 Key Features

- **Svelte 5 (Runes)**: Built with the latest Svelte features for maximum performance and reactivity.
- **Admin Dashboard**: A pre-built, responsive dashboard layout with a sidebar, breadcrumbs, and user menus.
- **Secure Authentication**: Implementation of Argon2 hashing, session management, and middleware-protected routes.
- **Type-Safe Database**: Integrated with **Drizzle ORM** (PostgreSQL) for type-safe schemas and seamless migrations.
- **Modular Architecture**: Clean separation of concerns with feature-based modules (models, services, forms).
- **Modern UI Components**: Powered by **Shadcn Svelte** and **TailwindCSS 4**.
- **Dynamic Forms**: Schema-driven form builder with built-in validation and file upload support.
- **Data Tables**: Feature-rich tables with sorting, filtering, and pagination.
- **Export Helpers**: One-click exports to CSV, Excel, or PDF.

## 🛠 Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) (Svelte 5)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: PostgreSQL (via `postgres.js`)
- **UI Library**: [Shadcn Svelte](https://svelte-5.shadcn-svelte.com/)
- **Icons**: [Lucide Svelte](https://lucide.dev/)

## 📁 Project Structure

```text
src/
├── lib/
│   ├── app/             # Core business logic
│   │   ├── database/    # Drizzle schema & client
│   │   ├── middleware/  # Auth & security guards
│   │   └── modules/     # Feature-based logic (user, product, etc.)
│   └── components/      # UI components
│       ├── ui/          # Shadcn primitives
│       └── form-builder/# Dynamic form logic
└── routes/              # SvelteKit pages & layouts
    └── panel/           # Protected admin dashboard
```

## 🚥 Getting Started

### 1. Clone & Install

```bash
# Clone the repository
npx degit lutfiangga/zvelkit my-app
cd my-app

# Install dependencies
npm install
```

### 2. Environment Setup

Copy the `.env.example` to `.env` and configure your database URL:

```bash
cp .env.example .env
```

### 3. Database Migration

```bash
# Generate migrations
npm run db:generate

# Push to database
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

## 📜 Scripts

- `npm run dev`: Start development server
- `npm run build`: Build production bundle
- `npm run preview`: Preview production build
- `npm run db:push`: Push local schema changes to database
- `npm run db:studio`: Open Drizzle Studio to view data
- `npm run lint`: Run ESLint and Prettier check
- `npm run format`: Format code with Prettier

## 📖 Documentation

For detailed guides on how to add new modules, customize the dashboard, or handle advanced forms, please refer to the `/docs` route in your application.

---

Built with ❤️ by [lutfiangga](https://github.com/lutfiangga)
