// NOTE: `Nav` and `Footer` are server components that query the DB.
// They MUST be imported directly from their own files (./nav, ./footer)
// by server components or layouts. Re-exporting them here would pull
// server-only modules (pg, drizzle) into the client bundle any time a
// client component imports `PageWrapper` through this barrel.
export { PageWrapper } from "./page-wrapper";
