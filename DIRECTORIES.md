```
/tmm-app
├── .env                      # Environment variables (not in source control)
├── .env.example              # Example environment variables
├── .gitignore
├── drizzle.config.ts         # Drizzle configuration
├── next.config.mjs           # Next.js configuration
├── package.json
├── tsconfig.json
├── postcss.config.js         # For Tailwind CSS
├── tailwind.config.js
├── README.md
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/           # Authentication routes (grouped layout)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx    # Auth layout shared among auth routes
│   │   │
│   │   ├── (dashboard)/      # Protected routes (grouped layout)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── teams/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── positions/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── members/
│   │   │   │   │       └── page.tsx
│   │   │   ├── schedule/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── manage/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── requests/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── team-members/
│   │   │   │       ├── page.tsx
│   │   │   │       └── [id]/
│   │   │   │           └── page.tsx
│   │   │   ├── forecast/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── variables/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── positions/
│   │   │   │       └── page.tsx
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── users/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── roles/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx    # Dashboard layout with nav and auth check
│   │   │
│   │   ├── api/              # Limited API routes (justified below)
│   │   │   ├── auth/
│   │   │   │   └── route.ts  # Authentication endpoints (login/refresh)
│   │   │   ├── uploads/      
│   │   │   │   └── route.ts  # File upload handling
│   │   │   └── webhooks/
│   │   │       └── route.ts  # External system webhooks
│   │   │
│   │   ├── error.tsx         # Global error handling
│   │   ├── layout.tsx        # Root layout
│   │   ├── loading.tsx       # Global loading state
│   │   └── page.tsx          # Home page (landing page or redirect)
│   │
│   ├── actions/              # Server actions
│   │   ├── auth/
│   │   │   ├── login.ts
│   │   │   ├── signup.ts
│   │   │   └── reset-password.ts
│   │   ├── teams/
│   │   │   ├── create-team.ts
│   │   │   ├── update-team.ts
│   │   │   └── delete-team.ts
│   │   ├── schedule/
│   │   │   ├── create-shift.ts
│   │   │   ├── update-schedule-stage.ts
│   │   │   └── assign-shift.ts
│   │   ├── manage/
│   │   │   ├── update-team-member.ts
│   │   │   ├── process-request.ts
│   │   │   └── assign-skill.ts
│   │   └── forecast/
│   │       ├── update-variable.ts
│   │       ├── create-position.ts
│   │       └── update-position.ts
│   │
│   ├── components/           # React components
│   │   ├── ui/               # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── ... (other shadcn components)
│   │   │
│   │   ├── auth/             # Authentication-related components
│   │   │   ├── login-form.tsx
│   │   │   └── signup-form.tsx
│   │   │
│   │   ├── layout/           # Layout components
│   │   │   ├── sidebar-nav.tsx
│   │   │   ├── user-menu.tsx
│   │   │   └── header.tsx
│   │   │
│   │   ├── teams/            # Team-related components
│   │   │   ├── team-form.tsx
│   │   │   ├── team-list.tsx
│   │   │   └── team-detail.tsx
│   │   │
│   │   ├── schedule/         # Schedule-related components
│   │   │   ├── schedule-editor.tsx
│   │   │   ├── shift-form.tsx
│   │   │   └── workload-view.tsx
│   │   │
│   │   ├── manage/           # Manage-related components
│   │   │   ├── team-member-form.tsx
│   │   │   ├── availability-calendar.tsx
│   │   │   └── request-list.tsx
│   │   │
│   │   └── forecast/         # Forecast-related components
│   │       ├── variable-form.tsx
│   │       ├── position-form.tsx
│   │       └── forecast-chart.tsx
│   │
│   ├── db/                   # Database layer
│   │   ├── schema/           # Drizzle schema
│   │   │   ├── index.ts      # Exports all schema
│   │   │   ├── core.ts       # Core entities
│   │   │   ├── scheduling.ts # Scheduling components
│   │   │   ├── security.ts   # Security components
│   │   │   └── forecast.ts   # Forecasting components
│   │   │
│   │   ├── migrations/       # Drizzle migrations
│   │   │   └── ...
│   │   │
│   │   ├── seed/             # Database seeders
│   │   │   ├── index.ts
│   │   │   └── role-seeder.ts
│   │   │
│   │   └── index.ts          # DB client configuration
│   │
│   ├── lib/                  # Utility functions and library code
│   │   ├── auth/             # Authentication utilities
│   │   │   ├── jwt.ts        # JWT handling 
│   │   │   ├── password.ts   # Password hashing
│   │   │   └── session.ts    # Server-side session handling
│   │   │
│   │   ├── utils/            # General utilities
│   │   │   ├── date.ts       # Date formatting utilities
│   │   │   ├── id.ts         # ID generation with nanoid
│   │   │   └── validation.ts # Common validation functions
│   │   │
│   │   └── env.ts            # Type-safe environment variables
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── use-form-with-server-action.ts
│   │   └── use-optimistic-action.ts
│   │
│   ├── repositories/         # Data access repositories
│   │   ├── team-repository.ts
│   │   ├── schedule-repository.ts
│   │   ├── team-member-repository.ts
│   │   └── user-repository.ts
│   │
│   ├── types/                # TypeScript type definitions
│   │   ├── schema.ts         # Schema-derived types
│   │   ├── auth.ts           # Authentication types
│   │   └── api.ts            # API-specific types
│   │
│   └── server/               # Server-only code
│       ├── auth/             # Authentication logic
│       │   ├── authorize.ts  # Authorization checking
│       │   └── authenticate.ts # Authentication logic
│       │
│       └── services/         # Business logic services
│           ├── team-service.ts
│           ├── schedule-service.ts
│           └── user-service.ts
│
└── migrations/               # Drizzle migrations output directory
```