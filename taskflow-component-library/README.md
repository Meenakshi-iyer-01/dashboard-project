# TaskFlow reusable component library

A Next.js App Router version of the TaskFlow dashboard, reorganized into reusable React components.

## Run in VS Code

1. Extract this ZIP.
2. Open the `taskflow-component-library` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open the local URL printed in the terminal (usually `http://localhost:3000`).

## Structure

```text
app/
  layout.tsx        # Root layout and global stylesheet import
  page.tsx          # Dashboard page; state and data orchestration
  global.css        # Global styles and dashboard design tokens
components/
  layout/
    Sidebar.tsx
    Topbar.tsx
  tasks/
    TaskDetails.tsx
    TaskFilters.tsx
    TaskList.tsx
    TaskRow.tsx
  ui/
    Icon.tsx
    StatusBadge.tsx
    SummaryCard.tsx
lib/
  tasks.ts           # API fetch and localStorage persistence
types/
  task.ts            # Shared TypeScript types
```

## Reusable components

- `SummaryCard`: use for any dashboard metric by passing a label, value, variant, and icon.
- `StatusBadge`: shared completed/pending badge.
- `TaskRow`: a selectable task row.
- `TaskFilters`: reusable All/Pending/Completed filter group.
- `TaskList`: task table, search, filters, pagination, loading and error states.
- `TaskDetails`: selected task details and status action.
- `Topbar` and `Sidebar`: reusable dashboard layout components.
- `Icon`: centralized SVG icon library.

## Notes

- Data comes from JSONPlaceholder (`/todos`).
- Status changes and theme preference are saved in localStorage.
- The API is a demo API: task changes are local to this browser and are not written back to the API.
- The dashboard displays up to 35 matching tasks, seven per page, to match the assignment implementation.
