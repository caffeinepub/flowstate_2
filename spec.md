# Specification

## Summary
**Goal:** Build FlowState, a productivity app combining a Kanban task board with a Pomodoro focus timer, featuring a dark-mode UI with amber/orange accents.

**Planned changes:**
- Backend Motoko actor storing tasks (id, title, description, status, priority, createdAt, dueDate) with CRUD operations and status update endpoint
- Backend Pomodoro session tracking with startSession, completeSession, and getSessionStats (today's sessions and focus minutes)
- Kanban board main view with three columns (To Do, In Progress, Done), drag-and-drop card movement, color-coded priority badges, due date display, and an Add Task modal
- Circular countdown Pomodoro timer widget (25 min default) with start/pause/reset controls, session completion prompt, break mode switching, and daily stats display
- Fixed sidebar layout containing the timer widget and daily stats; main area displaying the Kanban board
- Dark charcoal/slate global theme with amber/orange accents, clean sans-serif typography, and subtle card shadows
- App logo rendered in the sidebar header and a decorative background pattern applied subtly behind the main content area, loaded from `/assets/generated/`

**User-visible outcome:** Users can manage tasks across a drag-and-drop Kanban board, run focused Pomodoro work sessions with a live countdown timer, and track their daily productivity stats — all within a polished dark-mode interface.
