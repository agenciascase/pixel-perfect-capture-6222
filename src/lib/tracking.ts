// Meta Pixel + GTM helpers. Each conversion event fires at most once per page session.
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

const fired = new Set<string>();

export function trackOnce(event: "Lead" | "Schedule", data: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || fired.has(event)) return;
  fired.add(event);
  window.fbq?.("track", event, data);
  (window.dataLayer = window.dataLayer || []).push({ event: event.toLowerCase(), ...data });
}
