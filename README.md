# ERP-Front

Enterprise Resource Planning — Frontend

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)
![AG Grid](https://img.shields.io/badge/AG_Grid-Community-orange)
![Flowbite](https://img.shields.io/badge/Flowbite-React-purple)

> Frontend for a modular ERP system — connects to a Django REST Framework backend.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Getting Started](#4-getting-started)
5. [Architecture & Patterns](#5-architecture--patterns)
6. [Key Files Reference](#6-key-files-reference)
7. [HR Module — Employee](#7-hr-module--employee)
8. [Adding a New Module](#8-adding-a-new-module)
9. [API Contract](#9-api-contract)
10. [Frontend Error Handling](#10-frontend-error-handling)
11. [Conventions & Code Style](#11-conventions--code-style)

---

## 1. Project Overview

ERP-Front is a modular enterprise resource planning frontend built with **Next.js 15 App Router** and **TypeScript**. It connects to a Django REST Framework backend and provides a consistent, type-safe UI for managing HR data and other business domains.

**Key design goals:**
- **Module-first** — each business domain (`hr/`, `finance/`, …) is self-contained inside `modules/<domain>/`
- **Standardised API layer** — Axios interceptors enforce a single success/error envelope across every request
- **Reusable data-table pattern** — AG Grid + shared column/form schemas means new CRUD pages take minutes to scaffold
- **Type safety end-to-end** — read (`Employee`) and write (`EmployeeWrite`) types are kept separate to prevent field leakage

---

## 2. Tech Stack

| Category | Library / Tool | Purpose |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR, routing, layouts, middleware |
| Language | TypeScript | End-to-end type safety |
| Styling | Tailwind CSS | Utility-first responsive design |
| UI Components | Flowbite React | Pre-built accessible components |
| Data Grid | AG Grid Community | Sortable, filterable, paginated tables |
| HTTP Client | Axios | Interceptors, typed responses, FormData |
| Notifications | React Toastify | Success / error toast messages |
| Linting | ESLint + Prettier | Code quality and consistent formatting |

---

## 3. Folder Structure

ERP-front/
├── app/
│   ├── (auth)/                  # Login, register (no sidebar layout)
│   ├── (dashboard)/             # Protected pages with shared layout
│   └── layout.tsx
├── components/
│   ├── common/                  # PageHeader, DeleteConfirmModal, …
│   └── dashboard/               # FormModal, actionsColumn, sidebar, …
├── config/                      # App-wide constants (API base URL, …)
├── context/                     # React context providers (auth, theme)
├── guards/                      # Client-side route guards
├── helpers/                     # Pure utilities (fileValidation, …)
├── hooks/                       # useFetch, useAgGridFilter, …
├── lib/
│   ├── axios.ts                 # Configured instance + interceptors
│   ├── api-error.ts             # ApiError class
│   └── request.ts               # request() / requestList() helpers
├── modules/
│   └── hr/
│       ├── types/               # Employee, EmployeeWrite, Position, …
│       ├── services/            # employeeService.ts
│       └── schemas/
│           ├── formSchemas/     # employeeForm.ts (field definitions)
│           └── tableSchemas/    # employeeColumns.ts (AG Grid ColDefs)
├── types/                       # Global shared types
├── middleware.ts                 # Auth token check → redirect
├── next.config.ts
└── tsconfig.json


---

## 4. Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm
- Running Django REST Framework backend

### Installation

```bash
# 1. Clone
git clone https://github.com/Mohamed-Ahmed-12/ERP-front.git
cd ERP-front

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local

# 4. Run
npm run dev
# → http://localhost:3000
```

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### Scripts

| Script | Description |
|---|---|
| `npm run dev` | Dev server on localhost:3000 |
| `npm run build` | Optimised production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

---

## 5. Architecture & Patterns

### 5.1 API Layer

All HTTP traffic goes through `lib/axios.ts`. Two interceptors enforce the standard contract:

**Request interceptor** — attaches `Bearer <token>` from `localStorage` to every outgoing request.

**Response interceptor (2xx)** — unwraps the DRF envelope `{ success, status, message, data, pagination? }`. Your code receives the inner `data` directly — no `.data.data` nesting.

**Response interceptor (4xx / 5xx)** — parses `{ success, status, error: { code, message, details } }` and throws an `ApiError`. 401s automatically clear the token and redirect to `/login`.

### 5.2 Module Pattern

Each domain is self-contained. Adding a module means creating four files:

| File | Responsibility |
|---|---|
| `types/entity.ts` | Read + write TypeScript interfaces |
| `services/entityService.ts` | API calls using `request()` / `requestList()` |
| `schemas/formSchemas/entityForm.ts` | Field definitions consumed by `FormModal` |
| `schemas/tableSchemas/entityColumns.ts` | AG Grid `ColDef` array |

### 5.3 CRUD Page Pattern

Every list page follows the same skeleton:

```tsx
const { data, loading, refetch } = useFetch<Entity[]>('endpoint/');

const columns = [
    ...entityColumns,
    ...actionsColumn({ onEdit, onDelete }),
];

return (
    <>
        <FormModal ... />
        <DeleteConfirmModal ... />
        <AgGridReact rowData={data} columnDefs={columns} ... />
    </>
);
```

### 5.4 FormData Handling

`handleSubmit` builds `FormData` from the typed payload:

| Field type | Handling |
|---|---|
| Relation fields | Extract `.guid` from nested object (guard against `null` — see §5.5) |
| Scalar / text | Append directly; use `String()` for numbers and booleans |
| Nullable fields | Only append when truthy (`contract_end_date`, `manager`) |
| Boolean fields | Must use `String(value)` — FormData rejects native booleans |

### 5.5 The `null` / `typeof` Pitfall

> ⚠️ `typeof null === 'object'` in JavaScript. Accessing `.guid` on a `null` relation crashes at runtime.

```ts
// ❌ Wrong — true for null!
typeof payload.position === 'object'

// ✅ Correct
payload.position !== null && typeof payload.position === 'object'
```

Once `Employee` marks `position` / `department` as `T | null`, TypeScript catches this at compile time.

---

## 6. Key Files Reference

| File | What it does |
|---|---|
| `lib/axios.ts` | Axios instance with auth + response-unwrap interceptors |
| `lib/api-error.ts` | `ApiError` class — `isValidation()`, `fieldError()`, `allFieldErrors()` |
| `lib/request.ts` | `request<T>()` and `requestList<T>()` typed fetch wrappers |
| `hooks/useFetch.ts` | Generic data-fetching hook with `loading` / `error` / `refetch` |
| `hooks/useAgGridFilter.ts` | Wires AG Grid filter events to local state |
| `components/dashboard/FormModal.tsx` | Generic create/edit modal driven by a field-definition array |
| `components/dashboard/actionsColumn.tsx` | AG Grid `ColDef`s with Edit and Delete buttons |
| `components/common/DeleteConfirmModal.tsx` | Reusable delete confirmation dialog |
| `components/common/PageHeader.tsx` | Page title bar with optional action slot |
| `middleware.ts` | Checks access token; redirects unauthenticated users to `/login` |
| `helpers/fileValidation.ts` | Validates `File` objects against size and MIME-type requirements |

---

## 7. HR Module — Employee

### Types (`modules/hr/types/employees.ts`)

| Interface | Purpose |
|---|---|
| `Employee` | Read type — `position`, `department`, `manager` are full nested objects |
| `EmployeeWrite` | Write type — relations are plain GUID strings |

### Service (`modules/hr/services/employeeService.ts`)

```ts
export const EmployeeService = {
    list:   (params?) => requestList<Employee>('/hr/employees/', params),
    get:    (guid)    => request<Employee>('get',    `/hr/employees/${guid}/`),
    create: (payload) => request<Employee>('post',   '/hr/employees/', payload),
    update: (guid, p) => request<Employee>('patch',  `/hr/employees/${guid}/`, p),
    delete: (guid)    => request<null>    ('delete', `/hr/employees/${guid}/`),
};
```

### Schemas

- **`employeeForm.ts`** — field definition array; `FormModal` renders the correct input automatically
- **`employeeColumns.ts`** — AG Grid `ColDef` array; merged with `actionsColumn()` in the page

---

## 8. Adding a New Module

| # | Step |
|---|---|
| 1 | Create `modules/<domain>/types/entity.ts` with `Entity` and `EntityWrite` |
| 2 | Create `modules/<domain>/services/entityService.ts` using `request()` / `requestList()` |
| 3 | Create `modules/<domain>/schemas/formSchemas/entityForm.ts` |
| 4 | Create `modules/<domain>/schemas/tableSchemas/entityColumns.ts` |
| 5 | Create `app/(dashboard)/<domain>/page.tsx` following the CRUD pattern (§5.3) |
| 6 | Add a sidebar link in `components/dashboard/sidebar` |

---

## 9. API Contract

### Success response

```json
{ "success": true, "status": 200, "message": "...", "data": { } }

// Paginated list also includes:
{ "pagination": { "count": 84, "page": 1, "pages": 9, "page_size": 10, "next": "...", "previous": null } }
```

### Error response

```json
{
  "success": false, "status": 400,
  "error": {
    "code": "validation_error",
    "message": "Invalid input.",
    "details": { "email": ["This field is required."] }
  }
}
```

### Error codes

| `code` | HTTP | Meaning |
|---|---|---|
| `validation_error` | 400 | Field-level validation failed; `details` has the field → messages map |
| `integrity_error` | 400 | Unique constraint or FK violation |
| `not_authenticated` | 401 | No credentials — interceptor redirects to `/login` |
| `authentication_failed` | 401 | Credentials invalid — interceptor redirects to `/login` |
| `permission_denied` | 403 | User lacks required permission |
| `not_found` | 404 | Resource does not exist |
| `throttled` | 429 | Rate limit exceeded |
| `internal_server_error` | 500 | Unhandled server exception |

---

## 10. Frontend Error Handling

```ts
import { ApiError } from '@/lib/api-error';

try {
    const { data, message } = await EmployeeService.create(formData);
    toast.success(message);
} catch (err) {
    if (err instanceof ApiError) {
        if (err.isValidation()) {
            err.allFieldErrors().forEach(msg => toast.error(msg));
            // react-hook-form: setError('email', { message: err.fieldError('email') });
            return;
        }
        toast.error(err.message);
    }
}
```

### `ApiError` API

| Member | Description |
|---|---|
| `err.status` | HTTP status code |
| `err.code` | Machine-readable error code string |
| `err.message` | Human-readable message — safe to show in a toast |
| `err.details` | `Record<string, string[]>` for validation errors; `null` otherwise |
| `err.isValidation()` | `true` when `code === 'validation_error'` and `details` is non-null |
| `err.fieldError(field)` | First error message for a specific field name |
| `err.allFieldErrors()` | Flat `string[]` of all validation messages |

---

## 11. Conventions & Code Style

**Naming**
- Components — `PascalCase` (`FormModal.tsx`, `PageHeader.tsx`)
- Hooks — `camelCase` prefixed with `use` (`useFetch`, `useAgGridFilter`)
- Services — `camelCase` suffixed with `Service` (`employeeService`)
- Types — `PascalCase`; write variant suffixed with `Write` (`Employee`, `EmployeeWrite`)
- API endpoints — `snake_case` matching Django URL patterns

**Type safety rules**
- Always separate read types from write types — they differ in how relations are represented
- Never access `.guid` on a relation field without a `!== null` check first
- Use `String()` when appending booleans or numbers to `FormData`
- Iterate write-field names with `keyof EmployeeWrite`, not `keyof Employee`

**File organisation**
- One component per file
- Shared UI in `components/common` or `components/dashboard` — never inside `modules/`
- Business logic in `modules/<domain>/` — never in `components/`
- Global utilities in `helpers/` or `lib/` — never inline in a page component

---
