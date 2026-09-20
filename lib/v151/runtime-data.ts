import "server-only";
import { getRuntimeBindings } from "./bindings";
import { getPublishedDataset } from "./data-access";

export async function getRuntimeDataset() {
  return getPublishedDataset(getRuntimeBindings().DB);
}
