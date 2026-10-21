import { getRuntimeDataset } from "../v151/runtime-data";
import { summary } from "./summary";
export { summary } from "./summary";
export async function getDiscoveryData() {
  const d = await getRuntimeDataset();
  return {
    records: d.records.map(summary),
    storage: d.storage,
    calendarEvents: d.calendarEvents,
  };
}
