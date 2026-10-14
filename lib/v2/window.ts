import { validDay } from "./domain";
export function pilotWindow(
  env: {
    PILOT_START_DATE?: string;
    PILOT_DURATION_DAYS?: string;
    PILOT_ANALYTICS_ENABLED?: string;
    EDGE_RATE_LIMIT_READY?: string;
  },
  now = new Date(),
) {
  const start = env.PILOT_START_DATE ?? "";
  const days = Number(env.PILOT_DURATION_DAYS ?? 42);
  if (!validDay(start) || !Number.isInteger(days) || days < 1 || days > 365)
    return {
      enabled: false,
      start: "",
      end: "",
      reason: "Pilot dates are not configured",
    };
  const endDate = new Date(`${start}T00:00:00Z`);
  endDate.setUTCDate(endDate.getUTCDate() + days);
  const end = endDate.toISOString().slice(0, 10);
  const today = now.toISOString().slice(0, 10);
  const enabled =
    env.PILOT_ANALYTICS_ENABLED === "true" &&
    env.EDGE_RATE_LIMIT_READY === "true" &&
    today >= start &&
    today < end;
  return {
    enabled,
    start,
    end,
    reason:
      today < start
        ? "Pilot has not started"
        : today >= end
          ? "Pilot has ended"
          : enabled
            ? "Pilot collection is enabled"
            : "Collection has not been activated",
  };
}
