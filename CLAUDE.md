# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint (Next.js + TypeScript rules)
npm run format       # Prettier with Tailwind class sorting
npm run format:check # Check formatting without modifying files
```

There are no tests configured in this project.

## Architecture

**Stack:** Next.js 15 (App Router) + React 19 + TypeScript, Tailwind CSS 4 + Flowbite React, AG-Grid for tables, react-hook-form, Axios, next-intl.

**Backend:** Django REST Framework at `http://127.0.0.1:8000/api/` (hardcoded in `lib/network.tsx`). Uses JWT auth (access + refresh tokens in localStorage) with Django's CSRF pattern.

### Module Pattern

Every new resource (e.g., "invoices") follows the same 5-file pattern:

| File | Purpose |
|---|---|
| `types/<resource>.ts` | TypeScript interface with `guid`, timestamps |
| `services/<resource>.ts` | CRUD methods via `axiosInstance` |
| `schemas/formSchemas/<resource>Form.tsx` | `FormFieldGroup[]` schema driving the form UI |
| `schemas/tableSchemas/<resource>Columns.tsx` | `ColDef<T>[]` for AG-Grid |
| `app/dashboard/<module>/<resource>/page.tsx` | Page wiring it all together |

See `types/department.ts`, `services/departments.ts`, `schemas/formSchemas/departmentForm.tsx`, `schemas/tableSchemas/departmentColumns.tsx`, and `app/dashboard/hr/departments/page.tsx` as the canonical reference implementation.

### Form & Table Infrastructure

- **`components/dashboard/FormModal.tsx`** — Modal wrapper around `FormBuilder`
- **`components/dashboard/FormBuilder.tsx`** — Renders `FormFieldGroup[]` schemas, handles react-hook-form integration, maps Django validation errors back to fields via `helpers/apis.ts`
- **`components/dashboard/FieldBuilder.tsx`** — Maps `fieldType` to the correct Flowbite input component (`text`, `textarea`, `file`, `select`, `email`, `password`, `number`, `datetime-local`)
- **`components/dashboard/SelectWithOptions.tsx`** — Select that accepts static arrays, API endpoints (auto-maps `id`/`guid` → value, `name`/`title` → label), or JSON strings
- **`components/dashboard/actionsColumn.tsx`** — Adds Edit/Delete/View buttons to AG-Grid rows, permission-gated via user groups

### Auth & Guards

- **`context/auth.tsx`** — `AuthContext` with `user`, `loggedIn`, `isLoading`, `login()`, `logout()`
- **`guards/ProtectedRoute.tsx`** — Redirects unauthenticated users to `/`
- **`guards/PermissionGuard.tsx`** — Checks `user.groups` before rendering children
- The dashboard layout (`app/dashboard/layout.jsx`) wraps all content in `<ProtectedRoute>`

### Data Fetching

- **`hooks/useFetch.tsx`** — Generic hook returning `{ data, loading, error, refetch }`. Used in pages: `useFetch<Department[]>('hr/departments/')`.
- **`lib/network.tsx`** — Axios instance with request interceptor (injects Bearer token) and response interceptor (handles 401 → logout, 403 → permission error, maps DRF validation errors to `AxiosErrorWithData`).

### Navigation

Add new sidebar items in `components/common/SidebarDashboard.jsx` inside the `navGroups` array. Each group has a `label` and `items` array of `{ href, label, icon }`.

## Key Conventions

- Resources use `guid` (not `id`) as the primary key
- API endpoints use trailing slashes: `hr/departments/`, `hr/departments/${id}/`
- Service files use object literal pattern: `export const DepartmentService = { ... }`
- Form schemas use `FormFieldGroup[]` from `types/formfield.d.ts`
- Pages manage modal state locally: `isFormModalOpen`, `editingItem`, `deletingItem`
- Toast notifications via `react-toastify` for user feedback

<!-- new resource start from
types > schemas (form and table) > services > app (dashboard > module dir > entity > page.tsx) 
-->