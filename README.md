# Employee Management System - Frontend

React 18 + Vite dashboard for the Employee Management API.

## Setup
```bash
npm install
cp .env.example .env     # optional in development
npm run dev              # http://localhost:5173
npm run build            # production build in /dist
```
Start the backend first (default http://localhost:5000). In development Vite proxies `/api` to it, so no config is needed.
For a deployed build, set `VITE_API_URL` (e.g. `https://your-api.com/api`).

## Features
- Responsive dashboard (table on desktop, stacked cards on phones)
- Summary counts (total / active / inactive)
- Debounced search, status filter, department filter, sortable columns, pagination
- Add / edit employee form with client-side and server-side validation messages
- Employee details drawer
- Delete with confirmation
- Loading skeletons, empty states, error banner with retry, toast notifications

## Structure
```
src/
  api/client.js        fetch wrapper + employeeApi
  hooks/               useEmployees, useDebounce
  components/          Toolbar, EmployeeTable, EmployeeForm, EmployeeDetails, ...
  App.jsx, styles.css
```
