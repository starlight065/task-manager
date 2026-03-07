import type { Task } from "../types/Task";

const MOCK_TASKS: Task[] = [
  {
    id: 1,
    title: "Redesign onboarding flow",
    description: "Update all screens per new brand guidelines and user fee...",
    priority: "high",
    dueDate: "Mar 05, 2026",
    tag: "Design",
    completed: false,
  },
  {
    id: 2,
    title: "Fix payment gateway bug",
    description: "Stripe webhook falls silently on refund events in production",
    priority: "high",
    dueDate: "Mar 08, 2026",
    tag: "Dev",
    completed: false,
  },
  {
    id: 3,
    title: "Write Q1 performance report",
    description: "Compile metrics from analytics dashboard and summarize...",
    priority: "medium",
    dueDate: "Mar 08, 2026",
    tag: "Docs",
    completed: false,
  },
  {
    id: 4,
    title: "Research competitor pricing",
    description: "Survey top 5 competitors and create a comparison...",
    priority: "low",
    dueDate: "Mar 26, 2026",
    tag: "Research",
    completed: false,
  },
  {
    id: 5,
    title: "Draft homepage copy",
    description: "Final copy approved by marketing team on Mar 01",
    priority: "high",
    dueDate: "Mar 01, 2026",
    tag: "Copy",
    completed: true,
  },
  {
    id: 6,
    title: "Migrate to PostgreSQL 16",
    description: "Schema migration and data integrity checks all p...",
    priority: "medium",
    dueDate: "Feb 28, 2026",
    tag: "Dev",
    completed: true,
  },
  {
    id: 7,
    title: "Update privacy policy",
    description: "Legal review completed, published to site Feb 25",
    priority: "low",
    dueDate: "Feb 25, 2026",
    tag: "Legal",
    completed: true,
  },
];

export default MOCK_TASKS;
