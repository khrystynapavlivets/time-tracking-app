# Time Tracking App

Цей проект є додатком для відстеження часу, побудованим з використанням сучасних веб-технологій.

## Використані технології

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Мова програмування:** [TypeScript](https://www.typescriptlang.org/)
- **Стилізація:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Компоненти:** [shadcn/ui](https://ui.shadcn.com/) (базується на Radix UI)
- **База даних:** [Supabase](https://supabase.com/)
- **Управління станом:** React Context / Hooks
- **Валідація форм:** React Hook Form + Zod
- **Графіки:** Recharts
- **Робота з датами:** date-fns

## Як запустити проект локально

### Передумови

Переконайтеся, що у вас встановлено:
- [Node.js](https://nodejs.org/) (версія 18 або новіша)
- [pnpm](https://pnpm.io/) (рекомендований менеджер пакетів)

### Інструкція

1. **Клонуйте репозиторій:**

   ```bash
   git clone <repository-url>
   cd time-tracking-app
   ```

2. **Встановіть залежності:**

   ```bash
   pnpm install
   ```

3. **Налаштуйте змінні оточення:**

   Створіть файл `.env.local` в корені проекту та додайте ключі доступу до вашого проекту Supabase:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Запустіть сервер розробки:**

   ```bash
   pnpm dev
   ```

   Відкрийте [http://localhost:3000](http://localhost:3000) у вашому браузері, щоб побачити результат.

## Структура проекту

- `src/app`: Сторінки та макети (Next.js App Router)
- `src/components`: UI компоненти та бізнес-логіка
- `src/lib`: Утиліти, API клієнти, хуки та сервіси
- `supabase`: Міграції бази даних


### Структура Проекту (Clean Architecture)
```
src/
├── app/                 # Next.js App Router (Pages)
│   ├── api/             # API Routes (якщо потрібно)
│   ├── projects/        # Page: Projects
│   ├── reports/         # Page: Reports
│   └── page.tsx         # Page: Tracker (Home)
├── components/
│   ├── ui/              # Базові компоненти (Button, Input, Card)
│   ├── layout/          # Header, Sidebar
│   └── features/        # Компоненти з бізнес-логікою
│       ├── tracker/     # Timer, TaskList
│       ├── projects/    # ProjectList, ColorPicker
│       └── reports/     # DateRangePicker, ExportButton
├── lib/
│   ├── db/              # Prisma/Supabase client
│   ├── services/        # Бізнес-логіка (TimeService, ProjectService)
│   └── utils/           # Форматування часу, CSV генератор
└── types/               # TypeScript Definitions
```
