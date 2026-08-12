/**
 * Backend base URL.
 *
 * Defaults to the same origin (empty string) so the app talks to the local
 * backend through the Vite dev proxy (/api/* -> http://localhost:4000) with
 * zero config. Set VITE_BACKEND_URL to point at a hosted backend instead.
 */
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
