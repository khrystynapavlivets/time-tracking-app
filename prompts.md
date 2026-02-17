# Лог промптів (AI Interaction Log)


### Запит 1 ####
**AI-tool**:
 https://v0.app/

**Prompt**:
 Expert UI/UX Engineer & React Developer Goal: Build a complete, production-ready UI for a Time Tracking Application (SaaS style). Tech Stack: React, Tailwind CSS, Lucide Icons, Shadcn UI.

Page Structure: Create a layout with a Sidebar Navigation (Dashboard, Projects, Reports, Settings) and a Main Content Area.

1. The "Sticky" Tracker Bar (Critical Feature):

- Place this at the very top of the main content area. It must be sticky/fixed so it's always visible.
- Components inside the bar:
  - Task Input: A text input ("What are you working on?") that simulates autocomplete suggestions from previous tasks when focused.
  - Project Selector: A dropdown to select a project/client (display a colored dot next to the project name).
  - Timer Display: Large, clear digital digits (00:00:00).
  - Controls: A prominent "Start" (Play icon) and "Stop" (Square icon) button.
2. Dashboard & Task Management:

- Daily View: Show a list of today's time entries below the tracker.
- Grouping: Visually group these entries by Project . Display a header for each group with the Project Name and Total Time for that project.
- Entry Row: Each task row must allow:
  - Inline Editing: Clicking the task name or project allows editing.
  - Manual Time: An input field to manually adjust duration (e.g., "1:30").
  - Actions: A delete button (trash icon) on hover.
3. Projects Management Page:

- Create a separate view for "Projects".
- List: A clean table of projects (Name, Client, Total Hours Tracked, Status).
- Add/Edit: A modal/dialog form to add a new project. Crucially, include a Color Picker to assign a specific color to the project for visual tagging throughout the app.
4. Reports Page:

- Create a separate view for "Reports".
- Controls: Tabs to switch between Day / Week / Month views.
- Export: A clearly visible "Export CSV" button in the top right.
- Visuals: A summary section (Total Hours, Billable Hours) and a Bar Chart visualization of time spent per day.
Design Aesthetic:

- Clean, modern, professional (like Linear or Toggl).
- Use subtle borders and a refined color palette.
- Ensure high contrast and good spacing.

### Запит 2 ###
**AI-tool**:
https://www.trae.ai/

**Prompt**:
Run this project


### Запит 3 ###
**AI-tool**:
https://www.trae.ai/

**Prompt**:
Виконай рефакторинг наданого коду Next.js, дотримуючись принципів Clean Architecture та наведеної структури папок.

Контекст: Наразі код монолітний (логіка, стан та UI змішані в одному-двох файлах). Потрібно відокремити бізнес-логіку від компонентів інтерфейсу.

Суворі правила:

НЕ змінюй дизайн UI: Залиш усі класи Tailwind, кольори та верстку без змін.

Винесення логіки: Усі обчислення часу, форматування даних та запити до API мають бути винесені в src/lib/services/.

Розподіл компонентів:

UI: Базові візуальні компоненти (Button, Input, Card) йдуть у src/components/ui/.

Features: Складні компоненти зі станом (Timer, TaskList, ProjectList) йдуть у src/components/features/[назва_фічі]/.

Layout: Header, Sidebar та обгортки сторінок йдуть у src/components/layout/.

Типи: Усі інтерфейси та типи TypeScript мають бути в src/types/index.ts.

App Router: Файли в src/app/ повинні містити лише композицію сторінок (мінімум логіки).



### Запит 4 ###
**AI-tool**:
https://www.trae.ai/

**Prompt**:
You are a Senior Fullstack Developer and Software Architect. Analyze the provided code and test task requirements.

Your task: Create a detailed Roadmap for project implementation.

Limitations: It is strictly forbidden to make any changes to the code or files at this stage. Text plan only.

### Запит 5 ###
**AI-tool**:
https://www.trae.ai/

**Prompt**:
Step-by-step run and fix:

# pnpm lint
# npx tsc --noEmit
# pnpm build



### Запит 6 ###
**AI-tool**:
https://www.trae.ai/

**Prompt**:
Проведи критичний аудит (Code Review) мого проекту на Next.js. Перевір, чи відповідає він принципам Clean Architecture та чи немає в ньому «зайвого» (dead code) або змішаної відповідальності. Напиши план


### Запит 7 ###
**AI-tool**:
https://www.trae.ai/

**Prompt**:
Проведи критичний аудит (Code Review) мого проекту на Next.js. Перевір, чи відповідає він принципам Clean Architecture та чи немає в ньому «зайвого» (dead code) або змішаної відповідальності.


### Запит 8 ###
**AI-tool**:
https://www.trae.ai/

**Prompt**:
Recent tasks мають співпадати з завдань з бази  даних. виконай це завдання Поле введення назви задачі з автодоповненням з попередніх задач.

### Запит 9 ###
**AI-tool**:
https://www.trae.ai/

**Prompt**:
Додай Коротку документацію в README про вибрані технології та як запустити проект локально.

### Запит 10 ###
**AI-tool**:
https://www.trae.ai/

**Prompt**:
Переконатися, що UI коректно відображається, коли списки пусті (Empty States).


### Запит 11 ###
**AI-tool**:
https://www.trae.ai/

**Prompt**:
Перевір папку src/components/ui та видали компоненти shadcn, які не використовуються в проекті (наприклад, carousel, context-menu


### Запит 12 ###
**AI-tool**:
https://www.trae.ai/

**Prompt**:
Виконай рефакторинг згідно з принципом Separation of Concerns.

### Запит 13 ###
**AI-tool**:
https://www.trae.ai/

**Prompt**:
 Перенеси всі унікальні стилі та змінні з src/styles/globals.css у src/app/globals.css, якщо їх там немає. Після цього видали файл src/styles/globals.css та онови всі імпорти в проекті, щоб вони посилалися на актуальний файл стилів.


### Запит 14 ###
**AI-tool**:
https://www.trae.ai/

**Prompt**:
 Проаналізуй структуру проекту і знайди порожні директорій, які залишилися після рефакторингу або ще не використовуються.