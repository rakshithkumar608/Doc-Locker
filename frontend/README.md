🚀 Setup (Creating Frontend)

- npx create-next-app@latest frontend --typescript --tailwind --eslint --app --yes

📥 Install Essential Packages

- npm install lucide-react sonner framer-motion @tanstack/react-query

Initialize shadcn UI:
- npx shadcn@latest init


🧩 Add shadcn Components

- npx shadcn@latest add button card dialog table badge avatar dropdown-menu separator scroll-area input label toast sheet tabs skeleton progress

📂 Project Structure (Frontend only)

frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── lock/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx          ← Main protected layout with sidebar
│   │   ├── page.tsx            ← Home/Dashboard
│   │   ├── documents/page.tsx
│   │   ├── cards/page.tsx
│   │   ├── certificates/page.tsx
│   │   └── search/page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                     ← shadcn components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── ThemeProvider.tsx
│   ├── vault/
│   │   ├── FileCard.tsx
│   │   ├── FileTile.tsx
│   │   ├── SecureUpload.tsx
│   │   ├── TagChip.tsx
│   │   └── FileViewerModal.tsx
│   └── common/
├── lib/
│   ├── encryption.ts           ← Client-side AES-GCM encryption
│   ├── utils.ts
│   └── api.ts                  ← API client
├── types/
│   └── index.ts
├── hooks/
│   └── useAuth.ts
└── public/