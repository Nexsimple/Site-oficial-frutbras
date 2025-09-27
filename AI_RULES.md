# AI Rules for Frutbras Application Development

This document outlines the technical stack and best practices for developing the Frutbras web application. Adhering to these guidelines ensures consistency, maintainability, and optimal performance.

## Tech Stack Overview

The Frutbras application is built using a modern web development stack:

*   **React & TypeScript:** The core of the application is built with React for dynamic user interfaces, leveraging TypeScript for type safety and improved code quality.
*   **Vite:** A fast build tool that provides an excellent development experience with hot module replacement.
*   **Tailwind CSS:** A utility-first CSS framework used for all styling, enabling rapid UI development and consistent design.
*   **shadcn/ui & Radix UI:** A collection of beautifully designed, accessible, and customizable UI components built on Radix UI primitives and styled with Tailwind CSS.
*   **Lucide React:** A comprehensive icon library integrated for all visual icons across the application.
*   **React Router DOM:** Used for client-side routing, managing navigation and different views within the single-page application.
*   **TanStack Query (React Query):** A powerful library for data fetching, caching, synchronization, and managing server state in React applications.
*   **React Hook Form & Zod:** For efficient form management and robust schema-based validation.
*   **Supabase:** Our backend-as-a-service, providing database, authentication, and real-time capabilities.
*   **date-fns:** A lightweight and comprehensive JavaScript date utility library.
*   **Sonner:** A modern toast library for displaying notifications.

## Library Usage Guidelines

To maintain a consistent and efficient codebase, please follow these specific library usage rules:

*   **Styling (Tailwind CSS):**
    *   **Always** use Tailwind CSS utility classes for styling components.
    *   Avoid writing custom CSS unless absolutely necessary for complex, non-utility-based styles. If custom CSS is needed, define it in `src/index.css` using `@apply` directives to integrate with Tailwind's design system.
*   **UI Components (shadcn/ui & Radix UI):**
    *   **Prioritize** using existing shadcn/ui components for common UI elements (buttons, cards, forms, dialogs, etc.).
    *   If a shadcn/ui component needs significant modification beyond what its props allow, **create a new component** that wraps or extends the shadcn/ui component. **Do not modify the original shadcn/ui component files.**
*   **Icons (Lucide React):**
    *   **All icons** used in the application must come from the `lucide-react` library.
*   **Routing (React Router DOM):**
    *   Define all application routes within `src/App.tsx`.
    *   Use `Link` components for navigation within the application.
*   **Data Fetching (TanStack Query):**
    *   **All data fetching** from the Supabase backend should be managed using TanStack Query hooks (e.g., `useQuery`, `useMutation`).
    *   Define data fetching logic in `src/services/` files and corresponding hooks in `src/hooks/`.
*   **Form Management (React Hook Form & Zod):**
    *   **All forms** should be built using `react-hook-form` for state management and `zod` for schema validation.
*   **Backend Interaction (Supabase):**
    *   Interact with the Supabase backend using the `supabase` client imported from `src/integrations/supabase/client.ts`.
    *   Database interaction logic should reside in `src/services/` files.
*   **Notifications (Sonner & useToast):**
    *   Use `sonner` for general, non-intrusive notifications.
    *   Use the `useToast` hook from `src/hooks/use-toast.ts` (which leverages shadcn/ui's `Toast` component) for more traditional UI toasts that might require user interaction or specific styling.
*   **Date Handling (date-fns):**
    *   Use `date-fns` for all date formatting, parsing, and manipulation tasks.
*   **File Structure:**
    *   `src/pages/`: Top-level components representing distinct application pages.
    *   `src/components/`: Reusable UI components that can be used across different pages.
    *   `src/hooks/`: Custom React hooks for encapsulating reusable logic.
    *   `src/services/`: Modules responsible for interacting with external APIs (e.g., Supabase).
    *   `src/contexts/`: React Context API providers for global state management.
    *   `src/types/`: TypeScript type and interface definitions.
    *   `src/integrations/supabase/`: Supabase client configuration and auto-generated types.

## General Development Principles

*   **Responsiveness:** All new UI components and pages must be fully responsive and adapt gracefully to different screen sizes (mobile, tablet, desktop).
*   **Simplicity & Elegance:** Strive for the simplest and most elegant solution. Avoid over-engineering.
*   **Completeness:** Any feature or component implemented must be fully functional and complete. Avoid placeholders or `TODO` comments for core functionality.
*   **Modularity:** Create a new, focused file for every new component or hook. Aim for components that are 100 lines of code or less. Refactor larger files into smaller, more manageable units when necessary.
*   **Error Handling:** Do not implement `try/catch` blocks for API calls or component logic unless explicitly requested. Allow errors to bubble up for centralized handling and debugging.