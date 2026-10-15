import "server-only";
import { getRuntimeBindings } from "./bindings";
import { getPublishedDataset, getPublicReleaseSnapshot } from "./data-access";

export async function getRuntimeDataset() {
  if (getRuntimeBindings().PUBLIC_CATALOGUE_MODE === "release-snapshot")
    return getPublicReleaseSnapshot();
  return getPublishedDataset(getRuntimeBindings().DB);
}
